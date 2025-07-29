import { CreateProjectDto, UpdateProjectDto } from '../dto'

export class ProjectValidator {
  static validateCreate(dto: CreateProjectDto): string[] {
    const errors: string[] = [];
    
    if (!dto.name?.trim()) {
      errors.push('Project name is required');
    }
    
    if (dto.name && dto.name.length > 255) {
      errors.push('Project name must be less than 255 characters');
    }
    
    return errors;
  }
  
  static validateUpdate(dto: UpdateProjectDto): string[] {
    const errors: string[] = [];
    
    if (dto.name !== undefined && !dto.name?.trim()) {
      errors.push('Project name cannot be empty');
    }
    
    if (dto.name && dto.name.length > 255) {
      errors.push('Project name must be less than 255 characters');
    }
    
    return errors;
  }
}