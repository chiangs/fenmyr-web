import type { RemixNode } from 'remix/component'

import type { Mode, ThemeId } from '../ui/themes.ts'

export interface SectionCopy {
  title: string
  nav?: string
}

export interface FeatureCopy extends SectionCopy {
  lead: string
}

export interface TileCopy {
  title: string
  body: RemixNode
}

export type PrototypeTile = 'run' | 'live' | 'point' | 'code' | 'keep' | 'git'
export type WorkTile = 'due' | 'home' | 'kanban' | 'find'
export type MyraTile = 'sees' | 'asks' | 'undo' | 'stop' | 'type' | 'settings'

export interface TimerCopy {
  title: string
  how: RemixNode
  faces: string
  time: string
  purpose: string
  presets: string[]
}

export interface HomeSectionsCopy {
  prototype: FeatureCopy & {
    nav: string
    screenshotAlt: string
    tiles: Record<PrototypeTile, TileCopy>
    labels: { point: string; undo: string }
  }
  ripe: SectionCopy & RipeCopy
  slash: SectionCopy & SlashCopy
  myra: FeatureCopy & { tiles: Record<MyraTile, TileCopy>; labels: { add: string; undo: string; stop: string; type: string } }
  work: FeatureCopy & {
    timer: TimerCopy
    tiles: Record<WorkTile, TileCopy>
    labels: { overdue: string; today: string; friday: string; focus: string; find: string }
  }
  local: FeatureCopy & { points: RemixNode[] }
  linux: FeatureCopy & { body: string; macos: string }
  access: FeatureCopy & { points: RemixNode[] }
  built: FeatureCopy & { points: RemixNode[]; codeMap: string; codeMapButton: string }
  install: SectionCopy & {
    nav: string
    needs: RemixNode
    fromCode: { title: string; note: string; result: string }
    appImage: { title: string; note: string; button: string }
  }
  support: SectionCopy & {
    nav: string
    myraAlt: string
    pitch: string
    ways: { star: RemixNode; beta: string }
    sponsor: string
  }
}

export type SectionId = keyof HomeSectionsCopy

export interface Content {
  document: { title: string; description: string }
  header: {
    brand: string
    navLabel: string
    menu: string
    github: string
    download: string
    theme: { label: string; system: string; modes: Record<Mode, string>; names: Record<ThemeId, string> }
  }
  hero: {
    tagline: string
    lead: string
    body: string
    bubble: string
    download: string
    github: string
    myraAlt: string
    screenshotAlt: string
  }
  sections: HomeSectionsCopy
  footer: {
    brand: string
    navLabel: string
    github: string
    sponsor: string
    codeMap: string
    licence: string
    madeBy: string
  }
  notFound: { title: string; heading: string; body: string; home: string }
}

export type RipeStep = 'catch' | 'sort' | 'shape' | 'try'

export interface RipeCopy {
  lead: string
  bubble: string
  myraAlt: string
  steps: Record<RipeStep, { name: string; body: RemixNode }>
  labels: { capture: string; preview: string }
}

export type SlashCommand =
  | 'find'
  | 'tag'
  | 'tidy'
  | 'due'
  | 'fit'
  | 'timer'
  | 'template'
  | 'project'
  | 'folder'
  | 'board'
  | 'animate'
  | 'clear'
  | 'help'
export type SlashGroup = 'board' | 'make' | 'chat'

export interface SlashCopy {
  lead: string
  bubble: string
  myraAlt: string
  input: string
  hint: string
  empty: string
  groups: Record<SlashGroup, string>
  commands: Record<Exclude<SlashCommand, 'animate'>, { desc: string; reply: string }> & { animate: { desc: string } }
  hop: { desc: string; line: string; still: string }
}
