import { z } from 'zod';

export const researchRequestSchema = z.object({
  companyName: z.string().trim().min(2, 'Company name is required').max(200, 'Company name is too long')
});
