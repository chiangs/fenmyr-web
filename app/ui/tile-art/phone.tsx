import { css } from 'remix/component'

import { playOnSeen, soft, surface } from './base.ts'

// the phone turns on its side and grows, then comes back: a phone, a tablet and a desktop width, as the preview shows
// at any device width. The frame only turns and scales, so its corners stay round and nothing reflows. From raw to
// ripe borrows this phone outside a tile, where nothing plays it
const phoneMotion = css({
  '@keyframes tile-phone-turn': {
    '0%, 10%': { transform: 'none' },
    '32%, 42%': { transform: 'rotate(-90deg)' },
    '62%, 70%': { transform: 'rotate(-90deg) scale(1.35)' },
    '94%, 100%': { transform: 'none' },
  },
})

export function Phone() {
  return () => (
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
          ...playOnSeen({ transform: 'none' }, 'tile-phone-turn 2.4s ease-in-out both'),
          '& i': { display: 'block', height: '8px', borderRadius: '3px', background: 'var(--card-sky)' },
          '& i:nth-child(2)': { height: '22px', background: 'var(--card-butter)' },
        }),
      ]}
    >
      <i />
      <i />
      <i />
    </span>
  )
}
