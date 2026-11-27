import { readFile, readdir, rm, writeFile } from 'node:fs/promises'
import * as path from 'node:path'
import sharp from 'sharp'
import type { Sharp } from 'sharp'

import { encodedPath, formats, screenshots, sourcePath, themes } from '../app/ui/screenshots.ts'
import type { Format } from '../app/ui/screenshots.ts'

const root = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(root, 'public')
const imagesDir = path.join(publicDir, 'images')

const encoders: Record<Format, (image: Sharp) => Sharp> = {
  avif: (image) => image.avif({ quality: 60, chromaSubsampling: '4:4:4', effort: 4 }),
  webp: (image) => image.webp({ quality: 85, effort: 6 }),
}

async function existing(file: string) {
  try {
    return await readFile(file)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return null
    throw error
  }
}

let expected = new Set<string>()
let written = 0
let unchanged = 0

for (let [name, shot] of Object.entries(screenshots)) {
  for (let theme of themes) {
    let source = path.join(publicDir, sourcePath(name, theme))
    let { width, height } = await sharp(source).metadata()
    if (width !== shot.width || height !== shot.height) {
      throw new Error(`${path.relative(root, source)} is ${width}x${height}, app/ui/screenshots.ts says ${shot.width}x${shot.height}`)
    }
    let tooWide = shot.widths.find((w) => w > shot.width)
    if (tooWide) throw new Error(`${name} lists width ${tooWide}, wider than its ${shot.width} px source`)
    let jobs = shot.widths.flatMap((w) =>
      formats.map(async (format) => {
        let file = path.join(publicDir, encodedPath(name, theme, w, format))
        expected.add(file)
        let bytes = await encoders[format](sharp(source).removeAlpha().resize(w)).toBuffer()
        let before = await existing(file)
        if (before?.equals(bytes)) {
          unchanged++
          return
        }
        await writeFile(file, bytes)
        written++
        console.log(`wrote ${path.relative(root, file)} (${bytes.length} bytes)`)
      }),
    )
    await Promise.all(jobs)
  }
}

let encoded = new RegExp(`^(?:${Object.keys(screenshots).join('|')})-(?:${themes.join('|')})-\\d+\\.(?:${formats.join('|')})$`)
for (let entry of await readdir(imagesDir)) {
  let file = path.join(imagesDir, entry)
  if (encoded.test(entry) && !expected.has(file)) {
    await rm(file)
    console.log(`removed ${path.relative(root, file)}`)
  }
}

console.log(`${written} written, ${unchanged} unchanged`)
