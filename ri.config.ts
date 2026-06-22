import { defineConfig } from '@route-intelligence/core';
import { NextPlugin } from '@route-intelligence/next';

export default defineConfig({
  root: '.',
  plugins: [
    NextPlugin({
      appDir: 'app',
      pagesDir: 'pages',
      customNavigationWrappers: [],
    }),
  ],
  include: ['app/**', 'pages/**', 'middleware.ts'],
  exclude: ['**/*.test.ts', '**/*.spec.ts', 'node_modules/**'],
  cache: {
    enabled: true,
    directory: '.route-intelligence',
  },
  output: {
    formats: ['json', 'mermaid'],
    directory: 'ri-output',
  },
  rules: {
    'dead-route': 'warn',
    'broken-link': 'error',
    'redirect-cycle': 'error',
  },
});
