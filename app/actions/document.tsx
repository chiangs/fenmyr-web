import { unsafeHTML } from 'remix/component'
import type { Handle, RemixNode } from 'remix/component'
import { ImportMap } from 'remix/component/server'

import { scriptEntry } from '../assets.ts'
import { en } from '../content/en.tsx'
import { screenshots, srcset } from '../ui/screenshots.ts'
import type { ScreenshotName } from '../ui/screenshots.ts'
import { modes, themeStorageKey, themes } from '../ui/themes.ts'

export interface DocumentProps {
  children?: RemixNode
  head?: RemixNode
  hero?: ScreenshotName
  title?: string
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
    let { children, head, hero, title = en.document.title } = handle.props
    let { href, importMap, preloads } = scriptEntry

    return (
      <html lang="en" data-rmx-preserve-attrs="data-theme data-mode data-js">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script innerHTML={themeScript(hero)} />
          <meta name="color-scheme" content="light dark" />
          <meta name="description" content={en.document.description} />
          <link rel="icon" type="image/png" sizes="48x48" href="/images/favicon-48.png" />
          <link rel="apple-touch-icon" href="/images/icon.png" />
          <link rel="preload" href="/fonts/Figtree-400-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="preload" href="/fonts/Figtree-800-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link rel="stylesheet" href="/themes.css" />
          <link rel="stylesheet" href="/styles.css" />
          <title>{title}</title>
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
