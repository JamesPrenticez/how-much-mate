import { UnitType } from '../enums';

export interface ElementSubgroup {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  unit: UnitType;
  createdAt: string;
  updatedAt?: string;
}