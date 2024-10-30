import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const viewportSchema = z.object({
  width: z
    .union([
      z.number(),
      z.literal('full'), // Allow 'full' as a special value
    ])
    .default(1920),
  height: z
    .union([
      z.number(),
      z.literal('full'), // Allow 'full' as a special value
    ])
    .default(1080),
});

const configSchema = z.object({
  openai: z.object({
    apiKey: z.string().min(1),
    model: z.string().default('gpt-4-turbo-preview'),
    maxTokens: z.number().default(2000),
  }),
  cv: z.object({
    path: z.string().default('./assets/cv.txt'),
  }),
  djinni: z.object({
    email: z.string().email(),
    password: z.string().min(1),
    baseUrl: z.string().url(),
    primaryKeyword: z.string().optional(),
  }),
  browser: z.object({
    headless: z.boolean().default(true),
    slowMo: z.number().default(50),
    viewport: viewportSchema,
    userAgent: z.string().optional(),
    defaultTimeout: z.number().default(30000),
    screenshots: z.object({
      enabled: z.boolean().default(false),
      path: z.string().default('./screenshots'),
    }),
  }),
  auth: z.object({
    cookiesEnabled: z.boolean().default(true),
    cookiesPath: z.string().default('./cookies.json'),
    cookiesMaxAge: z.number().default(7 * 24 * 60 * 60 * 1000), // 7 days
  }),
});

type Config = z.infer<typeof configSchema>;

export const config: Config = {
  openai: {
    apiKey: process.env.OPENAI_SECRET_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 2000,
  },
  cv: {
    path: process.env.CV_PATH || './assets/cv.txt',
  },
  djinni: {
    email: process.env.DJINNI_EMAIL || '',
    password: process.env.DJINNI_PASS || '',
    baseUrl: 'https://djinni.co',
    primaryKeyword: process.env.DJINNI_PRIMARY_KEYWORD || '',
  },
  browser: {
    headless: process.env.BROWSER_HEADLESS !== 'false',
    slowMo: Number(process.env.BROWSER_SLOW_MO) || 50,
    viewport: {
      width: process.env.BROWSER_WIDTH === 'full' ? 'full' : Number(process.env.BROWSER_WIDTH) || 1920,
      height: process.env.BROWSER_HEIGHT === 'full' ? 'full' : Number(process.env.BROWSER_HEIGHT) || 1080,
    },
    userAgent: process.env.BROWSER_USER_AGENT,
    defaultTimeout: Number(process.env.BROWSER_TIMEOUT) || 30000,
    screenshots: {
      enabled: process.env.SCREENSHOTS_ENABLED === 'true',
      path: process.env.SCREENSHOTS_PATH || './screenshots',
    },
  },
  auth: {
    cookiesEnabled: process.env.COOKIES_ENABLED === 'true',
    cookiesPath: process.env.COOKIES_PATH || './cookies.json',
    cookiesMaxAge: Number(process.env.COOKIES_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
  },
};

try {
  configSchema.parse(config);
} catch (error) {
  console.error('Configuration validation failed:', error);
  process.exit(1);
}

export default config;
