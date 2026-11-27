export const themes = [
  { id: 'default-light', mode: 'light' },
  { id: 'midsummer', mode: 'light' },
  { id: 'clear', mode: 'light' },
  { id: 'default-dark', mode: 'dark' },
  { id: 'polar-night', mode: 'dark' },
  { id: 'lantern', mode: 'dark' },
] as const

export type Theme = (typeof themes)[number]
export type ThemeId = Theme['id']
export type Mode = Theme['mode']

export const modes = ['light', 'dark'] as const satisfies readonly Mode[]

export const themeStorageKey = 'fenmyr-theme'
