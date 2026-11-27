import { readFile, writeFile } from 'node:fs/promises'
import * as path from 'node:path'

import { themes } from '../app/ui/themes.ts'
import type { Theme, ThemeId } from '../app/ui/themes.ts'

const app = 'chiangs/fenmyr'
const commit = '5d569afae54f8b91948b4af945fd3ee38d578e65'
const root = path.resolve(import.meta.dirname, '..')
const output = path.resolve(process.argv[2] ?? path.join(root, 'public/themes.css'))

const tokens = [
  '--ink',
  '--ink-soft',
  '--board',
  '--dot',
  '--border',
  '--pink-deep',
  '--accent-text',
  '--on-accent',
  '--select',
  '--sh',
  '--sh-k',
  '--card-white',
  '--card-white-ink',
  '--card-white-soft',
  '--card-white-link',
  '--card-butter',
  '--card-butter-ink',
  '--card-pink',
  '--card-mint',
  '--card-sky',
  '--card-lilac',
  '--card-peach',
] as const

const appThemes: Record<ThemeId, { id: string; classes: string[] }> = {
  'default-light': { id: 'default-light', classes: [] },
  midsummer: { id: 'midsummer-light', classes: ['theme-midsummer'] },
  clear: { id: 'clear-light', classes: ['theme-clear'] },
  'default-dark': { id: 'default-dark', classes: ['dark'] },
  'polar-night': { id: 'polar-night-dark', classes: ['dark', 'theme-polar-night'] },
  lantern: { id: 'lantern-dark', classes: ['dark', 'theme-lantern'] },
}

const shapes: Record<string, RegExp> = {
  '--sh': /^\d{1,3}, \d{1,3}, \d{1,3}$/,
  '--sh-k': /^\d+(?:\.\d+)?$/,
}
const hex = /^#(?:[0-9a-f]{6}|[0-9a-f]{3})$/i

interface Rule {
  selector: string
  body: string
}

async function fetchText(file: string) {
  let url = `https://raw.githubusercontent.com/${app}/${commit}/${file}`
  let response = await fetch(url)
  if (!response.ok) throw new Error(`${url} answered ${response.status}`)
  return response.text()
}

function split(text: string, separator: string) {
  let parts: string[] = []
  let depth = 0
  let quote = ''
  let start = 0
  for (let i = 0; i < text.length; i++) {
    let char = text[i]
    if (quote) {
      if (char === '\\') i++
      else if (char === quote) quote = ''
    } else if (char === '"' || char === "'") quote = char
    else if (char === '(') depth++
    else if (char === ')') depth--
    else if (char === separator && depth === 0) {
      parts.push(text.slice(start, i))
      start = i + 1
    }
  }
  parts.push(text.slice(start))
  return parts
}

