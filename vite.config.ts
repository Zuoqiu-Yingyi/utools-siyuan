import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    base: `./`,
    plugins: [vue()],
    build: {
        // REF https://cn.vitejs.dev/config/build-options.html#build-minify
        minify: false,
        rollupOptions: {
            input: {
                preload: './src/preload.ts',
            },
            output: {
                // format: 'iife',
                format: 'cjs',

                // entryFileNames: '[name].js',
                entryFileNames: chunkInfo => {
                    switch (chunkInfo.name) {
                        case 'preload':
                            return '[name].js';

                        default:
                            return 'assets/[name]-[hash].js';
                    }
                },
            },
        },
    },
});
