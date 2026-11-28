import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { playOnSeen, soft, surface } from './base.ts'

// Two motions, for the two places the phone is drawn. In a tile, the phone turns on its side and grows, then comes
// back: a phone, a tablet and a desktop width, as the preview shows at any device width. The frame only turns and
// scales, so its corners stay round and nothing reflows. In From raw to ripe, where the phone stands for sketching the
// screens, the frame stays put and its blocks are drawn in one after another from the left, the way a hand would.
const phoneMotion = css({
  '@keyframes tile-phone-turn': {
    '0%, 10%': { transform: 'none' },
    '32%, 42%': { transform: 'rotate(-90deg)' },
    '62%, 70%': { transform: 'rotate(-90deg) scale(1.35)' },
    '94%, 100%': { transform: 'none' },
  },
  '@keyframes tile-phone-sketch': {
    '0%': { opacity: 0, transform: 'scaleX(0)' },
    '100%': { opacity: 1, transform: 'none' },
  },
})

function sketched(delay: number) {
  return css({
    transformOrigin: 'left center',
    ...playOnSeen({ opacity: 0, transform: 'scaleX(0)' }, `tile-phone-sketch 0.7s ease-out ${delay}s both`),
  })
}

export function Phone(handle: Handle<{ motion?: 'turn' | 'sketch' }>) {
  return () => {
    let sketch = handle.props.motion === 'sketch'
    return (
      <span
        mix={[
          phoneMotion,
          css({
            ...surface,
            display: 'grid',
            alignContent: 'start',
            gap: '5px',
            width: '3rem',
            height: '5rem',
            padding: '8px 6px',
            border: `2px solid ${soft}`,
            borderRadius: '12px',
            ...(sketch ? {} : playOnSeen({ transform: 'none' }, 'tile-phone-turn 2.4s ease-in-out both')),
            '& i': { display: 'block', height: '8px', borderRadius: '3px', background: 'var(--card-sky)' },
            '& i:nth-child(2)': { height: '22px', background: 'var(--card-butter)' },
          }),
        ]}
      >
        {[0.2, 0.75, 1.3].map((delay) => (
          <i key={delay} mix={sketch ? sketched(delay) : []} />
        ))}
      </span>
    )
  }
}
