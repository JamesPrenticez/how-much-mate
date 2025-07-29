import { ElementGroup } from "@draw/models";

export const SEED_ELEMENT_GROUPS: Omit<ElementGroup, 'id' | 'createdAt' | 'updatedAt'>[] = [
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