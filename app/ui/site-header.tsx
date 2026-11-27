import { css } from 'remix/component'

import { sections } from '../actions/home/sections.tsx'
import { en } from '../content/en.tsx'
import { routes } from '../routes.ts'
import { ButtonLink } from './button-link.tsx'

export function SiteHeader() {
  return () => {
    let home = routes.home.href()

    return (
      <header
        mix={css({
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gridTemplateAreas: '"brand nav cta"',
          alignItems: 'center',
          gap: '0.75rem 2rem',
          maxWidth: '72rem',
          marginInline: 'auto',
          padding: '1.25rem clamp(1rem, 4vw, 2rem)',
          '@media (max-width: 52rem)': {
            gridTemplateColumns: '1fr auto',
            gridTemplateAreas: '"brand cta" "nav nav"',
          },
        })}
      >
        <a
          href={home}
          mix={css({
            gridArea: 'brand',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--ink)',
            fontSize: '1.375rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            textDecoration: 'none',
          })}
        >
          <img src="/images/mark.svg" alt="" width={256} height={256} loading="lazy" mix={css({ width: '2rem', height: '2rem' })} />
          {en.header.brand}
        </a>
        <nav aria-label={en.header.navLabel} mix={css({ gridArea: 'nav' })}>
          <ul
            mix={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.25rem 1.5rem',
              margin: 0,
              padding: 0,
              listStyle: 'none',
              '& a': {
                color: 'var(--ink-soft)',
                fontWeight: 600,
                textDecoration: 'none',
              },
              '& a:hover': { color: 'var(--ink)' },
            })}
          >
            {sections
              .filter((section) => section.nav)
              .map((section) => (
                <li key={section.id}>
                  <a href={`${home}#${section.id}`}>{section.nav}</a>
                </li>
              ))}
            <li>
              <a href="https://github.com/chiangs/fenmyr">{en.header.github}</a>
            </li>
          </ul>
        </nav>
        <div mix={css({ gridArea: 'cta' })}>
          <ButtonLink href={`${home}#install`}>{en.header.download}</ButtonLink>
        </div>
      </header>
    )
  }
}
