import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate PostHog into its own chunk
          if (id.includes('posthog-js')) {
            return 'posthog';
          }
          // Bundle all DnD Kit packages into single chunk
          if (id.includes('@dnd-kit')) {
            return 'dndkit';
          }
          // Automatically split other vendor chunks for node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
