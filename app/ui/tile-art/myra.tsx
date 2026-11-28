import { css } from 'remix/component'

import { faint, line, playOnSeen, soft, surface } from './base.ts'
import type { Style } from './base.ts'

// Myra shows her work's drawings; its key caps are in key-cap.tsx

// the plan Myra asks about first: two boxes joined by an arrow. When the tile is seen, the outlines draw themselves,
// the left one and then the right, and the arrow follows. A mask of the same boxes draws in by stroke-dashoffset and
// the dashes stay as they are underneath, so only how much of them shows moves
const planMotion = css({
  '@keyframes tile-dashed-plan-draw': { from: { strokeDashoffset: 1 }, to: { strokeDashoffset: 0 } },
  '@keyframes tile-dashed-plan-arrow': {
    from: { opacity: 0, transform: 'translateX(-8px)' },
    to: { opacity: 1, transform: 'none' },
  },
})

const reveal = (delay: number) =>
  css(playOnSeen({ strokeDashoffset: 1 }, `tile-dashed-plan-draw 0.9s ease-in-out ${delay}s both`))
const revealLeft = reveal(0.1)
const revealRight = reveal(0.45)
const arrowIn = css(playOnSeen({ opacity: 0, transform: 'translateX(-8px)' }, 'tile-dashed-plan-arrow 0.6s ease-out 1.2s both'))

export function DashedPlan() {
  return () => (
    <svg
      viewBox="0 0 150 64"
      width="150"
      height="64"
      fill="none"
      stroke={line}
      strokeWidth={2}
      strokeDasharray="6 5"
      mix={planMotion}
    >
      <mask id="tile-dashed-plan-reveal" mix={css({ maskType: 'alpha' })}>
        <rect mix={revealLeft} x="4" y="6" width="56" height="52" rx="10" pathLength={1} strokeWidth={8} strokeDasharray={1} />
        <rect mix={revealRight} x="90" y="6" width="56" height="52" rx="10" pathLength={1} strokeWidth={8} strokeDasharray={1} />
      </mask>
      <g mask="url(#tile-dashed-plan-reveal)">
        <rect x="4" y="6" width="56" height="52" rx="10" />
        <rect x="90" y="6" width="56" height="52" rx="10" />
      </g>
      <g mix={arrowIn}>
        <path d="M62 32 H86" strokeDasharray="4 4" />
        <path d="M80 26 L87 32 L80 38" strokeDasharray="none" />
      </g>
    </svg>
  )
}

// a doc Myra wrote from her searches, with a heading, its findings and one marked as the key one, and the
// magnifying glass of the search that filled it. When the tile is seen, the lines fill in from the left, the key
// finding last, while the glass glides down the doc ahead of them, comes to rest on the key one, and goes home. Over
// the doc the glass is drawn in the doc's own ink, since its usual ink is the tile's and can vanish on a dark doc: the
// two drawings of it trade opacity, the usual one visible at home
const researchMotion = css({
  '@keyframes tile-research-doc-fill': { from: { transform: 'scaleX(0)' }, to: { transform: 'none' } },
  '@keyframes tile-research-doc-glass': {
    '0%, 100%': { transform: 'none' },
    '14%': { transform: 'translate(-52px, 15px)' },
    '34%': { transform: 'translate(1px, 29px)' },
    '54%': { transform: 'translate(-45px, 55px)' },
    '76%': { transform: 'translate(-22px, 42px)' },
  },
  '@keyframes tile-research-doc-glass-home': {
    '0%, 100%': { opacity: 1 },
    '8%, 92%': { opacity: 0 },
  },
  '@keyframes tile-research-doc-glass-over': {
    '0%, 100%': { opacity: 0 },
    '8%, 92%': { opacity: 1 },
  },
})

const fill = (delay: number, seconds: number) =>
  css({
    transformOrigin: 'left',
    ...playOnSeen({ transform: 'scaleX(0)' }, `tile-research-doc-fill ${seconds}s ease-out ${delay}s both`),
  })
const fillHeading = fill(0.15, 0.45)
const fillFirst = fill(0.6, 0.45)
const fillThird = fill(1.05, 0.45)
const fillKey = fill(1.5, 0.6)
const glassHome = css(playOnSeen({}, 'tile-research-doc-glass-home 2.4s ease-in-out both'))
const glassOver = css(playOnSeen({}, 'tile-research-doc-glass-over 2.4s ease-in-out both'))

