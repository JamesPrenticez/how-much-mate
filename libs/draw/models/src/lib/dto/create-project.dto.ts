export interface CreateProjectDto {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}