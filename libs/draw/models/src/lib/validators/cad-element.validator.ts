import { CreateCadElementDto } from '../dto';
import { GeometryType } from '../enums';

export class CadElementValidator {
  static validateCreate(dto: CreateCadElementDto): string[] {
    const errors: string[] = [];
    
    if (!dto.projectId?.trim()) {
      errors.push('Project ID is required');
    }
    
    if (!Object.values(GeometryType).includes(dto.geometryType)) {
      errors.push('Invalid geometry type');
    }
    
    if (!dto.geometry) {
      errors.push('Geometry is required');
    }
    
    // Validate geometry based on element type
    if (dto.geometry && dto.geometryType) {
      const geometryErrors = this.validateGeometry(dto.geometryType, dto.geometry);
      errors.push(...geometryErrors);
    }
    
    return errors;
  }
  
  private static validateGeometry(geometryType: GeometryType, geometry: any): string[] {
    const errors: string[] = [];
    
    switch (geometryType) {
      case GeometryType.LINE:
        if (!geometry.start || !geometry.end) {
          errors.push('Line geometry requires start and end points');
        }
        break;
      case GeometryType.POLYLINE:
        if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length < 2) {
          errors.push('Polyline geometry requires at least 2 coordinates');
        }
        break;
      case GeometryType.CIRCLE:
        if (!geometry.center || typeof geometry.radius !== 'number' || geometry.radius <= 0) {
          errors.push('Circle geometry requires center point and positive radius');
        }
        break;
      // Add more geometry validations as needed
    }
    
    return errors;
  }
}