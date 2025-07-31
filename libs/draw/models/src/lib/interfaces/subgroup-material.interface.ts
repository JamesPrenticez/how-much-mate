import z from "zod";

export const SubgroupMaterialSchema = z.object({
  id: z.string(),
  subgroupId: z.string(),
  materialId: z.string(),
  quantity: z.number(),
  wasteFactor: z.number(),
  notes: z.string().optional(),
  sortOrder: z.number(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type SubgroupMaterial = z.infer<typeof SubgroupMaterialSchema>;