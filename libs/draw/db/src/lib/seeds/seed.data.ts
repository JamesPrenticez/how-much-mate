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

export const SEED_TREE: CompanyTree[] = [
  {
    name: 'Demo Company',
    projects: [
      {
        code: 'PROJ-001',
        name: 'Demo Project A',
        syncStatus: SyncStatus.LOCAL,
        isDeleted: false,
        elementGroups: [
          {
            code: ELEMENTS.E7.code,
            name: ELEMENTS.E7.name,
            elementSubGroups: [
              { 
                  subCode: ELEMENTS.E7.subgroups.E701.code,
                  name: ELEMENTS.E7.subgroups.E701.name,
                  cadElements: [
                    { 
                        geometry: {
                          type: GeometryType.LINE,
                          start: { 
                            x: 50,
                            y: 50,
                            z: 0
                          },
                          end: {
                            x: 100,
                            y: 100,
                            z: 0
                          }
                        },
                        syncStatus: SyncStatus.LOCAL
                    }
                  ]
               },
            ],
          },
        ],
      },
    ],
  },
];
