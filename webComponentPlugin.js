import {readFileSync} from 'fs'

const buildComponentName = (filePath) => {
    const fileName = filePath
        .split('/')
        .pop() // получаем последнюю часть пути
        .replace(/\.(component\.html|component\.js)$/, ''); // убираем оба возможных расширения

    const className = fileName.includes('-')
        ? fileName.split('-').map(part =>
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join('')
        : fileName;

    const tagName = className
        .replace(/([A-Z])/g, '-$1') // Добавляем дефис перед каждой заглавной буквой
        .toLowerCase() // Переводим в нижний регистр
        .replace(/^-/, ''); // Убираем дефис в начале, если он есть


    return {className, tagName}
}

const scopedStyle = (style, componentTag) => {
    return style.replace(/([^{}]+)(?={)/g, selector =>
        selector.split(',').map(s => {
                const val = s.trim()
                if (componentTag === val) {
                    return val
                }
                return `${componentTag} ${val}`
            }
        ).join(',')
    );
};

const webComponentFactory = (codeRaw, filePath) => {

    // Извлекаем содержимое скриптов, стилей и HTML
    const scriptMatch = codeRaw.match(/<script>([\s\S]*?)<\/script>/);
    const styleMatch = codeRaw.match(/<style>([\s\S]*?)<\/style>/);
    const htmlMatch = codeRaw.match(/<template>([\s\S]*?)<\/template>/);

    // Получаем содержимое без оберток
    const script = scriptMatch ? scriptMatch[1].trim() : '';
    const style = styleMatch ? styleMatch[1].trim() : '';
    const html = htmlMatch ? htmlMatch[1].trim() : '';

    // Обрабатываем импорты в скрипте
    const importStatements = script.match(/import\s+.*?from\s+['"].*?['"]/g) || [];
    const scriptWithoutImports = script.replace(/import\s+.*?from\s+['"].*?['"]/g, '').trim();


    const {className, tagName} = buildComponentName(filePath)


    return `
        ${importStatements.join('\n')}
        const template = document.createElement('template');
        template.innerHTML = \`${html}\`;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = \`${scopedStyle(style, tagName)}\`;
        styleElement.setAttribute('data-tag-name', '${tagName}');
        document.body.append(styleElement)

        
       export default class ${className} extends HTMLElement {
            props = {}
            watchedPropsMap = new Map()
            
            
            propsMutationObserver = new MutationObserver((mutations) => {
               //TODO хз на до ли это 
               mutations.forEach((mutation) => {
                  const { type , target , oldValue} = mutation
                  if (type === 'attributes') {
                     const value = target.getAttribute(mutation.attributeName);
                        
                        // console.log('Атрибут изменился' , this.props , mutation , value , oldValue);
                    }
                });
            });
            

            constructor( props ) {
                super();
                this.props = props ?? {}
    
            }
            
            setAttribute(key, value) {

              if (Object.hasOwn(this.props,key)) {
                this.props[key] = value
             }
            
             super.setAttribute(key, JSON.stringify(value));
           }
           
           propsProxyHandle = {
              set:(target, key, value) => {
              
                super.setAttribute(key, value);
                
                 if ( this.watchedPropsMap.has(key) ) {
                    this.watchedPropsMap.get(key).forEach((cb)=>cb(value))
                 }
                
                return Reflect.set(target, key, value);
              }
           }
           
           watchProp( propKey , callback ) {
           
              if (!this.watchedPropsMap.has(propKey)) {
                this.watchedPropsMap.set( propKey, [] )
              }
              
               this.watchedPropsMap.get(propKey).push( callback )
              
           }
            
           connectedCallback() {
               this.append(template.content.cloneNode(true));
               
                const constructorProps = this.props
    
               ${scriptWithoutImports}
               // задаются дефолтные пропсы 
           
               this.props = Object.assign(this.props,constructorProps)
               
               Object.entries(this.props).forEach(([key,val])=> {
                    this.props[key] = val
                    
                    this.setAttribute(key , val)
               })

                
               this.props = new Proxy(this.props, this.propsProxyHandle);


                
               // this.propsMutationObserver.observe(this, {
               //      attributes: true 
               // });
            }
  
        }
        
        if (!customElements.get('${tagName}')) {
            customElements.define('${tagName}', ${className});
        }

    `
}

export default function webComponentPlugin() {
    let isBuildMode = false

    return {
        name: 'web-component-plugin',
        enforce: 'pre',
        configResolved(resolvedConfig) {
            isBuildMode = resolvedConfig.command === 'build'
        },

        transform(codeRaw, filePath) {
            if (!filePath.endsWith('.component.html')) {
                return null
            }

            return {
                code: webComponentFactory(codeRaw, filePath),
                map: null
            };
        },

        async resolveId(source, importer, options) {
            if (source.endsWith('.component.html') && isBuildMode) {
                const resolved = await this.resolve(
                    source.replace(/\.component\.html$/, '.component.js'),
                    importer,
                    {...options, skipSelf: true}
                );

                return resolved || {id: source.replace('.html', '.js')};
            }

        },

        load(filePath) {
            if (!filePath.endsWith('.component.js')) {
                return null
            }

            const htmlFile = filePath.replace(/\.component\.js$/, '.component.html');

            try {
                const codeRaw = readFileSync(htmlFile, 'utf-8');
                return webComponentFactory(codeRaw, filePath);
            } catch (e) {
                throw new Error(`Component file not found: ${htmlFile}`);
            }
        },
    };
}