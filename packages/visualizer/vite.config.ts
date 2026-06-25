import react from '@vitejs/plugin-react';
import { type PluginOption, defineConfig } from 'vite';

export default defineConfig({
  plugins: [react() as PluginOption],
  server: { port: 3001 },
});
