import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { AppLayoutWebsite } from './layout/app';

// Local
import './styles/styles.css';
// Shared
import '@shared/assets/styles/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <StrictMode>
    <BrowserRouter>
      <AppLayoutWebsite />
    </BrowserRouter>
  // </StrictMode>
);
