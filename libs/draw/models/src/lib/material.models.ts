import { z } from 'zod';

export const MaterialCodes = {
  PINE_H12_90x45: 'PINE_H1.2_90x45',
  PINE_H12_140x45: 'PINE_H1.2_140x45',
  PINE_H32_90x45: 'PINE_H3.2_90x45',
  PINE_H32_140x45: 'PINE_H3.2_140x45',
  PINE_H5_90x45: 'PINE_H5_90x45',
  PINE_H5_140x45: 'PINE_H5_140x45',
} as const;

export type MaterialCode = typeof MaterialCodes[keyof typeof MaterialCodes];
const codeValues = Object.values(MaterialCodes) as readonly string[];
const CodeSchema = z.enum(codeValues as [string, ...string[]]); // Type assertion to tuple

export const MaterialSchema = z.object({
  id: z.string(),
  code: CodeSchema,
  name: z.string().min(1),
  cost: z.number().int().min(0).optional(),
  dimensions: z.object({
    width: z.number().int().min(0).optional(),
    depth: z.number().int().min(0).optional(),
    length: z.number().int().min(0).optional(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.string()).default([]),
});

export type Material = z.infer<typeof MaterialSchema>;