import { PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import { useThemeStore } from './theme.store';

const Container = styled.div`
  display: contents;
  position: relative;
  overflow: hidden;
  transition: all 2000ms ease-in-out;
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
