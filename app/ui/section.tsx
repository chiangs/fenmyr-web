import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

export interface SectionProps {
  id: string
  title: string
  children?: RemixNode
}

export function Section(handle: Handle<SectionProps>) {
  return () => {
    let { id, title, children } = handle.props

    return (
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        mix={css({
          display: 'grid',
          gap: '1.75rem',
          paddingBlock: 'clamp(3rem, 8vw, 5.5rem)',
        })}
      >
        <h2 id={`${id}-title`} mix={css({ fontSize: 'clamp(1.875rem, 4.5vw, 2.75rem)' })}>
          {title}
        </h2>
        {children}
      </section>
    )
  }
}
