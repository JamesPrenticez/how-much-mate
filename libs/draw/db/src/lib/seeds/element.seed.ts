import { ElementGroup, ElementValidator } from "@draw/models";
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';

export const SEED_ELEMENT: Omit<ElementGroup, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Structural Elements',
    description: 'Load-bearing structural components',
    isCustom: false
  },
  {
    name: 'Wall Systems',
    description: 'Wall framing and cladding systems',
    isCustom: false
  },
  {
    name: 'Floor Systems',
    description: 'Floor structure and finishes',
    isCustom: false
  },
  {
    name: 'Roof Systems',
    description: 'Roof structure and covering',
    isCustom: false
  },
  {
    name: 'Foundation Systems',
    description: 'Foundation and ground floor systems',
    isCustom: false
  }
];

export const seedElements = async () => {
  const element = SEED_ELEMENT.map((ele) => {

    console.log("here")
    const errors = ElementValidator.validate(ele);
    if (errors.length) {
      throw new Error(`Validation failed for element ${ele.name}: ${errors.join(', ')}`);
    }

    return {
      ...ele,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  await db.elementGroups.bulkAdd(element);
}