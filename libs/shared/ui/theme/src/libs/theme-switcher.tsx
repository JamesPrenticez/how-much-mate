import styled from '@emotion/styled';
import { Themes } from './theme-wrapper';

const Container = styled.div`
  position: absolute;
  top: 3rem; /* half of 6rem navbar height */
  transform: translateY(-50%);
  right: 2rem;
  z-index: 9999;

  display: flex;
  align-items: center;
  padding: 0.8rem;
  border-radius: 8rem;
  transform-origin: center;

  gap: 0.4rem;
  background-color: rgba(var(--color-white-20-opacity), 0.5);
`;

const Dot = styled.div<{ color: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  cursor: pointer;
`;

interface ThemeSwitcherProps {
  handleSetTheme: (theme: Themes) => void;
}

export const ThemeSwitcher = ({ handleSetTheme }: ThemeSwitcherProps) => {
  return (
    <Container>
      {Object.keys(Themes).map((key) => {
        const themeKey = key as keyof typeof Themes;

        return (
          <Dot
            key={themeKey}
            color={`var(--color-${Themes[themeKey]}-100)`}
            className="button"
            onClick={() => handleSetTheme(Themes[themeKey])}
          />
        );
      })}
    </Container>
  );
};
