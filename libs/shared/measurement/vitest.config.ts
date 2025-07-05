/// <reference types="vitest" />
/// <reference types="vite/client" />

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
    test: {
        globals: true,
        environment: 'jsdom',
        cache: {
            dir: '../../node_modules/.vite/libs/animo-ui',
        },
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../coverage/libs/animo-ui',
            provider: 'v8',
            exclude: ['**/*.stories.tsx'],
        },
    },
    plugins: [nxViteTsPaths()],
}));
