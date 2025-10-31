import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { HintContextProvider } from './context/hint-context/index.tsx';
import { PostHog } from './context/posthog/index';
import { ThemeProvider } from './context/theme-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <PostHog>
        <HintContextProvider>
          <App />
        </HintContextProvider>
      </PostHog>
    </ThemeProvider>
  </StrictMode>
);
