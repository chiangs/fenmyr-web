import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.tsx'
import { routes } from '../routes.ts'
import { en } from '../content/en.tsx'
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

  it('GET / shows both Myras as still pictures, not animated ones', async () => {
    let response = await router.fetch(new URL(routes.home.href(), 'http://localhost'))
    let html = await response.text()

    for (let label of [en.hero.myraAlt, en.sections.support.myraAlt]) {
      assert.ok(html.includes(`alt="${label}"`), `missing Myra labelled "${label}"`)
    }
    assert.doesNotMatch(html, /myra-(hello|love)\.png/)
  })

  it('GET / has a popover menu with every header link and a labelled button', async () => {
    let response = await router.fetch(new URL(routes.home.href(), 'http://localhost'))
    let html = await response.text()

    assert.match(html, new RegExp(`<button[^>]*popovertarget="site-menu"[^>]*aria-label="${en.header.menu}"`))
    let menu = html.match(/<div id="site-menu" popover[^>]*>(.*?)<\/div>/s)?.[1] ?? ''
    let links = [
      ...sections.flatMap((section) => (section.nav ? [{ label: section.nav, href: `/#${section.id}` }] : [])),
      { label: en.header.github, href: 'https://github.com/chiangs/fenmyr' },
    ]
    for (let link of links) {
      assert.ok(menu.includes(`<a href="${link.href}">${link.label}</a>`), `menu is missing "${link.label}"`)
    }
  })

  it('GET an unknown path shows the not found page', async () => {
    let response = await router.fetch(new URL('/does-not-exist', 'http://localhost'))

    assert.equal(response.status, 404)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/html/)
    assert.match(await response.text(), /Page not found/)
  })

  it('GET /licences.txt serves the notices, including Mochiboard\'s MIT licence', async () => {
    let response = await router.fetch(new URL(routes.licences.href(), 'http://localhost'))

    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/plain/)
    let text = await response.text()
    assert.match(text, /EUPL/)
    assert.match(text, /MIT License/)
    assert.match(text, /Jessa Wolfe/)
  })
})
