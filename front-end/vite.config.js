import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('SSL/code.key'),
      cert: fs.readFileSync('SSL/code.crt'),
    }
  }
});
