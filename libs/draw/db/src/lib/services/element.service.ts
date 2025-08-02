import { CadElementTree, ElementGroupTree, ElementSubgroupTree } from '@draw/models';
import { db } from '../db';

export const elementService = {
  async getElements(projectId: string): Promise<ElementGroupTree[] | null> {
    // Get all elementGroups for this project
    const elementGroups = await db.elementGroups
      .where('projectId')
      .equals(projectId)
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
      Record<string, CadElementTree[]>
    >((acc, el) => {
      if (!acc[el.elementSubgroupId]) acc[el.elementSubgroupId] = [];
      acc[el.elementSubgroupId].push(el);
      return acc;
    }, {});

    const elementSubgroupsByGroupId = elementSubgroups.reduce<
      Record<string, ElementSubgroupTree[]>
    >((acc, sg) => {
      if (!acc[sg.elementGroupId]) acc[sg.elementGroupId] = [];

      acc[sg.elementGroupId].push({
        ...sg,
        cadElements: cadElementsBySubgroupId[sg.id] || [],
      });
      return acc;
    }, {});

    // Build the final tree structure directly as an array
    const elementGroupTrees: ElementGroupTree[] = elementGroups.map((group) => {
      return {
        ...group,
        elementSubGroups: elementSubgroupsByGroupId[group.id] || [],
      };
    });

    return elementGroupTrees;
  },
};
