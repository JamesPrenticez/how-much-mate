import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { addMaterial, getMaterials } from '@draw/db';

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

export const PriceList = () => {
  const [materials, setMaterials] = useState<any[]>([]); // Ideally use Material[] if typed

  useEffect(() => {
    const load = async () => {
      const m = await getMaterials();
      setMaterials(m);
    };

    load();
  }, []);

console.log(materials)

  return (
    <Container>
      <h1>MATERIALS - PRICE LIST</h1>

      {materials.map((m) => (
        <div key={`${m.id}`}>
          {m.code} - {m.name} — ${m.cost}
        </div>
      ))}
    </Container>
  );
};
