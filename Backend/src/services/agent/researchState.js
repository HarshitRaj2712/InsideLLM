import { z } from 'zod';

export const researchSourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  sourceType: z.string()
});

export const researchStateSchema = z.object({
  companyName: z.string(),
  normalizedCompanyName: z.string().nullable().default(null),
  researchPlan: z.array(z.string()).default([]),
  companyOverview: z.string().nullable().default(null),
  webResearch: z.array(z.string()).default([]),
  financialData: z.record(z.string(), z.unknown()).nullable().default(null),
  recentNews: z.array(z.string()).default([]),
  riskFactors: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  recentDevelopments: z.array(z.string()).default([]),
  scores: z.record(z.string(), z.number()).default({}),
  finalDecision: z.enum(['INVEST', 'PASS']).nullable().default(null),
  decision: z.enum(['INVEST', 'PASS']).nullable().default(null),
  confidenceScore: z.number().nullable().default(null),
  overallScore: z.number().nullable().default(null),
  investmentThesis: z.string().nullable().default(null),
  sources: z.array(researchSourceSchema).default([]),
  errors: z.array(z.string()).default([]),
  progress: z.array(z.string()).default([]),
  currentStage: z.string().default('idle')
});
