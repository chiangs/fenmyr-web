import type { RemixNode } from 'remix/component'
import { css } from 'remix/component'

import type { BetaTile, LocalTile, MyraTile, PrototypeTile, TileCopy, WorkTile } from '../../content/content.ts'
import { en } from '../../content/en.tsx'
import type { Tone } from '../../ui/tile.tsx'
import { AddKey, KeyCap, StopKey, UndoKey } from '../../ui/tile-art/key-cap.tsx'
import { DashedPlan, ResearchDoc, Switches } from '../../ui/tile-art/myra.tsx'
import { Phone } from '../../ui/tile-art/phone.tsx'
import { Captures, CodeLines, Commits, PaperSketch, Slider } from '../../ui/tile-art/prototype.tsx'
import { Columns, DueList, Folders, Icon } from '../../ui/tile-art/work.tsx'

// each section's tiles: the order, the card tone and the drawing, with the words from the copy
const { prototype, myra, work, local, beta } = en.sections

// a drawing, or one made for the tile's tone, for a drawing that paints in the tile's own colour, so the tone is
// written once
type Art = readonly [tone: Tone, art: RemixNode | ((tone: Tone) => RemixNode)]

function tilesOf<Id extends string>(copy: Record<Id, TileCopy>, art: readonly (readonly [Id, ...Art])[]) {
  return art.map(([key, tone, picture]) => ({
    key,
    tone,
    art: typeof picture === 'function' ? picture(tone) : picture,
    ...copy[key],
  }))
}

export const prototypeTiles = tilesOf<PrototypeTile>(prototype.tiles, [
  ['paper', 'lilac', <PaperSketch />],
  ['run', 'sky', <Phone />],
  ['live', 'butter', <Slider />],
  ['code', 'peach', <CodeLines />],
  ['versions', 'mint', <Captures />],
  ['git', 'pink', <Commits />],
])

export const myraTiles = tilesOf<MyraTile>(myra.tiles, [
  ['sees', 'sky', <AddKey label={myra.labels.add} />],
  ['asks', 'butter', <DashedPlan />],
  ['undo', 'mint', <UndoKey label={myra.labels.undo} />],
  ['stop', 'peach', <StopKey label={myra.labels.stop} />],
  ['research', 'lilac', <ResearchDoc />],
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
  ['offline', 'sky', (tone) => <Icon name="wifi" off={tone} />],
  ['files', 'butter', (tone) => <Icon name="file-text" on={tone} />],
  ['ask', 'lilac', <Icon name="sparkle" />],
  ['export', 'mint', <Icon name="download" />],
])

export const betaTiles = tilesOf<BetaTile>(beta.tiles, [
  ['update', 'butter', <KeyCap label={beta.labels.update} />],
  ['channel', 'lilac', <KeyCap label={beta.labels.channel} />],
  ['report', 'pink', <KeyCap label={beta.labels.report} />],
])
