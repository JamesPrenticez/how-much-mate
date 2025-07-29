export interface UpdateProjectDto {
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
}