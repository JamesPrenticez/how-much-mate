import z from "zod";
import { CadElementTree } from "./cad-element.interface";

export const ElementSubgroupSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  elementGroupId: z.string(),
  subCode: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type ElementSubgroup = z.infer<typeof ElementSubgroupSchema>;

export interface ElementSubgroupTree extends ElementSubgroup {
  cadElements: CadElementTree[] | null;
}