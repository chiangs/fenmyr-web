// Audits what search engines and link previews read in the built site, `.vercel/output/static`, so it checks the
// files Vercel serves. Run `npm run build` first; `npm run check` runs both. The skill in .agents/skills/seo says why
// each check is here.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import * as path from 'node:path'
import sharp from 'sharp'

import { preview, siteOrigin } from '../app/site.ts'

const root = path.resolve(import.meta.dirname, '..')
const staticDir = path.join(root, '.vercel/output/static')
const limits = { title: [15, 60], description: [70, 160], previewBytes: 300_000 } as const

if (!existsSync(staticDir)) throw new Error('no .vercel/output/static: run npm run build first')

let problems: string[] = []
let fail = (where: string, problem: string) => problems.push(`${where}: ${problem}`)

type Tag = { name: string; attributes: Map<string, string> }

function tagsOf(html: string): Tag[] {
  let body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (script) => script.replace(/>[\s\S]*</, '><'))
  return [...body.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi)].map(([, name = '', rest = '']) => ({
    name: name.toLowerCase(),
    attributes: new Map([...rest.matchAll(/([^\s=/]+)(?:=(["'])(.*?)\2)?/g)].map(([, key = '', , value = '']) => [key.toLowerCase(), decode(value)])),
  }))
}

function decode(text: string) {
  return text.replace(/&(amp|quot|#39|lt|gt);/g, (_, name: string) => ({ amp: '&', quot: '"', '#39': "'", lt: '<', gt: '>' })[name] ?? '')
}

function textOf(html: string, tag: string) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi'))].map(([, inner = '']) =>
    decode(inner.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim(),
  )
}

function meta(tags: Tag[], key: 'name' | 'property', value: string) {
  return tags.filter((tag) => tag.name === 'meta' && tag.attributes.get(key) === value).map((tag) => tag.attributes.get('content') ?? '')
}

function within(where: string, what: string, text: string, [min, max]: readonly [number, number]) {
  if (text.length < min || text.length > max) fail(where, `${what} is ${text.length} characters, keep it ${min} to ${max}: "${text}"`)
}

function one(where: string, what: string, values: string[]) {
  if (values.length !== 1) fail(where, `${values.length} ${what}, expected 1`)
  return values[0] ?? ''
}

// a URL on this site, as the file the build wrote for it
function fileFor(url: string) {
  let { origin, pathname } = new URL(url)
  if (origin !== siteOrigin) return null
  let file = path.join(staticDir, pathname.endsWith('/') ? `${pathname}index.html` : pathname)
  return existsSync(file) ? file : null
}

let sitemap = existsSync(path.join(staticDir, 'sitemap.xml')) ? readFileSync(path.join(staticDir, 'sitemap.xml'), 'utf8') : ''
if (!sitemap) fail('sitemap.xml', 'missing from public/')
let listed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, loc = '']) => loc.trim())
for (let loc of listed) if (!fileFor(loc)) fail('sitemap.xml', `${loc} is not a page on ${siteOrigin} in the build`)

let robots = existsSync(path.join(staticDir, 'robots.txt')) ? readFileSync(path.join(staticDir, 'robots.txt'), 'utf8') : ''
if (!robots) fail('robots.txt', 'missing from public/')
if (/^\s*disallow:\s*\/\s*$/im.test(robots)) fail('robots.txt', 'disallows the whole site')
if (!robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`)) fail('robots.txt', `has no "Sitemap: ${siteOrigin}/sitemap.xml" line`)

let titles = new Map<string, string>()
let pages = readdirSync(staticDir).filter((file) => file.endsWith('.html'))
for (let file of pages) {
  let html = readFileSync(path.join(staticDir, file), 'utf8')
  let tags = tagsOf(html)
  let where = file

  let lang = tags.find((tag) => tag.name === 'html')?.attributes.get('lang') ?? ''
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) fail(where, `<html lang="${lang}"> is not a language tag`)
  let title = one(where, '<title>', textOf(html, 'title'))
  let images = tags.filter((tag) => tag.name === 'img')
  for (let image of images) if (!image.attributes.has('alt')) fail(where, `<img src="${image.attributes.get('src')}"> has no alt`)

  let noindex = meta(tags, 'name', 'robots').some((content) => content.includes('noindex'))
  let canonical = tags.filter((tag) => tag.name === 'link' && tag.attributes.get('rel') === 'canonical').map((tag) => tag.attributes.get('href') ?? '')
  if (noindex) {
    if (canonical.length > 0) fail(where, 'is noindex but names a canonical URL')
    if (listed.some((loc) => fileFor(loc) === path.join(staticDir, file))) fail(where, 'is noindex but listed in sitemap.xml')
    continue
  }

  // an indexed page
  within(where, 'the title', title, limits.title)
  if (titles.has(title)) fail(where, `shares its title with ${titles.get(title)}`)
  titles.set(title, file)
  within(where, 'the meta description', one(where, 'meta descriptions', meta(tags, 'name', 'description')), limits.description)
  let url = one(where, 'canonical links', canonical)
  if (url && (!url.startsWith(`${siteOrigin}/`) || fileFor(url) !== path.join(staticDir, file)))
    fail(where, `canonical ${url} is not this page on ${siteOrigin}`)
  if (url && !listed.includes(url)) fail(where, `canonical ${url} is not in sitemap.xml`)

  let h1s = textOf(html, 'h1')
  if (h1s.length !== 1 || !h1s[0]) fail(where, `has ${h1s.length} <h1>, expected one with text`)
  let levels = [...html.matchAll(/<h([1-6])\b/gi)].map(([, level]) => Number(level))
  levels.forEach((level, index) => {
    let before = levels[index - 1]
    if (before !== undefined && level > before + 1) fail(where, `heading jumps from h${before} to h${level}`)
  })

  let og = (property: string) => one(where, `og:${property}`, meta(tags, 'property', `og:${property}`))
  if (og('url') !== url) fail(where, 'og:url differs from the canonical URL')
  if (og('title') !== title) fail(where, 'og:title differs from the title')
  for (let property of ['type', 'site_name', 'description', 'image:alt']) if (!og(property)) fail(where, `og:${property} is empty`)
  let image = og('image')
  let imageFile = image.startsWith(`${siteOrigin}/`) ? fileFor(image) : null
  if (!imageFile) fail(where, `og:image ${image} is not a file on ${siteOrigin} in the build`)
  else {
    let { width, height } = await sharp(imageFile).metadata()
    if (`${width}x${height}` !== `${og('image:width')}x${og('image:height')}` || width !== preview.width || height !== preview.height)
      fail(where, `og:image is ${width}x${height}, its tags and app/site.ts must agree`)
    let bytes = readFileSync(imageFile).length
    if (bytes > limits.previewBytes) fail(where, `og:image is ${bytes} bytes, keep it under ${limits.previewBytes} so every app shows it`)
  }
  if (one(where, 'twitter:card', meta(tags, 'name', 'twitter:card')) !== 'summary_large_image') fail(where, 'twitter:card is not summary_large_image')

  for (let [, json = ''] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      let data: unknown = JSON.parse(json)
      if (typeof data !== 'object' || data === null || Reflect.get(data, '@context') !== 'https://schema.org') fail(where, 'JSON-LD has no https://schema.org @context')
    } catch (error) {
      fail(where, `JSON-LD does not parse: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

if (problems.length > 0) {
  console.error(`seo: ${problems.length} problem${problems.length === 1 ? '' : 's'}\n${problems.map((problem) => `  ${problem}`).join('\n')}`)
  process.exit(1)
}
console.log(`seo: ${pages.length} pages, ${titles.size} indexed, ${listed.length} in the sitemap, all fine`)
