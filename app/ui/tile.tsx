import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import { cardStyle } from './card.ts'

export type Tone = 'butter' | 'pink' | 'mint' | 'sky' | 'lilac' | 'peach'

export interface TileItem {
  key: string
  title: string
  body: RemixNode
  tone: Tone
  art: RemixNode
}

const tileStyle = css({
  display: 'grid',
  alignContent: 'start',
  gap: '0.75rem',
  padding: '0.875rem 0.875rem 1.25rem',
  color: 'var(--card-white-soft)',
  '& h3': { paddingInline: '0.375rem', fontSize: '1.125rem', letterSpacing: '-0.015em', color: 'var(--card-white-ink)' },
  '& p': { paddingInline: '0.375rem', fontSize: '0.96875rem', lineHeight: 1.5 },
  '& strong': { color: 'var(--card-white-ink)', fontWeight: 800 },
})

const artStyle = css({
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  height: '6.5rem',
  overflow: 'hidden',
  borderRadius: '16px',
  cornerShape: 'squircle',
  color: 'var(--card-butter-ink)',
  '@media (max-width: 34rem)': { height: '4.75rem', '& > *': { scale: '0.8' } },
})

export function Tiles(handle: Handle<{ items: readonly TileItem[] }>) {
  return () => (
    <ul
      mix={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 17rem), 1fr))',
        gap: '1rem',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      })}
    >
      {handle.props.items.map((item) => (
        <li key={item.key} mix={[cardStyle, tileStyle]}>
          <div aria-hidden="true" style={{ background: `var(--card-${item.tone})` }} mix={artStyle}>
            {item.art}
          </div>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </li>
      ))}
    </ul>
  )
}
