import type { Handle } from 'remix/component'
import { css } from 'remix/component'

export interface ScreenshotProps {
  light: string
  dark: string
  alt: string
  width: number
  height: number
  priority?: boolean
}

export function Screenshot(handle: Handle<ScreenshotProps>) {
  return () => {
    let { light, dark, alt, width, height, priority } = handle.props

    return (
      <picture
        mix={css({
          display: 'block',
          overflow: 'hidden',
          borderRadius: '24px',
          cornerShape: 'squircle',
          background: 'var(--card-white)',
          boxShadow:
            '0 18px 48px rgba(var(--sh), calc(.16 * var(--sh-k))), 0 2px 6px rgba(var(--sh), calc(.08 * var(--sh-k)))',
        })}
      >
        <source media="(prefers-color-scheme: dark)" srcset={dark} width={width} height={height} />
        <img
          src={light}
          alt={alt}
          width={width}
          height={height}
          fetchpriority={priority ? 'high' : undefined}
          loading={priority ? undefined : 'lazy'}
          decoding={priority ? undefined : 'async'}
          mix={css({ width: '100%' })}
        />
      </picture>
    )
  }
}
