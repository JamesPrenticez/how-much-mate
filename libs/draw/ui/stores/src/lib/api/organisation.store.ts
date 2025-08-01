import { create } from 'zustand';
import { organisationService, OrganisationTree } from '@draw/db';

interface OrganisationState {
  all: OrganisationTree | null;

  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
}

export const useOrganisationStore = create<OrganisationState>((set) => {
  const fetchAll = async () => {
    set({ loading: true });
    try {
      const organisations = await organisationService.getOrganisations();

      if (!organisations || organisations.length === 0) {
        set({ all: null, loading: false });
        throw new Error('No organisations found');
      }

      const orgId = organisations[0].id;
      const all = await organisationService.getAll(orgId);

      if (!all) {
        set({ all: null, loading: false });
        throw new Error('No organisation data found');
      }

      set({ all, loading: false });

    } catch (err: any) {
      set({ error: err?.message ?? 'Unknown error', loading: false });
      throw new Error(err);
    }
  };

  // call on initial load
  fetchAll();

  return {
    all: null,
    loading: true,
    error: null,
    fetchAll,
  };
});
