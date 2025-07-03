import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { KeyLabel } from '@shared/models'
import styled from '@emotion/styled';

import {
  Button,
  ButtonVariants,
  Input,
  InputVariants,
  Tabs,
} from '@shared/components';
import { SlabForm } from './slab.form';
import { CaclculatorRenderer } from '../../components/calculator';
import { createCalculator } from '../../components/calculator/create-calculator';

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


  const [selectedTabItem, setSelectedTabItem] = useState(items[0].key);

let render = (() => {
  switch (selectedTabItem) {
    case TabKeys.SLAB:
      createCalculator.cube({
        name: "Slab",
        width: { dim: 0, unit: "m" },
        height: { dim: 0, unit: "m" },
        depth: { dim: 0, unit: "m" },
      });
      return <CaclculatorRenderer />;
    case TabKeys.POST:
      return <>Posts content here</>;
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
