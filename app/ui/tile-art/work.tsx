import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { packIcons } from '../pack-icons.ts'
import type { PackIcon } from '../pack-icons.ts'
import type { Tone } from '../tile.tsx'
import { faint, line, surface } from './base.ts'

// The drawings of Ideas and the work around them, and the icons of Yours, on your computer

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
