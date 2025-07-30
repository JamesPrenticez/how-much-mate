
import { MaterialValidator } from '@draw/models';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

import { Material, MaterialCategory, UnitType } from "@draw/models";

export const SEED_MATERIALS: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    code: 'TIM001',
    name: 'Pine Framing Timber 90x45mm',
    description: 'Structural pine timber for framing',
    unit: UnitType.LINEAR_METER,
    unitCost: 12.50,
    supplier: 'TimberCorp NZ',
    category: MaterialCategory.TIMBER,
    properties: {
      density: 500,
      grade: 'SG8',
      moisture: 15,
      finish: 'Rough sawn',
      dimensions: '90x45mm'
    },
    isCustom: false
  },
  {
    code: 'TIM002',
    name: 'Pine Framing Timber 140x45mm',
    description: 'Structural pine timber for framing',
    unit: UnitType.LINEAR_METER,
    unitCost: 18.75,
    supplier: 'TimberCorp NZ',
    category: MaterialCategory.TIMBER,
    properties: {
      density: 500,
      grade: 'SG8',
      moisture: 15,
      finish: 'Rough sawn',
      dimensions: '140x45mm'
    },
    isCustom: false
  },
  {
    code: 'TIM003',
    name: 'LVL Beam 300x63mm',
    description: 'Laminated Veneer Lumber structural beam',
    unit: UnitType.LINEAR_METER,
    unitCost: 89.50,
    supplier: 'Carter Holt Harvey',
    category: MaterialCategory.TIMBER,
    properties: {
      density: 580,
      grade: 'LVL11',
      moisture: 12,
      finish: 'Smooth',
      dimensions: '300x63mm'
    },
    isCustom: false
  },
  {
    code: 'TIM004',
    name: 'Plywood Structural 18mm',
    description: 'Structural plywood sheeting',
    unit: UnitType.SQUARE_METER,
    unitCost: 45.80,
    supplier: 'Plytech',
    category: MaterialCategory.TIMBER,
    properties: {
      density: 600,
      grade: 'F8',
      moisture: 12,
      thickness: '18mm',
      finish: 'Sanded'
    },
    isCustom: false
  },
]

export const seedMaterials = async () => {
  const materials = SEED_MATERIALS.map((mat) => {
    const errors = MaterialValidator.validate(mat);
    if (errors.length) {
      throw new Error(`Validation failed for material ${mat.code}: ${errors.join(', ')}`);
    }

    return {
      ...mat,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  await db.materials.bulkAdd(materials); // This is a stupid probelm, can't use repos while seeding
}
