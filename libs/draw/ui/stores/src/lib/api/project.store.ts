import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import { Project } from '@draw/models';
import { projectService } from '@draw/db';
import { useOrgStore } from './org.store';

interface ProjectStore {
  projects: Project[];
  error: string | null;
  isLoading: boolean;
  fetchProjects: (orgId: string) => Promise<void>;
  clearProjects: () => void;
}

export const useProjectStore = create<ProjectStore>()(
  subscribeWithSelector((set, get) => ({
    projects: [],
    error: null,
    isLoading: false,

    fetchProjects: async (orgId: string) => {
      set(
        produce<ProjectStore>((state) => {
          state.isLoading = true;
          state.error = null;
        })
      );

      try {
        const projects = await projectService.getProjects(orgId);
        set(
          produce<ProjectStore>((state) => {
            state.projects = projects;
            state.error = null;
            state.isLoading = false;
          })
        );
      } catch (err: any) {
        set(
          produce<ProjectStore>((state) => {
            state.error = err?.message ?? 'Unknown error';
            state.isLoading = false;
          })
        );
      }
    },

    clearProjects: () => {
      set(
        produce<ProjectStore>((state) => {
          state.projects = [];
          state.error = null;
        })
      );
    },
  }))
);

// Track previous orgId to avoid unnecessary refetches
let prevOrgId: string | undefined;

// Subscribe to org changes and fetch projects accordingly
useOrgStore.subscribe((state) => {
  const orgId = state.org?.id;
  
  if (orgId && orgId !== prevOrgId) {
    // Clear existing projects first
    useProjectStore.getState().clearProjects();
    
    // Fetch new projects
    useProjectStore.getState().fetchProjects(orgId);
    
    // Update previous orgId
    prevOrgId = orgId;
  } else if (!orgId && prevOrgId) {
    // Clear projects when org is removed
    useProjectStore.getState().clearProjects();
    prevOrgId = undefined;
  }
});

// Optional: export unsubscribe function if you need to clean up the subscription later
// export { unsubscribe as unsubscribeFromOrgChanges };