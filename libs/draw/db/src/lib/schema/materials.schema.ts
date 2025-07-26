import { z } from 'zod';

export const MaterialSchema = z.object({
  _id: z.string(),
  name: z.string().min(1),
  price: z.number().int().min(0).optional(),
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