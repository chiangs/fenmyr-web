import { css } from 'remix/component'

import { faint, line, playOnSeen, soft, surface } from './base.ts'

// From idea to prototype's drawings, and the phone From raw to ripe borrows

export function Phone() {
  return () => (
    <span
      mix={css({
        ...surface,
        display: 'grid',
        alignContent: 'start',
        gap: '5px',
        width: '3rem',
        height: '5rem',
        padding: '8px 6px',
        border: `2px solid ${soft}`,
        borderRadius: '12px',
        '& i': { display: 'block', height: '8px', borderRadius: '3px', background: 'var(--card-sky)' },
        '& i:nth-child(2)': { height: '22px', background: 'var(--card-butter)' },
      })}
    >
      <i />
      <i />
      <i />
    </span>
  )
}

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
// Paper stays white and pen stays dark in every theme, so it uses the paper tokens, not the card ones
const paper = 'var(--paper)'
const pen = 'var(--paper-ink)'
const pencil = 'color-mix(in oklab, var(--paper-ink) 40%, var(--paper))'

export function PaperSketch() {
  return () => (
    <svg viewBox="0 0 120 84" width="120" height="84" mix={css({ overflow: 'visible', rotate: '-4deg' })}>
      <path d="M4 4 H104 L116 16 V80 H4 Z" fill={paper} stroke={pencil} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M104 4 V16 H116" fill="none" stroke={pencil} strokeWidth={1.5} strokeLinejoin="round" />
      <g fill="none" stroke={pen} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 15 C32 13 46 16 61 14 C62 30 60 52 62 70 C46 72 31 69 16 71 C18 52 15 32 17 15 Z" />
        <path d="M23 26 C32 25 40 27 52 25" />
        <path d="M23 35 C30 34 36 36 44 34" />
        <path d="M24 49 C32 47 44 50 54 48 C55 53 54 57 55 61 C44 62 33 60 24 62 C25 57 23 53 24 49 Z" />
      </g>
      <path d="M72 30 C80 29 90 31 100 29 M72 40 C79 39 86 41 94 39" fill="none" stroke={pencil} strokeWidth={2} strokeLinecap="round" />
      <path d="M70 58 C78 52 86 66 96 56" fill="none" stroke="var(--pink-deep)" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  )
}

export function CodeLines() {
  return () => (
    <span
      mix={css({
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
      })}
    >
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}

export function Commits() {
  return () => (
    <svg viewBox="0 0 150 40" width="150" height="40" mix={css({ overflow: 'visible' })}>
      <path d="M12 20 H138" stroke={line} strokeWidth={2.5} strokeLinecap="round" opacity="0.5" />
      {[12, 54, 96].map((x) => (
        <circle key={x} cx={x} cy="20" r="8" fill="var(--card-white)" stroke={line} strokeWidth={2.5} />
      ))}
      <circle cx="138" cy="20" r="9" fill="var(--pink-deep)" stroke={line} strokeWidth={2.5} />
    </svg>
  )
}

// three captures of a prototype in a row, as they line up on the board, each tied to its commit by the tag under
// it; the newest is outlined, the one the preview shows until another is clicked
const captures = [
  { x: 1, rows: [18, 24] },
  { x: 53, rows: [26, 16] },
  { x: 105, rows: [30, 22] },
]

export function Captures() {
  return () => (
    <svg viewBox="0 0 150 46" width="150" height="46" mix={css({ overflow: 'visible' })}>
      {captures.map(({ x, rows }, index) => {
        let shown = index === captures.length - 1
        return (
          <g key={x}>
            <rect
              x={x}
              y="1"
              width="44"
              height="32"
              rx="5"
              fill="var(--card-white)"
              stroke={shown ? 'var(--pink-deep)' : line}
              strokeWidth={shown ? 3 : 2}
            />
            <path d={`M${x} 9 H${x + 44}`} stroke={line} strokeWidth={1.5} opacity="0.5" />
            {rows.map((width, row) => (
              <rect key={row} x={x + 6} y={14 + row * 9} width={width} height="5" rx="2.5" fill={faint} />
            ))}
            <rect x={x + 8} y="39" width="28" height="5" rx="2.5" fill={shown ? 'var(--pink-deep)' : soft} />
          </g>
        )
      })}
    </svg>
  )
}
