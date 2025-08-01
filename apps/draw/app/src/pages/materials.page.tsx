import { MaterialCategory, UnitType } from "@draw/models";
import { useMaterialStore } from "@draw/stores";
import styled from "@emotion/styled";
import { Grid } from "@grid";
import { Button, ButtonVariants } from "@shared/components";

const Container = styled.div``;

export const MaterialsPage = () => {
  const { materials, createMaterial } = useMaterialStore();

  const handleSubmit = async () => {
    await createMaterial({
      name: 'New Material',
      code: 'NEW123',
      unitCost: 50,
      unit: UnitType.COUNT,
      category: MaterialCategory.TIMBER,
      description: 'User-defined material',
    });
  };

  return (
    <Container>
      <h1>Materials</h1>
      <Grid
        data={materials}
        columnOrder={[
          'code',
          'name',
          'description',
          'unitCost',
          'unit',
          'properties',
        ]}
        initialColumnWidths={{
          code: '100px',
          name: '330px',
          description: '1fr',
        }}
      />

      <Button variant={ButtonVariants.OUTLINED} onClick={handleSubmit}>
        NEW
      </Button>
    </Container>
  )
}