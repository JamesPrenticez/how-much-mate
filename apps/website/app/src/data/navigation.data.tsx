import { ReactNode } from 'react';
import { Path } from '../models/paths';

import { HomePage } from '../pages/home.page';
import { ConcreteCalculatorPage } from '../pages';

interface NavItemProps {
  id: string;
  title: string;
  path: Path | string;
  page: ReactNode;
}

export const General_Nav_Items: NavItemProps[] = [
  {id: '0', title: 'Home', path: Path.HOME, page: <HomePage /> },
]

export const Calculator_Nav_Items: NavItemProps[] = [
  {id: '1', title: 'Concrete Calculator', path: Path.CONCRETE_CALCULATOR, page: <ConcreteCalculatorPage />},
]