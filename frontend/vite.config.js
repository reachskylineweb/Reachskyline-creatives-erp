import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables from the current directory, loading all variables
  const env = loadEnv(mode, process.cwd(), '');
  const rawBackendUrl = env.VITE_API_URL || 'http://localhost:5050';
  const backendTarget = rawBackendUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '') || 'http://localhost:5050';

  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('xlsx')) {
                return 'vendor-xlsx';
              }
              return 'vendor-utils';
            }
          }
        }
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
