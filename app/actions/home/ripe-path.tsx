import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import type { RipeCopy, RipeStep } from '../../content/content.ts'
import { cardStyle } from '../../ui/card.ts'
import { Myra } from '../../ui/public/myra.tsx'
import { KeyCap, Phone } from '../../ui/tile-art.tsx'

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

function Notes() {
  return () => (
    <span mix={css({ position: 'relative', width: '8rem', height: '4.5rem' })}>
      {[
        ['0', '0.5rem', '-6deg', 'var(--card-butter)'],
        ['1.75rem', '1.75rem', '4deg', 'var(--card-butter)'],
        ['4.5rem', '0.75rem', '-3deg', 'var(--card-mint)'],
      ].map(([left, top, turn, colour]) => (
        <span
          key={left}
          style={{ left, top, rotate: turn, background: colour }}
          mix={[surface, css({ position: 'absolute', width: '3rem', height: '2.5rem', borderRadius: '6px' })]}
        />
      ))}
    </span>
  )
}

function Preview(handle: Handle<{ label: string }>) {
  return () => (
    <span
      mix={[
        surface,
        css({
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
            padding: '0.2rem 0.6rem',
            borderRadius: '8px',
            background: 'var(--pink-deep)',
            color: 'var(--on-accent)',
            fontSize: '0.75rem',
            fontWeight: 700,
          })}
        >
          {handle.props.label}
        </span>
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
      catch: <KeyCap label={copy.labels.capture} />,
      sort: <Notes />,
      shape: <Phone />,
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
