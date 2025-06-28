import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { AppLayoutComponentLibrary } from './layout/app';

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
      <AppLayoutComponentLibrary />
    </BrowserRouter>
  // </StrictMode>
);
