import z from "zod";
import { elementCodeLiterals, elementNameLiterals } from "../enums";

export const ElementGroupSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  code: z.union([elementCodeLiterals, z.string()]),
  name: z.union([elementNameLiterals, z.string()]),
  description: z.string().optional(),
  isCustom: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
}).strict();

export type ElementGroup = z.infer<typeof ElementGroupSchema>;