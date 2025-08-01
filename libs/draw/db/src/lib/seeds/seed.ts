import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import {
  Company,
  Project,
  ElementGroup,
  ElementSubgroup,
  CadElement,
  ElementGroupSchema,
} from '@draw/models';

import { CompanyTree } from './seed.data';

export async function seedCompanyTree(tree: CompanyTree[]) {
  const now = new Date().toISOString();

  const companies: Company[] = [];
  const projects: Project[] = [];
  const elementGroups: ElementGroup[] = [];
  const elementSubgroups: ElementSubgroup[] = [];
  const cadElements: CadElement[] = [];

  for (const companyNode of tree) {
    const companyId = uuidv4();
    companies.push({
      id: companyId,
      name: companyNode.name,
      createdAt: now,
      updatedAt: now,
      metadata: companyNode.metadata,
    });

    for (const projectNode of companyNode.projects) {
      const { elementGroups: elementGroupsNode, ...projectRest } = projectNode;
      const projectId = uuidv4();
      projects.push({
        ...projectRest,
        id: projectId,
        companyId,
        createdAt: now,
        updatedAt: now,
      });

      for (const groupNode of elementGroupsNode) {
        // Strip nested elementSubGroups
        const { elementSubGroups: elementSubGroupsNode, ...groupRest } = groupNode;
        const groupId = uuidv4();
        elementGroups.push(ElementGroupSchema.parse({
          ...groupRest,
          id: groupId,
          projectId,
          createdAt: now,
          updatedAt: now,
          isCustom: true,
        }));

        for (const subgroupNode of elementSubGroupsNode) {
          // Strip nested cadElements
          const { cadElements: cadElementsNode, ...subgroupRest } = subgroupNode;
          const subgroupId = uuidv4();
          elementSubgroups.push({
            ...subgroupRest,
            id: subgroupId,
            projectId,
            elementGroupId: groupId,
            createdAt: now,
            updatedAt: now,
          });

          for (const cadElementNode of cadElementsNode) {
            cadElements.push({
              ...cadElementNode,
              id: uuidv4(),
              projectId,
              elementSubgroupId: subgroupId,
              createdAt: now,
              updatedAt: now,
            });
          }
        }
      }
    }
  }

  // TODO seed materials

  await db.transaction(
    'rw',
    [
      db.companies,
      db.projects,
      db.elementGroups,
      db.elementSubgroups,
      db.cadElements,
    ],
    async () => {
      await db.companies.bulkAdd(companies);
      await db.projects.bulkAdd(projects);
      await db.elementGroups.bulkAdd(elementGroups);
      await db.elementSubgroups.bulkAdd(elementSubgroups);
      await db.cadElements.bulkAdd(cadElements);
    }
  );
}
