import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { faint, playOnSeen, surface } from './base.ts'

// A key cap presses each time its tile plays: it dips and gives a little, then comes back up. Where two sit side
// by side, the second presses just after the first. KeyCap also appears outside any tile, as in From raw to ripe, and
// there nothing plays it, since playOnSeen only acts inside a tile.
const pressMotion = css({
  '@keyframes tile-key-cap-press': {
    '0%, 100%': { transform: 'none' },
    '30%, 50%': { transform: 'translateY(3px) scale(0.95)' },
  },
})

// a later mixin wins over the animation shorthand above it, whatever the selector's weight
const secondPress = css({ '&:nth-child(2)': { animationDelay: '0.75s' } })

export function KeyCap(handle: Handle<{ label: string }>) {
  return () => (
    <span
      mix={[
        pressMotion,
        css({
          ...surface,
          padding: '0.3rem 0.75rem',
          border: `1px solid ${faint}`,
          borderBottomWidth: '3px',
          borderRadius: '10px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          ...playOnSeen({}, 'tile-key-cap-press 0.9s ease-in-out 0.2s both'),
        }),
        secondPress,
      ]}
    >
      {handle.props.label}
    </span>
  )
}
