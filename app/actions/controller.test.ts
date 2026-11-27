import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.ts'
import { routes } from '../routes.ts'
import { sections } from './home/sections.tsx'

describe('root controller', () => {
  it('GET / shows every home section and the tagline once', async () => {
    let response = await router.fetch(new URL(routes.home.href(), 'http://localhost'))

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/html/)

    let html = await response.text()

    for (let section of sections) {
      assert.ok(html.includes(section.title), `missing title "${section.title}"`)
      assert.ok(html.includes(`id="${section.id}"`), `missing element with id "${section.id}"`)
    }

    assert.equal(html.split('Where ideas thrive.').length - 1, 1)
  })
})
