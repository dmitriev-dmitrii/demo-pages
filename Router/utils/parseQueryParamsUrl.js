

export const parseQueryParamsUrl = (urlSrc = '') => {

    if (!urlSrc) {

        return  {
            query: {},
            hash: '',
            path:''
        }
    }

    const {
        hash,
        searchParams,
        pathname
    } = new URL (urlSrc,'https://mock')

    // https://mock - костыль чтобы не ломало конструктор

    const query = Array.from(searchParams).reduce((acc,item)=> {

    if ( item ) {

        const [key,value] = item

        acc[key] = value
    }

    return acc
    },{})

    return {
        query,
        hash,
        path: pathname,
    }
}