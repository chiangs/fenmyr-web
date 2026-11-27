import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { encodedPath, formats, screenshots, sourcePath, themes } from './screenshots.ts'
import type { ScreenshotName } from './screenshots.ts'

export interface ScreenshotProps {
  name: ScreenshotName
  alt: string
  priority?: boolean
}

export function Screenshot(handle: Handle<ScreenshotProps>) {
  return () => {
    let { name, alt, priority } = handle.props
    let { width, height, widths, sizes } = screenshots[name]

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
        {formats.flatMap((format) =>
          themes.map((theme) => (
            <source
              key={`${format}-${theme}`}
              type={`image/${format}`}
              media={theme === 'dark' ? '(prefers-color-scheme: dark)' : undefined}
              srcset={widths.map((w) => `${encodedPath(name, theme, w, format)} ${w}w`).join(', ')}
              sizes={sizes}
            />
          )),
        )}
        <img
          src={sourcePath(name, 'light')}
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
