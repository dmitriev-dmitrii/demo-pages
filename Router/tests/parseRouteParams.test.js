import { expect, test } from 'vitest'
import {parseRouteParams} from "../utils/parseRouteParams.js";
import {buildPathRegExp} from "../utils/buildPathRegExp.js";

const url = 'https://example.com/users/2/role/1'

const routePath = '/users/:id/role/:roleId'

const pathRegExp = buildPathRegExp(routePath)

test('parseRouteParams ', () => {
    // console.log(pathRegExp)
    const {id, role} =  parseRouteParams({routePath,pathRegExp,url})

    expect(id).toBe('2')
    // expect(role).toBe('1')

})

