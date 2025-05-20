import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, './src'),
            },
        ],
    },
    build: {
        outDir: 'build',
    },

    server: {
        proxy: {
            '/api': {
                target: 'http://54.180.101.153:8088',
                changeOrigin: true,
            },
        },
    },
});
