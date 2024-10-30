import puppeteer from 'puppeteer';
import config from '../config/config.js';

export async function setupBrowser() {
  const browser = await puppeteer.launch({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo,
  });

  const page = await browser.newPage();

  if (config.browser.viewport.width === 'full' || config.browser.viewport.height === 'full') {
    const maximized = await page.evaluate(() => {
      return {
        width: window.screen.availWidth,
        height: window.screen.availHeight,
      };
    });

    await page.setViewport(maximized);
  } else {
    await page.setViewport({
      width: config.browser.viewport.width as number,
      height: config.browser.viewport.height as number,
    });
  }

  return { browser, page };
}
