import { css } from 'remix/component'

import { ButtonLink } from '../../ui/button-link.tsx'
import { Screenshot } from '../../ui/screenshot.tsx'
import { en } from '../../content/en.tsx'
import { Section } from '../../ui/section.tsx'
import { SiteFooter } from '../../ui/site-footer.tsx'
import { SiteHeader } from '../../ui/site-header.tsx'
import { Document } from '../document.tsx'
import { sections } from './sections.tsx'

export function HomePage() {
  return () => (
    <Document>
      <SiteHeader />
      <main
        mix={css({
          maxWidth: '72rem',
          marginInline: 'auto',
          paddingInline: 'clamp(1rem, 4vw, 2rem)',
        })}
      >
        <section
          aria-labelledby="hero-title"
          mix={css({ display: 'grid', gap: 'clamp(2rem, 5vw, 3rem)', paddingBlock: 'clamp(2rem, 7vw, 5rem) 1rem' })}
        >
          <div
            mix={css({
              display: 'grid',
              justifyItems: 'center',
              gap: '1.25rem',
              maxWidth: '48rem',
              marginInline: 'auto',
              textAlign: 'center',
            })}
          >
            <h1 id="hero-title" mix={css({ fontSize: 'clamp(2.75rem, 9vw, 5.25rem)', letterSpacing: '-0.045em' })}>
              {en.hero.tagline}
            </h1>
            <p mix={css({ fontSize: 'clamp(1.1875rem, 2.4vw, 1.4375rem)', lineHeight: 1.45 })}>
              {en.hero.lead}
            </p>
            <p mix={css({ maxWidth: '40rem', color: 'var(--ink-soft)' })}>
              {en.hero.body}
            </p>
            <div mix={css({ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem' })}>
              <ButtonLink href="#install">{en.hero.download}</ButtonLink>
              <ButtonLink href="https://github.com/chiangs/fenmyr" quiet>
                {en.hero.github}
              </ButtonLink>
            </div>
          </div>
          <div>
            <div
              mix={css({
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                marginBottom: '-1.25rem',
                paddingInline: 'clamp(0.5rem, 3vw, 2rem)',
              })}
            >
              <p
                mix={css({
                  maxWidth: '17rem',
                  marginBottom: '4.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '24px',
                  cornerShape: 'squircle',
                  background: 'var(--card-butter)',
                  color: 'var(--card-butter-ink)',
                  fontFamily: 'var(--hand)',
                  fontSize: '1.0625rem',
                  lineHeight: 1.4,
                  boxShadow: '0 8px 24px rgba(var(--sh), calc(.2 * var(--sh-k)))',
                })}
              >
                {en.hero.bubble}
              </p>
              <picture mix={css({ flex: 'none' })}>
                <source media="(prefers-reduced-motion: reduce)" srcset="/images/myra-hello-still.png" />
                <img
                  src="/images/myra-hello.png"
                  alt={en.hero.myraAlt}
                  width={136}
                  height={160}
                  loading="lazy"
                  mix={css({ width: 'clamp(6.375rem, 11vw, 8.5rem)' })}
                />
              </picture>
            </div>
            <Screenshot
              light="/images/board-light.png"
              dark="/images/board-dark.png"
              alt={en.hero.screenshotAlt}
              width={1760}
              height={1100}
              priority
            />
          </div>
        </section>
        {sections.map((section) => (
          <Section key={section.id} id={section.id} title={section.title}>
            {section.content}
          </Section>
        ))}
      </main>
      <SiteFooter />
    </Document>
  )
}
