import type { RemixNode } from 'remix/component'
import { css } from 'remix/component'

import type { BetaTile, LocalTile, MyraTile, PrototypeTile, TileCopy, WorkTile } from '../../content/content.ts'
import { en } from '../../content/en.tsx'
import type { Tone } from '../../ui/tile.tsx'
import {
  Columns,
  Commits,
  CodeLines,
  DashedPlan,
  DueList,
  Folders,
  Icon,
  KeyCap,
  Phone,
  Pointer,
  Slider,
  Specimen,
  Switches,
} from '../../ui/tile-art.tsx'

// each section's tiles: the order, the card tone and the drawing, with the words from the copy
const { prototype, myra, work, local, beta } = en.sections

type Art = readonly [tone: Tone, art: RemixNode]

function tilesOf<Id extends string>(copy: Record<Id, TileCopy>, art: readonly (readonly [Id, ...Art])[]) {
  return art.map(([key, tone, picture]) => ({ key, tone, art: picture, ...copy[key] }))
}

export const prototypeTiles = tilesOf<PrototypeTile>(prototype.tiles, [
  ['run', 'sky', <Phone />],
  ['live', 'butter', <Slider />],
  ['point', 'lilac', <Pointer label={prototype.labels.point} />],
  ['code', 'peach', <CodeLines />],
  ['keep', 'mint', <KeyCap label={prototype.labels.undo} />],
  ['git', 'pink', <Commits />],
])

export const myraTiles = tilesOf<MyraTile>(myra.tiles, [
  ['sees', 'sky', <KeyCap label={myra.labels.add} />],
  ['asks', 'butter', <DashedPlan />],
  ['undo', 'mint', <KeyCap label={myra.labels.undo} />],
  ['stop', 'peach', <KeyCap label={myra.labels.stop} />],
  ['type', 'lilac', <Specimen label={myra.labels.type} />],
  ['settings', 'pink', <Switches />],
])

export const workTiles = tilesOf<WorkTile>(work.tiles, [
  ['due', 'pink', <DueList labels={[work.labels.overdue, work.labels.today, work.labels.friday]} />],
  ['home', 'lilac', <Folders />],
  ['kanban', 'mint', <Columns />],
  [
    'find',
    'sky',
    <span mix={css({ display: 'flex', gap: '0.5rem' })}>
      <KeyCap label={work.labels.focus} />
      <KeyCap label={work.labels.find} />
    </span>,
  ],
])

export const localTiles = tilesOf<LocalTile>(local.tiles, [
  ['offline', 'sky', <Icon name="wifi" off="sky" />],
  ['files', 'butter', <Icon name="file-text" />],
  ['ask', 'lilac', <Icon name="sparkle" />],
  ['export', 'mint', <Icon name="download" />],
])

export const betaTiles = tilesOf<BetaTile>(beta.tiles, [
  ['update', 'butter', <KeyCap label={beta.labels.update} />],
  ['channel', 'lilac', <KeyCap label={beta.labels.channel} />],
  ['report', 'pink', <KeyCap label={beta.labels.report} />],
])
