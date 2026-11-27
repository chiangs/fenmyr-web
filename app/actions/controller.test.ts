import { runInNewContext } from 'node:vm'
import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.tsx'
import { routes } from '../routes.ts'
import { en } from '../content/en.tsx'
import { themeStorageKey, themes } from '../ui/themes.ts'
import { sections } from './home/sections.tsx'

function runThemeScript(script: string, stored: string | null) {
  let dataset: Record<string, string> = {}
  runInNewContext(script, {
    document: { documentElement: { dataset } },
    localStorage: { getItem: (key: string) => (key === themeStorageKey ? stored : null) },
  })
  return dataset
}

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

    let button = html.match(/<button[^>]*popovertarget="site-menu"[^>]*>/)?.[0] ?? ''
    assert.ok(button.includes(`aria-label="${en.header.menu}"`), 'the menu button has no label')
    let menuStart = html.search(/<div[^>]*id="site-menu"/)
    assert.ok(menuStart >= 0, 'no site-menu element')
    let menuTag = html.slice(menuStart, html.indexOf('>', menuStart) + 1)
    assert.match(menuTag, /\spopover[\s=>]/)
    let menu = html.slice(menuStart, html.indexOf('</nav>', menuStart))
    let links = [
      ...sections.flatMap((section) => (section.nav ? [{ label: section.nav, href: `/#${section.id}` }] : [])),
      { label: en.header.github, href: 'https://github.com/chiangs/fenmyr' },
    ]
    for (let link of links) {
      assert.ok(menu.includes(`<a href="${link.href}">${link.label}</a>`), `menu is missing "${link.label}"`)
    }
  })

  it('GET / sets the saved theme in a script before the first stylesheet', async () => {
    let response = await router.fetch(new URL(routes.home.href(), 'http://localhost'))
    let html = await response.text()

    let head = html.slice(0, html.indexOf('</head>'))
    let scriptAt = head.search(/<script>/)
    let stylesheetAt = head.search(/<link[^>]*rel="stylesheet"/)
    assert.ok(scriptAt >= 0, 'no inline script in <head>')
    assert.ok(stylesheetAt > scriptAt, 'the theme script comes after a stylesheet')
    let script = head.slice(scriptAt + '<script>'.length, head.indexOf('</script>', scriptAt))

    for (let theme of themes) {
      assert.deepEqual(runThemeScript(script, theme.id), { js: '', theme: theme.id, mode: theme.mode })
    }
    for (let stored of [null, '', 'sepia', '__proto__', 'constructor']) {
      assert.deepEqual(runThemeScript(script, stored), { js: '' }, `stored "${stored}" changed the theme`)
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
