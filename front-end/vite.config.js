import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// fs não é necessário aqui se não estiver usando HTTPS

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Remova ou comente a configuração https para usar HTTP
    // https: {
    //   key: fs.readFileSync('SSL/code.key'),
    //   cert: fs.readFileSync('SSL/code.crt'),
    // },
    port: 5173, // opcional, você pode definir a porta que quiser
  }
});
