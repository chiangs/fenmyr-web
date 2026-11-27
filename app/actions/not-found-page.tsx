import { css } from 'remix/component'

import { en } from '../content/en.tsx'
import { routes } from '../routes.ts'
import { ButtonLink } from '../ui/button-link.tsx'
import { SiteFooter } from '../ui/site-footer.tsx'
import { SiteHeader } from '../ui/site-header.tsx'
import { Document } from './document.tsx'

export function NotFoundPage() {
  return () => (
    <Document title={en.notFound.title}>
      <SiteHeader />
      <main
        mix={css({
          display: 'grid',
          justifyItems: 'center',
          gap: '1.25rem',
          maxWidth: '40rem',
          marginInline: 'auto',
          padding: 'clamp(4rem, 14vw, 9rem) clamp(1rem, 4vw, 2rem)',
          textAlign: 'center',
        })}
      >
        <h1 mix={css({ fontSize: 'clamp(2.25rem, 7vw, 3.5rem)' })}>{en.notFound.heading}</h1>
        <p mix={css({ color: 'var(--ink-soft)' })}>{en.notFound.body}</p>
        <ButtonLink href={routes.home.href()}>{en.notFound.home}</ButtonLink>
      </main>
      <SiteFooter />
    </Document>
  )
}
