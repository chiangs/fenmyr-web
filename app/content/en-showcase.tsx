import type { HomeSectionsCopy } from './content.ts'

// the home page's showcase sections, in British English. en.tsx spreads them into its sections
export const showcase: Pick<HomeSectionsCopy, 'prototype' | 'ripe' | 'myra' | 'slash' | 'work' | 'templates'> = {
  prototype: {
    title: 'From idea to prototype',
    nav: 'Why Fenmyr',
    lead: 'Make any board a prototype board. Myra turns its cards into a clickable React and Tailwind preview through Claude Code, so you can experiment with the idea and test it. Each prototype board keeps its own rules and design cards, and every build reads them.',
    screenshotAlt:
      "A prototype board: the board's cards, the preview at phone width, the code pane, and Myra's chat after a build, with its files and Undo this build",
    tiles: {
      paper: {
        title: 'Start on paper',
        body: 'Photograph a paper sketch and drop it in, or draw on the board. Myra builds from what she sees, wireframes too.',
      },
      run: { title: 'See it run', body: 'The preview sits beside the board at any device width.' },
      live: {
        title: 'Change it live',
        body: (
          <>
            Try colours and sizes as the preview changes, with no AI and no tokens spent. Myra adds the controls when
            you ask, and <strong>Keep these values</strong> saves them to the prototype.
          </>
        ),
      },
      code: {
        title: 'Read the code',
        body: (
          <>
            The code pane lists every file and marks what the last build changed. <strong>Point</strong> at anything in
            the preview to open the line that draws it, and the code links back to the cards it came from.
          </>
        ),
      },
      versions: {
        title: 'Compare versions',
        body: 'Capture the preview as you go, and the pictures line up side by side on the board. Click one to see that version run again. Every build can be undone.',
      },
      git: {
        title: 'Git, explained',
        body: 'The code lives in your own git repository. Myra explains each git step in plain words, and waits for your yes before she commits, pushes or pulls.',
      },
    },
  },
  ripe: {
    title: 'From raw to ripe',
    lead: 'Fenmyr is named for the northern bog where cloudberries grow, and only when the conditions are right. Ideas are the same.',
    bubble: "Bring them raw. We'll ripen them together.",
    myraAlt: 'Myra, a pixel cloudberry, beams beside her bubble',
    steps: {
      catch: {
        name: 'Catch',
        body: (
          <>
            Press <strong>Ctrl+K</strong> and the thought lands in Unsorted, without losing your place. Or talk it
            out in a voice memo.
          </>
        ),
      },
      sort: {
        name: 'Sort',
        body: (
          <>
            Ask Myra to sort the pile, or type <code>/tidy</code> to line the loose notes up in rows. An affinity map
            helps you find the themes.
          </>
        ),
      },
      shape: {
        name: 'Shape',
        body: 'Sketch the screens, by hand or as wireframes, map the journey, and give the next steps due dates.',
      },
      try: {
        name: 'Try',
        body: 'Make it a prototype board. Myra builds a clickable preview you can experiment with and test.',
      },
    },
    labels: { capture: 'Ctrl+K', preview: 'Sign up' },
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
      research: {
        title: 'She researches with you',
        body: 'Turn on web search, and she looks things up and lays out what she finds as cards and docs for you to sort.',
      },
      settings: {
        title: 'Set her your way',
        body: 'Choose her model and effort, how chatty she is and how much she moves.',
      },
    },
    labels: { add: '+ Add', undo: 'Undo', stop: 'Ctrl+.' },
  },
  slash: {
    title: 'Type / for the quick things',
    lead: "Thirteen commands in Myra's chat that need no AI and no internet. They work even with her thinking switched off.",
    bubble: 'Type / and I answer at once. Try /animate.',
    myraAlt: 'Myra, a pixel cloudberry, beams beside the command list',
    input: "Type one of Myra's commands",
    hint: 'Enter runs it',
    empty: 'No command starts like that',
    groups: { board: 'On this board', make: 'Make something', chat: 'In this chat' },
    commands: {
      find: { desc: 'Find cards that mention something', reply: "In Fenmyr I'd show you every card that mentions it." },
      tag: { desc: 'Show the cards with a tag', reply: "In Fenmyr I'd show you the cards with that tag." },
      tidy: { desc: 'Line the loose notes up in rows', reply: "In Fenmyr I'd line your loose notes up in rows." },
      due: {
        desc: 'List what is overdue and coming up on every board',
        reply: "In Fenmyr I'd list what's overdue and coming up, on every board.",
      },
      fit: { desc: 'Zoom to see everything', reply: "In Fenmyr I'd zoom out until you can see everything." },
      timer: {
        desc: 'Start a timer, with an optional purpose',
        reply: "In Fenmyr I'd start the clock and warn you two minutes before the end.",
      },
      template: {
        desc: 'Add a template, or start a board from one',
        reply: "In Fenmyr I'd add the template you name, or start a new board from it.",
      },
      project: {
        desc: 'Start a project and choose how its first board begins',
        reply: "In Fenmyr I'd start a project and ask how its first board should begin.",
      },
      folder: { desc: 'Add a folder to this project', reply: "In Fenmyr I'd add a folder to this project." },
      board: { desc: 'Add a board to this folder and open it', reply: "In Fenmyr I'd add a board here and open it." },
      animate: { desc: 'Make me hop' },
      clear: { desc: 'Start a fresh chat', reply: "In Fenmyr I'd start us a fresh chat." },
      help: {
        desc: 'What I can do without thinking',
        reply: 'Here is what I can do right here, no thinking needed. Everything in this list.',
      },
    },
    hop: { desc: 'A little jump', line: 'Boing!', still: "I'd hop, but I'm keeping still for you right now." },
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
  templates: {
    title: 'Fifteen ways to start',
    nav: 'Templates',
    lead: 'Templates for designers, product leads, workshop facilitators and makers. Each one comes with an instruction card, so you never face a blank board. Make your own, too.',
    filter: 'Show templates for',
    all: 'All',
    shown: '{count} templates match',
    roles: {
      designers: 'Designers',
      productLeads: 'Product leads',
      facilitators: 'Facilitators',
      makers: 'Makers',
    },
    groups: { think: 'Think', capture: 'Capture', plan: 'Plan', lookBack: 'Look back', build: 'Build' },
    // names and lines as the app's template picker shows them
    items: {
      empathy: { name: 'Empathy map', line: 'What they say, think, do and feel' },
      journey: { name: 'Journey map', line: 'Steps, feelings and pain points' },
      affinity: { name: 'Affinity map', line: 'Cluster notes into themes' },
      hmw: { name: 'How might we', line: 'Turn problems into questions' },
      opportunity: { name: 'Opportunity map', line: 'Outcome → opportunities → solutions' },
      impact: { name: 'Impact / effort', line: 'Sort ideas into four boxes' },
      moodboard: { name: 'Moodboard', line: 'Pictures, colours and fonts for a feeling' },
      brainDump: { name: 'Brain dump', line: "Empty your head, then I'll sort it" },
      okrs: { name: 'OKRs and opportunities', line: 'A vision, its key results and an opportunity tree' },
      kickoff: { name: 'Product kickoff', line: 'Why, who for, the edges and the first steps' },
      appPlan: { name: 'App plan', line: "Who it's for, the problem, the screens" },
      workshop: { name: 'Workshop planning', line: 'Define, design, prepare, run and follow up a workshop' },
      kanban: { name: 'Kanban', line: 'Cards move from to do to done' },
      retro: { name: 'Start, stop, continue', line: 'A quick, kind retro' },
      prototype: { name: 'Prototype', line: 'A clickable prototype Myra codes from your wireframes and notes' },
    },
  },
}
