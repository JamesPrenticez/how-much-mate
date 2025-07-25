import { useMemo } from 'react';
import { Entity, Elements } from '@draw/models'; 

export const useGroupedEntitiesByElement = (entities: Entity[]) => {
 return useMemo(() => {
    const groups = new Map<Elements | 'other', Entity[]>();

    // Init groups
    for (const key of Object.values(Elements)) {
      groups.set(key, []);
    }
    groups.set('other', []);

    // Assign entities
    for (const entity of entities) {
      const key = entity.element?.toLowerCase() as Elements | undefined;
      if (key && groups.has(key)) {
        groups.get(key)!.push(entity);
      } else {
        groups.get('other')!.push(entity);
      }
    }

    // Convert to array
    return Array.from(groups.entries()).map(([name, entities]) => ({
      name,
      entities,
    }));
  }, [entities]);
}
