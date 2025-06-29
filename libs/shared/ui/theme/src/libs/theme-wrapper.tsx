import { PropsWithChildren, useState } from 'react';

import styled from '@emotion/styled';
import { ThemeSwitcher } from './theme-switcher';

const Container = styled.div`
  display: contents;
  position: relative;
  overflow: hidden;
  transition: all 2000ms ease-in-out;
`;

export enum Themes {
  GOLD = 'gold',
  BLUE = 'blue',
  GREEN = 'green',
  PURPLE = 'purple',
  ORANGE_DARK = 'orange-dark',
  ORANGE_LIGHT = 'orange-light',
}

export interface Theme {
  theme: Themes;
  showSwitcher?: boolean;
}

export const ThemeWrapper = ({
  theme = Themes.GREEN,
  showSwitcher = false,
  children,
}: PropsWithChildren<Theme>) => {
  const [activeTheme, setActiveTheme] = useState<Themes>(() => {
    const savedTheme = localStorage.getItem('theme') as Themes | null;
    return savedTheme || theme;
  });

  const handleSetTheme = (theme: Themes) => {
    setActiveTheme(theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <Container
      className={`theme-${activeTheme}`}
    >
      {showSwitcher && <ThemeSwitcher handleSetTheme={handleSetTheme} />}

      {children}
    </Container>
  );
};
