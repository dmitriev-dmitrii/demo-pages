import {defineConfig} from "vite";
import {fileURLToPath, URL} from 'node:url'
import WebComponentPlugin from './webComponentPlugin';
import * as path from "path";

const PORT = 5000
export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {

    const isProdMode = mode === 'production'

    const config = {

        plugins: [
            WebComponentPlugin()
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            port: PORT,
        },
        preview: {
            port: PORT,
        },
        build: {
            minify: isProdMode ,
            cssMinify: isProdMode,
            sourcemap: true,
            rollupOptions: {
                output: {
                    chunkFileNames: ({name}) => {
                        if (name.includes('.component')) {
                            return `components/[name]-[hash].js`;
                        }
                        return `assets/[name]-[hash].js`;
                    },
                    manualChunks(id) {
                        if (id.includes('.component')) {
                            const fileName = path.basename(id).split('.')[0];
                            return `components/${fileName}`; // "component-button.js"
                        }
                    }
                }
            },
        },
    }

    if (isProdMode) {
        config.base = '/demo-pages'
    }

    return config
})

