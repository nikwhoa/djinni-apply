import { Page } from "puppeteer";
import { login } from "../../src/services/auth.js";
import { logger } from "../../src/utils/logger.js";

jest.mock("../../src/utils/logger.js");

describe("auth service", () => {
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    mockPage = {
      goto: jest.fn(),
      waitForSelector: jest.fn(),
      type: jest.fn(),
      click: jest.fn(),
      waitForNavigation: jest.fn(),
      $: jest.fn(),
    } as unknown as jest.Mocked<Page>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should successfully login", async () => {
    mockPage.$.mockResolvedValue({} as any);

    await login(mockPage);

    expect(mockPage.goto).toHaveBeenCalledWith("https://djinni.co/login");
    expect(mockPage.type).toHaveBeenCalledTimes(2);
    expect(mockPage.click).toHaveBeenCalledWith('button[type="submit"]');
    expect(logger.info).toHaveBeenCalledWith("Navigated to login page");
  });

  it("should throw error when login fails", async () => {
    mockPage.$.mockResolvedValue(null); 

    await expect(login(mockPage)).rejects.toThrow("Login failed");
    expect(logger.error).toHaveBeenCalled();
  });
});
