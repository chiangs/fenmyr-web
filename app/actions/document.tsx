import { unsafeHTML } from 'remix/component'
import type { Handle, RemixNode } from 'remix/component'
import { ImportMap } from 'remix/component/server'

import { scriptEntry } from '../assets.ts'
import { en } from '../content/en.tsx'
import { themeStorageKey, themes } from '../ui/themes.ts'

export interface DocumentProps {
  children?: RemixNode
  head?: RemixNode
  title?: string
}

const modeOf = JSON.stringify(Object.fromEntries(themes.map((theme) => [theme.id, theme.mode])))
const themeScript = unsafeHTML(
  `(()=>{let d=document.documentElement,m=${modeOf};d.dataset.js="";try{let t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(t&&Object.hasOwn(m,t)){d.dataset.theme=t;d.dataset.mode=m[t]}}catch{}})()`,
)

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, head, title = en.document.title } = handle.props
    let { href, importMap, preloads } = scriptEntry

    return (
      <html lang="en" data-rmx-preserve-attrs="data-theme data-mode data-js">
        <head>
          <meta charSet="utf-8" />
          <script innerHTML={themeScript} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
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
