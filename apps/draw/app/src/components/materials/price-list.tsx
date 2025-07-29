import { MaterialCategory, UnitType } from '@draw/models';
import { useMaterialStore } from '@draw/stores';
import styled from '@emotion/styled';
import { Button, ButtonVariants } from '@shared/components';
import { useEffect, useState } from 'react';
// import { addMaterial, getMaterials } from '@draw/db';

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
const { materials, createMaterial } = useMaterialStore()

  const handleSubmit = async () => {
    await createMaterial({
      name: 'New Material',
      code: 'NEW123',
      unitCost: 50,
      unit:  UnitType.COUNT,
      category: MaterialCategory.TIMBER,
      description: 'User-defined material',
    });
  };

  return (
    <Container>
      <h1>MATERIALS - PRICE LIST</h1>

      {materials.map((m) => (
        <div key={`${m.id}`}>
          {m.id} - {m.code} - {m.name} - {m.unitCost}
        </div>
      ))}

      <Button
        variant={ButtonVariants.OUTLINED}
        onClick={handleSubmit}
      >
        NEW
      </Button>
    </Container>
  );
};
