import styled from '@emotion/styled';
import { ThemeWrapper } from '@shared/theme';

import { Navbar } from '../components/navbar/navbar';
import { Sidebar } from '../components/sidebar/sidebar';
import { device } from '@shared/hooks';
import { Canvas2D } from '../components/2D/canvas-2d';

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

        <div className="row">
          <Sidebar />
          <main>
            <Canvas2D />
          </main>
        </div>
      </Container>
    </ThemeWrapper>
  );
};
