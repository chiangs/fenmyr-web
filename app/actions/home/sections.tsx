import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import { ButtonLink } from '../../ui/button-link.tsx'
import { Screenshot } from '../../ui/screenshot.tsx'

export type SectionId = 'prototype' | 'myra' | 'local' | 'linux' | 'access' | 'built' | 'install' | 'support'

export interface HomeSection {
  id: SectionId
  title: string
  nav?: string
  content: RemixNode
}

const cardStyle = css({
  borderRadius: '24px',
  cornerShape: 'squircle',
  background: 'var(--card-white)',
  boxShadow: '0 10px 30px rgba(var(--sh), calc(.10 * var(--sh-k))), 0 1px 3px rgba(var(--sh), calc(.06 * var(--sh-k)))',
})

const proseStyle = css({
  display: 'grid',
  gap: '1rem',
  maxWidth: '44rem',
  color: 'var(--ink-soft)',
})

function Lead(handle: Handle<{ icon: string; tone: string; children?: RemixNode }>) {
  return () => {
    let { icon, tone, children } = handle.props

    return (
      <div mix={css({ display: 'flex', alignItems: 'flex-start', gap: '1rem', maxWidth: '44rem' })}>
        <span
          style={{ background: `var(--card-${tone})` }}
          mix={css({
            flex: 'none',
            display: 'grid',
            placeItems: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: 'var(--pill-r)',
            cornerShape: 'squircle',
          })}
        >
          <img src={`/images/${icon}.svg`} alt="" width={256} height={256} loading="lazy" mix={css({ width: '1.75rem', height: '1.75rem' })} />
        </span>
        <p mix={css({ alignSelf: 'center', fontSize: 'clamp(1.0625rem, 2vw, 1.1875rem)', color: 'var(--ink)' })}>{children}</p>
      </div>
    )
  }
}

