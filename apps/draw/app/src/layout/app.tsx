import styled from '@emotion/styled';
import { ThemeWrapper } from '@shared/theme';

import { Navbar } from '../components/navbar/navbar';
import { device } from '@shared/hooks';
import { Route, Routes } from 'react-router-dom';
import { Nav_Items } from '../data/navigation.data';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: var(--color-background);

  .row {
    display: flex;
    flex-grow: 1;
  }

  main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: calc(100dvh - 6rem); // deduct height of navbar
    overflow-y: auto;
    background-color: var(--color-background-medium);

    /* margin: 1rem; */
    padding: 1rem;

    color: var(--color-text);
    font-size: 1.8rem;

    @media ${device.tablet} {
      height: calc(100dvh - 5rem); // deduct height of navbar
    }
  }
`;

export const AppLayout = () => {
  return (
    <ThemeWrapper>
      <Container>
        <Navbar />


          <Routes>
            {Nav_Items.map((item) => (
              <Route key={item.id} path={item.path} element={item.page} />
            ))}
          </Routes>
    </Container>
    </ThemeWrapper>
  );
};
