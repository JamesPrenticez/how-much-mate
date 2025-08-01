import z from 'zod';
import { SyncStatus } from '../enums';

export const ProjectSchema = z.object({
  id: z.string(),
  code: z.string(),
  organisationId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  syncStatus: z.nativeEnum(SyncStatus),
  syncVersion: z.string().optional(),
  isDeleted: z.boolean(),
  metadata: z.record(z.any()).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;