import { Project, SyncStatus } from "@draw/models";

export const SEED_PROJECTS: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Sample House Project',
    description: 'A sample residential house project for demonstration',
    syncStatus: SyncStatus.LOCAL,
    isDeleted: false,
    metadata: {
      client: 'Demo Client',
      location: 'Auckland, New Zealand',
      architect: 'Sample Architect',
      area: 180,
      stories: 2
    }
  },
  {
    name: 'Commercial Building',
    description: 'Small commercial office building',
    syncStatus: SyncStatus.LOCAL,
    isDeleted: false,
    metadata: {
      client: 'Demo Corp',
      location: 'Wellington, New Zealand',
      architect: 'Commercial Architects Ltd',
      area: 450,
      stories: 3
    }
  }
];