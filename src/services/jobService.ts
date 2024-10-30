import { Page } from 'puppeteer';
import { logger } from '../utils/logger.js';
import config from '../config/config.js';
import fs from 'fs/promises';
import { generateJobApplication } from './openAiService.js';

interface Job {
  title: string;
  url: string;
  company: string;
  description?: string;
  application?: {
    id: string;
    cvPath: string;
  };
}

export async function searchJobs(page: Page): Promise<Job[]> {
  try {
    const searchUrl = `${config.djinni.baseUrl}/jobs/?primary_keyword=${encodeURIComponent(config.djinni.primaryKeyword || '')}`;
    logger.info(`Navigating to search URL: ${searchUrl}`);

    const response = await page.goto(searchUrl, {
      waitUntil: 'networkidle0',
      timeout: config.browser.defaultTimeout,
    });

    if (!response?.ok()) {
      throw new Error(`Failed to load search page. Status: ${response?.status()}`);
    }

    await page.waitForSelector('.list-jobs', { timeout: config.browser.defaultTimeout });

    // Job list extraction
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.list-jobs > li');
      return Array.from(jobElements).map((job) => ({
        title: job.querySelector('h3')?.textContent?.trim() || '',
        url: job.querySelector('a.job-item__title-link')?.getAttribute('href') || '',
        company: job.querySelector('.text-body')?.textContent?.trim() || '',
      }));
    });

    // Visit each job and collect description of it
    const jobsWithApplications: Job[] = [];
    // const originalCV = await fs.readFile(config.cv.path, 'utf-8');

    for (const job of jobs) {
      try {
        const fullUrl = `${config.djinni.baseUrl}${job.url}`;
        logger.info(`Processing job: ${fullUrl}`);

        await page.goto(fullUrl, { waitUntil: 'networkidle0' });
        await page.waitForSelector('.job-post__description');

        const description = await page.evaluate(() => {
          const descElement = document.querySelector('.job-post__description');
          return descElement?.textContent?.trim() || '';
        });

        const application = await generateJobApplication(description, job.title, job.company);

        jobsWithApplications.push({
          ...job,
          description,
          application: {
            id: application.jobId,
            cvPath: `applications/${application.jobId}.json`,
          },
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        logger.error(`Error processing job ${job.title}:`, error);
        jobsWithApplications.push(job);
      }
    }

    await fs.writeFile('./jobs.json', JSON.stringify(jobsWithApplications, null, 2));

    logger.info(`Found ${jobsWithApplications.length} jobs`);
    return jobsWithApplications;
  } catch (error) {
    logger.error('Error searching jobs:', error);
    throw error;
  }
}