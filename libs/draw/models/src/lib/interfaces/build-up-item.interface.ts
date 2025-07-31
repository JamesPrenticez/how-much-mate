import { z } from 'zod';
import { UnitType } from '../enums';

export const BuildUpItemSchema = z.object({
  materialId: z.string(),
  materialCode: z.string(),
  materialName: z.string(),
  quantityPerUnit: z.number(),
  wasteFactor: z.number(),
  totalQuantity: z.number(),
  unit: z.nativeEnum(UnitType),
  unitCost: z.number(),
  totalCost: z.number(),
  notes: z.string().optional(),
});

export type BuildUpItem = z.infer<typeof BuildUpItemSchema>;