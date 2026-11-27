import { css } from 'remix/component'

import { en } from '../content/en.tsx'

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
            {en.footer.brand}
          </span>
          <nav aria-label={en.footer.navLabel}>
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
                <a href="https://github.com/chiangs/fenmyr">{en.footer.github}</a>
              </li>
              <li>
                <a href="https://github.com/sponsors/chiangs">{en.footer.sponsor}</a>
              </li>
              <li>
                <a href="https://code-map.fenmyr.com/">{en.footer.codeMap}</a>
              </li>
              <li>
                <a href="https://github.com/chiangs/fenmyr-web/blob/main/NOTICE">{en.footer.licence}</a>
              </li>
            </ul>
          </nav>
        </div>
        <p>{en.footer.madeBy}</p>
      </div>
    </footer>
  )
}
