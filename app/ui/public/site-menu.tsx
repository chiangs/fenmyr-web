import { clientEntry, css, on, ref } from 'remix/component'
import type { Handle } from 'remix/component'

import { iconButtonStyle } from './icon-button.ts'

export interface SiteMenuLink {
  label: string
  href: string
}

export interface SiteMenuProps {
  label: string
  navLabel: string
  links: SiteMenuLink[]
}

const buttonStyle = css({
  '& [data-icon="close"]': { display: 'none' },
  '&:has(+ :popover-open) [data-icon="menu"]': { display: 'none' },
  '&:has(+ :popover-open) [data-icon="close"]': { display: 'inline' },
})

const menuStyle = css({
  display: 'none',
  '&:popover-open': { display: 'block' },
  position: 'fixed',
  inset: 'var(--header-h, 0) 0 auto',
  width: 'auto',
  maxWidth: 'none',
  height: 'auto',
  maxHeight: 'calc(100dvh - var(--header-h, 0px))',
  overflow: 'auto',
  margin: 0,
  padding: '0.25rem clamp(1rem, 4vw, 2rem) 0.75rem',
  border: 0,
  borderBottom: '1px solid var(--dot)',
  background: 'var(--board)',
  color: 'var(--ink)',
  boxShadow: '0 18px 30px rgba(var(--sh), calc(.12 * var(--sh-k)))',
  '& ul': { display: 'grid', margin: 0, padding: 0, listStyle: 'none' },
  '& li + li': { borderTop: '1px solid var(--dot)' },
  '& a': {
    display: 'flex',
    alignItems: 'center',
    minHeight: '3.5rem',
    color: 'var(--ink)',
    fontSize: '1.25rem',
    fontWeight: 600,
    textDecoration: 'none',
  },
  '& a:hover': { color: 'var(--accent-text)' },
  '@media (prefers-reduced-motion: no-preference)': {
    '&:popover-open': {
      transition: 'opacity 180ms ease-out, translate 180ms ease-out',
      '@starting-style': { opacity: 0, translate: '0 -0.5rem' },
    },
  },
})

function close(menu: HTMLElement) {
  if (typeof menu.hidePopover === 'function' && menu.matches(':popover-open')) menu.hidePopover()
}

export const SiteMenu = clientEntry(import.meta.url, function SiteMenu(handle: Handle<SiteMenuProps>) {
  return () => {
    let { label, navLabel, links } = handle.props

    return (
      <>
        <button type="button" popovertarget="site-menu" aria-label={label} mix={[iconButtonStyle, buttonStyle]}>
          <svg
            viewBox="0 0 24 24"
            width={24}
            height={24}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path data-icon="menu" d="M4 7h16M4 12h16M4 17h16" />
            <path data-icon="close" d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <div
          id="site-menu"
          popover
          mix={[
            menuStyle,
            on('click', (event) => {
              if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
              if (event.target instanceof Element && event.target.closest('a')) close(event.currentTarget)
            }),
            ref((menu, signal) => {
              let wide = matchMedia('(width > 52rem)')
              wide.addEventListener('change', () => wide.matches && close(menu), { signal })
            }),
          ]}
        >
          <nav aria-label={navLabel}>
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    )
  }
})
