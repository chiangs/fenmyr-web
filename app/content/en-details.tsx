import type { HomeSectionsCopy } from './content.ts'

// the home page's sections from Connections to Support, in British English. en.tsx spreads them into its sections
export const details: Pick<
  HomeSectionsCopy,
  'connections' | 'local' | 'platforms' | 'access' | 'built' | 'beta' | 'install' | 'support'
> = {
  connections: {
    title: 'Works with what you already use',
    lead: 'Connect the tools you already use, or none of them. The canvas works on its own.',
    link: 'How to connect each one',
    items: {
      claude: {
        name: 'Claude Code',
        line: 'Myra thinks with Claude Code on your computer, signed in with your own Claude account.',
      },
      obsidian: {
        name: 'Obsidian',
        line: 'Fenmyr reads your vault and never writes to it. Each board chooses its folders, and #private notes stay unread.',
      },
      github: {
        name: 'Git and GitHub',
        line: 'Prototypes live in your own git repository. Fenmyr uses your gh command, so it never holds a GitHub token.',
      },
      mobbin: { name: 'Mobbin', line: 'Myra finds real app screens for inspiration, through your Claude account.' },
      higgsfield: {
        name: 'Higgsfield',
        line: 'Myra makes pictures through your Claude account. She shows the price and your balance, and waits for your yes.',
      },
    },
    more: {
      name: 'More to come',
      line: 'Which tool should Fenmyr work with next?',
      suggest: 'Suggest one on GitHub',
      myraAlt: 'Myra, a pixel cloudberry, beams beside the last card',
    },
  },
  local: {
    title: 'Yours, on your computer',
    lead: 'No account and no Fenmyr cloud. Your boards stay on your computer, and the AI runs only when you ask.',
    tiles: {
      offline: {
        title: 'Works offline',
        body: "Switch Myra's thinking off, and the canvas works with no AI and no internet.",
      },
      files: {
        title: 'Plain files',
        body: (
          <>
            Each board is one JSON file under <code>~/.local/share/fenmyr</code>. Back it up or copy it like any
            other file.
          </>
        ),
      },
      ask: {
        title: 'AI only when you ask',
        body: 'Myra thinks only when you ask her something or start a build. Then your board goes to Claude, the same as when you ask Claude yourself.',
      },
      export: {
        title: 'Take it with you',
        body: 'Export a board, a folder or a whole project as a zip, and open it on another computer.',
      },
    },
  },
  platforms: {
    title: 'Made for Linux and Mac',
    lead: 'Fenmyr runs on Linux and on Macs with Apple Silicon or Intel.',
    linux: {
      title: 'Linux',
      body: "Made for Arch and CachyOS on Wayland, and runs on Hyprland, KDE Plasma, GNOME, Sway and niri. The board fills a window with no title bar, so your compositor's tiling works as it does for any other window. On the Caelestia shell it takes on your desktop's colours.",
    },
    mac: {
      title: 'Mac',
      body: "Build it from the code and Fenmyr.app goes into Applications, where it opens with no warning. The installer offers to set up Node.js with Homebrew if it's missing.",
    },
    updates: 'Installed from the code, Fenmyr updates itself on both.',
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
  beta: {
    title: 'In beta, with lots more on the way',
    lead: 'Fenmyr is young and growing fast. New things land in the beta first, and lots more features are coming.',
    tiles: {
      update: {
        title: 'It updates itself',
        body: (
          <>
            When a new version is ready, a dot shows on the ⚙. <strong>Update now</strong> rebuilds and reopens
            without touching your boards.
          </>
        ),
      },
      channel: {
        title: 'Pick your pace',
        body: 'Choose Stable for tested releases, or Beta for new things early, with some rough edges.',
      },
      report: {
        title: 'Tell us what breaks',
        body: (
          <>
            Report it on GitHub, and paste in what <strong>Copy details</strong> in Settings gives you.
          </>
        ),
      },
    },
    labels: { update: 'Update now', channel: 'Beta', report: 'Copy details' },
    follow: 'Follow along on GitHub',
    report: 'Report a problem',
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
    star: (
      <>
        Star the <a href="https://github.com/chiangs/fenmyr">repository</a>, so others find it.
      </>
    ),
    sponsor: 'Sponsor on GitHub',
  },
}
