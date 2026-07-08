import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  TAVILY_API_KEY: z.string().min(1).optional(),
  TAVILY_BASE_URL: z.string().url().default('https://api.tavily.com'),
  ALPHAVANTAGE_API_KEY: z.string().min(1).optional(),
  ALPHAVANTAGE_BASE_URL: z.string().url().default('https://www.alphavantage.co/query'),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().default('gemini-2.0-flash'),
  GEMINI_BASE_URL: z.string().url().default('https://generativelanguage.googleapis.com/v1beta')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`);
  throw new Error(`Invalid environment configuration: ${issues.join(', ')}`);
}

export const env = parsedEnv.data;