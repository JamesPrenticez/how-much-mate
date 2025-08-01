import { create } from 'zustand';
import { ElementGroup, ElementSubgroup } from '@draw/models';
import { elementService, CompanyTree } from '@draw/db';

interface ElementsState {
  all: CompanyTree | null;
  elements: ElementGroup[];
  subs: ElementSubgroup[];
  loading: boolean;
  error: string | null;
  fetchElements: () => Promise<void>;
  fetchCompanyTree: () => Promise<void>;
  // createMaterial: (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => Promise<void>;
}

export const useElementStore = create<ElementsState>((set) => {
  const fetchElements = async () => {
    set({ loading: true });
    try {
      const elements = await elementService.getAll();
      set({ elements, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  };

const fetchCompanyTree = async () => {
  set({ loading: true });
  try {
    const company = await elementService.getCompany();
    const all = company.length > 0 ? await elementService.getCompanyTree(company[0].id) : null;
    set({ all, loading: false });
  } catch (err: any) {
    set({ error: err.message, loading: false });
  }
};

  // call on initial load
  fetchElements();
  fetchCompanyTree();

  return {
    all: null,
    elements: [],
    subs: [],
    loading: true,
    error: null,
    fetchElements,
    fetchCompanyTree
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
