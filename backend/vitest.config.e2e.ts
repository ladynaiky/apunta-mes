import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts'],
    // Todos los archivos comparten la base de datos de pruebas: de uno en uno.
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 60000,
  },
});
