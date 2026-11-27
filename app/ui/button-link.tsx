import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

export interface ButtonLinkProps {
  href: string
  quiet?: boolean
  children?: RemixNode
}

export function ButtonLink(handle: Handle<ButtonLinkProps>) {
  return () => {
    let { href, quiet, children } = handle.props

    return (
      <a
        href={href}
        data-quiet={quiet ? '' : undefined}
        mix={css({
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '2.75rem',
          paddingInline: '1.25rem',
          borderRadius: 'var(--pill-r)',
          cornerShape: 'squircle',
          background: 'var(--pink-deep)',
          color: 'var(--on-accent)',
          fontWeight: 600,
          lineHeight: 1.2,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 26px rgba(var(--sh), calc(.14 * var(--sh-k)))',
          '&[data-quiet]': {
            background: 'var(--card-white)',
            color: 'var(--ink)',
            boxShadow:
              'inset 0 0 0 1.5px color-mix(in oklab, var(--ink-soft) 35%, transparent), 0 8px 26px rgba(var(--sh), calc(.08 * var(--sh-k)))',
          },
          '&:hover': {
            background: 'color-mix(in oklab, var(--pink-deep) 88%, var(--ink))',
          },
          '&[data-quiet]:hover': {
            background: 'color-mix(in oklab, var(--card-white) 92%, var(--ink))',
          },
        })}
      >
        {children}
      </a>
    )
  }
}
