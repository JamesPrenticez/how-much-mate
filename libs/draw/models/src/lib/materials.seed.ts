import { db } from '../../../db/src/lib/db';
import { Material, MaterialCodes, MaterialSchema } from '../../../db/src/lib/models';
import { v4 as uuidv4 } from 'uuid';

const seedData: Material[] = [
  {
    id: uuidv4(),
    name: '90 x 45 H1.2 Rad. Pine',
    code: MaterialCodes.PINE_H12_90x45,
    cost: 6,
    dimensions: {
      width: 90,
      depth: 45,
      length: 1000,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['timber', 'framing'],
  },
  {
    id: uuidv4(),
    name: '140 x 45 H1.2 Rad. Pine',
    code: MaterialCodes.PINE_H12_90x45,
    cost: 18,
    dimensions: {
      width: 140,
      depth: 45,
      length: 1000,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['timber', 'framing'],
  },
  {
    id: uuidv4(),
    name: '90 x 45 H3.2 Rad. Pine',
    code: MaterialCodes.PINE_H32_90x45,
    cost: 9,
    dimensions: {
      width: 90,
      depth: 45,
      length: 1000,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['timber', 'framing'],
  },
  {
    id: uuidv4(),
    name: '140 x 45 H1.2 Rad. Pine',
    code: MaterialCodes.PINE_H32_140x45,
    cost: 18,
    dimensions: {
      width: 140,
      depth: 45,
      length: 1000,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['timber', 'framing'],
  },
  {
    id: uuidv4(),
    name: '90 x 45 H5 Rad. Pine',
    code: MaterialCodes.PINE_H5_90x45,
    cost: 9,
    dimensions: {
      width: 90,
      depth: 45,
      length: 1000,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['timber', 'framing'],
  },
  {
    id: uuidv4(),
    name: '140 x 45 H5 Rad. Pine',
    code: MaterialCodes.PINE_H5_140x45,
    cost: 18,
    dimensions: {
      width: 140,
      depth: 45,
      length: 1000,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['timber', 'framing'],
  },
];

export const seedMaterials = async () => {
  const validated = seedData.map((item) => MaterialSchema.parse(item));
  await db.materials.bulkAdd(validated);
}
