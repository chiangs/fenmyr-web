import type { Handle } from 'remix/component'
import { css } from 'remix/component'

const faint = 'color-mix(in oklab, currentColor 22%, transparent)'
const soft = 'color-mix(in oklab, currentColor 45%, transparent)'

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

export function Pointer(handle: Handle<{ label: string }>) {
  return () => (
    <span mix={css({ position: 'relative', display: 'inline-grid' })}>
      <KeyCap label={handle.props.label} />
      <svg
        viewBox="0 0 16 20"
        width="18"
        height="22"
        mix={css({ position: 'absolute', right: '-12px', bottom: '-16px', fill: 'var(--card-white)', stroke: 'currentColor', strokeWidth: 1.5 })}
      >
        <path d="M2 2 L2 16 L6 12.5 L9 18 L11.5 17 L8.5 11.5 L13.5 11.5 Z" strokeLinejoin="round" />
      </svg>
    </span>
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
      <path d="M12 20 H138" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" opacity="0.5" />
      {[12, 54, 96].map((x) => (
        <circle key={x} cx={x} cy="20" r="8" fill="var(--card-white)" stroke="currentColor" strokeWidth={2.5} />
      ))}
      <circle cx="138" cy="20" r="9" fill="var(--pink-deep)" stroke="currentColor" strokeWidth={2.5} />
    </svg>
  )
}

export function DashedPlan() {
  return () => (
    <svg viewBox="0 0 150 64" width="150" height="64" fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="6 5">
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
      <span mix={css({ fontFamily: 'var(--hand)', fontSize: '3rem', lineHeight: 1 })}>{handle.props.label}</span>
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
