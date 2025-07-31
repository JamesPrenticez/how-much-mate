import z from "zod";
import { ElementCode, ElementName } from "../enums";

export const ElementGroupSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  code: z.union([z.nativeEnum(ElementCode), z.string()]),
  name: z.union([z.nativeEnum(ElementName), z.string()]),
  description: z.string().optional(),
  isCustom: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
}).strict();

export type ElementGroup = z.infer<typeof ElementGroupSchema>;