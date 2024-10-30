import puppeteer from 'puppeteer';
import { setupBrowser } from '../../src/services/browser.js';
import config from '../../src/config/config.js';

jest.mock('puppeteer');

describe('browser service', () => {
  const mockBrowser = {
    newPage: jest.fn(),
  };

  const mockPage = {
    evaluate: jest.fn(),
    setViewport: jest.fn(),
  };

  beforeEach(() => {
    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
    mockBrowser.newPage.mockResolvedValue(mockPage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should setup browser with correct configuration', async () => {
    await setupBrowser();

    expect(puppeteer.launch).toHaveBeenCalledWith({
      headless: config.browser.headless,
      slowMo: config.browser.slowMo,
    });
  });

  it('should handle full viewport configuration', async () => {
    const mockDimensions = { width: 1920, height: 1080 };
    mockPage.evaluate.mockResolvedValue(mockDimensions);
    
    await setupBrowser();

    expect(mockPage.setViewport).toHaveBeenCalledWith(mockDimensions);
  });
});