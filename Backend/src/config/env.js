import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const emptyStringToUndefined = (value) => {
  return value === '' ? undefined : value;
};

const envSchema = z.object({
  PORT: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().positive().default(5000)
  ),

  CLIENT_ORIGIN: z
    .string()
    .default('http://localhost:5173,https://aiinvester.vercel.app')
    .transform((value) =>
      value.split(',').map((url) => url.trim())
    ),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  TAVILY_API_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().min(1).optional()
  ),

  TAVILY_BASE_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().url().default('https://api.tavily.com')
  ),

  ALPHAVANTAGE_API_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().min(1).optional()
  ),

  ALPHAVANTAGE_BASE_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().url().default('https://www.alphavantage.co/query')
  ),

  GEMINI_API_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().min(1).optional()
  ),

  GEMINI_MODEL: z.preprocess(
    emptyStringToUndefined,
    z.string().default('gemini-2.5-flash')
  ),

  GEMINI_BASE_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().url().default(
      'https://generativelanguage.googleapis.com/v1beta'
    )
  ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map(
    (issue) =>
      `${issue.path.join('.') || 'env'}: ${issue.message}`
  );

  throw new Error(
    `Invalid environment configuration: ${issues.join(', ')}`
  );
}

export const env = parsedEnv.data;