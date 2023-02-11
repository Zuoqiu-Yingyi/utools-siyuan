import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

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
        },
    },
});
