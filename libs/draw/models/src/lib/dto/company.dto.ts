export interface CreateCompanyDto {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateCompanyDto {
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
}