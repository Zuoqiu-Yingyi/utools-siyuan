import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import copy from "rollup-plugin-copy"

// https://vitejs.dev/config/
export default defineConfig({
    base: `./`,
    plugins: [vue()],
    build: {
        emptyOutDir: false,
        copyPublicDir: false,
        rollupOptions: {
            input: {
                main: './index.html',
            },
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
            },
            plugins: [
                copy({
                    targets: [
                        {
                            src: [
                                "./README.md",
                                "./CHANGELOG.md",
                                "LICENSE",
                            ],
                            dest: [
                                "./dist/",
                            ],
                        },
                    ],
                    verbose: true,
                }),
            ],
        },
    },
});
