import {parseUrl} from "./parseUrl.js";


export const parseRouteParams = ({ routePath,pathRegExp, url }) => {
    const {path} =  parseUrl(url)
    const params = {

    }

    const paramRegExp = new RegExp(/:\w+/,'gmi')

    const matchesArr =     Array.from( routePath.matchAll(paramRegExp) )

    // console.log('matchesArr',matchesArr)

    matchesArr.forEach((item)=> {
        const [key] = item
        key.replace(':','')
        params[key.replace(':','')] = ''
    })
    // console.log(params)

    let paramsVal = []


     const xz = {}
    // console.log(path)
    const valArr = path.match(pathRegExp)



    // console.log('valArr', valArr)
    // matchesArr.forEach((item, index)=> {
    //   const   [key] = item
    //     const [_,value] =  valArr[index]
    //
    //     xz[key.replace(':','')] =  value
    // })
    //
    // console.log(xz)
    //     const [_,paramValue] =
    //     console.log(paramValue)
    // }

    return params
}