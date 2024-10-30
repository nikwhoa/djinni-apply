import { setupBrowser } from './services/browser.js';
import { login } from './services/auth.js';
import { searchJobs } from './services/jobService.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    const { browser, page } = await setupBrowser();
    logger.info('Browser launched successfully');

    try {
      await login(page);
      logger.info('Successfully logged in');

      const jobs = await searchJobs(page);
      logger.info(`Found ${jobs.length} jobs`);
    } catch (error) {
      logger.error('Error during execution:', error);
      throw error;
    } finally {
      await browser.close();
      logger.info('Browser closed');
    }
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

main().catch((error) => {
  logger.error('Main function error:', error);
  process.exit(1);
});
