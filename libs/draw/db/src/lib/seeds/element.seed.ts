import { ElementGroup, ElementValidator } from '@draw/models';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { ElementCode, ElementName } from '@draw/models';

export const SEED_ELEMENT: Omit<
  ElementGroup,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    code: ElementCode.E7,
    name: ElementName.EXTERIOR_WALLS_AND_EXTERIOR_FINISHES,
    description: 'Walls and Claddings',
    isCustom: false,
  },
  {
    code: ElementCode.E8,
    name: ElementName.WINDOWS_AND_EXTERIOR_DOORS,
    description: 'Glazing',
    isCustom: false,
  },
  {
    code: "E99",
    name: "Custom element",
    description: 'Glazing',
    isCustom: true,
  },
];

export const seedElements = async () => {
  const element = SEED_ELEMENT.map((ele) => {
    const errors = ElementValidator.validate(ele);
    if (errors.length) {
      throw new Error(
        `Validation failed for element ${ele.code}: ${errors.join(', ')}`
      );
    }

    return {
      ...ele,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  await db.elementGroups.bulkAdd(element);
};
