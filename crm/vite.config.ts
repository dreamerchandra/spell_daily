import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: 4000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React and related libraries
          react: ['react', 'react-dom'],
          // React Router
          'react-router': ['react-router-dom'],
          // React Query
          'react-query': [
            '@tanstack/react-query',
            '@tanstack/react-query-devtools',
          ],
          // Material-UI Core Components
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          // Material-UI Icons
          'mui-icons': ['@mui/icons-material'],
          // Material-UI Date Pickers (if used)
          'mui-date-pickers': ['@mui/x-date-pickers'],
          // Other vendor libraries can be added here
        },
      },
    },
  },
});
