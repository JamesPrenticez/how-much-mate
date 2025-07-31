import { db } from '../db';
import { Company, ElementGroup, ElementSubgroup } from '@draw/models';
import { CadElementTree, CompanyTree, ElementSubgroupTree, ElementTree, ProjectTree } from '../seeds/seed.data';

export const elementService = {
  getAll(): Promise<ElementGroup[]> {
    return db.elementGroups.toArray();
  },
  getAllSub(): Promise<ElementSubgroup[]> {
    return db.elementSubgroups.toArray();
  },

  getCompany(): Promise<Company[]> {
    return db.companies.toArray();
  },

  async getCompanyTree(companyId: string): Promise<CompanyTree | null> {
  const company = await db.companies.get(companyId);
  if (!company) return null;

  // Get all projects for company
  const projects = await db.projects.where({ companyId }).toArray();
  const projectIds = projects.map(p => p.id);

  // Get all elementGroups for these projects
  const elementGroups = await db.elementGroups.where('projectId').anyOf(projectIds).toArray();

  // Get all elementSubgroups for those groups
  const groupIds = elementGroups.map(g => g.id);
  const elementSubgroups = await db.elementSubgroups.where('elementGroupId').anyOf(groupIds).toArray();

  // Get all cadElements for those subgroups
  const subgroupIds = elementSubgroups.map(sg => sg.id);
  const cadElements = await db.cadElements.where('elementSubgroupId').anyOf(subgroupIds).toArray();

  // Helper maps for fast nesting
  const cadElementsBySubgroupId = cadElements.reduce<Record<string, CadElementTree[]>>((acc, el) => {
    if (!acc[el.elementSubgroupId]) acc[el.elementSubgroupId] = [];
    // Omit id and timestamps to match Tree type
    const { id, createdAt, updatedAt, projectId, elementSubgroupId, ...treeProps } = el;
    acc[el.elementSubgroupId].push(treeProps);
    return acc;
  }, {});

  const elementSubgroupsByGroupId = elementSubgroups.reduce<Record<string, ElementSubgroupTree[]>>((acc, sg) => {
    if (!acc[sg.elementGroupId]) acc[sg.elementGroupId] = [];
    const { id, createdAt, updatedAt, projectId, elementGroupId, ...rest } = sg;
    acc[sg.elementGroupId].push({
      ...rest,
      cadElements: cadElementsBySubgroupId[sg.id] || [],
    });
    return acc;
  }, {});

  const elementGroupsByProjectId = elementGroups.reduce<Record<string, ElementTree[]>>((acc, group) => {
    if (!acc[group.projectId]) acc[group.projectId] = [];
    const { id, createdAt, updatedAt, isCustom, projectId, ...rest } = group;
    acc[group.projectId].push({
      ...rest,
      elementSubGroups: elementSubgroupsByGroupId[group.id] || [],
    });
    return acc;
  }, {});

  // Build full tree
  const projectsTree: ProjectTree[] = projects.map(proj => {
    const { id, createdAt, updatedAt, companyId, ...rest } = proj;
    return {
      ...rest,
      elementGroups: elementGroupsByProjectId[proj.id] || [],
    };
  });

  const { id, createdAt, updatedAt, ...companyRest } = company;
  return {
    ...companyRest,
    projects: projectsTree,
  };
}

};