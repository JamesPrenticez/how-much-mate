import { z } from 'zod';

export const OrganisationSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type Organisation = z.infer<typeof OrganisationSchema>;