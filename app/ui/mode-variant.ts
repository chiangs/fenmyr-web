import { css } from 'remix/component'

// Shows the element whose data-variant matches the page's mode: data-mode on <html>, or the system's without one.
export const modeVariant = css({
  display: 'block',
  '&[data-variant="dark"]': { display: 'none' },
  ':root[data-mode="dark"] &[data-variant="light"]': { display: 'none' },
  ':root[data-mode="dark"] &[data-variant="dark"]': { display: 'block' },
  '@media (prefers-color-scheme: dark)': {
    ':root:not([data-mode]) &[data-variant="light"]': { display: 'none' },
    ':root:not([data-mode]) &[data-variant="dark"]': { display: 'block' },
  },
})
