import { clientEntry } from 'remix/component'
import type { Handle } from 'remix/component'

// Marks each feature tile data-seen once 60% of it is on screen, so its drawing plays its motion once, and plays it
// again when the pointer or focus comes to the tile, unless it is still playing. The motion itself is CSS, in
// app/ui/tile-art/; playOnSeen in base.ts says how a drawing waits and plays. Drawings wait in their first frame only
// while <html> has data-tile-motion, which this sets once it is watching, so if it never runs they stay still.
export const TileMotion = clientEntry(import.meta.url, function TileMotion(handle: Handle) {
  handle.queueTask(() => {
    let signal = handle.signal
    if (signal.aborted) return
    let root = document.documentElement
    let seen = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          // the first report covers every tile, even one barely on screen, so the ratio decides, not isIntersecting
          if (entry.intersectionRatio < 0.6) continue
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
    let listening = new WeakSet<Element>()
    // every tile not yet seen is watched, including ones an in-place navigation puts on the page later
    let watch = () => {
      for (let tile of document.querySelectorAll<HTMLElement>('[data-tile]')) {
        if (!tile.hasAttribute('data-seen')) seen.observe(tile)
        if (listening.has(tile)) continue
        listening.add(tile)
        tile.addEventListener('pointerenter', replay, { signal })
        tile.addEventListener('focusin', replay, { signal })
      }
    }
    watch()
    let added = new MutationObserver(watch)
    added.observe(document.body, { childList: true, subtree: true })
    root.setAttribute('data-tile-motion', '')
    signal.addEventListener('abort', () => {
      seen.disconnect()
      added.disconnect()
      root.removeAttribute('data-tile-motion')
    })
  })

  return () => <span hidden />
})
