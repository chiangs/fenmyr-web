import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import type { RipeCopy, RipeStep } from '../../content/content.ts'
import { cardStyle } from '../../ui/card.ts'
import { Myra } from '../../ui/public/myra.tsx'
import { faint, playOnSeen } from '../../ui/tile-art/base.ts'
import { KeyCap } from '../../ui/tile-art/key-cap.tsx'
import { Phone } from '../../ui/tile-art/phone.tsx'

// a cloudberry ripens from hard and red to soft gold, in Myra's own colours. Catch is the raw idea, so its berry
// stays red and only grows.
const berries: Record<RipeStep, string> = {
  catch: 'var(--myra-heart)',
  sort: 'color-mix(in oklab, var(--myra-heart), var(--myra-body))',
  shape: 'var(--myra-body)',
  try: 'var(--myra-soft-shine)',
}

// on one row the steps share a view timeline, so each berry ripens a little after the one before it
const ranges: Record<RipeStep, string> = {
  catch: 'entry 60% cover 35%',
  sort: 'cover 25% cover 40%',
  shape: 'cover 30% cover 45%',
  try: 'cover 35% cover 50%',
}

const tones: Record<RipeStep, string> = {
  catch: 'var(--card-pink)',
  sort: 'var(--card-peach)',
  shape: 'var(--card-sky)',
  try: 'var(--card-butter)',
}

const surface = css({
  background: 'var(--card-white)',
  boxShadow: '0 4px 12px rgba(var(--sh), calc(.14 * var(--sh-k)))',
})

// The drawings play as the feature tiles do: each drawing's box is marked as a tile, so app/ui/public/tile-motion.tsx
// plays it when it scrolls into view and again every 10 s. The mark sits on the drawing, not the whole step, because the
// berry's scroll-driven animation in the step's heading would otherwise count as the drawing still playing. Every part
// that moves is invisible or in its place in the still.

