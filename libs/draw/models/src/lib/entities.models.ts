import { z } from 'zod';

export const Vec2DSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const MeasureToolType = {
  LINE: 'line',
  TEMP_LINE: 'temp-line',
} as const;

const MeasureToolTypeValues = Object.values(MeasureToolType) as readonly string[];
const MeasureToolTypeSchema = z.enum(MeasureToolTypeValues as [string, ...string[]]);


export const QuantityUnit = {
  MM: 'mm',
  M: 'm',
  // M2: 'm2',
  // M3: 'm3'
} as const;

const QuantityUnitValues = Object.values(QuantityUnit) as readonly string[];
const QuantityUnitSchema = z.enum(QuantityUnitValues as [string, ...string[]]);

export const LineEntitySchema = z.object({
  id: z.string(),
  start: Vec2DSchema,
  end: Vec2DSchema,
  measureToolType: MeasureToolTypeSchema,
  quantity: MeasureToolTypeSchema,
  unit: QuantityUnitSchema
});

export const EntitySchema = LineEntitySchema; // add more

export type Vec2D = z.infer<typeof Vec2DSchema>;
export type LineEntity = z.infer<typeof LineEntitySchema>;

export type Entity = z.infer<typeof EntitySchema>;
