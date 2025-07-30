import { ElementGroup, ElementSubgroup } from '../entities';

export class ElementValidator {
  static validate(element: Partial<ElementGroup>): string[] {
    const errors: string[] = [];
    
    if (!element.name?.trim()) {
      errors.push('Element name is required');
    }
    
    return errors;
  }
}

export class ElementSubgroupValidator {
  static validate(elementSubGroup: Partial<ElementSubgroup>): string[] {
    const errors: string[] = [];
    
    if (!elementSubGroup.name?.trim()) {
      errors.push('Element Subgroup name is required');
    }
    
    return errors;
  }
}