import { Material, MaterialCategory } from "@draw/models";
import { BaseRepository } from "./base.repository";
import Dexie, { Table } from "dexie";

export class MaterialRepository extends BaseRepository<Material> {
  protected storeName = 'materials';

  constructor(db: Dexie) {
    super(db);
  }

  async findByCode(code: string): Promise<Material | null> {
    return this.findOneBy('code', code);
  }

  async findByCategory(category: MaterialCategory): Promise<Material[]> {
    return this.findBy('category', category);
  }

  async findCustomMaterials(): Promise<Material[]> {
    return this.findBy('isCustom', true);
  }

  async findBuiltInMaterials(): Promise<Material[]> {
    return this.findBy('isCustom', false);
  }

  async createCustomMaterial(materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>): Promise<Material> {
    return this.create({
      ...materialData,
      isCustom: true,
    });
  }

  async searchMaterials(query: string): Promise<Material[]> {
    const allMaterials = await this.findAll();
    const searchTerm = query.toLowerCase();
    
    return allMaterials.filter(material => 
      material.name.toLowerCase().includes(searchTerm) ||
      material.code.toLowerCase().includes(searchTerm) ||
      material.description?.toLowerCase().includes(searchTerm)
    );
  }
}
