import { clientEntry, css, on } from 'remix/component'
import type { Handle } from 'remix/component'

import type { SlashCommand, SlashCopy, SlashGroup } from '../../../content/content.ts'
import { Myra } from '../../../ui/public/myra.tsx'
import { myraEvent } from '../../../ui/public/myra-event.ts'

// Myra's commands in the order her menu lists them, from the app's src/web/myra/greet.ts. The words after a command
// are code, as the app shows them, so they live here and not in the copy.
const commands: readonly { name: SlashCommand; arg: string; group: SlashGroup }[] = [
  { name: 'find', arg: '<words>', group: 'board' },
  { name: 'tag', arg: '<tag>', group: 'board' },
  { name: 'tidy', arg: '', group: 'board' },
  { name: 'due', arg: '[overdue|today]', group: 'board' },
  { name: 'fit', arg: '', group: 'board' },
  { name: 'timer', arg: '<minutes> <purpose>', group: 'board' },
  { name: 'template', arg: '<name>', group: 'board' },
  { name: 'project', arg: '[name]', group: 'make' },
  { name: 'folder', arg: '[name]', group: 'make' },
  { name: 'board', arg: '[name]', group: 'make' },
  { name: 'animate', arg: '<name>', group: 'chat' },
  { name: 'clear', arg: '', group: 'chat' },
  { name: 'help', arg: '', group: 'chat' },
]

interface Row {
  key: string
  command: string
  arg: string
  desc: string
  group?: string
  run: () => string
}

