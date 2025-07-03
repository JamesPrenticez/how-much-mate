import { PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import { useThemeStore } from './theme.store';

const Container = styled.div`
  display: block; /* or flex/grid */
  position: relative;
  overflow: hidden;
  
  & * div {
    transition: color background-color 200ms ease-in-out;
  }
`;

export const ThemeWrapper = ({
  children,
}: PropsWithChildren) => {
  const activeTheme = useThemeStore(s => s.activeTheme);

  return (
    <Container className={`theme-${activeTheme}`}>
      {children}
    </Container>
  );
};