// Catch: after the key presses, a small thought pops out from behind it and drops away, as if landing in Unsorted
const thoughtRest = 'translateY(0) rotate(0deg) scale(0.7)'
const thoughtMotion = css({
  '@keyframes tile-catch-thought': {
    '0%': { opacity: 0, transform: thoughtRest, animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
    '20%': { opacity: 1, transform: 'translateY(-1.95rem) rotate(-8deg) scale(1)' },
    '44%': {
      opacity: 1,
      transform: 'translateY(-1.95rem) rotate(-8deg) scale(1)',
      animationTimingFunction: 'ease-in',
    },
    '70%': { opacity: 1, transform: 'translateY(2.4rem) rotate(6deg) scale(0.95)' },
    '88%': { opacity: 0, transform: 'translateY(2.75rem) rotate(8deg) scale(0.9)' },
    '100%': { opacity: 0, transform: thoughtRest },
  },
})

function Capture(handle: Handle<{ label: string }>) {
  return () => (
    <span mix={css({ position: 'relative', isolation: 'isolate', display: 'grid' })}>
      <span
        mix={[
          thoughtMotion,
          surface,
          css({
            position: 'absolute',
            zIndex: -1,
            top: 'calc(50% - 0.75rem)',
            left: 'calc(50% - 1.125rem)',
            display: 'grid',
            alignContent: 'center',
            gap: '4px',
            width: '2.25rem',
            height: '1.5rem',
            paddingInline: '7px',
            border: '1px solid color-mix(in oklab, var(--card-butter-ink) 18%, transparent)',
            borderRadius: '6px',
            background: 'var(--card-butter)',
            opacity: 0,
            transform: thoughtRest,
            ...playOnSeen(
              { opacity: 0, transform: thoughtRest },
              'tile-catch-thought 1.9s ease-in-out 0.55s both',
            ),
            '& i': { display: 'block', height: '3px', borderRadius: '2px', background: faint },
            '& i:last-child': { width: '60%' },
          }),
        ]}
      >
        <i />
        <i />
      </span>
      <KeyCap label={handle.props.label} />
    </span>
  )
}

// Sort: the scattered notes line up in a straight row, as /tidy does, hold a moment, then drift back to where they lie
// in the still drawing. Each note has its own turn and its own way into the row, so each has its own keyframes
const pile = [
  { left: '0', top: '0.5rem', turn: '-6deg', colour: 'var(--card-butter)', frames: 'tile-sort-a' },
  { left: '1.75rem', top: '1.75rem', turn: '4deg', colour: 'var(--card-butter)', frames: 'tile-sort-b' },
  { left: '4.5rem', top: '0.75rem', turn: '-3deg', colour: 'var(--card-mint)', frames: 'tile-sort-c' },
]
const lying = (turn: string) => `translate(0, 0) rotate(${turn}) scale(1)`
const tidy = (turn: string, dx: string, dy: string) => ({
  '0%, 6%': { transform: lying(turn) },
  '36%, 62%': { transform: `translate(${dx}, ${dy}) rotate(0deg) scale(0.9)` },
  '92%, 100%': { transform: lying(turn) },
})
const tidyMotion = css({
  '@keyframes tile-sort-a': tidy('-6deg', '-0.5rem', '0.5rem'),
  '@keyframes tile-sort-b': tidy('4deg', '0.75rem', '-0.75rem'),
  '@keyframes tile-sort-c': tidy('-3deg', '1rem', '0.25rem'),
})

function Notes() {
  return () => (
    <span mix={[tidyMotion, css({ position: 'relative', width: '8rem', height: '4.5rem' })]}>
      {pile.map((note, index) => (
        <span
          key={note.left}
          style={{ left: note.left, top: note.top, background: note.colour }}
          mix={[
            surface,
            css({
              position: 'absolute',
              width: '3rem',
              height: '2.5rem',
              borderRadius: '6px',
              transform: `rotate(${note.turn})`,
              ...playOnSeen({ transform: lying(note.turn) }, `${note.frames} 2.2s ease-in-out ${index * 0.1}s both`),
            }),
          ]}
        />
      ))}
    </span>
  )
}

// Try: a pointer glides in and clicks Sign up. The button presses and a ring shows for a moment, then the pointer
// leaves. The pointer waits outside the window, invisible, in the still drawing
const pointerRest = 'translate(7rem, 4.6rem) scale(1)'
const pointerAt = 'translate(3.95rem, 2.8rem)'
const tryMotion = css({
  '@keyframes tile-try-pointer': {
    '0%': { opacity: 0, transform: pointerRest },
    '12%': { opacity: 1, transform: 'translate(6.2rem, 4.2rem) scale(1)' },
    '42%': { opacity: 1, transform: `${pointerAt} scale(1)` },
    '47%': { opacity: 1, transform: 'translate(3.95rem, 2.9rem) scale(0.88)' },
    '53%': { opacity: 1, transform: `${pointerAt} scale(1)` },
    '72%': { opacity: 1, transform: `${pointerAt} scale(1)` },
    '92%, 100%': { opacity: 0, transform: pointerRest },
  },
  '@keyframes tile-try-press': {
    '0%, 44%': { transform: 'none' },
    '50%': { transform: 'scale(0.94)' },
    '58%, 100%': { transform: 'none' },
  },
  '@keyframes tile-try-ring': {
    '0%, 46%': { opacity: 0, transform: 'scale(0.92)' },
    '54%': { opacity: 1, transform: 'scale(1)' },
    '78%': { opacity: 0, transform: 'scale(1.25)' },
    '100%': { opacity: 0, transform: 'none' },
  },
})

function Preview(handle: Handle<{ label: string }>) {
  return () => (
    <span
      mix={[
        tryMotion,
        surface,
        css({
          position: 'relative',
          display: 'grid',
          gridTemplateRows: '0.625rem 1fr',
          width: '7.5rem',
          height: '4.75rem',
          overflow: 'hidden',
          borderRadius: '10px',
          color: 'var(--card-white-ink)',
        }),
      ]}
    >
      <span mix={css({ background: 'color-mix(in oklab, var(--card-white-ink) 18%, var(--card-white))' })} />
      <span mix={css({ display: 'grid', placeItems: 'center' })}>
        <span
          mix={css({
            position: 'relative',
            padding: '0.2rem 0.6rem',
            borderRadius: '8px',
            background: 'var(--pink-deep)',
            color: 'var(--on-accent)',
            fontSize: '0.75rem',
            fontWeight: 700,
            ...playOnSeen({ transform: 'none' }, 'tile-try-press 2.4s ease-in-out both'),
          })}
        >
          {handle.props.label}
          <span
            mix={css({
              position: 'absolute',
              inset: '-4px',
              border: '2px solid color-mix(in oklab, var(--pink-deep) 85%, transparent)',
              borderRadius: '12px',
              opacity: 0,
              ...playOnSeen({ opacity: 0, transform: 'scale(0.92)' }, 'tile-try-ring 2.4s ease-out both'),
            })}
          />
        </span>
      </span>
      <span
        mix={css({
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          transform: pointerRest,
          ...playOnSeen({ opacity: 0, transform: pointerRest }, 'tile-try-pointer 2.4s ease-in-out both'),
          '& svg': { display: 'block', width: '0.875rem', height: '0.875rem' },
          '& path': { fill: 'var(--card-white-ink)', stroke: 'var(--card-white)', strokeWidth: 1, strokeLinejoin: 'round' },
        })}
      >
        <svg viewBox="0 0 16 16" focusable="false">
          <path d="M2 1.5V13l3.2-3 2.3 5 2-1-2.3-4.8H12z" />
        </svg>
      </span>
    </span>
  )
}

const order: readonly RipeStep[] = ['catch', 'sort', 'shape', 'try']

const stepStyle = css({
  position: 'relative',
  display: 'grid',
  alignContent: 'start',
  gap: '0.75rem',
  padding: '0.875rem 0.875rem 1.25rem',
  color: 'var(--card-white-soft)',
  '& p': { paddingInline: '0.375rem', fontSize: '0.96875rem', lineHeight: 1.5 },
  '& strong, & code': { color: 'var(--card-white-ink)' },
  '& strong': { fontWeight: 800 },
  // the dashed connector to the next step: across on wide screens, down on narrow ones
  '&:not(:last-child)::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    right: '-1rem',
    width: '1rem',
    borderTop: '2px dashed var(--pink-deep)',
  },
  '@media (max-width: 52rem)': {
    '&:not(:last-child)::after': {
      top: 'auto',
      right: 'auto',
      bottom: '-1rem',
      left: '2.25rem',
      width: 0,
      height: '1rem',
      borderTop: 0,
      borderLeft: '2px dashed var(--pink-deep)',
    },
  },
})

