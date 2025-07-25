import { useControlsDrawingStore, useEntitiesStore } from '@draw/stores';
import { useGetEntitiesByGroup } from '@draw/hooks';
import styled from '@emotion/styled';
import clsx from 'clsx';

const Container = styled.div`
  color: white;
`;

const GroupTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--color-text-subtle);
  text-transform: capitalize;
  font-family: 'Aronui';

  &.active {
    color: var(--color-accent);
  }
`;

export const EntitesList = () => {
  const { entities } = useEntitiesStore();
  const { activeDimensionGroup } = useControlsDrawingStore();
  const groupedEntities = useGetEntitiesByGroup(entities);

  return (
    <Container>
      {groupedEntities.map((group) => (
        <div key={group.name}>
          <GroupTitle
            className={clsx({
              active: activeDimensionGroup === group.name,
            })}
          >
            {group.name}
          </GroupTitle>

          {group.entities.map((entity) => (
            <div key={entity.id}>{entity.id}</div>
          ))}
        </div>
      ))}
    </Container>
  );
};
