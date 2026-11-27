import { readFileSync, readdirSync, statSync } from 'node:fs'
import * as path from 'node:path'
import { SyntaxKind } from 'typescript/unstable/ast'
import type { Node, SourceFile } from 'typescript/unstable/ast'
import { API } from 'typescript/unstable/sync'

const kinds = ['any', 'casts', 'rawColours', 'longFiles'] as const
type Kind = (typeof kinds)[number]

const root = path.resolve(import.meta.dirname, '..')
const budgetFile = path.join(root, 'tools/budget.json')
const styleFiles = ['public/styles.css', 'public/themes.css'].map((file) => path.join(root, file))
const maxLines = 400
const rawColour = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b|\b(?:rgba?|hsla?)\(/gi
const shadowColour = /^rgba?\(\s*var\(--sh\)/i
const tokenBlock = /^(?::root|:root:not\(\[data-theme\]\)|\[data-theme="[a-z-]+"\])(?:,\s*(?::root|\[data-theme="[a-z-]+"\]))*$/
const customProperty = /^\s*--[\w-]+\s*:/
const stringKinds = new Set([
  SyntaxKind.StringLiteral,
  SyntaxKind.NoSubstitutionTemplateLiteral,
  SyntaxKind.TemplateHead,
  SyntaxKind.TemplateMiddle,
  SyntaxKind.TemplateTail,
])

const found: Record<Kind, string[]> = { any: [], casts: [], rawColours: [], longFiles: [] }

function filesUnder(dir: string) {
  return readdirSync(path.join(root, dir), { recursive: true, encoding: 'utf8' })
    .map((name) => path.join(root, dir, name))
    .filter((file) => statSync(file).isFile())
    .sort()
}

function where(file: string, line: number, column: number) {
  return `${path.relative(root, file)}:${line + 1}:${column + 1}`
}

function rawColoursIn(text: string, at: (index: number) => string) {
  for (let match of text.matchAll(rawColour)) {
    if (!shadowColour.test(text.slice(match.index))) found.rawColours.push(at(match.index))
  }
}

function readBudget(): Record<Kind, number> {
  let raw: unknown = JSON.parse(readFileSync(budgetFile, 'utf8'))
  if (typeof raw !== 'object' || raw === null) throw new Error('tools/budget.json must hold an object')
  let value = (kind: Kind) => {
    let count: unknown = Reflect.get(raw, kind)
    if (typeof count !== 'number') throw new Error(`tools/budget.json needs a number for "${kind}"`)
    return count
  }
  return { any: value('any'), casts: value('casts'), rawColours: value('rawColours'), longFiles: value('longFiles') }
}

let rootFiles = readdirSync(root)
  .filter((name) => /\.tsx?$/.test(name))
  .map((name) => path.join(root, name))
  .sort()
let appFiles = filesUnder('app')
let toolFiles = filesUnder('tools')
let scripts = [...rootFiles, ...appFiles, ...toolFiles].filter((file) => /\.tsx?$/.test(file))

let api = new API({ cwd: root })
let project = api.updateSnapshot({ openProjects: [path.join(root, 'tsconfig.json')] }).getProjects()[0]
if (!project) throw new Error('tsconfig.json did not load')

for (let file of scripts) {
  let source: SourceFile | undefined = project.program.getSourceFile(file)
  if (!source) throw new Error(`${path.relative(root, file)} is not in the tsconfig.json program`)
  let sourceFile = source
  let inApp = appFiles.includes(file)
  let at = (position: number) => {
    let { line, character } = sourceFile.getLineAndCharacterOfPosition(position)
    return where(file, line, character)
  }
  let visit = (node: Node): void => {
    if (node.kind === SyntaxKind.AnyKeyword) found.any.push(at(node.getStart(sourceFile)))
    if (node.kind === SyntaxKind.TypeAssertionExpression) found.casts.push(at(node.getStart(sourceFile)))
    if (node.kind === SyntaxKind.AsExpression && !/\bas\s+const$/.test(node.getText(sourceFile))) {
      found.casts.push(at(node.getStart(sourceFile)))
    }
    if (inApp && stringKinds.has(node.kind)) {
      let start = node.getStart(sourceFile)
      rawColoursIn(node.getText(sourceFile), (index) => at(start + index))
    }
    node.forEachChild(visit)
  }
  sourceFile.forEachChild(visit)
}
api.close()

for (let file of styleFiles) {
  let blocks: string[] = []
  let header = ''
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, number) => {
      let inTokenBlock = tokenBlock.test(blocks.at(-1) ?? '')
      if (!(inTokenBlock && customProperty.test(line))) {
        rawColoursIn(line, (index) => where(file, number, index))
      }
      for (let char of line) {
        if (char === '{') {
          blocks.push(header.trim().replace(/\s+/g, ' '))
          header = ''
        } else if (char === '}') {
          blocks.pop()
          header = ''
        } else if (char === ';') {
          header = ''
        } else {
          header += char
        }
      }
      header += ' '
    })
}

for (let file of [...rootFiles, ...appFiles, ...toolFiles, ...styleFiles]) {
  let lines = readFileSync(file, 'utf8').replace(/\n$/, '').split('\n').length
  if (lines > maxLines) found.longFiles.push(`${path.relative(root, file)} has ${lines} lines`)
}

let budget = readBudget()
let over = false
for (let kind of kinds) {
  let count = found[kind].length
  console.log(`${kind}: ${count} (budget ${budget[kind]})`)
  if (count > budget[kind]) {
    over = true
    for (let location of found[kind]) console.log(`  ${location}`)
  } else if (count < budget[kind]) {
    console.log(`  ${kind} fell to ${count}: lower it in tools/budget.json`)
  }
}
if (over) {
  console.log('Over budget.')
  process.exit(1)
}
