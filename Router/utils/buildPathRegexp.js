export const buildPathRegExp = (path) => {
    const dynamicParamMatch = path.match(new RegExp(/:\w+/gmi)) || []

    const rawDynamicParamsKeys = dynamicParamMatch.reduce((acc,key)=> {
        if (key.length > 1) {
            acc.push(key)
        }
        return acc
    },[])

    return {
        rawPath: path,
        rawDynamicParamsKeys,
        pathRegexp: new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/gmi, "(.+)") + "$")
    }
}