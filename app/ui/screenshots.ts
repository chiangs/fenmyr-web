export const themes = ['dark', 'light'] as const
export const formats = ['avif', 'webp'] as const

export type Theme = (typeof themes)[number]
export type Format = (typeof formats)[number]

export interface ScreenshotImage {
  width: number
  height: number
  widths: readonly number[]
  sizes: string
}

const pageColumn = {
  widths: [360, 720, 1088, 1760],
  sizes: '(min-width: 72rem) 68rem, (min-width: 50rem) calc(100vw - 4rem), (min-width: 25rem) 92vw, calc(100vw - 2rem)',
}

export const screenshots = {
  board: { width: 1760, height: 1100, ...pageColumn },
  'proto-built': { width: 1760, height: 1100, ...pageColumn },
} satisfies Record<string, ScreenshotImage>

export type ScreenshotName = keyof typeof screenshots

export function sourcePath(name: string, theme: Theme) {
  return `/images/${name}-${theme}.png`
}

export function encodedPath(name: string, theme: Theme, width: number, format: Format) {
  return `/images/${name}-${theme}-${width}.${format}`
}
