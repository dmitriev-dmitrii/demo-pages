import {buildPathRegExp} from "./utils/buildPathRegexp.js";
import {parseRouteParams} from "./utils/parseRouteParams.js";

let routesNamesMap = new Map()
let routesRegexpPathMap = new Map()

let routerViewDom = undefined
let currentRoute = {}

const routes = [{
    path: "/404",
    name:'Not-Found',
    component: '<h1> 404 Not Found </h1>'
}]


const findRoute =  ( routePayload )=> {

    // TODO добавить мемоизацию

  const   { path = '', name = '', params = {} } = routePayload

    if (name && !path) {
        // search by name
        // todo params obj

        return routesNamesMap.get(name.trim().toLowerCase())
    }

    // search by path
     const matchesArr = Array.from(routesRegexpPathMap.keys()).filter((item)=> {
            return  item.test(path)
     })

     const route = routesRegexpPathMap.get(matchesArr?.[0])

     if ( route ) {

         route.path = path
         route.params = parseRouteParams(route)

         return route
     }

     // TODO переделать на страницу ошибки c props кодом ошибки

     return    routes.find((item)=> item.path === '/404')

}

const renderRouterView = async () => {
    // TODO скрипты с компнентов  могут не рабоать если не форматировать код  и не ставить ;
    const {component} = currentRoute

    // component - это функция которую сгенерировал vite template plugin из html либо сгенерированный веб компонент

    if (typeof component  === "function") {

        const template = document.createElement('div')

        const c = await component()
        template.append(c)

        const scriptRaw = template.querySelector('script')
        // сам скрипт записывается корректно в dom, но не работает поэтому перезаписываем таким костылем

        if (scriptRaw) {
             const script = document.createElement("script")

            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap

            Array.from(scriptRaw.attributes).forEach((item)=> {
            // применяем атрибуты
                return   script.attributes.setNamedItemNS(item.cloneNode(true))
            })

            scriptRaw.remove()
            template.appendChild(script)
            script.innerHTML = scriptRaw.innerHTML
        }

        routerViewDom.innerHTML = ''
        // очистка от старого контента

        routerViewDom.append.apply( routerViewDom , template.children )

        return
    }


    routerViewDom.innerHTML =  component || ''

    // TODO router children

};

export const push = async  (payload) => {

    currentRoute = findRoute(payload)

    window.history.pushState(null, null, currentRoute.path  || currentRoute.rawPath);

    await  renderRouterView();
};

const onWindowPopState = async ( e ) => {
    currentRoute = findRoute({ path : window.location.pathname })

    await  renderRouterView();
}

export const init = (routesArr) => {

    routesArr.forEach((item)=> {

        item.name = item.name.toLowerCase().trim()

        const { name, path } = item

        const {pathRegexp,rawDynamicParamsKeys ,rawPath} = buildPathRegExp(path)

        item.pathRegexp = pathRegexp

        item.rawPath = rawPath

        item.path = ''

        routesNamesMap.set( name , item )
        routesRegexpPathMap.set( pathRegexp, item)

        routes.push(item)

    })

    currentRoute = findRoute({ path : window.location.pathname })

    window.onpopstate = onWindowPopState;

    document.addEventListener("DOMContentLoaded", () => {
        routerViewDom  = document.querySelector("#router-view")
        renderRouterView();
    });
}





