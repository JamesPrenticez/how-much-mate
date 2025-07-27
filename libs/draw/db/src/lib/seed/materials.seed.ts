import { db } from '../db';
import { MaterialSchema } from '../models';

const seedData = [
  {
    _id: 'mat-001',
    name: 'H3.2 Treated Pine 90x45',
    cost: 6,
    dimensions: {
      width: 90,
      depth: 45,
      length: 3600,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['timber', 'framing'],
  },
  {
    _id: 'mat-002',
    name: 'Steel RHS 75x50',
    cost: 18,
    dimensions: {
      width: 75,
      depth: 50,
      length: 6000,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['steel', 'structural'],
  },
];

export const seedMaterials = async () => {
  const validated = seedData.map((item) => MaterialSchema.parse(item));
  await db.materials.bulkAdd(validated);
}
