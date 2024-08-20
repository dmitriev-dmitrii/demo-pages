
// const paramRegExp = new RegExp(/:\w+/,'gmi')

export const parseRouteParams = (route) => {

    const {paramsRawKeys, path, pathRegexp , rawPath } = route

    // функция чтобы распарсить из урла динамические параметры

    const r = rawPath.split('/').filter((item)=>!!item) //  [ 'posts', ':id' ]
    const p = path.split('/').filter((item)=>!!item) // [ 'posts', '2' ]

    const params = r.reduce((acc,item,index)=> {

        const key = item.replace(':','')
        const val = p[index]

        if (key !==  val) {

            acc[key] =  val
        }

        return acc
    },{} )

    return params
}