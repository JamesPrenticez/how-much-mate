import { MaterialCategory, UnitType } from '../enums';

export interface MaterialProperties {
  density?: number; // kg/m3
  thermalConductivity?: number; // W/mK
  thermalResistance?: number; // m2K/W
  moistureContent?: number; // %
  grade?: string;
  colour?: string;
  finish?: string;
  fireRating?: string;
  [key: string]: any; // Allow custom properties
}

export interface Material {
  id: string;
  code: string;
  name: string;
  description?: string;
  unit: UnitType;
  unitCost: number;
  supplier?: string;
  category: MaterialCategory;
  properties?: MaterialProperties;
  isCustom: boolean;
  createdAt: string;
  updatedAt?: string;
}
