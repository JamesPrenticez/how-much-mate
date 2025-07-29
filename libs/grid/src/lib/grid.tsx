import styled from '@emotion/styled';
import { useState } from 'react';
import { Header } from './header';

const GridContainer = styled.div`
  border: 1px solid var(--color-primary);
  border-radius: 0.5rem;
  background-color: var(--color-secondary);
  height: 500px;
`;

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  width: 100%;
`;

interface GridProps {
  data: any[];
}

export const Grid = ({ data }: GridProps) => {

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <GridContainer>
      <HeaderContainer>
        {columns.map((colKey) => (
          <Header
            key={`header-${colKey}`}
            title={colKey.toUpperCase()}  
          />
        ))}
      </HeaderContainer>


    </GridContainer>
  );
};
