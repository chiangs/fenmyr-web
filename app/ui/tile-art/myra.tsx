import { css } from 'remix/component'

import { faint, line, soft, surface } from './base.ts'

// Myra shows her work's drawings; its key caps are in key-cap.tsx

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

// a doc Myra wrote from her searches, with a heading, its findings and one marked as the key one, and the
// magnifying glass of the search that filled it
export function ResearchDoc() {
  return () => (
    <span mix={css({ position: 'relative', display: 'inline-grid' })}>
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
        <b />
        <i />
        <i />
        <i />
      </span>
      <svg
        viewBox="0 0 28 28"
        width="30"
        height="30"
        mix={css({ position: 'absolute', top: '-12px', right: '-14px', overflow: 'visible' })}
      >
        <circle cx="12" cy="12" r="8" fill="var(--card-white)" stroke={line} strokeWidth={2.5} />
        <path d="M18 18 L25 25" stroke={line} strokeWidth={3} strokeLinecap="round" />
      </svg>
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
