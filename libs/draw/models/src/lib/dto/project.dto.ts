export interface CreateProjectDto {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
}