import { create } from 'zustand';
import { organisationService, OrganisationTree } from '@draw/db';
import { Organisation } from '@draw/models';

interface OrganisationState {
  all: OrganisationTree | null;
  
  org: Organisation | null;

  loading: boolean;
  error: string | null;

  fetchOrg: () => Promise<void>;
  fetchAll: () => Promise<void>;
}

export const useOrgStore = create<OrganisationState>((set) => {
  const fetchOrg = async () => {
    try {
      const organisations = await organisationService.getOrganisations();
      const org = organisations?.[0] ?? null;

      if (!org) {
        set({ org: null, loading: false });
        throw new Error('No primary organisation found');
      }

      set({ org, loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? 'Unknown error', loading: false });
      throw err;
    }
  };

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
  fetchOrg();
  fetchAll();

  return {
    all: null,
    org: null,
    loading: true,
    error: null,
    fetchAll,
    fetchOrg
  };
});
