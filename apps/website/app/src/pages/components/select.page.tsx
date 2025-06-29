import styled from '@emotion/styled';
import { Select, SubTitle, Title } from '@shared/components';
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .row {
    display: flex;
    gap: 2rem;
  }
`;

const mockPlants = [
  { id: 'luna-fern', name: 'Luna Fern', planet: 'Moon' },
  { id: 'mars-moss', name: 'Martian Moss', planet: 'Mars' },
  { id: 'jovian-vine', name: 'Jovian Vine', planet: 'Jupiter' },
  { id: 'saturn-succulent', name: 'Saturn Succulent', planet: 'Saturn' },
];

export const SelectPage = () => {
  const [selected, setSelected] = useState('');

  return (
    <Container>
      <Title>Select</Title>

      <section>
        <SubTitle>Default Select</SubTitle>
        <div className="row">
          <Select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            isMobile={false}
          >
            <option value="" disabled>
              Select a plant
            </option>
            {mockPlants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.planet}
              </option>
            ))}
          </Select>
        </div>
      </section>
    </Container>
  );
};
