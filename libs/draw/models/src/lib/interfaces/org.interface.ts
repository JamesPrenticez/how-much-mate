import { z } from 'zod';
import { ProjectTree } from './project.interface';

export const OrgSchema = z.object({
  id: z.string(),
  name: z.string(),
  profilePicture: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type Org = z.infer<typeof OrgSchema>;

export interface OrgTree extends Org {
  projects: ProjectTree[];
}