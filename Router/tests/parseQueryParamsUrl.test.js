import { expect, test } from 'vitest'
import {parseQueryParamsUrl} from "../utils/parseQueryParamsUrl.js";

const url = 'https://example.com/path/index.html?param=value&param2=value2#somehash'

// TODO сделать парсинг обьектов ? или json
test('parseQueryParamsUrl test query', () => {
    const {query} =    parseQueryParamsUrl(url)

    expect(query).toMatchObject({
        param:'value',
        param2:'value2',
    })
})

test('parseQueryParamsUrl test empty query', () => {
    const {query} =    parseQueryParamsUrl('')

    expect(query).toMatchObject({})
})

test('parseQueryParamsUrl test hash', () => {
    const {hash} =    parseQueryParamsUrl(url)

    expect(hash).toBe('#somehash')
})
