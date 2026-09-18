import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  /* ------------------------------------------------------------
     Pre-bundle every runtime dependency up-front.

     Without this list Vite *discovers* dependencies lazily, while the
     browser is already loading the page. Each discovery invalidates the
     optimised-dep cache and forces a re-bundle mid-flight, so modules
     that were already served come back as "504 Outdated Optimize Dep".
     The module graph then fails to link, /src/main.jsx never executes,
     and the splash screen parks itself at 90% forever.

     Naming them here makes Vite bundle all of them once, at server
     start, before the first request is ever served.
     ------------------------------------------------------------ */
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      'lucide-react',
      'recharts',
      'canvas-confetti',
    ],
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true,
    allowedHosts: true,
    // Transform the entry graph during startup instead of on first paint,
    // so the very first page load is not paying the cold-compile cost.
    warmup: {
      clientFiles: [
        './src/main.jsx',
        './src/App.jsx',
        './src/context/AppContext.jsx',
      ],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
