import { CreateCadElementDto } from '../dto';
import { ElementType } from '../enums';

export class CadElementValidator {
  static validateCreate(dto: CreateCadElementDto): string[] {
    const errors: string[] = [];
    
    if (!dto.projectId?.trim()) {
      errors.push('Project ID is required');
    }
    
    if (!Object.values(ElementType).includes(dto.elementType)) {
      errors.push('Invalid element type');
    }
    
    if (!dto.geometry) {
      errors.push('Geometry is required');
    }
    
    // Validate geometry based on element type
    if (dto.geometry && dto.elementType) {
      const geometryErrors = this.validateGeometry(dto.elementType, dto.geometry);
      errors.push(...geometryErrors);
    }
    
    return errors;
  }
  
  private static validateGeometry(elementType: ElementType, geometry: any): string[] {
    const errors: string[] = [];
    
    switch (elementType) {
      case ElementType.LINE:
        if (!geometry.start || !geometry.end) {
          errors.push('Line geometry requires start and end points');
        }
        break;
      case ElementType.POLYLINE:
        if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length < 2) {
          errors.push('Polyline geometry requires at least 2 coordinates');
        }
        break;
      case ElementType.CIRCLE:
        if (!geometry.center || typeof geometry.radius !== 'number' || geometry.radius <= 0) {
          errors.push('Circle geometry requires center point and positive radius');
        }
        break;
      // Add more geometry validations as needed
    }
    
    return errors;
  }
}