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
      // await addMaterial({
      //   _id: 'mat-001',
      //   name: '90 x 45 H1.2 Radiata Pine',
      //   cost: 6, // per metre or unit
      //   dimensions: {
      //     width: 90,
      //     depth: 45,
      //     length: 1000,
      //   },
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      //   tags: ['timber', 'framing', 'treated'],
      // });
      const m = await getMaterials();
      setMaterials(m);
    };

    load();
  }, []);

console.log(materials)

  return (
    <Container>
      <h1>MATERIALS</h1>

      {materials.map((m) => (
        <div key={`${m._id}`}>
          {m._id} - {m.name} — ${m.cost} 
        </div>
      ))}
    </Container>
  );
};
