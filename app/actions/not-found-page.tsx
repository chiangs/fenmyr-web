import { css } from 'remix/component'

import { routes } from '../routes.ts'
import { ButtonLink } from '../ui/button-link.tsx'
import { SiteFooter } from '../ui/site-footer.tsx'
import { SiteHeader } from '../ui/site-header.tsx'
import { Document } from './document.tsx'

export function NotFoundPage() {
  return () => (
    <Document title="Page not found · Fenmyr">
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
        <h1 mix={css({ fontSize: 'clamp(2.25rem, 7vw, 3.5rem)' })}>Page not found</h1>
        <p mix={css({ color: 'var(--ink-soft)' })}>Nothing lives at this address. The link may be old or mistyped.</p>
        <ButtonLink href={routes.home.href()}>Go to the home page</ButtonLink>
      </main>
      <SiteFooter />
    </Document>
  )
}
