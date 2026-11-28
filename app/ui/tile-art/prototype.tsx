import { css } from 'remix/component'

import { faint, line, playOnSeen, soft, surface } from './base.ts'

// From idea to prototype's drawings; its phone is in phone.tsx, since From raw to ripe borrows it

// two controls above the preview. When the tile is seen, both handles slide as if someone were trying values, and the
// fill follows, then they settle back. Each handle rides on a full-width layer moved by translate, and each fill
// grows by scaleX, so only transforms move
const sliders = [
  { at: 62, fill: 'tile-slider-fill-a', handle: 'tile-slider-handle-a' },
  { at: 35, fill: 'tile-slider-fill-b', handle: 'tile-slider-handle-b' },
] as const

const sliderMotion = css({
  '@keyframes tile-slider-fill-a': {
    '0%, 100%': { transform: 'scaleX(0.62)' },
    '30%': { transform: 'scaleX(0.22)' },
    '65%': { transform: 'scaleX(0.86)' },
  },
  '@keyframes tile-slider-handle-a': {
    '0%, 100%': { transform: 'translateX(62%)' },
    '30%': { transform: 'translateX(22%)' },
    '65%': { transform: 'translateX(86%)' },
  },
  '@keyframes tile-slider-fill-b': {
    '0%, 100%': { transform: 'scaleX(0.35)' },
    '40%': { transform: 'scaleX(0.74)' },
    '75%': { transform: 'scaleX(0.18)' },
  },
  '@keyframes tile-slider-handle-b': {
    '0%, 100%': { transform: 'translateX(35%)' },
    '40%': { transform: 'translateX(74%)' },
    '75%': { transform: 'translateX(18%)' },
  },
})

export function Slider() {
  return () => (
    <span
      mix={[
        sliderMotion,
        css({ ...surface, display: 'grid', gap: '10px', width: '9rem', padding: '0.75rem', borderRadius: '12px' }),
      ]}
    >
      {sliders.map(({ at, fill, handle }) => (
        <span key={at} mix={css({ position: 'relative', display: 'block', height: '4px', borderRadius: '2px', background: faint })}>
          <span
            style={{ transform: `scaleX(${at / 100})` }}
            mix={css({
              position: 'absolute',
              inset: 0,
              borderRadius: '2px',
              background: 'var(--pink-deep)',
              transformOrigin: 'left',
              ...playOnSeen({}, `${fill} 2.4s ease-in-out both`),
            })}
          />
          <span
            style={{ transform: `translateX(${at}%)` }}
            mix={css({ position: 'absolute', inset: 0, ...playOnSeen({}, `${handle} 2.4s ease-in-out both`) })}
          >
            <span
              mix={css({
                position: 'absolute',
                top: '-5px',
                left: 0,
                width: '14px',
                height: '14px',
                marginLeft: '-7px',
                borderRadius: '50%',
                background: 'var(--card-white)',
                boxShadow: `0 0 0 2px var(--pink-deep)`,
              })}
            />
          </span>
        </span>
      ))}
    </span>
  )
}

// a sheet of paper with a rough screen drawn on it in pen, a little askew, as a photo of a sketch lands on the board.
// Paper stays white and pen stays dark in every theme, so it uses the paper tokens, not the card ones. When the tile
// is seen, the sheet drops in and settles, then each pen line draws itself, the accent last. A line draws by its dash:
// pathLength 1 makes every path one unit long, so one dash and one offset fit them all, and the last keyframe drops the
// dash, so the drawing ends as it was
const paper = 'var(--paper)'
const pen = 'var(--paper-ink)'
const pencil = 'color-mix(in oklab, var(--paper-ink) 40%, var(--paper))'

const landStart = { opacity: 0, transform: 'translateY(-16px) rotate(-8deg) scale(1.08)' }
const penStart = { strokeDasharray: '1 2', strokeDashoffset: 1 }

const paperMotion = css({
  '@keyframes tile-paper-land': {
    '0%': landStart,
    '60%': { opacity: 1, transform: 'translateY(2px) rotate(1.5deg) scale(1)' },
    '90%, 100%': { opacity: 1, transform: 'none' },
  },
  '@keyframes tile-paper-pen': {
    '0%': penStart,
    '99%': { strokeDasharray: '1 2', strokeDashoffset: 0 },
    '100%': { strokeDasharray: 'none', strokeDashoffset: 0 },
  },
})

