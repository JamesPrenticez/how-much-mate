import { z } from 'zod';

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type Company = z.infer<typeof CompanySchema>;