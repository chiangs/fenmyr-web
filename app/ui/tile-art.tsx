import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { packIcons } from './pack-icons.ts'
import type { PackIcon } from './pack-icons.ts'
import type { Tone } from './tile.tsx'

const faint = 'color-mix(in oklab, var(--card-white-ink) 22%, transparent)'
const soft = 'color-mix(in oklab, var(--card-white-ink) 45%, transparent)'
const line = 'var(--card-butter-ink)'

const surface = {
  background: 'var(--card-white)',
  color: 'var(--card-white-ink)',
  boxShadow: '0 4px 12px rgba(var(--sh), calc(.14 * var(--sh-k)))',
}

export function KeyCap(handle: Handle<{ label: string }>) {
  return () => (
    <span
      mix={css({
        ...surface,
        padding: '0.3rem 0.75rem',
        border: `1px solid ${faint}`,
        borderBottomWidth: '3px',
        borderRadius: '10px',
        fontSize: '0.9375rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      })}
    >
      {handle.props.label}
    </span>
  )
}

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

export function Slider() {
  return () => (
    <span mix={css({ ...surface, display: 'grid', gap: '10px', width: '9rem', padding: '0.75rem', borderRadius: '12px' })}>
      {[62, 35].map((at) => (
        <span key={at} mix={css({ position: 'relative', display: 'block', height: '4px', borderRadius: '2px', background: faint })}>
          <span
            style={{ width: `${at}%` }}
            mix={css({ position: 'absolute', insetBlock: 0, left: 0, borderRadius: '2px', background: 'var(--pink-deep)' })}
          />
          <span
            style={{ left: `${at}%` }}
            mix={css({
              position: 'absolute',
              top: '-5px',
              width: '14px',
              height: '14px',
              marginLeft: '-7px',
              borderRadius: '50%',
              background: 'var(--card-white)',
              boxShadow: `0 0 0 2px var(--pink-deep)`,
            })}
          />
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

export function DashedPlan() {
  return () => (
    <svg viewBox="0 0 150 64" width="150" height="64" fill="none" stroke={line} strokeWidth={2} strokeDasharray="6 5">
      <rect x="4" y="6" width="56" height="52" rx="10" />
      <rect x="90" y="6" width="56" height="52" rx="10" />
      <path d="M62 32 H86" strokeDasharray="4 4" />
      <path d="M80 26 L87 32 L80 38" strokeDasharray="none" />
    </svg>
  )
}

export function Specimen(handle: Handle<{ label: string }>) {
  return () => (
    <span mix={css({ display: 'flex', alignItems: 'baseline', gap: '0.75rem' })}>
      <span mix={css({ fontFamily: 'var(--hand)', fontSize: '3rem', fontWeight: 500, lineHeight: 1 })}>{handle.props.label}</span>
      <span mix={css({ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em' })}>
        {handle.props.label}
      </span>
    </span>
  )
}

export function Switches() {
  return () => (
    <span mix={css({ ...surface, display: 'grid', gap: '8px', padding: '0.75rem 0.875rem', borderRadius: '12px' })}>
      {[true, false, true].map((on, index) => (
        <span key={index} mix={css({ display: 'flex', alignItems: 'center', gap: '0.75rem' })}>
          <span mix={css({ display: 'block', width: '4.5rem', height: '6px', borderRadius: '3px', background: faint })} />
          <span
            style={{ justifyContent: on ? 'flex-end' : 'flex-start', background: on ? 'var(--pink-deep)' : faint }}
            mix={css({ display: 'flex', width: '1.875rem', height: '1.125rem', padding: '2px', borderRadius: '999px' })}
          >
            <span mix={css({ width: '0.875rem', height: '0.875rem', borderRadius: '50%', background: 'var(--card-white)' })} />
          </span>
        </span>
      ))}
    </span>
  )
}

export function DueList(handle: Handle<{ labels: readonly string[] }>) {
  return () => (
    <span mix={css({ ...surface, display: 'grid', gap: '6px', width: '11rem', padding: '0.625rem 0.75rem', borderRadius: '12px' })}>
      {handle.props.labels.map((label, index) => (
        <span key={index} mix={css({ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 })}>
          <span
            style={{ background: index === 0 ? 'var(--pink-deep)' : faint, color: index === 0 ? 'var(--on-accent)' : 'inherit' }}
            mix={css({ padding: '0 0.4rem', borderRadius: '999px', lineHeight: 1.5 })}
          >
            {label}
          </span>
          <span mix={css({ flex: 1, height: '5px', borderRadius: '3px', background: faint })} />
        </span>
      ))}
    </span>
  )
}

export function Folders() {
  return () => (
    <span mix={css({ ...surface, display: 'grid', gap: '7px', width: '10rem', padding: '0.75rem', borderRadius: '12px' })}>
      {[0, 1, 2, 1].map((depth, index) => (
        <span key={index} style={{ marginLeft: `${depth * 0.875}rem` }} mix={css({ display: 'flex', alignItems: 'center', gap: '0.4rem' })}>
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

export function Columns() {
  return () => (
    <span mix={css({ display: 'grid', gridTemplateColumns: 'repeat(3, 3rem)', gap: '0.5rem', alignItems: 'start' })}>
      {[3, 2, 1].map((cards, column) => (
        <span key={column} mix={css({ ...surface, display: 'grid', gap: '4px', padding: '5px', borderRadius: '8px' })}>
          {Array.from({ length: cards }, (_, index) => (
            <span
              key={index}
              style={{ background: column === 2 ? 'var(--card-mint)' : 'var(--card-butter)' }}
              mix={css({ height: '10px', borderRadius: '3px' })}
            />
          ))}
        </span>
      ))}
    </span>
  )
}

// one of the app's icons, large. off draws a slash through it, with a gap cut in the tile's own colour so the slash
// stands apart from the icon
export function Icon(handle: Handle<{ name: PackIcon; off?: Tone }>) {
  return () => {
    let { name, off } = handle.props
    return (
      <svg viewBox="0 0 256 256" width="56" height="56" fill="currentColor">
        <path d={packIcons[name]} />
        {off ? (
          <>
            <path d="M40 40 L216 216" stroke={`var(--card-${off})`} strokeWidth={44} strokeLinecap="round" />
            <path d="M40 40 L216 216" stroke={line} strokeWidth={16} strokeLinecap="round" />
          </>
        ) : null}
      </svg>
    )
  }
}
