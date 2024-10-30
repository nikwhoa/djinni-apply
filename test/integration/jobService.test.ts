import { Page } from 'puppeteer';
import { searchJobs } from '../../src/services/jobService.js';
import { logger } from '../../src/utils/logger.js';
import config from '../../src/config/config.js';

jest.mock('../../src/utils/logger.js');

describe('searchJobs', () => {
  it('should return list of jobs with descriptions', async () => {
    const mockJobs = [
      {
        title: 'Job 1',
        url: '/jobs/1',
        company: 'Company 1',
        description: 'Description 1',
      },
    ];

    const mockPage = {
      goto: jest.fn(),
      waitForSelector: jest.fn(),
      evaluate: jest.fn(),
    } as unknown as jest.Mocked<Page>;

    mockPage.evaluate.mockResolvedValueOnce([{ title: 'Job 1', url: '/jobs/1', company: 'Company 1' }]);
    mockPage.evaluate.mockResolvedValueOnce('Description 1');

    const jobs = await searchJobs(mockPage);

    expect(jobs).toEqual(mockJobs);
    expect(mockPage.goto).toHaveBeenCalledWith(expect.stringContaining(config.djinni.baseUrl));
    expect(logger.info).toHaveBeenCalledWith('Found 1 jobs');
  });
});

describe('jobService', () => {
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    mockPage = {
      goto: jest.fn(),
      waitForSelector: jest.fn(),
      evaluate: jest.fn(),
      click: jest.fn(),
      $: jest.fn(),
    } as unknown as jest.Mocked<Page>;
  });

  describe('searchJobs', () => {
    it('should return list of jobs', async () => {
      const mockJobs = [
        { title: 'Job 1', url: 'url1', company: 'Company 1' },
        { title: 'Job 2', url: 'url2', company: 'Company 2' },
      ];

      mockPage.evaluate.mockResolvedValue(mockJobs);

      const jobs = await searchJobs(mockPage);

      expect(jobs).toEqual(mockJobs);
      expect(mockPage.goto).toHaveBeenCalledWith(expect.stringContaining(config.djinni.baseUrl));
      expect(logger.info).toHaveBeenCalledWith('Found 2 jobs');
    });

    it('should handle errors during job search', async () => {
      mockPage.goto.mockRejectedValue(new Error('Network error'));

      await expect(searchJobs(mockPage)).rejects.toThrow('Network error');
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
