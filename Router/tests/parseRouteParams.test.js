import { expect, test } from 'vitest'
import {parseRouteParams} from "../utils/parseRouteParams.js";
import {buildPathRegExp} from "../utils/buildPathRegExp.js";


const mockRoute = {
    "path" :"/posts/2",
    "rawPath": "/posts/:id",
    "pathRegexp": /^\/posts\/(.+)$/,
    paramsRawKeys:{
        ":id": ""
    },
}


test('parseRouteParams ', () => {
    // console.log(pathRegExp)
    const {id, role} =  parseRouteParams(mockRoute)

    expect(id).toBe('2')
    // expect(role).toBe('1')

})

