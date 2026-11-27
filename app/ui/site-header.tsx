import { css } from 'remix/component'

import { sections } from '../actions/home/sections.tsx'
import { en } from '../content/en.tsx'
import { routes } from '../routes.ts'
import { ButtonLink } from './button-link.tsx'
import { SiteMenu } from './public/site-menu.tsx'
import { ThemePicker } from './public/theme-picker.tsx'
import { modes, themeStorageKey, themes } from './themes.ts'

export function SiteHeader() {
  return () => {
    let home = routes.home.href()
    let links = [
      ...sections.flatMap((section) => (section.nav ? [{ label: section.nav, href: `${home}#${section.id}` }] : [])),
      { label: en.header.github, href: 'https://github.com/chiangs/fenmyr' },
    ]
    let { theme } = en.header
    let groups = modes.map((mode) => ({
      mode,
      label: theme.modes[mode],
      choices: themes.filter((item) => item.mode === mode).map((item) => ({ id: item.id, name: theme.names[item.id] })),
    }))

    return (
      <header
        mix={css({
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'color-mix(in oklab, var(--board) 88%, transparent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--dot)',
          '@media (max-width: 52rem)': { height: 'var(--header-h)' },
        })}
      >
        <div
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
              gridTemplateColumns: '1fr auto auto',
              gridTemplateAreas: '"brand cta menu"',
              gap: '0.75rem',
              height: '100%',
              paddingBlock: 0,
            },
            '@media (width < 25rem)': { gap: '0.5rem' },
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
              '@media (width < 25rem)': { gap: '0.375rem', fontSize: '1.125rem' },
            })}
          >
            <img
              src="/images/mark.svg"
              alt=""
              width={256}
              height={256}
              mix={css({ width: '2rem', height: '2rem', '@media (width < 25rem)': { width: '1.75rem', height: '1.75rem' } })}
            />
            <span
              mix={css({
                '@media (width < 22.5rem)': {
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                  clipPath: 'inset(50%)',
                  whiteSpace: 'nowrap',
                },
              })}
            >
              {en.header.brand}
            </span>
          </a>
          <nav
            aria-label={en.header.navLabel}
            mix={css({ gridArea: 'nav', '@media (max-width: 52rem)': { display: 'none' } })}
          >
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
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div
            mix={css({
              gridArea: 'cta',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              '@media (width < 25rem)': { gap: '0.5rem' },
            })}
          >
            <ButtonLink href={`${home}#install`}>{en.header.download}</ButtonLink>
            <ThemePicker label={theme.label} system={theme.system} groups={groups} storageKey={themeStorageKey} />
          </div>
          <div mix={css({ gridArea: 'menu', '@media (width > 52rem)': { display: 'none' } })}>
            <SiteMenu label={en.header.menu} navLabel={en.header.navLabel} links={links} />
          </div>
        </div>
      </header>
    )
  }
}
