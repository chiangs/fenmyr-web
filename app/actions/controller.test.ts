import { runInNewContext } from 'node:vm'
import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.tsx'
import { routes } from '../routes.ts'
import { en } from '../content/en.tsx'
import { screenshots, srcset } from '../ui/screenshots.ts'
import { themeStorageKey, themes } from '../ui/themes.ts'
import type { Mode } from '../ui/themes.ts'
import { sections } from './home/sections.tsx'

function runThemeScript(script: string, stored: string | null, systemDark = false) {
  let dataset: Record<string, string> = {}
  let added: Record<string, string>[] = []
  runInNewContext(script, {
    document: {
      documentElement: { dataset },
      createElement: () => ({}),
      head: { append: (element: Record<string, string>) => added.push(element) },
    },
    localStorage: { getItem: (key: string) => (key === themeStorageKey ? stored : null) },
    matchMedia: (query: string) => ({ matches: systemDark && query === '(prefers-color-scheme: dark)' }),
  })
  return { dataset, added }
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

  it('GET / shows every tile of the prototype, Myra and work sections', async () => {
    let html = await (await router.fetch(new URL(routes.home.href(), 'http://localhost'))).text()

    for (let id of ['prototype', 'myra', 'work'] as const) {
      let start = html.indexOf(`id="${id}"`)
      let section = html.slice(start, html.indexOf('</section>', start))
      let tiles = Object.values(en.sections[id].tiles)
      assert.equal(section.split('data-tile=').length - 1, tiles.length, `${id} renders a different number of tiles`)
      for (let tile of tiles) assert.ok(section.includes(`>${tile.title}</h3>`), `${id} is missing the tile "${tile.title}"`)
    }
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

  it('GET / has a theme picker with "Match my system" and the six themes, labelled', async () => {
    let response = await router.fetch(new URL(routes.home.href(), 'http://localhost'))
    let html = await response.text()
    let { theme } = en.header

    let button = html.match(/<button[^>]*popovertarget="theme-picker"[^>]*>/)?.[0] ?? ''
    assert.ok(button.includes(`aria-label="${theme.label}"`), 'the theme button has no label')
    let start = html.search(/<div[^>]*id="theme-picker"/)
    assert.ok(start >= 0, 'no theme-picker element')
    assert.match(html.slice(start, html.indexOf('>', start) + 1), /\spopover[\s=>]/)
    let picker = html.slice(start, html.indexOf('</div>', start))

    let values = [...picker.matchAll(/<input[^>]*type="radio"[^>]*>/g)].map(([input]) => {
      assert.match(input, /name="theme"/)
      return input.match(/value="([^"]*)"/)?.[1]
    })
    assert.deepEqual(values, ['', ...themes.map((item) => item.id)])
    for (let legend of [theme.label, theme.modes.light, theme.modes.dark]) {
      assert.ok(picker.includes(`<legend>${legend}</legend>`), `no legend "${legend}"`)
    }
    for (let name of [theme.system, ...themes.map((item) => theme.names[item.id])]) {
      assert.ok(picker.includes(`<span>${name}</span>`), `no choice named "${name}"`)
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
      assert.deepEqual(runThemeScript(script, theme.id).dataset, { js: '', theme: theme.id, mode: theme.mode })
    }
    for (let stored of [null, '', 'sepia', '__proto__', 'constructor']) {
      assert.deepEqual(runThemeScript(script, stored).dataset, { js: '' }, `stored "${stored}" changed the theme`)
    }
  })

  it('GET / preloads the hero screenshot in the mode the theme script chose', async () => {
    let response = await router.fetch(new URL(routes.home.href(), 'http://localhost'))
    let html = await response.text()
    let script = html.slice(html.indexOf('<script>') + '<script>'.length, html.indexOf('</script>'))
    let preload = (mode: Mode) => ({
      rel: 'preload',
      as: 'image',
      type: 'image/avif',
      fetchPriority: 'high',
      imageSrcset: srcset('board', mode, 'avif'),
      imageSizes: screenshots.board.sizes,
    })

    for (let theme of themes) {
      for (let systemDark of [false, true]) {
        assert.deepEqual(runThemeScript(script, theme.id, systemDark).added, [preload(theme.mode)])
      }
    }
    assert.deepEqual(runThemeScript(script, null, false).added, [preload('light')])
    assert.deepEqual(runThemeScript(script, null, true).added, [preload('dark')])
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
