import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { packIcons } from '../pack-icons.ts'
import type { PackIcon } from '../pack-icons.ts'
import type { Tone } from '../tile.tsx'
import { faint, line, playOnSeen, surface } from './base.ts'

// The drawings of Ideas and the work around them, and the icons of Yours, on your computer

// the dated rows land one after another, rising a little as they fade in; the overdue row's red pill pops in just after
// its row, so the one that needs attention arrives last. Each row ends where the still drawing has it
const dueMotion = css({
  '@keyframes tile-due-row': {
    '0%': { opacity: 0, transform: 'translateY(8px)' },
    '100%': { opacity: 1, transform: 'none' },
  },
  '@keyframes tile-due-flag': {
    '0%': { opacity: 0, transform: 'scale(0.6)' },
    '60%': { opacity: 1, transform: 'scale(1.12)' },
    '100%': { opacity: 1, transform: 'none' },
  },
})

export function DueList(handle: Handle<{ labels: readonly string[] }>) {
  return () => (
    <span
      mix={[dueMotion, css({ ...surface, display: 'grid', gap: '6px', width: '11rem', padding: '0.625rem 0.75rem', borderRadius: '12px' })]}
    >
      {handle.props.labels.map((label, index) => (
        <span
          key={index}
          mix={css({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            ...playOnSeen(
              { opacity: 0, transform: 'translateY(8px)' },
              `tile-due-row 0.8s ease-out ${index * 0.55}s both`,
            ),
          })}
        >
          <span
            style={{ background: index === 0 ? 'var(--pink-deep)' : faint, color: index === 0 ? 'var(--on-accent)' : 'inherit' }}
            mix={css({
              padding: '0 0.4rem',
              borderRadius: '999px',
              lineHeight: 1.5,
              transformOrigin: 'left center',
              ...(index === 0 ? playOnSeen({ opacity: 0, transform: 'scale(0.6)' }, 'tile-due-flag 0.7s ease-out 0.4s both') : {}),
            })}
          >
            {label}
          </span>
          <span mix={css({ flex: 1, height: '5px', borderRadius: '3px', background: faint })} />
        </span>
      ))}
    </span>
  )
}

// a project and the folders inside it: the project lands first, then each folder slips out from its parent's indent,
// one after another, until the tree is as the still drawing has it
const foldersMotion = css({
  '@keyframes tile-folders-root': {
    '0%': { opacity: 0, transform: 'translateY(6px)' },
    '100%': { opacity: 1, transform: 'none' },
  },
  '@keyframes tile-folders-child': {
    '0%': { opacity: 0, transform: 'translate(-14px, -9px)' },
    '100%': { opacity: 1, transform: 'none' },
  },
})

export function Folders() {
  return () => (
    <span mix={[foldersMotion, css({ ...surface, display: 'grid', gap: '7px', width: '10rem', padding: '0.75rem', borderRadius: '12px' })]}>
      {[0, 1, 2, 1].map((depth, index) => (
        <span
          key={index}
          style={{ marginLeft: `${depth * 0.875}rem` }}
          mix={css({
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            ...(index === 0
              ? playOnSeen({ opacity: 0, transform: 'translateY(6px)' }, 'tile-folders-root 0.7s ease-out both')
              : playOnSeen(
                  { opacity: 0, transform: 'translate(-14px, -9px)' },
                  `tile-folders-child 0.8s ease-out ${0.5 + (index - 1) * 0.45}s both`,
                )),
          })}
        >
          <span
            style={{ background: depth === 0 ? 'var(--pink-deep)' : 'var(--card-sky)' }}
            mix={css({ width: '9px', height: '9px', borderRadius: '3px' })}
          />
          <span mix={css({ flex: 1, height: '5px', borderRadius: '3px', background: faint })} />
        </span>
      ))}
    </span>
  )
}

