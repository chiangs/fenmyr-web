import { unsafeHTML } from 'remix/component'
import type { Handle, RemixNode } from 'remix/component'
import { ImportMap } from 'remix/component/server'

import { scriptEntry } from '../assets.ts'
import { en } from '../content/en.tsx'
import { absolute, preview } from '../site.ts'
import { screenshots, srcset } from '../ui/screenshots.ts'
import type { ScreenshotName } from '../ui/screenshots.ts'
import { modes, themeStorageKey, themes } from '../ui/themes.ts'

export interface DocumentProps {
  children?: RemixNode
  // what search results show under the title; the home page's when left out
  description?: string
  head?: RemixNode
  hero?: ScreenshotName
  // the page's own path: a page with one is indexed, with a canonical URL and a link preview; a page without one,
  // such as the 404 page, asks search engines to leave it out
  path?: string
  title?: string
}

// what search engines and link previews read; `npm run seo` checks the built pages for it
function SearchMeta(handle: Handle<{ description: string; path?: string; title: string }>) {
  return () => {
    let { description, path, title } = handle.props
    if (path === undefined) return <meta name="robots" content="noindex" />
    let url = absolute(path)
    return (
      <>
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={en.header.brand} />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={absolute(preview.path)} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content={String(preview.width)} />
        <meta property="og:image:height" content={String(preview.height)} />
        <meta property="og:image:alt" content={en.document.previewAlt} />
        <meta name="twitter:card" content="summary_large_image" />
      </>
    )
  }
}

const modeOf = JSON.stringify(Object.fromEntries(themes.map((theme) => [theme.id, theme.mode])))
function themeScript(hero: ScreenshotName | undefined) {
  let preload = hero
    ? `let s=${JSON.stringify(Object.fromEntries(modes.map((mode) => [mode, srcset(hero, mode, 'avif')])))},l=document.createElement("link");l.rel="preload";l.as="image";l.type="image/avif";l.fetchPriority="high";l.imageSrcset=s[d.dataset.mode||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")];l.imageSizes=${JSON.stringify(screenshots[hero].sizes)};document.head.append(l)`
    : ''
  return unsafeHTML(
    `(()=>{let d=document.documentElement,m=${modeOf};d.dataset.js="";try{let t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(t&&Object.hasOwn(m,t)){d.dataset.theme=t;d.dataset.mode=m[t]}}catch{}${preload}})()`,
  )
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, description = en.document.description, head, hero, path, title = en.document.title } = handle.props
    let { href, importMap, preloads } = scriptEntry

    return (
      <html lang="en-GB" data-rmx-preserve-attrs="data-theme data-mode data-js data-tile-motion">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script innerHTML={themeScript(hero)} />
          <meta name="color-scheme" content="light dark" />
          <meta name="description" content={description} />
          <link rel="icon" type="image/png" sizes="48x48" href="/images/favicon-48.png" />
          <link rel="apple-touch-icon" href="/images/icon.png" />
          <link rel="preload" href="/fonts/Figtree-400-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="preload" href="/fonts/Figtree-800-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="stylesheet" href="/themes.css" />
          <link rel="stylesheet" href="/styles.css" />
          <title>{title}</title>
          <SearchMeta description={description} path={path} title={title} />
          {head}
          <ImportMap value={importMap} />
          {preloads.map((preloadHref) => (
            <link key={preloadHref} rel="modulepreload" href={preloadHref} />
          ))}
          <script type="module" src={href}></script>
        </head>
        <body>{children}</body>
      </html>
    )
  }
}
