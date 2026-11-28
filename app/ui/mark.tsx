import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { modeVariant } from './mode-variant.ts'
import type { Mode } from './themes.ts'
import { modes } from './themes.ts'

// On a dark page the berry's tint blurs into the ground, so dark mode shows only its lines, as the app's outline icon does.
const markSources = {
  light: '/images/mark.svg',
  dark: '/images/mark-outline.svg',
} as const satisfies Record<Mode, string>

export interface MarkProps {
  size: ReturnType<typeof css>
  lazy?: boolean
}

export function Mark(handle: Handle<MarkProps>) {
  return () => {
    let { size, lazy } = handle.props
    let loading: 'lazy' | undefined = lazy ? 'lazy' : undefined

    return (
      <>
        {modes.map((mode) => (
          <img
            key={mode}
            src={markSources[mode]}
            alt=""
            width={256}
            height={256}
            loading={loading}
            data-variant={mode}
            mix={[modeVariant, size]}
          />
        ))}
      </>
    )
  }
}
