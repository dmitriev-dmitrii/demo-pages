import {defineConfig} from "vite";
import { fileURLToPath, URL } from 'node:url'

const fileRegex = /\.(html)$/

 function templatePlugin(){
    return {
        name: 'template-loader-plugin',

        transform(codeRaw, path) {

            if(fileRegex.test(path)) {
                // берем только html файлы
                // console.log( codeRaw )
                // todo props component Name
                return {
                    // code: `export default function template(props = {}){return \`${id}\`}`,
                    code: `export default function template(props = {}){return \`${codeRaw}\`}`,
                    map: null,
                }
            }
        }
    }
}

const PORT = 5000
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    // const env = loadEnv(mode, process.cwd(), '')

    const config = {
        plugins: [
            templatePlugin(),
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
        rollupOptions: {
            // https://rollupjs.org/configuration-options/
        },
        // define: {
            //         __APP_ENV__: JSON.stringify(env.APP_ENV),
            //     },
    }
    // console.log(mode)
    if (mode === 'production') {
        config.base = '/demo-pages'
    }

    return config
})