const wide = '@media (prefers-reduced-motion: no-preference) and (min-width: 52.0625rem)'

const rangeStyles: Record<RipeStep, ReturnType<typeof css>> = {
  catch: css({ [wide]: { animationTimeline: '--ripe', animationRange: ranges.catch } }),
  sort: css({ [wide]: { animationTimeline: '--ripe', animationRange: ranges.sort } }),
  shape: css({ [wide]: { animationTimeline: '--ripe', animationRange: ranges.shape } }),
  try: css({ [wide]: { animationTimeline: '--ripe', animationRange: ranges.try } }),
}

const berryStyle = css({
  width: '1.125rem',
  height: '1.125rem',
  borderRadius: '50%',
  boxShadow: 'inset -3px -3px 0 rgba(var(--sh), calc(.18 * var(--sh-k)))',
  // with scroll-driven animations each berry ripens from red as its step comes into view
  '@supports (animation-timeline: view())': {
    '@media (prefers-reduced-motion: no-preference)': {
      animation: 'berry-ripen linear both',
      animationTimeline: 'view()',
      animationRange: 'entry 40% cover 45%',
    },
  },
  '@keyframes berry-ripen': {
    from: { background: 'var(--myra-heart)', scale: '0.7' },
  },
})

export function RipePath(handle: Handle<{ copy: RipeCopy }>) {
  return () => {
    let { copy } = handle.props
    let art: Record<RipeStep, RemixNode> = {
      catch: <Capture label={copy.labels.capture} />,
      sort: <Notes />,
      shape: <Phone motion="sketch" />,
      try: <Preview label={copy.labels.preview} />,
    }

    return (
      <div mix={css({ display: 'grid', gap: '1.75rem' })}>
        <div mix={css({ display: 'flex', alignItems: 'center', gap: '0.75rem' })}>
          <Myra pose="hello" label={copy.myraAlt} size="4.25rem" lazy />
          <p
            mix={css({
              padding: '0.625rem 1rem',
              borderRadius: '20px 20px 20px 6px',
              background: 'var(--card-butter)',
              color: 'var(--card-butter-ink)',
              fontFamily: 'var(--hand)',
              fontSize: '1.0625rem',
              lineHeight: 1.4,
              boxShadow: '0 8px 24px rgba(var(--sh), calc(.14 * var(--sh-k)))',
            })}
          >
            {copy.bubble}
          </p>
        </div>
        <ol
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '1rem',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            viewTimelineName: '--ripe',
            '@media (max-width: 52rem)': { gridTemplateColumns: 'minmax(0, 1fr)' },
          })}
        >
          {order.map((step) => (
            <li key={step} data-step={step} mix={[cardStyle, stepStyle]}>
              <h3
                mix={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  paddingInline: '0.375rem',
                  fontFamily: 'var(--hand)',
                  fontSize: '1.375rem',
                  fontWeight: 500,
                  letterSpacing: 0,
                  color: 'var(--card-white-ink)',
                })}
              >
                <span aria-hidden="true" style={{ background: berries[step] }} mix={[berryStyle, rangeStyles[step]]} />
                {copy.steps[step].name}
              </h3>
              <div
                aria-hidden="true"
                data-tile={step}
                data-rmx-preserve-attrs="data-seen"
                style={{ background: tones[step] }}
                mix={css({
                  display: 'grid',
                  placeItems: 'center',
                  height: '6.5rem',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  cornerShape: 'squircle',
                  color: 'var(--card-butter-ink)',
                })}
              >
                {art[step]}
              </div>
              <p>{copy.steps[step].body}</p>
            </li>
          ))}
        </ol>
      </div>
    )
  }
}
