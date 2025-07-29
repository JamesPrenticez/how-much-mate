import { create } from 'zustand';
import { Material } from '@draw/models';
import { materialService } from '@draw/db';

interface MaterialState {
  materials: Material[];
  loading: boolean;
  error: string | null;
  createMaterial: (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => Promise<void>;
}

export const useMaterialStore = create<MaterialState>((set) => {
  // Load on init
  materialService.getAll()
    .then((materials) => set({ materials, loading: false }))
    .catch((err) => set({ error: err.message, loading: false }));

  return {
    materials: [],
    loading: true,
    error: null,
    createMaterial: async (materialData) => {
      try {
        const newMaterial = await materialService.createNewMaterial(materialData);
        set((state) => ({ materials: [...state.materials, newMaterial] }));
      } catch (err: any) {
        set({ error: err.message });
      }
    },
  };
});
