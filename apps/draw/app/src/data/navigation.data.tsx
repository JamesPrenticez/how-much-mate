import { ReactNode } from 'react';
import { Path } from '../models';

import { Draw2DPage, ElementsPage, MaterialsPage, SchedulePage } from '../pages';

interface NavItemProps {
  id: string;
  title: string;
  path: Path | string;
  page: ReactNode;
}

export const Nav_Items: NavItemProps[] = [
  {id: '1', title: 'Draw 2D', path: Path.DRAW_2D, page: <Draw2DPage />},
  {id: '2', title: 'Materials', path: Path.MATERIALS, page: <MaterialsPage />},
  {id: '3', title: 'Schedule', path: Path.SCHEDULE, page: <SchedulePage />},
  {id: '4', title: 'Elements', path: Path.ELEMENTS, page: <ElementsPage />},
]