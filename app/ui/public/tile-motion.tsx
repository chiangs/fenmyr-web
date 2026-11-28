import { clientEntry } from 'remix/component'
import type { Handle } from 'remix/component'

// Marks each feature tile data-seen once most of it has scrolled into view, so its drawing plays its motion once,
// and plays it again when the pointer or focus comes to the tile, unless it is still playing. The motion itself is
// CSS, in app/ui/tile-art/; playOnSeen in base.ts says how a drawing waits and plays.
export const TileMotion = clientEntry(import.meta.url, function TileMotion(handle: Handle) {
  handle.queueTask((signal) => {
    let seen = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-seen', '')
          seen.unobserve(entry.target)
        }
      },
      { threshold: 0.6 },
    )
    let replay = (event: Event) => {
      let tile = event.currentTarget
      if (!(tile instanceof HTMLElement) || !tile.hasAttribute('data-seen')) return
      if (tile.getAnimations({ subtree: true }).some((animation) => animation.playState === 'running')) return
      tile.removeAttribute('data-seen')
      // reading the layout makes the browser drop the old animation before it starts again
      void tile.offsetWidth
      tile.setAttribute('data-seen', '')
    }
    for (let tile of document.querySelectorAll<HTMLElement>('[data-tile]')) {
      seen.observe(tile)
      tile.addEventListener('pointerenter', replay, { signal })
      tile.addEventListener('focusin', replay, { signal })
    }
    signal.addEventListener('abort', () => seen.disconnect())
  })

  return () => <span hidden />
})
