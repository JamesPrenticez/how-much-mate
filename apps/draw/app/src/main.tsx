import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { AppLayout } from './layout/app';
import { DbProvider } from '@draw/contexts';

// Local
import './styles/styles.css';
// Shared
import '@shared/assets/styles/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <DbProvider>
      <AppLayout />
    </DbProvider>
  </BrowserRouter>
);
