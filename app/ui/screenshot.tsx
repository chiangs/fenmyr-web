import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { encodedPath, formats, screenshots, sourcePath } from './screenshots.ts'
import type { ScreenshotName } from './screenshots.ts'
import { modes } from './themes.ts'

export interface ScreenshotProps {
  name: ScreenshotName
  alt: string
  priority?: boolean
}

const variantStyle = css({
  display: 'block',
  '&[data-variant="dark"]': { display: 'none' },
  ':root[data-mode="dark"] &[data-variant="light"]': { display: 'none' },
  ':root[data-mode="dark"] &[data-variant="dark"]': { display: 'block' },
  '@media (prefers-color-scheme: dark)': {
    ':root:not([data-mode]) &[data-variant="light"]': { display: 'none' },
    ':root:not([data-mode]) &[data-variant="dark"]': { display: 'block' },
  },
})

export function Screenshot(handle: Handle<ScreenshotProps>) {
  return () => {
    let { name, alt, priority } = handle.props
    let { width, height, widths, sizes } = screenshots[name]

    return (
      <div
        mix={css({
          overflow: 'hidden',
          borderRadius: '24px',
          cornerShape: 'squircle',
          background: 'var(--card-white)',
          boxShadow:
            '0 18px 48px rgba(var(--sh), calc(.16 * var(--sh-k))), 0 2px 6px rgba(var(--sh), calc(.08 * var(--sh-k)))',
        })}
      >
        {modes.map((mode) => (
          <picture key={mode} data-variant={mode} mix={variantStyle}>
            {formats.map((format) => (
              <source
                key={format}
                type={`image/${format}`}
                srcset={widths.map((w) => `${encodedPath(name, mode, w, format)} ${w}w`).join(', ')}
                sizes={sizes}
              />
            ))}
            <img
              src={sourcePath(name, mode)}
              alt={alt}
              width={width}
              height={height}
              fetchpriority={priority ? 'high' : undefined}
              loading="lazy"
              decoding={priority ? undefined : 'async'}
              mix={css({ width: '100%' })}
            />
          </picture>
        ))}
      </div>
    )
  }
}
