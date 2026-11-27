import { css } from 'remix/component'

export const iconButtonStyle = css({
  display: 'grid',
  placeItems: 'center',
  width: '2.75rem',
  height: '2.75rem',
  padding: 0,
  border: 0,
  borderRadius: 'var(--pill-r)',
  cornerShape: 'squircle',
  background: 'var(--card-white)',
  color: 'var(--card-white-ink)',
  boxShadow: 'inset 0 0 0 1.5px color-mix(in oklab, var(--card-white-soft) 35%, transparent)',
  cursor: 'pointer',
  '&:hover': { background: 'color-mix(in oklab, var(--card-white) 92%, var(--card-white-ink))' },
  '@supports not selector(:popover-open)': { display: 'none' },
})
