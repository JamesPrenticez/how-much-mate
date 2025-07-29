// import { useMemo } from 'react';
// import { Entity, Group } from '@draw/models';

// export const useGetEntitiesByGroup = (entities: Entity[]) => {
//   return useMemo(() => {
//     const groups = new Map<Group, Entity[]>();

//     // Init groups
//     for (const key of Object.values(Group)) {
//       groups.set(key, []);
//     }
//     groups.set(Group.OTHER, []);

//     // Assign entities
//     for (const entity of entities) {
//       const key = entity.element?.toLowerCase() as Group | undefined;
//       if (key && groups.has(key)) {
//         groups.get(key)!.push(entity);
//       } else {
//         groups.get(Group.OTHER)!.push(entity);
//       }
//     }

//     // Convert to array
//     const groupedArray = Array.from(groups.entries()).map(
//       ([name, entities]) => ({
//         name,
//         entities,
//       })
//     );

//     // Custom sort order
//     const preferredOrder: Group[] = [Group.OTHER, Group.FLOOR];

//     groupedArray.sort((a, b) => {
//       const aIndex = preferredOrder.indexOf(a.name);
//       const bIndex = preferredOrder.indexOf(b.name);

//       const aScore = aIndex === -1 ? Infinity : aIndex;
//       const bScore = bIndex === -1 ? Infinity : bIndex;

//       return aScore - bScore;
//     });

//     return groupedArray;
//   }, [entities]);
// };
