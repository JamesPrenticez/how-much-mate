import { db } from '../db';
import { Material, MaterialValidator } from '@draw/models';
import { MaterialRepository } from '../repositories';

const repo = new MaterialRepository(db);

export const materialService = {
  async getAll(): Promise<Material[]> {
    return repo.findAll();
  },

  async createNewMaterial(
    materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>
  ): Promise<Material> {
    const errors = MaterialValidator.validate(materialData);
    if (errors.length > 0) {
      throw new Error(`Material validation failed: ${errors.join(', ')}`);
    }
    return repo.createCustomMaterial(materialData);
  },

  async search(query: string): Promise<Material[]> {
    return repo.searchMaterials(query);
  },

  // Add more methods as needed
};
