import { create } from 'zustand';
import { Entity } from '../models/entities.models';

interface EntitiesState {
  entities: Entity[];
  addEntity: (entity: Entity) => void;
  clear: () => void;
}

export const useEntitiesStore = create<EntitiesState>((set) => ({
  entities: [],
  addEntity: (entity) => set((state) => ({ entities: [...state.entities, entity] })),
  clear: () => set({ entities: [] }),
}));
