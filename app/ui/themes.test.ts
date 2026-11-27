import { readFileSync, readdirSync, statSync } from 'node:fs'
import * as path from 'node:path'
import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { themes } from './themes.ts'

const root = path.resolve(import.meta.dirname, '../..')
const themesCss = readFileSync(path.join(root, 'public/themes.css'), 'utf8')
const stylesCss = readFileSync(path.join(root, 'public/styles.css'), 'utf8')

function blocks(css: string) {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector = '', body = '']) => ({
    selectors: selector.split(',').map((part) => part.trim()),
    names: new Set([...body.matchAll(/(--[\w-]+)\s*:/g)].map(([, name = '']) => name)),
  }))
}

function defined(css: string) {
  return new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(([, name = '']) => name))
}

function sources(dir: string) {
  return readdirSync(path.join(root, dir), { recursive: true, encoding: 'utf8' })
    .map((name) => path.join(root, dir, name))
    .filter((file) => statSync(file).isFile() && /\.tsx?$/.test(file) && !file.endsWith('.test.ts'))
}

describe('themes', () => {
  let all = blocks(themesCss)
  let base = all.find((block) => block.selectors.includes(':root'))

  it('the system default defines the same tokens as every theme', () => {
    assert.ok(base, 'public/themes.css has no :root block')
    let dark = all.find((block) => block.selectors.includes(':root:not([data-theme])'))
    assert.ok(dark, 'public/themes.css has no dark :root block')
    assert.deepEqual([...dark.names].sort(), [...base.names].sort())
  })

  for (let theme of themes) {
    it(`${theme.id} has a block defining every token`, () => {
      let own = all.find((block) => block.selectors.includes(`[data-theme="${theme.id}"]`) && block.names.has('--ink'))
      assert.ok(own, `public/themes.css has no [data-theme="${theme.id}"] block`)
      let missing = [...(base?.names ?? [])].filter((name) => !own.names.has(name))
      assert.deepEqual(missing, [], `${theme.id} lacks ${missing.join(', ')}`)
      assert.match(themesCss, new RegExp(`\\[data-theme="${theme.id}"\\] \\{\\s*color-scheme: ${theme.mode};`))
    })
  }

  it('every token the site reads is defined', () => {
    let known = new Set([...defined(themesCss), ...defined(stylesCss)])
    let used = [stylesCss, ...sources('app').map((file) => readFileSync(file, 'utf8'))].flatMap((text) =>
      [...text.matchAll(/var\((--[\w-]+)(\s*,)?/g)].flatMap(([, name = '', fallback]) =>
        name.endsWith('-') || fallback ? [] : [name],
      ),
    )
    let missing = [...new Set(used)].filter((name) => !known.has(name))
    assert.deepEqual(missing, [], `no value for ${missing.join(', ')}`)
  })
})