// the card in Done is picked up from the first column, as a butter card, and carried across to Done, turning mint as it
// lands. Three layers keep it to transforms and opacity: the outer one travels, the card lifts and drops on its own
// layer, and a butter layer over the mint card fades out. A column is 3rem wide with a 0.5rem gap, so Done is 7rem on
const columnsMotion = css({
  '@keyframes tile-columns-move': {
    '0%, 15%': { transform: 'translateX(-7rem)' },
    '85%, 100%': { transform: 'none' },
  },
  '@keyframes tile-columns-lift': {
    '0%, 100%': { transform: 'none' },
    '15%, 85%': { transform: 'translateY(-7px) scale(1.12)' },
  },
  '@keyframes tile-columns-butter': {
    '0%, 40%': { opacity: 1 },
    '80%, 100%': { opacity: 0 },
  },
})

function MovingCard() {
  return () => (
    <span mix={css(playOnSeen({ transform: 'translateX(-7rem)' }, 'tile-columns-move 2.2s ease-in-out both'))}>
      <span
        style={{ background: 'var(--card-mint)' }}
        mix={css({
          position: 'relative',
          display: 'block',
          height: '10px',
          borderRadius: '3px',
          ...playOnSeen({}, 'tile-columns-lift 2.2s ease-in-out both'),
        })}
      >
        <span
          mix={css({
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'var(--card-butter)',
            opacity: 0,
            ...playOnSeen({ opacity: 1 }, 'tile-columns-butter 2.2s ease-in-out both'),
          })}
        />
      </span>
    </span>
  )
}

export function Columns() {
  return () => (
    <span mix={[columnsMotion, css({ display: 'grid', gridTemplateColumns: 'repeat(3, 3rem)', gap: '0.5rem', alignItems: 'start' })]}>
      {[3, 2, 1].map((cards, column) => (
        <span key={column} mix={css({ ...surface, display: 'grid', gap: '4px', padding: '5px', borderRadius: '8px' })}>
          {column === 2 ? (
            <MovingCard />
          ) : (
            Array.from({ length: cards }, (_, index) => (
              <span key={index} style={{ background: 'var(--card-butter)' }} mix={css({ height: '10px', borderRadius: '3px' })} />
            ))
          )}
        </span>
      ))}
    </span>
  )
}

// the slash draws across the icon from its top left, the gap cut in the tile's colour just ahead of the line. pathLength
// makes the dash lengths relative to the whole path, so one keyframe fits both strokes; the dash pattern sits in the
// animation only, so the still drawing is a plain stroke
const slashMotion = css({
  '@keyframes tile-icon-slash': {
    '0%': { strokeDasharray: '1 2', strokeDashoffset: 1 },
    '100%': { strokeDasharray: '1 2', strokeDashoffset: 0 },
  },
})
const slashStart = { strokeDasharray: '1 2', strokeDashoffset: 1 }
const slashAnimation = 'tile-icon-slash 1.5s ease-in-out 0.3s both'

// one of the app's icons, large. off draws a slash through it, with a gap cut in the tile's own colour so the slash
// stands apart from the icon
export function Icon(handle: Handle<{ name: PackIcon; off?: Tone }>) {
  return () => {
    let { name, off } = handle.props
    return (
      <svg viewBox="0 0 256 256" width="56" height="56" fill="currentColor" mix={off ? slashMotion : undefined}>
        <path d={packIcons[name]} />
        {off ? (
          <>
            <path
              d="M40 40 L216 216"
              pathLength={1}
              stroke={`var(--card-${off})`}
              strokeWidth={44}
              strokeLinecap="round"
              mix={css(playOnSeen(slashStart, slashAnimation))}
            />
            <path
              d="M40 40 L216 216"
              pathLength={1}
              stroke={line}
              strokeWidth={16}
              strokeLinecap="round"
              mix={css(playOnSeen(slashStart, slashAnimation))}
            />
          </>
        ) : null}
      </svg>
    )
  }
}
