// Where the site is served. Canonical, Open Graph and sitemap URLs must be absolute, and every page is rendered once
// at build time, so they come from here and never from the request.
export const siteOrigin = 'https://www.fenmyr.com'

export function absolute(path: string) {
  return new URL(path, siteOrigin).href
}

// The picture a shared link shows. `npm run images` crops it from the light board screenshot.
export const preview = { path: '/images/og.jpg', from: '/images/board-light.png', width: 1200, height: 630 } as const
