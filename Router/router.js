import {buildPathRegExp} from "./utils/buildPathRegexp.js";


let routesNamesMap = new Map()
let routesRegexpPathMap = new Map()

let routerViewDom = undefined
let currentRoute = {}

const routes = [{
    path: "/404",
    name:'Not-Found',
    component: '<h1> 404 Not Found </h1>'
}]

const findRoute =  ( {path = '', name = '' } )=> {

    if (name && !path) {
        // search by name
        return  routesNamesMap.get(name.trim().toLowerCase())
    }

     const r = Array.from(routesRegexpPathMap.keys()).filter((item)=> {
            return  item.test(path)
     })

     const route = routesRegexpPathMap.get(r[0])

     if ( route ) {
         return route
     }

     // TODO переделать на страницу ошибки c props кодом ошибки
     return    routes.find((item)=> item.path === '/404')

}


const renderRouterView = async () => {

    const {component} = currentRoute

    if (typeof component  === "function") {

        const template = document.createElement('div')
        template.innerHTML =  await component()

        const scriptRaw = template.querySelector('script')
        // scriptRaw скрипт не работает поэтому перезаписываем

        if (scriptRaw) {
             const script = document.createElement("script")
             script.innerText =    scriptRaw.innerText.trim()

            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap

            Array.from(scriptRaw.attributes).forEach((item)=> {

                return   script.attributes.setNamedItemNS(item.cloneNode(true))
            })

            scriptRaw.replaceWith( scriptRaw,script )
        }

        routerViewDom.innerHTML = ''

        routerViewDom.append.apply( routerViewDom , template.children )

        return
    }

    routerViewDom.innerHTML =  component || ''

    // TODO router children

};

export const push = async  (payload) => {

    const {params, path } = payload

    currentRoute = findRoute(payload)

    // console.log(path)
    // console.log('currentRoute',currentRoute)

    window.history.pushState(null, null, path || currentRoute.path );

    await  renderRouterView();
};

const onWindowPopState = async ( e ) => {
    currentRoute = findRoute({ path : window.location.pathname })
    await  renderRouterView();
}

export const init = (routesArr) => {

    routesArr.forEach((item)=> {

        item.name = item.name.toLowerCase().trim()

        const { name,path } = item

        const  pathRegexp = buildPathRegExp(path)
        item.pathRegexp = pathRegexp

        routesNamesMap.set( name , item )
        routesRegexpPathMap.set( pathRegexp, item)

        routes.push(item)

    })

    currentRoute = findRoute({ path : window.location.pathname })

    // const {pathRegexp} = currentRoute
    //


    window.onpopstate = onWindowPopState;

    document.addEventListener("DOMContentLoaded", () => {
        routerViewDom  = document.querySelector("#router-view")
        renderRouterView();
    });
}




