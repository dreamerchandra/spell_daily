import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { HintContextProvider } from './context/hint-context/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HintContextProvider>
      <App />
    </HintContextProvider>
  </StrictMode>
);
