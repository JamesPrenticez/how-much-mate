export interface MaterialBuildupDto {
  materialId: string;
  quantity: number;
  wasteFactor?: number;
  notes?: string;
  sortOrder?: number;
}