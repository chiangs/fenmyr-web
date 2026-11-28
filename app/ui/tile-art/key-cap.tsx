import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { faint, surface } from './base.ts'

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
