import { constants } from 'node:fs'
import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import * as path from 'node:path'

import { assets } from '../app/assets.ts'
import { router } from '../app/router.tsx'
import { routes } from '../app/routes.ts'

const root = path.resolve(import.meta.dirname, '..')
const output = path.join(root, '.vercel/output')
const staticDir = path.join(output, 'static')
const assetUrl = /\/assets\/[^"'`\s<>()\\?#]+/g
const importMap = /<script[^>]*type="importmap"[^>]*>(.*?)<\/script>/gs
const pages = [
  { route: 'home', file: 'index.html', url: routes.home.href(), status: 200 },
  { route: 'licences', file: 'licences.txt', url: routes.licences.href(), status: 200 },
  { route: null, file: '404.html', url: '/404', status: 404 },
]
const unrendered = Object.keys(routes).filter((name) => name !== 'assets' && !pages.some((page) => page.route === name))
if (unrendered.length > 0) throw new Error(`routes with no page in tools/build.ts: ${unrendered.join(', ')}`)

function fetchPath(url: string) {
  return router.fetch(new Request(new URL(url, 'http://localhost')))
}

async function write(file: string, body: Uint8Array | string) {
  let target = path.join(staticDir, file)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, body)
}

function keysOf(value: unknown, field: string) {
  let inner: unknown = typeof value === 'object' && value !== null ? Reflect.get(value, field) : null
  return typeof inner === 'object' && inner !== null ? Object.keys(inner) : []
}

function filesUnder(dir: string) {
  return readdir(dir, { recursive: true, withFileTypes: true }).then((entries) =>
    entries.filter((entry) => entry.isFile()).map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name))),
  )
}

let ids = 0
crypto.randomUUID = () => `${(++ids).toString(16).padStart(8, '0')}-0000-4000-8000-000000000000`

await rm(output, { recursive: true, force: true })

let specifiers = new Set<string>()
let queue: string[] = []
let enqueue = (text: string) => {
  for (let [url] of text.matchAll(assetUrl)) if (!specifiers.has(url) && !queue.includes(url)) queue.push(url)
}

let html: string[] = []
for (let page of pages) {
  let response = await fetchPath(page.url)
  if (response.status !== page.status) throw new Error(`${page.url} answered ${response.status}, expected ${page.status}`)
  let text = await response.text()
  for (let [, json] of text.matchAll(importMap)) {
    let map: unknown = JSON.parse(json ?? '')
    for (let key of [...keysOf(map, 'imports'), ...keysOf(map, 'scopes')]) specifiers.add(key)
  }
  html.push(text)
  await write(page.file, text)
}
html.forEach(enqueue)

for (let url of queue) {
  let response = await fetchPath(url)
  if (response.status !== 200) throw new Error(`${url} answered ${response.status}`)
  let body = new Uint8Array(await response.arrayBuffer())
  if (/^text\/|javascript|json|xml/.test(response.headers.get('content-type') ?? '')) enqueue(new TextDecoder().decode(body))
  await write(url.split('/').map(decodeURIComponent).join('/'), body)
}

let publicFiles = await filesUnder(path.join(root, 'public'))
for (let file of publicFiles) {
  await mkdir(path.dirname(path.join(staticDir, file)), { recursive: true })
  await copyFile(path.join(root, 'public', file), path.join(staticDir, file), constants.COPYFILE_EXCL)
}

let overrides = Object.fromEntries(
  (await filesUnder(staticDir))
    .filter((file) => /\.tsx?$/.test(file))
    .sort()
    .map((file) => [file, { contentType: 'text/javascript; charset=utf-8' }]),
)

let config = {
  version: 3,
  overrides,
  routes: [
    { src: '^/.*$', headers: { 'X-Content-Type-Options': 'nosniff' }, continue: true },
    { handle: 'filesystem' },
    { src: '^/(.*)$', dest: '/404.html', status: 404 },
  ],
}
await writeFile(path.join(output, 'config.json'), `${JSON.stringify(config, null, 2)}\n`)
await assets.close()

console.log(
  `wrote ${path.relative(root, output)}: ${pages.length} pages, ${queue.length} assets (${Object.keys(overrides).length} TypeScript overrides), ${publicFiles.length} public files`,
)
