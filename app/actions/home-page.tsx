import { css } from 'remix/component'

import { Document } from './document.tsx'

export function HomePage() {
  return () => (
    <Document>
      <main
        mix={css({
          maxWidth: '40rem',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          fontFamily: 'system-ui, sans-serif',
          lineHeight: 1.5,
        })}
      >
        <h1>Fenmyr</h1>
        <p>Where ideas thrive.</p>
        <p>A canvas for growing ideas, from the first note to a working prototype, with Myra the cloudberry to help.</p>
      </main>
    </Document>
  )
}
