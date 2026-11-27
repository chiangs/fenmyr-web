import { existsSync } from 'node:fs'
import * as path from 'node:path'
import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.tsx'
import { routes } from '../routes.ts'
import { screenshots } from './screenshots.ts'

const publicDir = path.resolve(import.meta.dirname, '../../public')

function imagePaths(html: string) {
  let paths: string[] = []
  for (let [tag] of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    for (let [, name = '', , value = ''] of tag.matchAll(/\s(src|srcset)=(["'])(.*?)\2/gi)) {
      let values = name.toLowerCase() === 'srcset' ? value.split(',').map((part) => part.trim().split(/\s+/)[0] ?? '') : [value]
      paths.push(...values)
    }
  }
  return paths
}

describe('screenshots', () => {
  it('every picture on the home page points at a file in public/', async () => {
    let response = await router.fetch(new URL(routes.home.href(), 'http://localhost'))
    let paths = imagePaths(await response.text())

    for (let name of Object.keys(screenshots)) {
      let own = paths.filter((file) => file.startsWith(`/images/${name}-`))
      for (let extension of ['.avif', '.webp', '.png']) {
        assert.ok(own.some((file) => file.endsWith(extension)), `no ${extension} image for ${name}`)
      }
      for (let theme of ['dark', 'light']) {
        assert.ok(own.includes(`/images/${name}-${theme}.png`), `no ${theme} PNG fallback for ${name}`)
      }
    }
    for (let file of paths) {
      assert.ok(existsSync(path.join(publicDir, file)), `${file} is not in public/`)
    }
  })
})
