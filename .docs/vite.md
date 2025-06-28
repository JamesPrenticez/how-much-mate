Always use vite except for the backend

# Shared Assets
We need to allow the server of an app to use shared assets

While there are ways to automate the generation of the vite-config and or have a base vite config file - we just do it manually

```ts
/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/component-library/app',
  server: {
    port: 4201,
    host: 'localhost',
    fs: {
      allow: [
        path.resolve(__dirname, '../../../libs/shared'),
      ],
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), svgr()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../../dist/apps/component-library/app',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});

```