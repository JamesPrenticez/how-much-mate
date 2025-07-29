import { Material } from '../entities';
import { UnitType, MaterialCategory } from '../enums';

export class MaterialValidator {
  static validate(material: Partial<Material>): string[] {
    const errors: string[] = [];
    
    if (!material.code?.trim()) {
      errors.push('Material code is required');
    }
    
    if (!material.name?.trim()) {
      errors.push('Material name is required');
    }
    
    if (!Object.values(UnitType).includes(material.unit as UnitType)) {
      errors.push('Invalid unit type');
    }
    
    if (!Object.values(MaterialCategory).includes(material.category as MaterialCategory)) {
      errors.push('Invalid material category');
    }
    
    if (material.unitCost !== undefined && material.unitCost < 0) {
      errors.push('Unit cost cannot be negative');
    }
    
    return errors;
  }
}