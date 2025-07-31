import { z } from 'zod';
import { MaterialCategory, UnitType } from '../enums';

export const MaterialPropertiesSchema = z.record(z.any()).and(z.object({
  density: z.number().optional(),               // kg/m3
  thermalConductivity: z.number().optional(),   // W/mK
  thermalResistance: z.number().optional(),     // m2K/W
  moistureContent: z.number().optional(),       // %
  grade: z.string().optional(),
  colour: z.string().optional(),
  finish: z.string().optional(),
  fireRating: z.string().optional(),
}));

export const MaterialSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  unit: z.nativeEnum(UnitType),
  unitCost: z.number(),
  supplier: z.string().optional(),
  category: z.nativeEnum(MaterialCategory),
  properties: MaterialPropertiesSchema.optional(),
  isCustom: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type Material = z.infer<typeof MaterialSchema>;
export type MaterialProperties = z.infer<typeof MaterialPropertiesSchema>;