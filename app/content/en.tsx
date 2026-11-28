import type { Content } from './content.ts'
import { details } from './en-details.tsx'
import { showcase } from './en-showcase.tsx'

const summary =
  'A canvas for growing ideas, from the first note to a rapid prototype you can experiment with and test, with Myra the cloudberry to help.'

export const en: Content = {
  document: {
    title: 'Fenmyr',
    description: summary,
  },
  header: {
    brand: 'Fenmyr',
    navLabel: 'Main',
    menu: 'Menu',
    github: 'GitHub',
    download: 'Download',
    theme: {
      label: 'Theme',
      system: 'Match my system',
      modes: { light: 'Light', dark: 'Dark' },
      names: {
        'default-light': 'Default',
        midsummer: 'Midsummer',
        clear: 'Clear',
        'default-dark': 'Default',
        'polar-night': 'Polar Night',
        lantern: 'Lantern',
      },
    },
  },
  hero: {
    tagline: 'Where ideas thrive.',
    lead: summary,
    body: 'Fenmyr is a free, open-source canvas for Linux and macOS. Spread notes, pictures, links, checklists, docs and wireframes across an endless board, then ask Myra to sort, plan and prototype. Your boards are plain files on your computer, and the AI runs only when you ask.',
    bubble: "Hello, I'm Myra. Bring me your messiest board ✦",
    download: 'Download',
    github: 'View on GitHub',
    myraAlt: 'Myra, a pixel cloudberry, hops and beams',
    screenshotAlt:
      "A Fenmyr board: Myra's how-to note, Raw ideas and Ripe collections, a This week kanban, Unsorted ideas on the right, the tools at the top right and the boards on the left",
  },
  sections: {
    ...showcase,
    ...details,
  },
  footer: {
    brand: 'Fenmyr',
    navLabel: 'Footer',
    github: 'GitHub',
    sponsor: 'Sponsor',
    codeMap: 'Code map',
    licence: 'Licences',
    madeBy: 'Made with care by Stephen Chiang.',
  },
  notFound: {
    title: 'Page not found · Fenmyr',
    heading: 'Page not found',
    body: 'Nothing lives at this address. The link may be old or mistyped.',
    home: 'Go to the home page',
  },
}
