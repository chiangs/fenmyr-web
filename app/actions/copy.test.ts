import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.tsx'
import { routes } from '../routes.ts'

const pages = [
  { name: 'home', path: routes.home.href(), status: 200 },
  { name: 'not found', path: '/does-not-exist', status: 404 },
]

const americanSpellings = [
  'color',
  'colors',
  'colored',
  'favorite',
  'organize',
  'organized',
  'organizing',
  'gray',
  'center',
  'behavior',
  'analyze',
  'customize',
  'customized',
  'license',
]

const entities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  copy: '©',
}

function decode(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (entity, name: string) => {
    if (name.startsWith('#x') || name.startsWith('#X')) return String.fromCodePoint(Number.parseInt(name.slice(2), 16))
    if (name.startsWith('#')) return String.fromCodePoint(Number.parseInt(name.slice(1), 10))
    let value = entities[name]
    assert.ok(value !== undefined, `unknown entity ${entity}`)
    return value
  })
}

function visibleText(html: string) {
  return decode(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|code|pre)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]*>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()
}

function attributeText(html: string) {
  let values: string[] = []
  for (let [tag] of html.matchAll(/<[a-z][^>]*>/gi)) {
    // og:title and og:description repeat the title and description, so only the preview's alt text is new copy
    let isDescription = /^<meta\b/i.test(tag) && /\s(?:name=(["'])description\1|property=(["'])og:image:alt\2)/i.test(tag)
    for (let [, name = '', , value = ''] of tag.matchAll(/\s(alt|aria-label|title|content)=(["'])(.*?)\2/gi)) {
      if (name.toLowerCase() === 'content' && !isDescription) continue
      values.push(decode(value))
    }
  }
  return values
}

function around(text: string, index: number) {
  return text.slice(Math.max(0, index - 40), index + 40)
}

function resourceUrls(html: string) {
  let urls: string[] = []
  for (let [tag] of html.matchAll(/<[a-z][^>]*>/gi)) {
    // a canonical link names this page's address; it is not a request
    let isLink = /^<link\b/i.test(tag) && !/\srel=(["'])canonical\1/i.test(tag)
    for (let [, name, , value = ''] of tag.matchAll(/\s(src|srcset|href)=(["'])(.*?)\2/gi)) {
      let attribute = name.toLowerCase()
      if (attribute === 'href' && !isLink) continue
      let values = attribute === 'srcset' ? value.split(',').map((part) => part.trim().split(/\s+/)[0] ?? '') : [value]
      urls.push(...values.map(decode))
    }
  }
  return urls
}

async function render(path: string, status: number) {
  let response = await router.fetch(new URL(path, 'http://localhost'))
  assert.equal(response.status, status)
  return response.text()
}

describe('copy', () => {
  for (let page of pages) {
    it(`the ${page.name} page follows the DESIGN.md Words rules`, async () => {
      let html = await render(page.path, page.status)
      let text = [visibleText(html), ...attributeText(html)].join(' ')

      let dash = text.search(/[—–]/)
      assert.equal(dash, -1, `long dash in "${around(text, dash)}"`)

      assert.ok(text.split('✦').length - 1 <= 1, 'more than one ✦')
      assert.ok(text.split('Where ideas thrive.').length - 1 <= 1, 'tagline more than once')

      let bracket = text.indexOf('(')
      assert.equal(bracket, -1, `bracket in "${around(text, bracket)}"`)

      let american = new RegExp(`\\b(${americanSpellings.join('|')})\\b`, 'i').exec(text)
      assert.equal(american, null, `American spelling "${american?.[0]}" in "${around(text, american?.index ?? 0)}"`)
    })

    it(`the ${page.name} page loads nothing from another origin`, async () => {
      let html = await render(page.path, page.status)
      let urls = resourceUrls(html)
      assert.ok(urls.length > 0, 'found no src, srcset or link href')
      for (let url of urls) {
        assert.ok(!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(url), `third-party resource ${url}`)
      }
    })
  }
})
