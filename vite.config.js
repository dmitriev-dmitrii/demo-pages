import {defineConfig} from "vite";
import {fileURLToPath, URL} from 'node:url'
import WebComponentPlugin from './webComponentPlugin';

console.log('Loading Vite config...');

const PORT = 5000
export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {
    console.log('Configuring Vite...');
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
            // rollupOptions: {
            //     input: {
            //         main: 'index.html',
            //     },
            //     output: {
            //         entryFileNames: 'assets/[name]-[hash].js',
            //         chunkFileNames: 'assets/[name]-[hash].js',
            //         assetFileNames: (assetInfo) => {
            //             if (assetInfo.name.endsWith('.component.html')) {
            //                 return 'assets/[name].js';
            //             }
            //             return `assets/[name]-[hash][extname]`;
            //         }
            //     }
            // },
        },
    }
    
    if (mode === 'production') {
        config.base = '/demo-pages'
    }

    return config
})

