import { UnitType } from '../enums';

export interface MaterialQuantity {
  materialId: string;
  materialCode: string;
  materialName: string;
  quantityPerUnit: number;
  wasteFactor: number;
  totalQuantity: number;
  unit: UnitType;
  unitCost: number;
  totalCost: number;
  notes?: string;
}