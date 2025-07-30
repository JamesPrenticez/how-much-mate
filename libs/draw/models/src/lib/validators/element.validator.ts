import { ElementGroup } from '../entities';

export class ElementValidator {
  static validate(material: Partial<ElementGroup>): string[] {
    const errors: string[] = [];
    
    if (!material.name?.trim()) {
      errors.push('Material name is required');
    }
    
    return errors;
  }
}