import { clientEntry, css, ref } from 'remix/component'
import type { Handle } from 'remix/component'

import { Goo } from './myra/goo.ts'
import type { Pose } from './myra/goo.ts'

export interface MyraProps {
  pose: Pose
  label: string
  size: string
  lazy?: boolean
}

function animate(canvas: HTMLCanvasElement, pose: Pose, signal: AbortSignal) {
  let goo = Goo(canvas, pose)
  let reduced = matchMedia('(prefers-reduced-motion: reduce)')
  let seen = false
  let frame = 0
  let last = 0
  let nextHop = 0
  let tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    if (now - last < 32) return
    last = now
    if (pose === 'hello' && now >= nextHop) {
      goo.hop()
      nextHop = now + 3000 + Math.random() * 3000
    }
    goo.draw(now, false)
  }
  let sync = () => {
    cancelAnimationFrame(frame)
    if (reduced.matches) goo.draw(0, true)
    else if (seen && document.visibilityState === 'visible') frame = requestAnimationFrame(tick)
  }
  let observer = new IntersectionObserver((entries) => {
    seen = entries.at(-1)?.isIntersecting ?? seen
    sync()
  })
  observer.observe(canvas)
  reduced.addEventListener('change', sync, { signal })
  document.addEventListener('visibilitychange', sync, { signal })
  signal.addEventListener('abort', () => {
    observer.disconnect()
    cancelAnimationFrame(frame)
  })
  goo.draw(0, true)
}

const pixelArt = css({ flex: 'none', display: 'block', maxWidth: '100%', height: 'auto', imageRendering: 'pixelated' })

export const Myra = clientEntry(import.meta.url, function Myra(handle: Handle<MyraProps>) {
  let started = false
  handle.queueTask(() => {
    started = true
    handle.update()
  })

  return () => {
    let { pose, label, size, lazy } = handle.props

    if (!started) {
      return (
        <img
          src={`/images/myra-${pose}-still.png`}
          alt={label}
          width={136}
          height={160}
          loading={lazy ? 'lazy' : undefined}
          style={{ width: size }}
          mix={pixelArt}
        />
      )
    }

    return (
      <canvas
        role="img"
        aria-label={label}
        width={136}
        height={160}
        style={{ width: size }}
        mix={[pixelArt, ref((canvas, signal) => animate(canvas, pose, signal))]}
      />
    )
  }
})
