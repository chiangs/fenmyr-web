import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import * as path from 'node:path'
import { promisify } from 'node:util'
import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

const root = path.resolve(import.meta.dirname, '..')
const run = promisify(execFile)

describe('npm run themes', () => {
  it('writes the same public/themes.css every time', { timeout: 60_000 }, async () => {
    let dir = await mkdtemp(path.join(tmpdir(), 'fenmyr-themes-'))
    try {
      let outputs = []
      for (let name of ['first.css', 'second.css']) {
        let file = path.join(dir, name)
        await run(process.execPath, [path.join(root, 'tools/themes.ts'), file])
        outputs.push(await readFile(file, 'utf8'))
      }
      assert.equal(outputs[0], outputs[1])
      assert.equal(outputs[0], await readFile(path.join(root, 'public/themes.css'), 'utf8'))
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
