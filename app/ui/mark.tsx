import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { modeVariant } from './mode-variant.ts'
import type { Mode } from './themes.ts'
import { modes } from './themes.ts'

// On a dark page the berry's tint blurs into the ground, so the site shows only its lines there. The app keeps the tint in
// every mode. Both are lazy, so the hidden one is never fetched; the theme picker loads the other ahead of a switch.
const markSources = {
  light: '/images/mark.svg',
  dark: '/images/mark-outline.svg',
} as const satisfies Record<Mode, string>

export interface MarkProps {
  size: ReturnType<typeof css>
}

export function Mark(handle: Handle<MarkProps>) {
  return () => {
    let { size } = handle.props

    return (
      <>
        {modes.map((mode) => (
          <img
            key={mode}
            src={markSources[mode]}
            alt=""
            width={256}
            height={256}
            loading="lazy"
            data-variant={mode}
            mix={[modeVariant, size]}
          />
        ))}
      </>
    )
  }
}
