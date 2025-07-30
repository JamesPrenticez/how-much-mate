import { ElementCode, ElementName } from "../enums";

export interface ElementGroup {
  id: string;
  code: ElementCode | string;
  name: ElementName | string;
  description?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt?: string;
}
