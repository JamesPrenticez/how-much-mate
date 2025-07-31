import z from 'zod';
import { GeometrySchema } from './geometry.interface';
import { BuildUpItemSchema } from './build-up-item.interface';
import { SyncStatus } from '../enums';

export const CadElementSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  elementSubgroupId: z.string(),
  
  geometry: GeometrySchema,

  area: z.number().optional(),
  length: z.number().optional(),
  volume: z.number().optional(),

  buildUp: z.array(BuildUpItemSchema).optional(),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  syncStatus: z.union([z.nativeEnum(SyncStatus), z.string()]),
  syncVersion: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export type CadElement = z.infer<typeof CadElementSchema>;