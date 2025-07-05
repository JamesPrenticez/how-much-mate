import { PropsWithChildren } from 'react';
import { Themes, ThemeWrapper } from '@shared/theme';

interface BaseLayoutProps extends PropsWithChildren {
  theme?: Themes;
  showSwitcher?: boolean;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return <ThemeWrapper>{children}</ThemeWrapper>;
};
