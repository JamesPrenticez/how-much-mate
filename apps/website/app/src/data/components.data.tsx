import { ReactNode } from 'react';
import { Path } from '../models/paths';

import { HomePage } from '../pages/home.page';
import { ConcreteCalculatorPage } from '../pages';

interface ComponentDataProps {
  id: string;
  title: string;
  path: Path | string;
  page: ReactNode;
}

export const COMPONENT_DATA: ComponentDataProps[] = [
  {id: '0', title: 'Home', path: Path.HOME, page: <HomePage /> },
  {id: '4', title: 'Concrete Calculator', path: Path.SELECT, page: <ConcreteCalculatorPage />},
]