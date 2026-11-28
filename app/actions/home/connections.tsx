import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import type { ConnectionId, ConnectionsCopy } from '../../content/content.ts'
import { cardStyle } from '../../ui/card.ts'
import { Myra } from '../../ui/public/myra.tsx'

// Each tool's own logo, self-hosted from its official source, as NOTICE lists. Claude Code shows a plain icon,
// since Anthropic's trademark guidelines allow its logo only in materials it approves. GitHub's mark is a mask in
// black, one of the colours its brand rules allow.
const logos: readonly { id: ConnectionId; src: string; mask?: boolean }[] = [
  { id: 'claude', src: '/images/terminal.svg', mask: true },
  { id: 'obsidian', src: '/images/logos/obsidian.svg' },
  { id: 'github', src: '/images/logos/github.svg', mask: true },
  { id: 'mobbin', src: '/images/logos/mobbin.svg' },
  { id: 'higgsfield', src: '/images/logos/higgsfield.png' },
]

const linkStyle = css({ color: 'var(--accent-text)', fontWeight: 700, textDecoration: 'none' })

const cardLayout = css({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'start',
  gap: '1rem',
  padding: '1.125rem',
  color: 'var(--card-white-soft)',
  '& h3': { fontSize: '1.125rem', letterSpacing: '-0.015em', color: 'var(--card-white-ink)' },
  '& p': { fontSize: '0.96875rem', lineHeight: 1.5 },
})

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
              mix={[cardStyle, cardLayout]}
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
          {/* not a connection yet, so a dashed outline and no shadow; the paper stays opaque, so its text keeps the
              contrast the card colours were chosen for */}
          <li
            data-connection-more=""
            mix={[
              cardLayout,
              css({
                border: '1.5px dashed color-mix(in oklab, var(--card-white-ink) 28%, transparent)',
                borderRadius: '24px',
                cornerShape: 'squircle',
                background: 'var(--card-white)',
              }),
            ]}
          >
            {/* Myra sits in a logo tile like the other cards' logos. Her canvas is 17 art units wide, so 34px keeps
                her on whole pixels at whole-number pixel ratios while she is still, and at 40px tall she fits the
                52px tile. The top five rows of her canvas are room for her hop, so she moves up 5px to look centred */}
            <span mix={[tileStyle, css({ '& canvas, & img': { translate: '0 -0.3125rem' } })]}>
              <Myra pose="hello" label={copy.more.myraAlt} size="2.125rem" lazy />
            </span>
            <span mix={css({ display: 'grid', gap: '0.25rem' })}>
              <h3>{copy.more.name}</h3>
              <p>{copy.more.line}</p>
              <a
                href="https://github.com/chiangs/fenmyr/issues/new?template=feature_request.yml"
                mix={[linkStyle, css({ justifySelf: 'start' })]}
              >
                {copy.more.suggest} →
              </a>
            </span>
          </li>
        </ul>
        <a href="https://github.com/chiangs/fenmyr#connections" mix={[linkStyle, css({ justifySelf: 'start' })]}>
          {copy.link} →
        </a>
      </div>
    )
  }
}
