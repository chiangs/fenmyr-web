import { clientEntry } from 'remix/component'
import type { Handle } from 'remix/component'

// how often a drawing plays while its tile stays on screen: its motion of about 2.5 s, then a long rest
const every = 10_000
// tiles that come into view together start this far apart, so a grid of them doesn't move in step
const stagger = 900

// Marks each feature tile data-seen once 60% of it is on screen, so its drawing plays its motion, then plays it again
// every 10 s while the tile stays on screen and the page is in front, and at once when the pointer or focus comes to
// it. The motion itself is CSS, in app/ui/tile-art/; playOnSeen in base.ts says how a drawing waits and plays.
// Drawings wait in their first frame only while <html> has data-tile-motion, which this sets once it is watching, so
// if it never runs they stay still. With reduced motion, the CSS plays nothing and this schedules nothing.
export const TileMotion = clientEntry(import.meta.url, function TileMotion(handle: Handle) {
  handle.queueTask(() => {
    let signal = handle.signal
    if (signal.aborted) return
    let root = document.documentElement
    let calm = matchMedia('(prefers-reduced-motion: reduce)')
    let onScreen = new Set<HTMLElement>()
    let due = new WeakMap<HTMLElement, number>()

    let playing = (tile: HTMLElement) =>
      tile.getAnimations({ subtree: true }).some((animation) => animation.playState === 'running')
    let play = (tile: HTMLElement) => {
      due.set(tile, performance.now() + every)
      if (!tile.hasAttribute('data-seen')) return tile.setAttribute('data-seen', '')
      tile.removeAttribute('data-seen')
      // reading the layout makes the browser drop the old animation before it starts again
      void tile.offsetWidth
      tile.setAttribute('data-seen', '')
    }

    let seen = new IntersectionObserver(
      (entries) => {
        let arriving = 0
        for (let entry of entries) {
          if (!(entry.target instanceof HTMLElement)) continue
          // the first report covers every tile, even one barely on screen, so the ratio decides, not isIntersecting
          if (entry.intersectionRatio < 0.6) {
            onScreen.delete(entry.target)
            continue
          }
          if (onScreen.has(entry.target)) continue
          onScreen.add(entry.target)
          // a tile coming into view plays now if it is due, or a little after the others arriving with it, whether it
          // is new or back after a while off screen
          let now = performance.now()
          if ((due.get(entry.target) ?? 0) <= now) due.set(entry.target, now + arriving++ * stagger)
        }
      },
      { threshold: 0.6 },
    )
    let tick = setInterval(() => {
      if (document.hidden || calm.matches) return
      let now = performance.now()
      for (let tile of onScreen) {
        if (!tile.isConnected) {
          onScreen.delete(tile)
          continue
        }
        if (now >= (due.get(tile) ?? 0) && !playing(tile)) play(tile)
      }
    }, 250)

    let replay = (event: Event) => {
      let tile = event.currentTarget
      if (tile instanceof HTMLElement && tile.hasAttribute('data-seen') && !playing(tile)) play(tile)
    }
    let listening = new WeakSet<Element>()
    // every tile is watched, including ones an in-place navigation puts on the page later
    let watch = () => {
      for (let tile of document.querySelectorAll<HTMLElement>('[data-tile]')) {
        if (listening.has(tile)) continue
        listening.add(tile)
        seen.observe(tile)
        tile.addEventListener('pointerenter', replay, { signal })
        tile.addEventListener('focusin', replay, { signal })
      }
    }
    watch()
    let added = new MutationObserver(watch)
    added.observe(document.body, { childList: true, subtree: true })
    root.setAttribute('data-tile-motion', '')
    signal.addEventListener('abort', () => {
      clearInterval(tick)
      seen.disconnect()
      added.disconnect()
      root.removeAttribute('data-tile-motion')
    })
  })

  return () => <span hidden />
})
