//
//
// let routesNamesMap = new Map()
// let  routesRegexpPathMap = new Map()
//
// let routerViewDom = undefined
// let currentRoute = {}
//
// const routes = [{
//     path: "/404",
//     name:'Not-Found',
//     component: '<h1> 404 Not Found </h1>'
// }]
//
// const buildPathRegex = (path) => {
//     return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
// }
//
// // const getParams = match => {
// //     const values = match.result.slice(1);
// //     const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
// //
// //     return Object.fromEntries(keys.map((key, i) => {
// //         return [key, values[i]];
// //     }));
// // };
//
// const findRoute =  ( {path = '', name = '' } )=> {
//
//     if (path) {
//
//         const r = Array.from(routesRegexpPathMap.keys()).filter((item)=> {
//            return  item.test(path)
//         })
//
//         const route = routesRegexpPathMap.get(r[0])
//
//         if ( route ) {
//              return route
//         }
//     }
//
//     if (name) {
//         // search by name
//         return  routesNamesMap.get(name.trim().toLowerCase())
//     }
//
//         // TODO переделать на страницу ошибки c props кодом ошибки
//        return    routes.find((item)=> {
//         return item.path === '/404'
//     })
// }
//
//
// const renderRouterView = async () => {
//
//     const {component} = currentRoute
//
//     // if (typeof component === 'string' && component.endsWith('html')) {
//     //
//     //     const data =       await fetch(component).then((res) => res.text())
//     //
//     //
//     //     // const scriptEl = document.createRange().createContextualFragment(html);
//     //     // document.getElementById('1').append(scriptEl)
//     //     return
//     // }
//
//     if (typeof component  === "function") {
//
//         const template = document.createElement('div')
//         template.innerHTML =  await component()
//
//         const scriptRaw = template.querySelector('script')
//         // scriptRaw скрипт не работает поэтому перезаписываем
//
//         if (scriptRaw) {
//              const script = document.createElement("script")
//              script.innerText =    scriptRaw.innerText.trim()
//
//             // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
//
//             Array.from(scriptRaw.attributes).forEach((item)=> {
//
//                 return   script.attributes.setNamedItemNS(item.cloneNode(true))
//             })
//
//             scriptRaw.replaceWith( scriptRaw,script )
//         }
//
//         routerViewDom.innerHTML = ''
//
//         routerViewDom.append.apply( routerViewDom , template.children )
//
//         return
//     }
//
//     routerViewDom.innerHTML =  component || ''
//
//     // TODO router children
//     // // Test each route for potential match
//     // const potentialMatches = routes.map(route => {
//     //     return {
//     //         route: route,
//     //         result: location.pathname.match(pathToRegex(route.path))
//     //     };
//     // });
//     //
//     // let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
//     //
//     // if (!match) {
//     //     match = {
//     //         route: routes[0],
//     //         result: [location.pathname]
//     //     };
//     // }
//     //
//     // const view = new match.route.view(getParams(match));
//     //
//     // console.log(currentRoute)
//     // routerView.innerHTML = await view.getHtml();
//
//
//     // console.log(location.pathname)
//
//     // const
//     // console.log('currentRoute',currentRoute.view)
//     // console.log(currentRoute.view)
//     // routerView.innerHTML =  await currentRoute.view.getHtml()
// };
//
// export const push = async  (payload) => {
//
//     const {params} = payload
//
//     currentRoute = findRoute(payload)
//     const {path} =  currentRoute
//
//
//     if (!currentRoute?.path) {
//         console.err( `currentRoute is ${ path }`  )
//         return
//     }
//
//     window.history.pushState(null, null, path );
//
//     await  renderRouterView();
// };
//
//
// const onWindowPopState = async ( e ) => {
//     currentRoute = findRoute({ path : window.location.pathname })
//     await  renderRouterView();
// }
//
// export const init = (routesArr) => {
//
//     routesArr.forEach((item)=> {
//
//         item.name = item.name.toLowerCase().trim()
//
//         const { name,path } = item
//         routes.push(item)
//
//         if (name) {
//             routesNamesMap.set( name , item )
//         }
//
//         if (path) {
//             routesRegexpPathMap.set(buildPathRegex (path) , item)
//         }
//
//     })
//
//     currentRoute = findRoute({ path : window.location.pathname })
//
//     window.onpopstate = onWindowPopState;
//
//     document.addEventListener("DOMContentLoaded", () => {
//         routerViewDom  = document.querySelector("#router-view")
//         renderRouterView();
//     });
// }
//
//
//
//
