import styled from '@emotion/styled';
import { Themes, ThemeWrapper } from '@shared/theme';

import { Navbar } from '../components/navbar/navbar';
import { Sidebar } from '../components/sidebar/sidebar';
import { Route, Routes } from 'react-router-dom';
import { COMPONENT_DATA } from '../data/components.data';

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
    height: calc(100dvh - 6rem); // deduct height of navnar
    overflow-y: auto;
    background-color: var(--color-black-20);
    border-radius: 0.5rem;

    /* margin: 1rem; */
    padding: 1rem;

    color: var(--color-white-100);
    font-size: 1.8rem;
  }
`;

export const AppLayoutWebsite = () => {
  return (
    <ThemeWrapper theme={Themes.ORANGE_LIGHT} showSwitcher>
      <Container>
        <Navbar />

        <div className="row">
          <Sidebar />
          <main>
            <Routes>
              {COMPONENT_DATA.map((item) => (
                <Route key={item.id} path={item.path} element={item.page} />
              ))}
            </Routes>
          </main>
        </div>
      </Container>
    </ThemeWrapper>
  );
};
