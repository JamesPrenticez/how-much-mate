// seed-tree.ts
import { Organisation, Project, ElementGroup, ElementSubgroup, CadElement, SyncStatus, GeometryType, ELEMENTS } from '@draw/models';

export type CadElementTree = Omit<CadElement, "id" | "createdAt" | "updatedAt" | "projectId" | "elementSubgroupId">

export interface ElementSubgroupTree extends Omit<ElementSubgroup, "id" | "createdAt" | "updatedAt" | "projectId" | "elementGroupId"> {
  cadElements: CadElementTree[] | null;
}

export interface ElementTree extends Omit<ElementGroup, "id" | "createdAt" | "updatedAt" | "isCustom" | "projectId">  {
  elementSubGroups: ElementSubgroupTree[];
}

export interface ProjectTree extends Omit<Project, "id" | "createdAt" | "updatedAt" | "organisationId"> {
  elementGroups: ElementTree[];
}

export interface OrganisationTree extends Omit<Organisation, "id" | "createdAt" | "updatedAt"> {
  projects: ProjectTree[];
}

const cadElementsForSeed: Record<string, CadElementTree[]> = {
  E705: [
    {
      geometry: {
        type: GeometryType.LINE,
        start: { x: 50, y: 50, z: 0 },
        end: { x: 100, y: 100, z: 0 },
      },
      syncStatus: SyncStatus.LOCAL,
    },
    {
      geometry: {
        type: GeometryType.LINE,
        start: { x: 90, y: 90, z: 0 },
        end: { x: 100, y: 100, z: 0 },
      },
      syncStatus: SyncStatus.LOCAL,
    },
  ],
};

export const SEED_TREE: OrganisationTree[] = [
  {
    name: 'Demo Company',
    projects: [
      {
        code: 'PROJ-001',
        name: '333 Blue Spur Road',
        syncStatus: SyncStatus.LOCAL,
        isDeleted: false,
        elementGroups: createSeedElementGroups(ELEMENTS, cadElementsForSeed),
      },
      {
        code: 'PROJ-002',
        name: '338 Berryfield Architectural Showhome',
        syncStatus: SyncStatus.LOCAL,
        isDeleted: false,
        elementGroups: createSeedElementGroups(ELEMENTS, cadElementsForSeed),
      },
      {
        code: 'PROJ-003',
        name: '65a Leask Stree, Omakau',
        syncStatus: SyncStatus.LOCAL,
        isDeleted: false,
        elementGroups: createSeedElementGroups(ELEMENTS, cadElementsForSeed),
      },
      {
        code: 'PROJ-004',
        name: '17a Westburn Terrace, Christchurch',
        syncStatus: SyncStatus.LOCAL,
        isDeleted: false,
        elementGroups: createSeedElementGroups(ELEMENTS, cadElementsForSeed),
      },
    ],
  },
];

function createSeedElementGroups (
  elements: typeof ELEMENTS,
  cadElementsMap: Record<string, CadElementTree[]> = {}
) {
  return Object.values(elements).map(group => ({
    code: group.code,
    name: group.name,
    elementSubGroups: Object.entries(group.subgroups).map(([subCode, sub]) => {
      // Handle subgroup either as string or object with code + name
      const code = typeof sub === 'string' ? subCode : sub.code;
      const name = typeof sub === 'string' ? sub : sub.name;

      return {
        subCode: code,
        name,
        cadElements: cadElementsMap[code] || [],
      };
    }),
  }));
}