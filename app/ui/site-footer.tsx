import { css } from 'remix/component'

export function SiteFooter() {
  return () => (
    <footer
      mix={css({
        marginTop: 'clamp(2rem, 6vw, 4rem)',
        borderTop: '1px solid var(--dot)',
        background: 'color-mix(in oklab, var(--board) 82%, transparent)',
      })}
    >
      <div
        mix={css({
          display: 'grid',
          gap: '1rem',
          maxWidth: '72rem',
          marginInline: 'auto',
          padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)',
          color: 'var(--ink-soft)',
          fontSize: '0.9375rem',
        })}
      >
        <div
          mix={css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem 2rem',
          })}
        >
          <span
            mix={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--ink)',
              fontSize: '1.125rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
            })}
          >
            <img src="/images/mark.svg" alt="" width={256} height={256} loading="lazy" mix={css({ width: '1.75rem', height: '1.75rem' })} />
            Fenmyr
          </span>
          <nav aria-label="Footer">
            <ul
              mix={css({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.25rem 1.5rem',
                margin: 0,
                padding: 0,
                listStyle: 'none',
                '& a': { color: 'var(--ink)', fontWeight: 600 },
              })}
            >
              <li>
                <a href="https://github.com/chiangs/fenmyr">GitHub</a>
              </li>
              <li>
                <a href="https://github.com/sponsors/chiangs">Sponsor</a>
              </li>
              <li>
                <a href="https://code-map.fenmyr.com/">Code map</a>
              </li>
              <li>
                <a href="https://github.com/chiangs/fenmyr/blob/main/LICENSE">EUPL-1.2 licence</a>
              </li>
            </ul>
          </nav>
        </div>
        <p>
          Fenmyr began as a fork of <a href="https://github.com/jessawolfe-ux/mochiboard">Mochiboard</a> by{' '}
          <a href="https://jessa.art">Jessa Wolfe</a>.
        </p>
        <p>
          The names Fenmyr and Myra, Myra the cloudberry, her art, the logo and the app icon are not part of the code
          licence and are all rights reserved by Stephen Chiang.
        </p>
        <p>Made with care by Stephen Chiang.</p>
      </div>
    </footer>
  )
}
