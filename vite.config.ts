import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/snake/', // Remplacez "snake" par le nom de votre repository GitHub
  plugins: [react()],
});