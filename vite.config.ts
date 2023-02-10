import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    base: `./`,
    plugins: [vue()],
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                preload: './src/preload.ts',
            },
            output: {
                // entryFileNames: '[name].js',
                entryFileNames: chunkInfo => {
                    switch (chunkInfo.name) {
                        case 'preload':
                            return '[name].js';

                        default:
                            return 'assets/[name]-[hash].js';
                    }
                },
            }
        },
    },
})
