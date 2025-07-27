import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { getEntities } from '@draw/db';
import { Entity } from '@draw/models';

const Container = styled.div`
  border: solid 0.2rem var(--color-border);
  border-radius: 0.5rem;
  width: 80%;
  margin: 2rem auto;
  color: var(--color-text-subtle);
  font-size: 2rem;
  background-color: var(--color-background-weak);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  h1 {
    font-size: 3rem;
    font-weight: 600;
    font-family: 'Quicksand', sans-serif;
  }
`;

export const SOQ = () => {
  const [entities, setEntities] = useState<any[]>([]); // Ideally use Material[] if typed

  useEffect(() => {
    const load = async () => {
      const e = await getEntities();
      setEntities(e);
    };

    load();
  }, []);

console.log(entities)

  return (
    <Container>
      <h1>SCHEDULE OF QUANTITES</h1>

      {entities.map((entity: Entity) => (
        <div key={`${entity.id}`}>
          {entity.id} - {entity.type} — {entity.element} - {entity.start.x}
        </div>
      ))}
    </Container>
  );
};
