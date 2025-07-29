import { MaterialBuildupDto } from "@draw/models";

// Material buildups for different subgroups
export const TIMBER_FRAME_WALL_BUILDUP: MaterialBuildupDto[] = [
  {
    materialId: 'TIM001', // TIM001 - Pine Framing Timber 90x45mm
    quantity: 3.5, // Linear meters per square meter of wall
    wasteFactor: 1.1,
    notes: 'Studs at 600mm centers plus plates',
    sortOrder: 1
  },
  {
    materialId: 'INS001', // INS001 - Polyester Insulation R1.8 90mm
    quantity: 1.0, // Square meter per square meter
    wasteFactor: 1.05,
    notes: 'Wall cavity insulation',
    sortOrder: 2
  },
  {
    materialId: 'PLB001', // PLB001 - GIB Standard 13mm
    quantity: 2.0, // Both sides of wall
    wasteFactor: 1.1,
    notes: 'Internal and external lining',
    sortOrder: 3
  },
  {
    materialId: 'HRW001', // HRW001 - Galvanised Nails 75mm
    quantity: 0.5, // kg per square meter
    wasteFactor: 1.2,
    notes: 'Framing nails',
    sortOrder: 4
  }
];