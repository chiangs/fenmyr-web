import type { RemixNode } from 'remix/component'

export interface SectionCopy {
  title: string
  nav?: string
}

export interface FeatureCopy extends SectionCopy {
  lead: string
}

export interface HomeSectionsCopy {
  prototype: FeatureCopy & { nav: string; screenshotAlt: string; points: RemixNode[] }
  myra: FeatureCopy & { points: RemixNode[] }
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
  header: { brand: string; navLabel: string; github: string; download: string }
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
    credit: RemixNode
    trademarks: string
    madeBy: string
  }
  notFound: { title: string; heading: string; body: string; home: string }
}
