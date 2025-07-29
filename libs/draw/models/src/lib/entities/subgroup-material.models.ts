export interface SubgroupMaterial {
  id: string;
  subgroupId: string;
  materialId: string;
  quantity: number; // quantity per unit of subgroup
  wasteFactor: number; // 1.0 = no waste, 1.1 = 10% waste
  notes?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
}