import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Default output directory for Vite
  },
  server: {
    host: 'localhost',  // Host for local development
    port: 4890,         // Port for local development
  },
  // Optional: Define base path if your app is not hosted at the root
  base: '/',  // Adjust this if hosting under a subdirectory
});