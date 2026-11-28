import type { Content } from './content.ts'

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
    prototype: {
      title: 'From idea to prototype',
      nav: 'Why Fenmyr',
      lead: 'Make any board a prototype board. Myra turns its cards into a clickable React and Tailwind preview through Claude Code, so you can experiment with the idea and test it. Each prototype board keeps its own rules and design cards, and every build reads them.',
      screenshotAlt:
        "A prototype board: the board's cards, the preview at phone width, the code pane, and Myra's chat after a build, with its files and Undo this build",
      tiles: {
        run: { title: 'See it run', body: 'The preview sits beside the board at any device width.' },
        live: { title: 'Change it live', body: 'Controls above the preview change its values as you watch.' },
        point: {
          title: 'Point at it',
          body: (
            <>
              <strong>Point</strong> at anything in the preview to open the line of code that draws it.
            </>
          ),
        },
        code: {
          title: 'Read the code',
          body: 'The code pane lists every file and marks what the last build changed. The code links back to the cards it came from.',
        },
        keep: {
          title: 'Keep what works',
          body: 'Every build can be undone. A capture puts a picture of the preview on the board, tied to the commit it shows.',
        },
        git: {
          title: 'Git, explained',
          body: 'The code lives in your own git repository. Myra explains each git step in plain words, and waits for your yes before she commits, pushes or pulls.',
        },
      },
      labels: { point: 'Point', undo: 'Undo this build' },
    },
    myra: {
      title: 'Myra shows her work',
      lead: 'Myra reads your board and answers in the chat beside it. She asks before big changes, and one Undo takes back a whole reply.',
      tiles: {
        sees: {
          title: 'She shows what she reads',
          body: (
            <>
              <strong>Myra sees</strong> shows what she will read, and <strong>+ Add</strong> hands her pictures, text
              files or vault notes.
            </>
          ),
        },
        asks: {
          title: 'She asks first',
          body: 'Before she changes more than ten cards, or removes any, she draws her plan on the board in dashed lines and waits.',
        },
        undo: {
          title: 'One undo per reply',
          body: (
            <>
              After a reply she lists what changed, with <strong>Show on board</strong> and one <strong>Undo</strong> for
              the whole reply.
            </>
          ),
        },
        stop: {
          title: 'Stop her any time',
          body: (
            <>
              While she works, <strong>Ctrl+.</strong> stops her. On a prototype board it ends the build too.
            </>
          ),
        },
        type: { title: 'She explores type', body: 'She sets out type specimens from your computer or Google Fonts.' },
        settings: {
          title: 'Set her your way',
          body: 'Choose her model and effort, how chatty she is and how much she moves.',
        },
      },
      labels: { add: '+ Add', undo: 'Undo', stop: 'Ctrl+.', type: 'Aa' },
    },
    work: {
      title: 'Ideas and the work around them',
      lead: 'An idea comes with things to do. Keep both in the same place.',
      timer: {
        title: 'Timers with a face',
        how: (
          <>
            Type <code>/timer 25 write the intro</code>, or just ask Myra. The timer counts down by the clock, so it
            keeps going through sleep, restarts and switching boards.
          </>
        ),
        faces:
          'Myra warns you two minutes before the end. She looks sleepy through a break and startled near the finish. When time is up she hops, berry confetti bursts out, and her pill glows red after work or green after a break.',
        time: '23:41',
        purpose: 'write the intro',
        presets: ['15 min break', '50 min focus', '5 min breather'],
      },
      tiles: {
        due: {
          title: 'Due dates that find you',
          body: (
            <>
              Give a note a due date. <code>/due</code> lists what is overdue and coming up on every board, and Myra
              reminds you, even about notes on other boards.
            </>
          ),
        },
        home: { title: 'A home for every project', body: 'Projects, folders and boards each get a home page.' },
        kanban: { title: 'Kanbans', body: 'Cards move across the columns until they are done, on the same board as the ideas.' },
        find: {
          title: 'Focus and find',
          body: (
            <>
              <strong>F</strong> focuses on the selected cards, and <strong>Ctrl+F</strong> finds anything a card
              shows on the board.
            </>
          ),
        },
      },
      labels: { overdue: 'Overdue', today: 'Today', friday: 'Friday', focus: 'F', find: 'Ctrl+F' },
    },
    local: {
      title: 'Yours, on your computer',
      lead: "There's no account and no Fenmyr cloud. Your boards stay on your computer.",
      points: [
        <>
          Each board is one JSON file under <code>~/.local/share/fenmyr</code>.
        </>,
        <>Switch Myra's thinking off, and the canvas works with no AI and no internet.</>,
        <>
          Connect an Obsidian vault read-only. Folders you put off-limits and <code>#private</code> notes are never
          read.
        </>,
        <>Export a board, a folder or a whole project as a zip, and open it on another computer.</>,
      ],
    },
    linux: {
      title: 'Made for the Linux desktop',
      lead: 'Fenmyr is built for Arch and CachyOS on Wayland, and runs on Hyprland, KDE Plasma, GNOME, Sway and niri.',
      body: "The board fills a window with no title bar, so your compositor's tiling works as it does for any other window. On the Caelestia shell it takes on your desktop's colours and changes with them.",
      macos: 'It runs on macOS too.',
    },
    access: {
      title: 'Accessible by design',
      lead: 'Six themes, three for each mode: Default, Midsummer and Clear for light, and Default, Polar Night and Lantern for dark.',
      points: [
        <>Clear and Lantern hold AAA contrast, outline every card and thicken the focus ring.</>,
        <>Cards are named by their colour for screen readers.</>,
        <>F10 takes the keyboard to the bar over the selection, and every shortcut is listed.</>,
      ],
    },
    built: {
      title: 'Built to last',
      lead: "Each of Fenmyr's rules comes with the check that enforces it.",
      points: [
        <>
          <strong>Strict TypeScript.</strong> No <code>any</code>. Data from disk, the network and other processes is
          checked where it enters.
        </>,
        <>
          <strong>One bridge.</strong> The canvas and the host meet only through a typed contract.
        </>,
        <>
          <strong>A budget that only goes down.</strong> Casts, long files and raw colours are counted, and CI fails if
          a count rises.
        </>,
        <>
          <strong>Proof, not promises.</strong> Every pull request compares the app's screens pixel by pixel with the
          base branch.
        </>,
      ],
      codeMap: 'The code map shows every source file and every import, with a line on what each file is for.',
      codeMapButton: 'Explore the code map',
    },
    install: {
      title: 'Install',
      nav: 'Install',
      needs: (
        <>
          You need <strong>Node.js 22.18</strong> or newer to install from the code, and <strong>Claude Code</strong>{' '}
          for Myra and prototyping.
        </>
      ),
      fromCode: {
        title: 'From the code',
        note: 'Recommended on Arch, CachyOS and macOS.',
        result: 'On Linux this adds Fenmyr to your app launcher. On macOS it builds Fenmyr.app and puts it in Applications.',
      },
      appImage: {
        title: 'AppImage',
        note: 'For any x86-64 Linux with FUSE 2. Download it, make it executable and run it.',
        button: 'Download the AppImage',
      },
    },
    support: {
      title: 'Support Fenmyr',
      nav: 'Support',
      myraAlt: 'Myra with heart eyes, hearts floating up',
      pitch: 'Fenmyr is free and made in spare hours. If it helps you think, you can help it grow.',
      ways: {
        star: (
          <>
            Star the <a href="https://github.com/chiangs/fenmyr">repository</a>, so others find it.
          </>
        ),
        beta: 'Try the beta and report what breaks.',
      },
      sponsor: 'Sponsor on GitHub',
    },
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
