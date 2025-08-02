import { ElementSubgroupTree } from '@draw/models';
import styled from '@emotion/styled';
import { CadElement } from './cad-element';
import clsx from 'clsx';

const Container = styled.div`
  padding: 0.5rem 0.5rem 1rem 0.5rem;
  h3 {
    color: var(--color-text-subtle);
    font-size: 1.2rem;
    text-transform: capitalize;
    font-weight: 400;

    &.active {
      color: var(--color-accent);
    }
  }

  .scroll-container {
    overflow-y: scroll;
    overflow-x: hidden;
  }
`;

const SubgroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0rem 0.5rem;
`;

interface SubGroupProps {
  subgroup: ElementSubgroupTree;
}

export const Subgroup = ({ subgroup }: SubGroupProps) => {
  if (!subgroup) return <div>No Subgroup...</div>;

  return (
    <Container>
      <h3
        className={clsx({
          active: true,
        })}
      >
        {subgroup.name}
      </h3>

      <SubgroupContainer>
        {subgroup.cadElements ? (
          subgroup.cadElements.map((cadElement) => (
            <CadElement key={cadElement.id} cadElement={cadElement} />
          ))
        ) : (
          <div>No cadElements</div>
        )}
      </SubgroupContainer>
    </Container>
  );
};
