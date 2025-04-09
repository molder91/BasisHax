import { defineConfig } from 'electron-vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['keytar']
      }
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve('src'),
        '@renderer': resolve('src/renderer'),
        '@components': resolve('src/renderer/components'),
        '@hooks': resolve('src/renderer/hooks'),
        '@lib': resolve('src/renderer/lib'),
        '@pages': resolve('src/renderer/pages'),
        '@utils': resolve('src/renderer/utils')
      }
    }
  }
}); 