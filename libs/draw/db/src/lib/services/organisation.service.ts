import { db } from '../db';
import { Org, OrgTree } from '@draw/models';
import {
  CadElementTreeSeed,
  OrgTreeSeed,
  ElementSubgroupTreeSeed,
  ElementGroupTreeSeed,
  ProjectTreeSeed,
} from '../seeds/seed.data';

export const organisationService = {
  getOrganisations(): Promise<Org[]> {
    return db.organisation.toArray();
  },

  async getAll(organisationId: string): Promise<OrgTree | null> {
    const organisation = await db.organisation.get(organisationId);
    if (!organisation) return null;

    // Get all projects for company
    const projects = await db.projects.where({ organisationId }).toArray();
    const projectIds = projects.map((p) => p.id);

    // Get all elementGroups for these projects
    const elementGroups = await db.elementGroups
      .where('projectId')
      .anyOf(projectIds)
      .toArray();

    // Get all elementSubgroups for those groups
    const groupIds = elementGroups.map((g) => g.id);
    const elementSubgroups = await db.elementSubgroups
      .where('elementGroupId')
      .anyOf(groupIds)
      .toArray();

    // Get all cadElements for those subgroups
    const subgroupIds = elementSubgroups.map((sg) => sg.id);
    const cadElements = await db.cadElements
      .where('elementSubgroupId')
      .anyOf(subgroupIds)
      .toArray();

    // Helper maps for fast nesting
    const cadElementsBySubgroupId = cadElements.reduce<
      Record<string, CadElementTreeSeed[]>
    >((acc, el) => {
      if (!acc[el.elementSubgroupId]) acc[el.elementSubgroupId] = [];
      // Omit id and timestamps to match Tree type
      const {
        id,
        createdAt,
        updatedAt,
        projectId,
        elementSubgroupId,
        ...treeProps
      } = el;
      acc[el.elementSubgroupId].push(treeProps);
      return acc;
    }, {});

    const elementSubgroupsByGroupId = elementSubgroups.reduce<
      Record<string, ElementSubgroupTreeSeed[]>
    >((acc, sg) => {
      if (!acc[sg.elementGroupId]) acc[sg.elementGroupId] = [];
      const { id, createdAt, updatedAt, projectId, elementGroupId, ...rest } =
        sg;
      acc[sg.elementGroupId].push({
        ...rest,
        cadElements: cadElementsBySubgroupId[sg.id] || [],
      });
      return acc;
    }, {});

    const elementGroupsByProjectId = elementGroups.reduce<
      Record<string, ElementGroupTreeSeed[]>
    >((acc, group) => {
      if (!acc[group.projectId]) acc[group.projectId] = [];
      const { id, createdAt, updatedAt, isCustom, projectId, ...rest } = group;
      acc[group.projectId].push({
        ...rest,
        elementSubGroups: elementSubgroupsByGroupId[group.id] || [],
      });
      return acc;
    }, {});

    // Build full tree
    const projectsTree: ProjectTreeSeed[] = projects.map((proj) => {
      const { id, createdAt, updatedAt, organisationId, ...rest } = proj;
      return {
        ...rest,
        elementGroups: elementGroupsByProjectId[proj.id] || [],
      };
    });

    const { id, createdAt, updatedAt, ...companyRest } = organisation;
    return {
      ...companyRest,
      projects: projectsTree,
    };
  },
};
