import { Org, Project, ElementGroup, ElementSubgroup, CadElement, SyncStatus, GeometryType, ELEMENTS } from '@draw/models';

export type CadElementTreeSeed = Omit<CadElement, "id" | "createdAt" | "updatedAt" | "projectId" | "elementSubgroupId">;

export interface ElementSubgroupTreeSeed extends Omit<ElementSubgroup, "id" | "createdAt" | "updatedAt" | "projectId" | "elementGroupId"> {
  cadElements: CadElementTreeSeed[] | null;
}

export interface ElementGroupTreeSeed extends Omit<ElementGroup, "id" | "createdAt" | "updatedAt" | "isCustom" | "projectId"> {
  elementSubGroups: ElementSubgroupTreeSeed[];
}

export interface ProjectTreeSeed extends Omit<Project, "id" | "createdAt" | "updatedAt" | "organisationId"> {
  elementGroups: ElementGroupTreeSeed[];
}

export interface OrgTreeSeed extends Omit<Org, "id" | "createdAt" | "updatedAt"> {
  projects: ProjectTreeSeed[];
}

const cadElementsForSeed: Record<string, CadElementTreeSeed[]> = {
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

export const SEED_TREE: OrgTreeSeed[] = [
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
  cadElementsMap: Record<string, CadElementTreeSeed[]> = {}
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