const listStyle = css({
  display: 'grid',
  maxHeight: '20rem',
  margin: 0,
  padding: '0.375rem',
  overflowY: 'auto',
  listStyle: 'none',
  '& [data-group]': {
    padding: '0.625rem 0.625rem 0.25rem',
    color: 'var(--card-white-soft)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  '& [role="option"]': {
    display: 'grid',
    gap: '0.0625rem',
    padding: '0.4375rem 0.625rem',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  '& [aria-selected="true"]': { background: 'var(--card-butter)', color: 'var(--card-butter-ink)' },
  '& code': { fontSize: '0.9375rem', fontWeight: 600 },
  '& code span': { opacity: 0.6, fontWeight: 400 },
  '& [role="option"] > span': { color: 'var(--card-white-soft)', fontSize: '0.875rem' },
  '& [aria-selected="true"] > span': { color: 'var(--card-butter-ink)' },
})

export const SlashDemo = clientEntry(import.meta.url, function SlashDemo(handle: Handle<{ copy: SlashCopy }>) {
  let started = false
  let text = '/'
  let selected = 0
  let reply = ''

  handle.queueTask(() => {
    started = true
    handle.update()
  })

  let hop = () => {
    document.dispatchEvent(new CustomEvent(myraEvent, { detail: 'hop' }))
    return handle.props.copy.hop.line
  }

  function rows(): Row[] {
    let { copy } = handle.props
    let typed = /^\/(\w*)/.exec(text)
    if (!typed) return []
    let name = (typed[1] ?? '').toLowerCase()
    // as in the app, /animate lists the moves she can make
    if (name === 'animate' && /^\/animate(\s|$)/i.test(text))
      return [{ key: 'animate hop', command: '/animate hop', arg: '', desc: copy.hop.desc, run: hop }]
    return commands
      .filter((command) => command.name.startsWith(name))
      .map((command) => ({
        key: command.name,
        command: `/${command.name}`,
        arg: command.arg,
        desc: copy.commands[command.name].desc,
        group: copy.groups[command.group],
        run: command.name === 'animate' ? hop : () => copy.commands[command.name].reply,
      }))
  }

  function run(row: Row | undefined) {
    if (!row) return
    reply = row.run()
    text = '/'
    selected = 0
    handle.update()
  }

  return () => {
    let { copy } = handle.props
    let shown = rows()
    let active = shown[Math.min(selected, shown.length - 1)]
    let last = ''

    return (
      <div
        mix={css({
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 34rem) minmax(0, 1fr)',
          alignItems: 'center',
          gap: '1.5rem 3rem',
          '@media (max-width: 52rem)': { gridTemplateColumns: 'minmax(0, 1fr)' },
        })}
      >
        <div
          mix={css({
            overflow: 'hidden',
            borderRadius: '20px',
            cornerShape: 'squircle',
            background: 'var(--card-white)',
            color: 'var(--card-white-ink)',
            boxShadow:
              'var(--card-edge, 0 0 0 0 transparent), 0 14px 40px rgba(var(--sh), calc(.12 * var(--sh-k))), 0 1px 3px rgba(var(--sh), calc(.06 * var(--sh-k)))',
          })}
        >
          <ul id="slash-list" role={started ? 'listbox' : undefined} aria-label={copy.input} mix={listStyle}>
            {shown.length === 0 ? <li data-group="">{copy.empty}</li> : null}
            {shown.map((row, index) => {
              let head = row.group && row.group !== last ? row.group : ''
              last = row.group ?? last
              let isActive = started && row === active
              return [
                head ? (
                  <li key={`group ${head}`} data-group="" role={started ? 'presentation' : undefined}>
                    {head}
                  </li>
                ) : null,
                <li
                  key={row.key}
                  id={`slash-${index}`}
                  role={started ? 'option' : undefined}
                  aria-selected={started ? isActive : undefined}
                  mix={on('click', () => run(row))}
                >
                  <code>
                    {row.command}
                    {row.arg ? <span> {row.arg}</span> : null}
                  </code>
                  <span>{row.desc}</span>
                </li>,
              ]
            })}
          </ul>
          {started ? (
            <div
              mix={css({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderTop: '1px solid var(--border)',
                '& input': {
                  flex: 1,
                  minWidth: 0,
                  border: 0,
                  outline: 0,
                  background: 'transparent',
                  color: 'var(--card-white-ink)',
                  font: '600 1rem ui-monospace, SFMono-Regular, Menlo, monospace',
                },
                '&:focus-within': { boxShadow: 'inset 0 0 0 2px var(--select)' },
                '& span': { color: 'var(--card-white-soft)', fontSize: '0.875rem' },
              })}
            >
              <input
                type="text"
                role="combobox"
                aria-label={copy.input}
                aria-controls="slash-list"
                aria-expanded="true"
                aria-autocomplete="list"
                aria-activedescendant={active ? `slash-${shown.indexOf(active)}` : undefined}
                autocomplete="off"
                spellcheck={false}
                value={text}
                mix={[
                  on('input', (event) => {
                    text = event.currentTarget.value
                    selected = 0
                    handle.update()
                  }),
                  on('keydown', (event) => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                      event.preventDefault()
                      if (shown.length === 0) return
                      let step = event.key === 'ArrowDown' ? 1 : -1
                      selected = ((active ? shown.indexOf(active) : 0) + step + shown.length) % shown.length
                      handle.update()
                    } else if (event.key === 'Enter') {
                      event.preventDefault()
                      run(active)
                    }
                  }),
                ]}
              />
              <span>{copy.hint}</span>
            </div>
          ) : null}
        </div>
        <div
          mix={css({
            display: 'grid',
            justifyItems: 'center',
            gap: '0.75rem',
            '@media (max-width: 52rem)': {
              order: -1,
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              alignItems: 'center',
              justifyItems: 'start',
            },
          })}
        >
          <p
            aria-live="polite"
            mix={css({
              maxWidth: '16rem',
              padding: '0.625rem 1rem',
              borderRadius: '20px',
              cornerShape: 'squircle',
              background: 'var(--card-butter)',
              color: 'var(--card-butter-ink)',
              fontFamily: 'var(--hand)',
              fontSize: '1.0625rem',
              lineHeight: 1.4,
              boxShadow: '0 8px 24px rgba(var(--sh), calc(.14 * var(--sh-k)))',
            })}
          >
            {reply || copy.bubble}
          </p>
          <Myra pose="hello" label={copy.myraAlt} size="clamp(4.25rem, 9vw, 7rem)" lazy />
        </div>
      </div>
    )
  }
})
