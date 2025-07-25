import { useEntitiesStore } from '@draw/stores';
import { useGroupedEntitiesByElement } from '@draw/hooks';
import styled from '@emotion/styled';

const Container = styled.div`
  color: white;
  `;

const GroupTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--color-text-subtle);
  text-transform: capitalize;
  font-family: "Aronui";
  
  &.active {
    color: var(--color-accent);
  }
`

export const EntitesList = () => {
  const { entities } = useEntitiesStore();
  const groupedEntities = useGroupedEntitiesByElement(entities);
  console.log(groupedEntities);

  return (
    <Container>
      {groupedEntities.map((group) => (
        <div key={group.name}>
          <GroupTitle>{group.name}</GroupTitle>

          {group.entities.map((entity) => (
            <div key={entity.id}>{entity.id}</div>
          ))}
        </div>
      ))}
    </Container>
  );
};
