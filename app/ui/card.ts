import { css } from 'remix/component'

export const cardStyle = css({
  borderRadius: '24px',
  cornerShape: 'squircle',
  background: 'var(--card-white)',
  color: 'var(--card-white-ink)',
  boxShadow:
    'var(--card-edge, 0 0 0 0 transparent), 0 10px 30px rgba(var(--sh), calc(.10 * var(--sh-k))), 0 1px 3px rgba(var(--sh), calc(.06 * var(--sh-k)))',
})