function drawn(delay: number, duration: number) {
  return css(playOnSeen(penStart, `tile-paper-pen ${duration}s ease-in-out ${delay}s both`))
}

export function PaperSketch() {
  return () => (
    <svg
      viewBox="0 0 120 84"
      width="120"
      height="84"
      mix={[
        paperMotion,
        css({
          overflow: 'visible',
          rotate: '-4deg',
          ...playOnSeen(landStart, 'tile-paper-land 0.7s cubic-bezier(0.25, 0.8, 0.35, 1) both'),
        }),
      ]}
    >
      <path d="M4 4 H104 L116 16 V80 H4 Z" fill={paper} stroke={pencil} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M104 4 V16 H116" fill="none" stroke={pencil} strokeWidth={1.5} strokeLinejoin="round" />
      <g fill="none" stroke={pen} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path
          pathLength={1}
          mix={drawn(0.55, 0.5)}
          d="M17 15 C32 13 46 16 61 14 C62 30 60 52 62 70 C46 72 31 69 16 71 C18 52 15 32 17 15 Z"
        />
        <path pathLength={1} mix={drawn(0.95, 0.3)} d="M23 26 C32 25 40 27 52 25" />
        <path pathLength={1} mix={drawn(1.15, 0.3)} d="M23 35 C30 34 36 36 44 34" />
        <path
          pathLength={1}
          mix={drawn(1.35, 0.4)}
          d="M24 49 C32 47 44 50 54 48 C55 53 54 57 55 61 C44 62 33 60 24 62 C25 57 23 53 24 49 Z"
        />
      </g>
      <path
        pathLength={1}
        mix={drawn(1.7, 0.35)}
        d="M72 30 C80 29 90 31 100 29 M72 40 C79 39 86 41 94 39"
        fill="none"
        stroke={pencil}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        pathLength={1}
        mix={drawn(1.85, 0.5)}
        d="M70 58 C78 52 86 66 96 56"
        fill="none"
        stroke="var(--pink-deep)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

// a code pane: the lines come in one after another, then the accent line, the one the last build changed, grows from the
// left and thickens for a moment, as if it were marked
const lineStart = { opacity: 0, transform: 'scaleX(0)' }

const codeMotion = css({
  '@keyframes tile-code-line': {
    '0%': lineStart,
    '30%': { opacity: 1 },
    '90%, 100%': { opacity: 1, transform: 'none' },
  },
  '@keyframes tile-code-mark': {
    '0%': lineStart,
    '15%': { opacity: 1 },
    '60%': { opacity: 1, transform: 'scale(1.06, 1.7)' },
    '92%, 100%': { opacity: 1, transform: 'none' },
  },
})

// the lines in the order they come in: the accent line is the third on the page and the last to arrive
const codeOrder = [
  { delay: 0, animation: 'tile-code-line 0.6s ease-out' },
  { delay: 0.2, animation: 'tile-code-line 0.6s ease-out' },
  { delay: 1, animation: 'tile-code-mark 1.2s ease-in-out' },
  { delay: 0.4, animation: 'tile-code-line 0.6s ease-out' },
] as const

export function CodeLines() {
  return () => (
    <span
      mix={[
        codeMotion,
        css({
          ...surface,
          display: 'grid',
          gap: '7px',
          width: '10rem',
          padding: '0.75rem',
          borderRadius: '12px',
          '& i': { display: 'block', height: '6px', borderRadius: '3px', background: faint },
          '& i:nth-child(2)': { width: '70%', marginLeft: '12%' },
          '& i:nth-child(3)': { width: '78%', marginLeft: '12%', background: 'var(--pink-deep)' },
          '& i:nth-child(4)': { width: '45%' },
        }),
      ]}
    >
      {codeOrder.map(({ delay, animation }, index) => (
        <i
          key={index}
          mix={css({ transformOrigin: 'left', ...playOnSeen(lineStart, `${animation} ${delay}s both`) })}
        />
      ))}
    </span>
  )
}

// the commits on a line. When the tile is seen, the line draws from the left and each dot pops in as the line reaches
// it, then the newest fills with the accent, with a small pop. The accent dot lies over a white one the size of the
// others, which it covers when it is still
const dotStart = { opacity: 0, transform: 'scale(0)' }
const commitXs = [12, 54, 96, 138]

const commitMotion = css({
  '@keyframes tile-commits-line': {
    '0%': penStart,
    '99%': { strokeDasharray: '1 2', strokeDashoffset: 0 },
    '100%': { strokeDasharray: 'none', strokeDashoffset: 0 },
  },
  '@keyframes tile-commits-dot': {
    '0%': dotStart,
    '55%': { opacity: 1, transform: 'scale(1.2)' },
    '90%, 100%': { opacity: 1, transform: 'none' },
  },
})

// a dot pops in around its own middle
function popped(animation: string) {
  return css({ transformBox: 'fill-box', transformOrigin: 'center', ...playOnSeen(dotStart, animation) })
}

export function Commits() {
  return () => (
    <svg viewBox="0 0 150 40" width="150" height="40" mix={[commitMotion, css({ overflow: 'visible' })]}>
      <path
        d="M12 20 H138"
        pathLength={1}
        mix={css(playOnSeen(penStart, 'tile-commits-line 1.3s linear 0.1s both'))}
        stroke={line}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity="0.5"
      />
      {commitXs.map((x, index) => (
        <circle
          key={x}
          cx={x}
          cy="20"
          r="8"
          mix={popped(`tile-commits-dot 0.4s ease-out ${0.1 + index * 0.43}s both`)}
          fill="var(--card-white)"
          stroke={line}
          strokeWidth={2.5}
        />
      ))}
      <circle
        cx="138"
        cy="20"
        r="9"
        mix={popped('tile-commits-dot 0.5s ease-out 1.75s both')}
        fill="var(--pink-deep)"
        stroke={line}
        strokeWidth={2.5}
      />
    </svg>
  )
}

// three captures of a prototype in a row, as they line up on the board, each tied to its commit by the tag under
// it; the newest is outlined, the one the preview shows until another is clicked. When the tile is seen, the captures
// come in from left to right, then the newest's outline turns accent and its tag lands
const captures = [
  { x: 1, rows: [18, 24] },
  { x: 53, rows: [26, 16] },
  { x: 105, rows: [30, 22] },
]

const captureStart = { opacity: 0, transform: 'translateY(8px)' }
const tagStart = { opacity: 0, transform: 'translateY(-8px) scale(0.6)' }
// the newest capture's accent outline is a second rect over the plain one, faded in, so only opacity moves
const outlineStart = { opacity: 0 }

const captureMotion = css({
  '@keyframes tile-captures-appear': {
    '0%': captureStart,
    '90%, 100%': { opacity: 1, transform: 'none' },
  },
  '@keyframes tile-captures-outline': {
    '0%': outlineStart,
    '100%': { opacity: 1 },
  },
  '@keyframes tile-captures-tag': {
    '0%': tagStart,
    '55%': { opacity: 1, transform: 'translateY(1px) scale(1.1)' },
    '90%, 100%': { opacity: 1, transform: 'none' },
  },
})

export function Captures() {
  return () => (
    <svg viewBox="0 0 150 46" width="150" height="46" mix={[captureMotion, css({ overflow: 'visible' })]}>
      {captures.map(({ x, rows }, index) => {
        let shown = index === captures.length - 1
        return (
          <g key={x} mix={css(playOnSeen(captureStart, `tile-captures-appear 0.6s ease-out ${index * 0.35}s both`))}>
            <rect
              x={x}
              y="1"
              width="44"
              height="32"
              rx="5"
              fill="var(--card-white)"
              stroke={line}
              strokeWidth={2}
            />
            {shown ? (
              <rect
                x={x}
                y="1"
                width="44"
                height="32"
                rx="5"
                fill="none"
                stroke="var(--pink-deep)"
                strokeWidth={3}
                mix={css(playOnSeen(outlineStart, 'tile-captures-outline 0.5s ease-in-out 1.4s both'))}
              />
            ) : null}
            <path d={`M${x} 9 H${x + 44}`} stroke={line} strokeWidth={1.5} opacity="0.5" />
            {rows.map((width, row) => (
              <rect key={row} x={x + 6} y={14 + row * 9} width={width} height="5" rx="2.5" fill={faint} />
            ))}
            <rect
              x={x + 8}
              y="39"
              width="28"
              height="5"
              rx="2.5"
              fill={shown ? 'var(--pink-deep)' : soft}
              mix={
                shown
                  ? css({
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      ...playOnSeen(tagStart, 'tile-captures-tag 0.6s ease-out 1.7s both'),
                    })
                  : []
              }
            />
          </g>
        )
      })}
    </svg>
  )
}
