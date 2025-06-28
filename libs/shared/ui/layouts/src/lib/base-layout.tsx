import { PropsWithChildren } from 'react';
import { Themes, ThemeWrapper } from '@shared/theme';

interface BaseLayoutProps extends PropsWithChildren {
  theme?: Themes;
  showSwitcher?: boolean;
}

export const BaseLayout = ({
  theme = Themes.GOLD,
  showSwitcher = false,
  children,
}: BaseLayoutProps) => {

  return (
      <ThemeWrapper theme={theme} showSwitcher={showSwitcher}>
        {children}
      </ThemeWrapper>
);
};
