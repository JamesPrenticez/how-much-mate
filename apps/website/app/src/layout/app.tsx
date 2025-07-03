import styled from '@emotion/styled';
import { ThemeWrapper } from '@shared/theme';

import { Navbar } from '../components/navbar/navbar';
import { Sidebar } from '../components/sidebar/sidebar';
import { Route, Routes } from 'react-router-dom';
import { Calculator_Nav_Items, General_Nav_Items } from '../data/navigation.data';
import { device } from '@shared/hooks';

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

export const AppLayoutWebsite = () => {
  return (
    <ThemeWrapper>
      <Container>
        <Navbar />

        <div className="row">
          <Sidebar />
          <main>
            <Routes>
              {General_Nav_Items.map((item) => (
                <Route key={item.id} path={item.path} element={item.page} />
              ))}
            </Routes>
            <Routes>
              {Calculator_Nav_Items.map((item) => (
                <Route key={item.id} path={item.path} element={item.page} />
              ))}
            </Routes>
          </main>
        </div>
      </Container>
    </ThemeWrapper>
  );
};
