import { create } from 'zustand';
import { ElementGroup } from '@draw/models';
import { elementService } from '@draw/db';

interface ElementsState {
  elements: ElementGroup[];
  loading: boolean;
  error: string | null;
  // createMaterial: (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => Promise<void>;
}

export const useElementStore = create<ElementsState>((set) => {
  // Load on init
  elementService.getAll()
    .then((elements) => set({ elements, loading: false }))
    .catch((err) => set({ error: err.message, loading: false }));

  return {
    elements: [],
    loading: true,
    error: null,
    // createMaterial: async (materialData) => {
    //   try {
    //     const newMaterial = await elementService.createNewMaterial(materialData);
    //     set((state) => ({ materials: [...state.materials, newMaterial] }));
    //   } catch (err: any) {
    //     set({ error: err.message });
    //   }
    // },
  };
});
