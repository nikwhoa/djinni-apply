import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import config from '../config/config.js';
import fs from 'fs/promises';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

interface JobApplication {
  jobId: string;
  coverLetter: string;
  timestamp: string;
  role: string;
  company: string;
}

async function generateCoverLetter(jobDescription: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `Write a professional cover letter for this job description: ${jobDescription}`,
      },
    ],
  });

  return response.choices[0].message.content || '';
}

export async function generateJobApplication(
  jobDescription: string,
  role: string,
  company: string,
): Promise<JobApplication> {
  try {
    const coverLetter = await generateCoverLetter(jobDescription);
    logger.info('Cover letter generated successfully');

    const application: JobApplication = {
      jobId: Date.now().toString(),
      coverLetter,
      timestamp: new Date().toISOString(),
      role,
      company,
    };

    await saveApplication(application);
    return application;
  } catch (error) {
    logger.error('Error generating job application:', error);
    throw error;
  }
}

async function saveApplication(application: JobApplication): Promise<void> {
  const applicationsDir = './applications';

  await fs.mkdir(applicationsDir, { recursive: true });

  const sanitizedRole = application.role.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const sanitizedCompany = application.company.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const baseFileName = `${sanitizedRole}_${sanitizedCompany}_${application.jobId}`;

  const jsonPath = `${applicationsDir}/${baseFileName}.json`;
  await fs.writeFile(jsonPath, JSON.stringify(application, null, 2));

  logger.info(`Application saved to ${applicationsDir}/${baseFileName}.json`);
}
