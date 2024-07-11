export const buildPathRegExp = (path) => {
    const dynamicParamMatch = path.match(new RegExp(/:\w+/gmi)) || []

    const dynamicParams = dynamicParamMatch.reduce((acc,key)=> {
        if (key.length > 1) {
            acc[key] = ''
        }
        return acc
    },{})

    return {
        dynamicParams,
        pathRegexp: new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/gmi, "(.+)") + "$")
    }
}