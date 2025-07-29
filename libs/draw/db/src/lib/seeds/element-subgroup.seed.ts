import { ElementSubgroup, UnitType } from "@draw/models";

export const SEED_ELEMENT_SUBGROUPS: Omit<ElementSubgroup, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Structural Elements subgroups
  {
    groupId: '', // Will be set during seeding
    name: 'Concrete Beams',
    description: 'Reinforced concrete structural beams',
    unit: UnitType.LINEAR_METER
  },
  {
    groupId: '', // Will be set during seeding
    name: 'Steel Columns',
    description: 'Structural steel columns',
    unit: UnitType.LINEAR_METER
  },
  {
    groupId: '', // Will be set during seeding
    name: 'Timber Beams',
    description: 'Engineered timber beams',
    unit: UnitType.LINEAR_METER
  },

  // Wall Systems subgroups
  {
    groupId: '', // Will be set during seeding
    name: 'Timber Frame Wall',
    description: 'Standard timber framed wall with insulation and lining',
    unit: UnitType.SQUARE_METER
  },
  {
    groupId: '', // Will be set during seeding
    name: 'Concrete Block Wall',
    description: 'Concrete masonry wall system',
    unit: UnitType.SQUARE_METER
  },

  // Floor Systems subgroups
  {
    groupId: '', // Will be set during seeding
    name: 'Timber Floor System',
    description: 'Suspended timber floor with bearers and joists',
    unit: UnitType.SQUARE_METER
  },
  {
    groupId: '', // Will be set during seeding
    name: 'Concrete Slab',
    description: 'Reinforced concrete slab on ground',
    unit: UnitType.SQUARE_METER
  },

  // Foundation Systems subgroups
  {
    groupId: '', // Will be set during seeding
    name: 'Strip Foundation',
    description: 'Concrete strip foundation',
    unit: UnitType.LINEAR_METER
  },
  {
    groupId: '', // Will be set during seeding
    name: 'Pile Foundation',
    description: 'Driven pile foundation system',
    unit: UnitType.COUNT
  }
];