function topLevelRules(css: string) {
  let text = css.replace(/\/\*[\s\S]*?\*\//g, '')
  let rules: Rule[] = []
  let depth = 0
  let quote = ''
  let start = 0
  let open = 0
  for (let i = 0; i < text.length; i++) {
    let char = text[i]
    if (quote) {
      if (char === '\\') i++
      else if (char === quote) quote = ''
    } else if (char === '"' || char === "'") quote = char
    else if (char === '{') {
      if (depth === 0) open = i
      depth++
    } else if (char === '}') {
      depth--
      if (depth === 0) {
        rules.push({ selector: text.slice(start, open).trim(), body: text.slice(open + 1, i) })
        start = i + 1
      }
    } else if (char === ';' && depth === 0) start = i + 1
  }
  return rules
}

function declarations(body: string) {
  let found = new Map<string, string>()
  if (body.includes('{')) return found
  for (let part of split(body, ';')) {
    let colon = part.indexOf(':')
    let name = part.slice(0, colon).trim()
    if (colon > 0 && name.startsWith('--')) found.set(name, part.slice(colon + 1).trim())
  }
  return found
}

function cascade(rules: Rule[], classes: string[]) {
  let matching = rules.flatMap((rule, order) => {
    if (rule.selector === ':root') return [{ rule, rank: 0, order }]
    let body = /^body((?:\.[\w-]+)*)$/.exec(rule.selector)
    if (!body) return []
    let own = (body[1] ?? '').split('.').filter(Boolean)
    return own.every((name) => classes.includes(name)) ? [{ rule, rank: 1 + own.length, order }] : []
  })
  matching.sort((a, b) => a.rank - b.rank || a.order - b.order)
  let values = new Map<string, string>()
  for (let { rule } of matching) for (let [name, value] of declarations(rule.body)) values.set(name, value)
  return values
}

function resolve(values: Map<string, string>, name: string, seen: string[] = []): string {
  if (seen.includes(name)) throw new Error(`${[...seen, name].join(' -> ')} refers to itself`)
  let value = values.get(name)
  if (value === undefined) throw new Error(`the app sets no ${name}`)
  return value.replace(/var\((--[\w-]+)\)/g, (_, inner: string) => resolve(values, inner, [...seen, name]))
}

function edgeOf(values: Map<string, string>) {
  let edge = values.get('--card-edge') ?? ''
  for (let [, name = ''] of edge.matchAll(/var\((--[\w-]+)\)/g)) {
    if (!tokens.some((token) => token === name)) throw new Error(`--card-edge "${edge}" uses ${name}, which the site has no token for`)
  }
  if (!edge) throw new Error('the app sets no --card-edge')
  return edge
}

function appTheme(source: string, id: string) {
  let start = source.indexOf(`id: '${id}'`)
  if (start < 0) throw new Error(`src/web/settings/themes.ts has no theme ${id}`)
  let next = source.indexOf("id: '", start + 1)
  let chunk = source.slice(start, next < 0 ? undefined : next)
  let field = (pattern: RegExp) => {
    let match = pattern.exec(chunk)
    if (!match?.[1]) throw new Error(`theme ${id} has no ${pattern.source}`)
    return match[1]
  }
  return {
    board: field(/\bbg: '(#[0-9a-f]+)'/i),
    outline: field(/\boutline: (true|false)\b/) === 'true',
    ring: field(/\bring: (true|false)\b/) === 'true',
  }
}

function block(selectors: string[], lines: string[], indent = '') {
  return [`${indent}${selectors.join(`,\n${indent}`)} {`, ...lines.map((line) => `${indent}  ${line}`), `${indent}}`].join('\n')
}

let [themesCss, styleCss, themesTs] = await Promise.all([
  fetchText('web/themes.css'),
  fetchText('web/style.css'),
  fetchText('src/web/settings/themes.ts'),
])
let rules = topLevelRules(`${themesCss}\n${styleCss}`)

let resolved = themes.map((theme: Theme) => {
  let source = appThemes[theme.id]
  let values = cascade(rules, source.classes)
  let extra = appTheme(themesTs, source.id)
  values.set('--board', extra.board)
  let lines = [`color-scheme: ${theme.mode};`]
  for (let name of tokens) {
    let value = resolve(values, name)
    let shape = shapes[name] ?? hex
    if (!shape.test(value)) throw new Error(`${theme.id} ${name} is "${value}", expected ${shape.source}`)
    lines.push(`${name}: ${value.toLowerCase()};`)
  }
  return { theme, lines, edge: extra.outline ? edgeOf(values) : null, ring: extra.ring }
})

let byId = (id: ThemeId) => {
  let entry = resolved.find((item) => item.theme.id === id)
  if (!entry) throw new Error(`no theme ${id}`)
  return entry
}
let selector = (id: ThemeId) => `[data-theme="${id}"]`
let outlined = resolved.filter((item) => item.edge)
let ringed = resolved.filter((item) => item.ring)
let edges = new Set(outlined.map((item) => item.edge))
if (edges.size > 1) throw new Error(`the outlined themes draw different card edges: ${[...edges].join(' | ')}`)

let css = [
  block([':root', selector('default-light')], byId('default-light').lines),
  `@media (prefers-color-scheme: dark) {\n${block([':root:not([data-theme])'], byId('default-dark').lines, '  ')}\n}`,
  ...resolved.filter((item) => item.theme.id !== 'default-light').map((item) => block([selector(item.theme.id)], item.lines)),
  ...(outlined.length ? [block(outlined.map((item) => selector(item.theme.id)), [`--card-edge: ${[...edges][0]};`])] : []),
  ...(ringed.length
    ? [block(ringed.map((item) => `${selector(item.theme.id)} :focus-visible`), ['outline: 3px solid var(--select);', 'outline-offset: 2px;'])]
    : []),
].join('\n\n')

let text = `${css}\n`
let before = await readFile(output, 'utf8').catch(() => '')
if (before === text) console.log(`${path.relative(root, output)} unchanged`)
else {
  await writeFile(output, text)
  console.log(`wrote ${path.relative(root, output)}: ${themes.length} themes, ${tokens.length} tokens each, from ${app}@${commit.slice(0, 7)}`)
}
