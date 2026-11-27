import { grid } from './pixels.ts'

export type Pose = 'hello' | 'love'

function context2d(canvas: HTMLCanvasElement) {
  const g = canvas.getContext('2d')
  if (!g) throw new Error('no 2D canvas for Myra')
  return g
}

export function Goo(canvas: HTMLCanvasElement, pose: Pose) {
  const GW = 16,
    GH = 15,
    W = canvas.width,
    H = canvas.height,
    px = Math.max(1, Math.floor(Math.min(W / (GW + 1), H / (GH + 1))))
  const g = context2d(canvas)
  const style = getComputedStyle(canvas)
  const token = (name: string) => style.getPropertyValue(`--myra-${name}`).trim()
  const P = {
    B: token('body'),
    S: token('shine'),
    s: token('soft-shine'),
    D: token('seam'),
    d: token('shade'),
    L: token('leaf'),
    l: token('leaf-dark'),
  }
  const ink = token('ink'),
    blush = token('blush'),
    heart = token('heart')
  let hopT = -9,
    look = 0,
    lookTo = 0,
    nextLook = 0
  function frame(now: number, still: boolean) {
    const t = now / 1000
    g.clearRect(0, 0, W, H)
    if (t > nextLook) {
      lookTo = [-1, 0, 0, 1][Math.floor(Math.random() * 4)] ?? 0
      nextLook = t + 1.5 + Math.random() * 2.5
    }
    look += (lookTo - look) * 0.2
    const hp = t - hopT,
      lift = !still && hp < 0.45 ? Math.sin((hp / 0.45) * Math.PI) * 3 : 0
    const breathe = still ? 0 : Math.sin(t * 2.4) * 0.04
    if (still) look = 0
    const ox = (W - GW * px) / 2,
      oy = H - GH * px - Math.round(lift) * px
    g.save()
    g.translate(W / 2, H)
    g.scale(1 - breathe * 0.5, 1 + breathe)
    g.translate(-W / 2, -H)
    grid.forEach((row, y) => {
      row.forEach((c, x) => {
        if (c) {
          g.fillStyle = P[c]
          g.fillRect(ox + x * px, oy + y * px, px, px)
        }
      })
    })
    const blink = t % 3.3 > 3.15,
      ex = Math.round(look)
    if (pose === 'love') {
      g.fillStyle = heart
      for (const c of [3, 10]) {
        g.fillRect(ox + c * px, oy + 7.5 * px, px, px)
        g.fillRect(ox + (c + 2) * px, oy + 7.5 * px, px, px)
        g.fillRect(ox + c * px, oy + 8.5 * px, px * 3, px)
        g.fillRect(ox + (c + 1) * px, oy + 9.5 * px, px, px)
      }
    } else {
      g.fillStyle = ink
      for (const c of [4, 11]) {
        g.fillRect(ox + (c + ex) * px, oy + (blink ? 8.5 : 8) * px, px, blink ? px * 0.4 : px * 2)
      }
    }
    g.fillStyle = blush
    for (const c of [2, 13]) {
      g.fillRect(ox + c * px, oy + 10 * px, px, px)
    }
    g.fillStyle = P.d
    g.fillRect(ox + 7 * px, oy + 11 * px, px * 2, px)
    if (pose === 'love') {
      g.fillStyle = heart
      for (const [i, o] of [0, 0.5].entries()) {
        const ph = (t / 2 + o) % 1,
          u = Math.max(1, px * 0.6),
          hx = ox + (i ? 2 : 12) * px,
          hy = oy + (3 - ph * 5) * px
        g.globalAlpha = Math.sin(ph * Math.PI)
        g.fillRect(hx, hy, u, u)
        g.fillRect(hx + u * 2, hy, u, u)
        g.fillRect(hx, hy + u, u * 3, u)
        g.fillRect(hx + u, hy + u * 2, u, u)
      }
      g.globalAlpha = 1
    }
    g.restore()
  }
  return {
    hop() {
      hopT = performance.now() / 1000
    },
    draw: frame,
  }
}