function Points(handle: Handle<{ items: RemixNode[] }>) {
  return () => (
    <ul
      mix={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))',
        gap: '1rem',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        '& strong': { color: 'var(--ink)', fontWeight: 800 },
      })}
    >
      {handle.props.items.map((item, index) => (
        <li key={index} mix={[cardStyle, css({ padding: '1.25rem 1.375rem', color: 'var(--ink-soft)' })]}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export const sections: readonly HomeSection[] = [
  {
    id: 'prototype',
    title: 'From idea to prototype',
    nav: 'Why Fenmyr',
    content: (
      <>
        <Lead icon="prototype" tone="butter">
          Make a board into a prototype board, and Myra builds a working React and Tailwind app from its cards through
          Claude Code. Each prototype board keeps its own rules and design cards, and every build reads them.
        </Lead>
        <Screenshot
          light="/images/proto-built-light.png"
          dark="/images/proto-built-dark.png"
          alt="A prototype board: the board's cards, the preview at phone width, the code pane, and Myra's chat with a finished build, its files and Undo this build"
          width={1760}
          height={1100}
        />
        <Points
          items={[
            <>
              <strong>See it run.</strong> The preview sits beside the board at any device width.
            </>,
            <>
              <strong>Read the code.</strong> The code pane lists every file and marks what the last build changed.
            </>,
            <>
              <strong>Keep what works.</strong> Every build can be undone.
            </>,
            <>
              <strong>Git, explained.</strong> The code lives in your project's own repo, and Myra explains each git
              step in plain words.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'myra',
    title: 'Myra shows her work',
    content: (
      <>
        <Lead icon="myra" tone="pink">
          Myra reads your board and answers in the chat beside it.
        </Lead>
        <Points
          items={[
            <>
              <strong>Myra sees</strong> shows what she will read, and <strong>+ Add</strong> hands her pictures, text
              files or vault notes.
            </>,
            <>
              Before she changes more than ten cards, or removes any, she draws her plan on the board in dashed lines
              and waits.
            </>,
            <>
              After a reply she lists what changed, with one <strong>Undo</strong> for the whole reply.
            </>,
            <>
              Type <strong>/</strong> for commands that need no AI at all, such as <code>/find</code>,{' '}
              <code>/tidy</code> and <code>/timer</code>.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'local',
    title: 'Yours, on your computer',
    content: (
      <>
        <Lead icon="local" tone="mint">
          There's no account and no Fenmyr cloud. Your boards stay on your computer.
        </Lead>
        <Points
          items={[
            <>
              Each board is one JSON file under <code>~/.local/share/fenmyr</code>.
            </>,
            <>Switch Myra's thinking off, and the canvas works with no AI and no internet.</>,
            <>
              Connect an Obsidian vault read-only. Folders you put off-limits and <code>#private</code> notes are never
              read.
            </>,
            <>Export a board, a folder or a whole project as a zip, and open it on another computer.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'linux',
    title: 'Made for the Linux desktop',
    content: (
      <>
        <Lead icon="linux" tone="sky">
          Fenmyr is built for Arch and CachyOS on Wayland, and runs on Hyprland, KDE Plasma, GNOME, Sway and niri.
        </Lead>
        <div mix={proseStyle}>
          <p>
            The board fills a window with no title bar, so your compositor's tiling works as it does for any other
            window. On the Caelestia shell it takes on your desktop's colours and changes with them.
          </p>
          <p>It runs on macOS too.</p>
        </div>
      </>
    ),
  },
  {
    id: 'access',
    title: 'Accessible by design',
    content: (
      <>
        <Lead icon="access" tone="lilac">
          Six themes, three for each mode: Default, Midsummer and Clear for light, and Default, Polar Night and Lantern
          for dark.
        </Lead>
        <Points
          items={[
            <>Clear and Lantern hold AAA contrast, outline every card and thicken the focus ring.</>,
            <>Cards are named by their colour for screen readers.</>,
            <>F10 takes the keyboard to the bar over the selection, and every shortcut is listed.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'built',
    title: 'Built to last',
    content: (
      <>
        <Lead icon="built" tone="peach">
          Each of Fenmyr's rules comes with the check that enforces it.
        </Lead>
        <Points
          items={[
            <>
              <strong>Strict TypeScript.</strong> No <code>any</code>. Data from disk, the network and other processes
              is checked where it enters.
            </>,
            <>
              <strong>One bridge.</strong> The canvas and the host meet only through a typed contract.
            </>,
            <>
              <strong>A budget that only goes down.</strong> Casts, long files and raw colours are counted, and CI
              fails if a count rises.
            </>,
            <>
              <strong>Proof, not promises.</strong> Every pull request compares the app's screens pixel by pixel with
              the base branch.
            </>,
          ]}
        />
        <div mix={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem 1.5rem' })}>
          <p mix={css({ maxWidth: '36rem', color: 'var(--ink-soft)' })}>
            The code map shows every source file and every import, with a line on what each file is for.
          </p>
          <ButtonLink href="https://code-map.fenmyr.com/" quiet>
            Explore the code map
          </ButtonLink>
        </div>
      </>
    ),
  },
  {
    id: 'install',
    title: 'Install',
    nav: 'Install',
    content: (
      <>
        <p mix={css({ maxWidth: '44rem', color: 'var(--ink-soft)' })}>
          You need <strong>Node.js 22.18</strong> or newer to install from the code, and <strong>Claude Code</strong>{' '}
          for Myra and prototyping.
        </p>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))',
            gap: '1.25rem',
          })}
        >
          <div mix={[cardStyle, css({ display: 'grid', alignContent: 'start', gap: '1rem', padding: '1.5rem' })]}>
            <h3 mix={css({ fontSize: '1.375rem' })}>From the code</h3>
            <p mix={css({ color: 'var(--ink-soft)' })}>Recommended on Arch, CachyOS and macOS.</p>
            <pre
              mix={css({
                margin: 0,
                padding: '1rem 1.125rem',
                overflowX: 'auto',
                borderRadius: 'var(--pill-r)',
                cornerShape: 'squircle',
                background: 'color-mix(in oklab, var(--ink) 7%, var(--card-white))',
                color: 'var(--ink)',
                lineHeight: 1.7,
              })}
            >
              <code>
                {'git clone https://github.com/chiangs/fenmyr.git\ncd fenmyr\n./install.sh'}
              </code>
            </pre>
            <p mix={css({ color: 'var(--ink-soft)' })}>
              On Linux this adds Fenmyr to your app launcher. On macOS it builds Fenmyr.app and puts it in
              Applications.
            </p>
          </div>
          <div mix={[cardStyle, css({ display: 'grid', alignContent: 'start', gap: '1rem', padding: '1.5rem' })]}>
            <h3 mix={css({ fontSize: '1.375rem' })}>AppImage</h3>
            <p mix={css({ color: 'var(--ink-soft)' })}>
              For any x86-64 Linux with FUSE 2. Download it, make it executable and run it.
            </p>
            <div>
              <ButtonLink href="https://github.com/chiangs/fenmyr/releases">Download the AppImage</ButtonLink>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'support',
    title: 'Support Fenmyr',
    nav: 'Support',
    content: (
      <div
        mix={[
          cardStyle,
          css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1.5rem 2rem',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          }),
        ]}
      >
        <img
          src="/images/myra-love.png"
          alt="Myra with heart eyes, hearts floating up"
          width={136}
          height={160}
          loading="lazy"
          mix={css({ flex: 'none', width: '6.375rem' })}
        />
        <div mix={css({ flex: '1 1 20rem', display: 'grid', gap: '1rem', color: 'var(--ink-soft)' })}>
          <p mix={css({ fontSize: '1.1875rem', color: 'var(--ink)' })}>
            Fenmyr is free and made in spare hours. If it helps you think, you can help it grow.
          </p>
          <ul mix={css({ margin: 0, paddingLeft: '1.25rem' })}>
            <li>
              Star the <a href="https://github.com/chiangs/fenmyr">repository</a>, so others find it.
            </li>
            <li>Try the beta and report what breaks.</li>
          </ul>
          <div>
            <ButtonLink href="https://github.com/sponsors/chiangs">Sponsor on GitHub</ButtonLink>
          </div>
        </div>
      </div>
    ),
  },
]
