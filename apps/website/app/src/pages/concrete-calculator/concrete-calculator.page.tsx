import { useState } from 'react';
import type { KeyLabel } from '@shared/models';
import styled from '@emotion/styled';

import {
  Tabs,
} from '@shared/components';
import { Simple, type MeasurementData, MeasurementType, CalculatorForm } from '@shared/measurement';


const cubeCalculator: MeasurementData = {
  type: MeasurementType.CUBE,
  name: 'Slab',
  inputs: {
    width: { value: 20, unit: 'm' },
    height: { value: 50, unit: 'm' },
    depth: { value: 100, unit: 'mm' },
  },
};

const cylinderCalculator = {
  name: 'Cylinder Volume',
  initialInputs: {
    radius: { value: 5, unit: 'cm' },
    height: { value: 20, unit: 'cm' },
  },
};

export enum TabKeys {
  SLAB = 'slab',
  POST = 'post',
  BLOCK = 'block',
}

const items: KeyLabel[] = [
  { key: TabKeys.SLAB, label: 'Slab' },
  { key: TabKeys.POST, label: 'Posts' },
  { key: TabKeys.BLOCK, label: 'Block Fill' },
];

const Container = styled.div``;

export const ConcreteCalculatorPage = () => {
  const [selectedTabItem, setSelectedTabItem] = useState(items[1].key);

  let render = (() => {
    switch (selectedTabItem) {
      case TabKeys.SLAB:
        return null;
        // return <CalculatorForm data={cubeCalculator}/>;
      case TabKeys.POST:
        return <Simple />
      case TabKeys.BLOCK:
        return <>Block Fill content here</>;
      default:
        return null;
    }
  })();

  return (
    <Container>
      <h1>Concrete Volume Calculator</h1>

      <Tabs
        items={items}
        selectedKey={selectedTabItem}
        onChange={(key) => setSelectedTabItem(key)}
      />
      {render}
    </Container>
  );
};
