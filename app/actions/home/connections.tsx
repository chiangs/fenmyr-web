import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import type { ConnectionId, ConnectionsCopy } from '../../content/content.ts'
import { cardStyle } from '../../ui/card.ts'

// Each tool's own logo, self-hosted from its official source, as NOTICE lists. Claude Code shows a plain icon,
// since Anthropic's trademark guidelines allow its logo only in materials it approves. GitHub's mark is a mask in
// black, one of the colours its brand rules allow.
const logos: readonly { id: ConnectionId; src: string; mask?: boolean }[] = [
  { id: 'claude', src: '/images/terminal.svg', mask: true },
  { id: 'obsidian', src: '/images/logos/obsidian.svg' },
  { id: 'github', src: '/images/logos/github.svg', mask: true },
  { id: 'caelestia', src: '/images/logos/caelestia.svg' },
  { id: 'mobbin', src: '/images/logos/mobbin.svg' },
  { id: 'higgsfield', src: '/images/logos/higgsfield.png' },
]

const tileStyle = css({
  display: 'grid',
  placeItems: 'center',
  width: '3.25rem',
  height: '3.25rem',
  overflow: 'hidden',
  borderRadius: '14px',
  cornerShape: 'squircle',
  background: 'var(--logo-tile)',
  boxShadow: '0 0 0 1px rgba(var(--sh), calc(.12 * var(--sh-k)))',
})

export function Connections(handle: Handle<{ copy: ConnectionsCopy }>) {
  return () => {
    let { copy } = handle.props

    return (
      <div mix={css({ display: 'grid', gap: '1.25rem' })}>
        <ul
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 19rem), 1fr))',
            gap: '1rem',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          })}
        >
          {logos.map(({ id, src, mask }) => (
            <li
              key={id}
              data-connection={id}
              mix={[
                cardStyle,
                css({
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  alignItems: 'start',
                  gap: '1rem',
                  padding: '1.125rem',
                  color: 'var(--card-white-soft)',
                  '& h3': { fontSize: '1.125rem', letterSpacing: '-0.015em', color: 'var(--card-white-ink)' },
                  '& p': { fontSize: '0.96875rem', lineHeight: 1.5 },
                }),
              ]}
            >
              <span mix={tileStyle}>
                {mask ? (
                  <span
                    aria-hidden="true"
                    style={{ maskImage: `url(${src})` }}
                    mix={css({
                      width: '60%',
                      height: '60%',
                      background: 'var(--logo-ink)',
                      maskPosition: 'center',
                      maskRepeat: 'no-repeat',
                      maskSize: 'contain',
                    })}
                  />
                ) : (
                  <img
                    src={src}
                    alt=""
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    mix={css({ width: id === 'mobbin' ? '100%' : '72%', height: 'auto' })}
                  />
                )}
              </span>
              <span mix={css({ display: 'grid', gap: '0.25rem' })}>
                <h3>{copy.items[id].name}</h3>
                <p>{copy.items[id].line}</p>
              </span>
            </li>
          ))}
        </ul>
        <a
          href="https://github.com/chiangs/fenmyr#connections"
          mix={css({ justifySelf: 'start', color: 'var(--accent-text)', fontWeight: 700, textDecoration: 'none' })}
        >
          {copy.link} →
        </a>
      </div>
    )
  }
}
