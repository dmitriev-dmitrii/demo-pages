import {defineConfig} from "vite";
import {fileURLToPath, URL} from 'node:url'
import path from "path";


const componentFileRegex = /\.component(?=\.html$)/i

function WebComponentPlugin() {
    const parseWebComponent = (codeRaw , scopeId) => {
        const scriptMatch = codeRaw.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        const script = scriptMatch ? scriptMatch[1].trim() : '';

        const styleMatch = codeRaw.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const styleRaw = styleMatch ? styleMatch[1].trim() : '';

        const scopeDataAttr = `data-scoped-id=${scopeId}`
        const style = styleRaw.replace(
            /([^{]+)\{([^}]+)\}/g,
            (match, selector, styles) => {

                const selectors = selector.split(',').map(s => s.trim());

                // Добавляем атрибут к каждому селектору
                const scopedSelectors = selectors.map(
                    s => `[${scopeDataAttr}] ${s}`
                ).join(', ');

                return `${scopedSelectors} { ${styles} }`;
            }
        );

        const html = codeRaw
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .trim();

        return {
            script,
            style,
            html
        };

    }

    function parseFileName(filePath) {

        // Извлекаем имя файла без расширения (например, "app-table.web-component")
        const filename = path.basename(filePath, path.extname(filePath));

        // Разделяем имя файла по точкам (первая часть — tagName)
        const [tagName, ...rest] = filename.split('.');

        // Преобразуем tagName в className (camelCase)
        const className = tagName
            .split('-')
            .map((part, index) =>
                index === 0
                    ? part.toLowerCase()
                    : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join('');

        return {
            tagName,
            className
        };
    }

    return {
        name: 'WebComponentPlugin',
        transform(codeRaw, path) {

            if (componentFileRegex.test(path)) {

                const {
                    tagName,
                    className
                } = parseFileName(path)

                const  scopeId = `${tagName}-${Math.random().toString(36).substr(2, 8)}`

                const {
                    script,
                    style,
                    html
                } = parseWebComponent(codeRaw,scopeId);

                return {
                    code: `
                        const html = \`${html}\`;
                        const style = \`${style}\`;
                        const script = \`${script}\`;
                        
                        const templateElement = document.createElement('template');
                        templateElement.innerHTML = html;
                        
                        const styleElement = document.createElement('style');
                        styleElement.textContent = style;
                        document.body.append(styleElement)
         
                        class ${className} extends HTMLElement {
                                constructor() {
                                    super();
                 
                                    this.append(templateElement.content.cloneNode(true))
                                }
                                    connectedCallback() {
                                          this.setAttribute('data-scoped-id','${scopeId}')
                                          const scriptFunction = new Function(script);
                                          scriptFunction.call(this);
                                    }
                        }
                        
                        if (!customElements.get('${tagName}')) {
                                customElements.define('${tagName}', ${className});
                        }
                         
                        export default function(props) {
                            return new ${className}(props)
                        }
                    `,
                    map: null
                };
            }
        }
    };
}

const PORT = 5000
export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {
    // const env = loadEnv(mode, process.cwd(), '')

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

