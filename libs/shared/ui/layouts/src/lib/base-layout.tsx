import { PropsWithChildren } from 'react';
import { ThemeWrapper } from '@shared/theme';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return <ThemeWrapper>{children}</ThemeWrapper>;
};
