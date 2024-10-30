import { Page } from 'puppeteer';
import config from '../config/config.js';
import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import { existsSync } from 'fs';

export async function login(page: Page): Promise<void> {
  try {
    const hasCookies = await loadCookies(page);

    if (hasCookies) {
      await page.goto(`${config.djinni.baseUrl}`);
      const isLoggedIn = await page.$('.userpic-image');

      if (isLoggedIn) {
        logger.info('Successfully logged in using saved cookies');
        return;
      }
      logger.info('Saved cookies expired, proceeding with normal login');
    }

    await page.goto(`${config.djinni.baseUrl}/login`);
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', config.djinni.email);
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', config.djinni.password);
    await page.click('button[type="submit"]');

    const isLoggedIn = await page.$('.userpic-image');
    if (!isLoggedIn) {
      throw new Error('Login failed - unable to verify user is logged in');
    }

    await saveCookies(page);
    logger.info('Login successful and cookies saved');
  } catch (error) {
    logger.error('Login failed:', error);
    throw error;
  }
}

async function loadCookies(page: Page): Promise<boolean> {
  try {
    if (!existsSync('./cookies.json')) {
      return false;
    }

    const cookiesString = await fs.readFile('./cookies.json', 'utf8');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    logger.info('Cookies loaded successfully');
    return true;
  } catch (error) {
    logger.error('Error loading cookies:', error);
    return false;
  }
}

async function saveCookies(page: Page): Promise<void> {
  const cookies = await page.cookies();
  await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
  logger.info('Cookies saved successfully');
}
