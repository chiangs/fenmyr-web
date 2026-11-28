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

export type PrototypeTile = 'paper' | 'run' | 'live' | 'code' | 'versions' | 'git'
export type LocalTile = 'offline' | 'files' | 'ask' | 'export'
export type BetaTile = 'update' | 'channel' | 'report'
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
  }
  ripe: SectionCopy & RipeCopy
  slash: SectionCopy & SlashCopy
  myra: FeatureCopy & { tiles: Record<MyraTile, TileCopy>; labels: { add: string; undo: string; stop: string; type: string } }
  work: FeatureCopy & {
    timer: TimerCopy
    tiles: Record<WorkTile, TileCopy>
    labels: { overdue: string; today: string; friday: string; focus: string; find: string }
  }
  templates: SectionCopy & TemplatesCopy & { nav: string }
  connections: SectionCopy & ConnectionsCopy
  local: FeatureCopy & { tiles: Record<LocalTile, TileCopy> }
  platforms: FeatureCopy & { linux: { title: string; body: string }; mac: { title: string; body: string }; updates: string }
  access: FeatureCopy & { points: RemixNode[] }
  // maker is a note in the maker's own words, signed
  built: FeatureCopy & {
    points: RemixNode[]
    maker: { quote: string; by: string }
    codeMap: string
    codeMapButton: string
  }
  beta: FeatureCopy & {
    tiles: Record<BetaTile, TileCopy>
    labels: { update: string; channel: string; report: string }
    follow: string
    report: string
  }
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
    star: RemixNode
    sponsor: string
  }
}

export type SectionId = keyof HomeSectionsCopy

export interface Content {
  // title and description are what search results show; previewAlt describes the picture a shared link shows
  // platforms and author are what the structured data tells search engines
  document: { title: string; description: string; previewAlt: string; platforms: string; author: string }
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
    site: string
    linkedIn: string
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

export type TemplateId =
  | 'empathy'
  | 'journey'
  | 'affinity'
  | 'hmw'
  | 'opportunity'
  | 'impact'
  | 'moodboard'
  | 'brainDump'
  | 'okrs'
  | 'kickoff'
  | 'appPlan'
  | 'workshop'
  | 'kanban'
  | 'retro'
  | 'prototype'
export type TemplateGroup = 'think' | 'capture' | 'plan' | 'lookBack' | 'build'
export type TemplateRole = 'designers' | 'productLeads' | 'facilitators' | 'makers'

export interface TemplatesCopy {
  lead: string
  filter: string
  all: string
  shown: string
  roles: Record<TemplateRole, string>
  groups: Record<TemplateGroup, string>
  items: Record<TemplateId, { name: string; line: string }>
}

export type ConnectionId = 'claude' | 'obsidian' | 'github' | 'mobbin' | 'higgsfield'

export interface ConnectionsCopy {
  lead: string
  link: string
  items: Record<ConnectionId, { name: string; line: string }>
  // the last card, which says more connections are coming and asks which one to make next
  more: { name: string; line: string; suggest: string; myraAlt: string }
}
