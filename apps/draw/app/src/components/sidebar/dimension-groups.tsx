import { useEntitiesStore } from '@draw/stores';
import { useGetEntitiesByGroup } from '@draw/hooks';
import styled from '@emotion/styled';
import { DimGroup } from './dim-group';

const Container = styled.div`
  background-color: var(--color-background-weak);
  padding: 0.5rem;
  border-radius: 0.8rem;

  h1 {
    font-size: 2rem;
    color: var(--color-primary);
  }

  .scroll-container {
    overflow-y: scroll;
    overflow-x: hidden;
  }
`;

export const DimensionGroups = () => {
  const { entities } = useEntitiesStore();

  const groupedEntities = useGetEntitiesByGroup(entities);

  return (
    <Container>
      <h1 className="title">Dimension Groups</h1>

      <div className="scroll-container custom-scrollbar-narrow">
        {groupedEntities.map((group) => (
          <DimGroup key={group.name} title={group.name}>
            {group.entities.map((entity) => (
              <div key={entity.id}>{entity.id}</div>
            ))}
          </DimGroup>
        ))}
      </div>
    </Container>
  );
};
