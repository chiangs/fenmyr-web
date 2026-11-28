import { css } from 'remix/component'

// What the tile drawings in this folder share: the quiet colours, the line colour and the raised surface, and how a
// drawing's motion plays. Each section's drawings are in their own file.

export type Style = Parameters<typeof css>[0]

export const faint = 'color-mix(in oklab, var(--card-white-ink) 22%, transparent)'
export const soft = 'color-mix(in oklab, var(--card-white-ink) 45%, transparent)'
export const line = 'var(--card-butter-ink)'

export const surface = {
  background: 'var(--card-white)',
  color: 'var(--card-white-ink)',
  boxShadow: '0 4px 12px rgba(var(--sh), calc(.14 * var(--sh-k)))',
}

// A drawing plays its motion when its tile scrolls into view, again every 10 s while the tile stays on screen, and
// when the pointer or focus comes to the tile: app/ui/public/tile-motion.tsx marks and re-marks the tile data-seen.
// Until then, once that island is watching and motion is allowed, the drawing waits in its first frame, `start`.
// With reduced motion, without the island, or in print, it is the still drawing.
// `animation` names a @keyframes from the same css() and ends on the still drawing, with fill-mode `both`.
// Spread the result into the css() of the element that moves.
export function playOnSeen(start: Style, animation: string): Style {
  return {
    '@media screen and (prefers-reduced-motion: no-preference)': {
      ':root[data-tile-motion] [data-tile]:not([data-seen]) &': start,
      ':is([data-tile][data-seen]) &': { animation },
    },
  }
}
