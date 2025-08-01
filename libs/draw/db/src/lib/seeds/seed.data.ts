// seed-tree.ts
import { Company, Project, ElementGroup, ElementSubgroup, CadElement, SyncStatus, GeometryType, ELEMENTS } from '@draw/models';

export type CadElementTree = Omit<CadElement, "id" | "createdAt" | "updatedAt" | "projectId" | "elementSubgroupId">

export interface ElementSubgroupTree extends Omit<ElementSubgroup, "id" | "createdAt" | "updatedAt" | "projectId" | "elementGroupId"> {
  cadElements: CadElementTree[] | null;
}

export interface ElementTree extends Omit<ElementGroup, "id" | "createdAt" | "updatedAt" | "isCustom" | "projectId">  {
  elementSubGroups: ElementSubgroupTree[];
}

export interface ProjectTree extends Omit<Project, "id" | "createdAt" | "updatedAt" | "companyId"> {
  elementGroups: ElementTree[];
}

export interface CompanyTree extends Omit<Company, "id" | "createdAt" | "updatedAt"> {
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

export const SEED_TREE: CompanyTree[] = [
  {
    name: 'Demo Company',
    projects: [
      {
        code: 'PROJ-001',
        name: 'Demo Project A',
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