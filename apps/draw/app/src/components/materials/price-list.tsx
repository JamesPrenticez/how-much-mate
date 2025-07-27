import { useDb } from '@draw/contexts';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
// import { addMaterial, getMaterials } from '@draw/db';
import { Material } from "@draw/models"
import { Button, ButtonVariants } from '@shared/components';

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
 const {resetDb, materials } = useDb();
  const [data, setData] = useState<Material[]>([]);

  useEffect(() => {
    setData(materials.getAll());
  }, [materials]);


  // todo persit db in local storage

  return (
    <Container>
      <h1>MATERIALS - PRICE LIST</h1>
            <Button
        variant={ButtonVariants.OUTLINED}
        onClick={() => resetDb()}
      >
        Reset
      </Button>
      {JSON.stringify(data)}
    </Container>
  );
};
