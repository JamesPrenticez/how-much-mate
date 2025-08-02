import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import { elementService } from '@draw/db';
import { useProjectStore } from './project.store';
import { ElementGroupTree } from '@draw/models';


interface ElementStore {
  elements: ElementGroupTree[] | null;
  error: string | null;
  isLoading: boolean;
  fetchElements: (projectId: string) => Promise<void>;
  clearElements: () => void;
}

export const useElementStore = create<ElementStore>()(
  subscribeWithSelector((set, get) => ({
    elements: [],
    error: null,
    isLoading: false,

    fetchElements: async (projectId: string) => {
      set(
        produce<ElementStore>((state) => {
          state.isLoading = true;
          state.error = null;
        })
      );

      try {
        const elements = await elementService.getElements(projectId);
        set(
          produce<ElementStore>((state) => {
            state.elements = elements;
            state.error = null;
            state.isLoading = false;
          })
        );
      } catch (err: any) {
        set(
          produce<ElementStore>((state) => {
            state.error = err?.message ?? 'Unknown error';
            state.isLoading = false;
          })
        );
      }
    },

    clearElements: () => {
      set(
        produce<ElementStore>((state) => {
          state.elements = [];
          state.error = null;
        })
      );
    },
  }))
);

// Track previous orgId to avoid unnecessary refetches
let prevOrgId: string | undefined;

// Subscribe to org changes and fetch projects accordingly
useProjectStore.subscribe((state) => {
  const projectId = state.activeProject?.id;
  
  if (projectId && projectId !== prevOrgId) {
    // Clear existing projects first
    useElementStore.getState().clearElements();
    
    // Fetch new projects
    useElementStore.getState().fetchElements(projectId);
    
    // Update previous orgId
    prevOrgId = projectId;
  } else if (!projectId && prevOrgId) {
    // Clear projects when org is removed
    useElementStore.getState().clearElements();
    prevOrgId = undefined;
  }
});

// Optional: export unsubscribe function if you need to clean up the subscription later
// export { unsubscribe as unsubscribeFromOrgChanges };