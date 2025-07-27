import z from "zod";

export const BuildUpSchema = z.object({
  id: z.string(),
  name: z.string(),
  cost: z.number(),
  quantity: z.string(), // or z.number() if always numeric
  unit: z.string(),
});