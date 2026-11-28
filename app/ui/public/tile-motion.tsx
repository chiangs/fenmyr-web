import { clientEntry } from 'remix/component'
import type { Handle } from 'remix/component'

// how often a drawing plays while its tile stays on screen: its motion of about 2 to 3 s, then a long rest
const every = 10_000
// at most one drawing starts in this time, so tiles that come due together, however they did, never move in step
const stagger = 900

// Marks each [data-tile], the feature tiles and the drawings of the From raw to ripe steps, data-seen when its drawing
// should play: once 60% of the tile is on screen and its turn comes, again every 10 s while it stays on screen and the
// page is in front, and at once when the pointer or focus comes to it. The motion itself is CSS, in app/ui/tile-art/;
// playOnSeen in base.ts says how a drawing waits and plays.
// Drawings wait in their first frame only while <html> has data-tile-motion, which this sets once it is watching, so
// if it never runs they stay still. With reduced motion the CSS plays nothing, and no timer runs.
export const TileMotion = clientEntry(import.meta.url, function TileMotion(handle: Handle) {
  handle.queueTask(() => {
    let signal = handle.signal
    if (signal.aborted) return
    let root = document.documentElement
    let calm = matchMedia('(prefers-reduced-motion: reduce)')
    // the tiles 60% on screen, in the order they arrived, which is the order they take their turns in
    let onScreen = new Set<HTMLElement>()
    let due = new WeakMap<HTMLElement, number>()
    let lastStart = -Infinity

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

    // starts the first tile whose turn has come, if no other started in the last `stagger`
    let tick = () => {
      let now = performance.now()
      if (now - lastStart < stagger) return
      for (let tile of onScreen) {
        if (!tile.isConnected) {
          onScreen.delete(tile)
          seen.unobserve(tile)
          continue
        }
        if (now < (due.get(tile) ?? 0) || playing(tile)) continue
        play(tile)
        lastStart = now
        return
      }
    }
    // the timer runs only while there is something to play and someone to see it
    let timer: ReturnType<typeof setInterval> | undefined
    let arm = () => {
      let wanted = onScreen.size > 0 && !calm.matches && !document.hidden
      if (wanted && timer === undefined) timer = setInterval(tick, 250)
      if (!wanted && timer !== undefined) {
        clearInterval(timer)
        timer = undefined
      }
    }

    let seen = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (!(entry.target instanceof HTMLElement)) continue
          if (!entry.target.isConnected) seen.unobserve(entry.target)
          // the first report covers every tile, even one barely on screen, so the ratio decides, not isIntersecting
          if (entry.intersectionRatio < 0.6 || !entry.target.isConnected) onScreen.delete(entry.target)
          else onScreen.add(entry.target)
        }
        arm()
      },
      { threshold: 0.6 },
    )

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
    document.addEventListener('visibilitychange', arm, { signal })
    calm.addEventListener('change', arm, { signal })
    root.setAttribute('data-tile-motion', '')
    signal.addEventListener('abort', () => {
      if (timer !== undefined) clearInterval(timer)
      seen.disconnect()
      added.disconnect()
      root.removeAttribute('data-tile-motion')
    })
  })

  return () => <span hidden />
})