export function ResearchDoc() {
  return () => (
    <span mix={[researchMotion, css({ position: 'relative', display: 'inline-grid' })]}>
      <span
        mix={css({
          ...surface,
          display: 'grid',
          gap: '7px',
          width: '9.5rem',
          padding: '0.75rem',
          borderRadius: '12px',
          '& b': { display: 'block', width: '58%', height: '8px', borderRadius: '4px', background: soft },
          '& i': { display: 'block', height: '6px', borderRadius: '3px', background: faint },
          '& i:nth-of-type(2)': { width: '82%', background: 'var(--pink-deep)' },
          '& i:nth-of-type(3)': { width: '64%' },
        })}
      >
        <b mix={fillHeading} />
        <i mix={fillFirst} />
        <i mix={fillKey} />
        <i mix={fillThird} />
      </span>
      <svg
        viewBox="0 0 28 28"
        width="30"
        height="30"
        mix={css({
          position: 'absolute',
          top: '-12px',
          right: '-14px',
          overflow: 'visible',
          ...playOnSeen({}, 'tile-research-doc-glass 2.4s ease-in-out both'),
        })}
      >
        <g mix={glassHome}>
          <circle cx="12" cy="12" r="8" fill="var(--card-white)" stroke={line} strokeWidth={2.5} />
          <path d="M18 18 L25 25" stroke={line} strokeWidth={3} strokeLinecap="round" />
        </g>
        <g opacity="0" mix={glassOver}>
          <circle cx="12" cy="12" r="8" fill="var(--card-white)" stroke="var(--card-white-ink)" strokeWidth={2.5} />
          <path d="M18 18 L25 25" stroke="var(--card-white-ink)" strokeWidth={3} strokeLinecap="round" />
        </g>
      </svg>
    </span>
  )
}

// three switches, as the app's settings list them. When the tile is seen they flip one after another, to the other
// way and back. A knob rides on translate and the colour of the track is two layers, one faint and one in the accent,
// that trade opacity, so only transforms and opacity move
const knobTravel = 'translateX(calc(1rem - 4px))'

const switchMotion = css({
  '@keyframes tile-switches-knob-on': {
    '0%, 100%': { transform: knobTravel },
    '30%, 65%': { transform: 'none' },
  },
  '@keyframes tile-switches-knob-off': {
    '0%, 100%': { transform: 'none' },
    '30%, 65%': { transform: knobTravel },
  },
  '@keyframes tile-switches-fill-on': {
    '0%, 100%': { opacity: 1 },
    '30%, 65%': { opacity: 0 },
  },
  '@keyframes tile-switches-fill-off': {
    '0%, 100%': { opacity: 0 },
    '30%, 65%': { opacity: 1 },
  },
})

const flip = (name: string, index: number) => `${name} 1.1s ease-in-out ${index * 0.45}s both`

const trackLayer: Style = { position: 'absolute', inset: 0, borderRadius: 'inherit' }

export function Switches() {
  return () => (
    <span
      mix={[
        switchMotion,
        css({ ...surface, display: 'grid', gap: '8px', padding: '0.75rem 0.875rem', borderRadius: '12px' }),
      ]}
    >
      {[true, false, true].map((on, index) => (
        <span key={index} mix={css({ display: 'flex', alignItems: 'center', gap: '0.75rem' })}>
          <span mix={css({ display: 'block', width: '4.5rem', height: '6px', borderRadius: '3px', background: faint })} />
          <span mix={css({ position: 'relative', width: '1.875rem', height: '1.125rem', borderRadius: '999px' })}>
            <span
              style={{ opacity: on ? 0 : 1 }}
              mix={css({
                ...trackLayer,
                background: faint,
                ...(on ? playOnSeen({}, flip('tile-switches-fill-off', index)) : {}),
              })}
            />
            <span
              style={{ opacity: on ? 1 : 0 }}
              mix={css({
                ...trackLayer,
                background: 'var(--pink-deep)',
                ...playOnSeen({}, flip(on ? 'tile-switches-fill-on' : 'tile-switches-fill-off', index)),
              })}
            />
            <span
              style={{ transform: on ? knobTravel : 'none' }}
              mix={css({
                position: 'absolute',
                top: '2px',
                left: '2px',
                width: '0.875rem',
                height: '0.875rem',
                borderRadius: '50%',
                background: 'var(--card-white)',
                ...playOnSeen({}, flip(on ? 'tile-switches-knob-on' : 'tile-switches-knob-off', index)),
              })}
            />
          </span>
        </span>
      ))}
    </span>
  )
}
