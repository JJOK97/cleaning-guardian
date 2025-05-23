import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
            manifest: {
                name: '청소의 신',
                short_name: 'guardian',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#4CAF50',
                icons: [
                    {
                        src: 'logo192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'logo512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            strategies: 'generateSW',
            injectRegister: 'auto',
        }),
    ],
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
