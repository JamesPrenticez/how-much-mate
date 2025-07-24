import type { ReactElement } from 'react';

import Chevron from '../assets/icons/chevron.icon.svg?react';
import Cube from '../assets/icons/cube.icon.svg?react';
import Hamburger from '../assets/icons/hamburger.icon.svg?react';
import Search from '../assets/icons/search.icon.svg?react';
import Trowl from '../assets/icons/trowl.icon.svg?react';
import X from '../assets/icons/x.icon.svg?react';

export enum IconKeys {
  Chevron = 'Chevron',
  Cube = 'Cube',
  Hamburger = 'Hamburger',
  Search = 'Search',
  Trowl = 'Trowl',
  X = 'X',
}

export const ICONS: Record<IconKeys, ReactElement> = {
  Chevron: <Chevron />,
  Cube: <Cube />,
  Hamburger: <Hamburger />,
  Search: <Search />,
  Trowl: <Trowl />,
  X: <X />,
};
