import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import {
  Organisation,
  Project,
  ElementGroup,
  ElementSubgroup,
  CadElement,
  ElementGroupSchema,
} from '@draw/models';

import { OrganisationTree } from './seed.data';

export async function seedCompanyTree(tree: OrganisationTree[]) {
  const now = new Date().toISOString();

  const organisations: Organisation[] = [];
  const projects: Project[] = [];
  const elementGroups: ElementGroup[] = [];
  const elementSubgroups: ElementSubgroup[] = [];
  const cadElements: CadElement[] = [];

  for (const organisationNode of tree) {
    const organisationId = uuidv4();
    organisations.push({
      id: organisationId,
      name: organisationNode.name,
      createdAt: now,
      updatedAt: now,
      metadata: organisationNode.metadata,
    });

    for (const projectNode of organisationNode.projects) {
      const { elementGroups: elementGroupsNode, ...projectRest } = projectNode;
      const projectId = uuidv4();
      projects.push({
        ...projectRest,
        id: projectId,
        organisationId,
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
      db.organisation,
      db.projects,
      db.elementGroups,
      db.elementSubgroups,
      db.cadElements,
    ],
    async () => {
      await db.organisation.bulkAdd(organisations);
      await db.projects.bulkAdd(projects);
      await db.elementGroups.bulkAdd(elementGroups);
      await db.elementSubgroups.bulkAdd(elementSubgroups);
      await db.cadElements.bulkAdd(cadElements);
    }
  );
}
