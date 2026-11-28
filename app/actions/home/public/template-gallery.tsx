import { clientEntry, css, on } from 'remix/component'
import type { Handle } from 'remix/component'

import type { TemplateGroup, TemplateId, TemplateRole, TemplatesCopy } from '../../../content/content.ts'

type Thumb = 'quad' | 'columns' | 'flow' | 'tree' | 'scatter' | 'list' | 'screens' | 'board' | 'window'

// The app's templates in its picker's order and groups, from src/web/features/templateList.ts, with the roles each
// one suits and the shape of its board for the thumbnail.
const templates: readonly { id: TemplateId; group: TemplateGroup; thumb: Thumb; roles: readonly TemplateRole[] }[] = [
  { id: 'empathy', group: 'think', thumb: 'quad', roles: ['designers'] },
  { id: 'journey', group: 'think', thumb: 'flow', roles: ['designers'] },
  { id: 'affinity', group: 'think', thumb: 'scatter', roles: ['designers', 'facilitators'] },
  { id: 'hmw', group: 'think', thumb: 'list', roles: ['designers', 'facilitators'] },
  { id: 'opportunity', group: 'think', thumb: 'tree', roles: ['productLeads'] },
  { id: 'impact', group: 'think', thumb: 'quad', roles: ['productLeads', 'facilitators'] },
  { id: 'moodboard', group: 'capture', thumb: 'board', roles: ['designers', 'makers'] },
  { id: 'brainDump', group: 'capture', thumb: 'scatter', roles: ['facilitators', 'makers'] },
  { id: 'okrs', group: 'plan', thumb: 'tree', roles: ['productLeads'] },
  { id: 'kickoff', group: 'plan', thumb: 'list', roles: ['productLeads'] },
  { id: 'appPlan', group: 'plan', thumb: 'screens', roles: ['designers', 'productLeads', 'makers'] },
  { id: 'workshop', group: 'plan', thumb: 'flow', roles: ['facilitators'] },
  { id: 'kanban', group: 'plan', thumb: 'columns', roles: ['productLeads', 'makers'] },
  { id: 'retro', group: 'lookBack', thumb: 'columns', roles: ['facilitators'] },
  { id: 'prototype', group: 'build', thumb: 'window', roles: ['designers', 'makers'] },
]

const roles: readonly TemplateRole[] = ['designers', 'productLeads', 'facilitators', 'makers']

const block = (background: string, extra: Record<string, string> = {}) => ({ display: 'block', borderRadius: '3px', background, ...extra })

const thumbStyles: Record<Thumb, ReturnType<typeof css>> = {
  quad: css({
    gridTemplate: '1fr 1fr / 1fr 1fr',
    '& i:nth-child(1)': block('var(--card-pink)'),
    '& i:nth-child(2)': block('var(--card-mint)'),
    '& i:nth-child(3)': block('var(--card-sky)'),
    '& i:nth-child(4)': block('var(--card-butter)'),
  }),
  columns: css({
    gridTemplateColumns: 'repeat(3, 1fr)',
    alignContent: 'start',
    '& i': block('var(--card-white)', { height: '0.5rem' }),
    '& i:nth-child(n+4)': block('var(--card-butter)', { height: '0.5rem' }),
  }),
  flow: css({
    gridTemplateColumns: 'repeat(4, 1fr)',
    alignItems: 'center',
    justifyItems: 'center',
    '& i': block('var(--card-sky)', { width: '0.875rem', height: '0.875rem', borderRadius: '50%' }),
    '& i:nth-child(even)': block('var(--pink-deep)', { width: '0.875rem', height: '0.875rem', borderRadius: '50%' }),
  }),
  tree: css({
    gridTemplate: '1fr 1fr / 1fr 1fr 1fr',
    '& i': block('var(--card-mint)', { gridRow: '2' }),
    '& i:first-child': block('var(--card-butter)', { gridRow: '1', gridColumn: '2' }),
  }),
  scatter: css({
    position: 'relative',
    display: 'block',
    '& i': block('var(--card-butter)', { position: 'absolute', width: '1rem', height: '0.8125rem' }),
    '& i:nth-child(1)': { left: '10%', top: '12%', rotate: '-8deg' },
    '& i:nth-child(2)': { left: '42%', top: '42%', rotate: '6deg', background: 'var(--card-pink)' },
    '& i:nth-child(3)': { left: '66%', top: '10%', background: 'var(--card-mint)' },
    '& i:nth-child(4)': { left: '18%', top: '58%', rotate: '4deg', background: 'var(--card-sky)' },
  }),
  list: css({
    alignContent: 'center',
    '& i': block('color-mix(in oklab, var(--card-white-ink) 22%, transparent)', { height: '0.375rem' }),
    '& i:first-child': block('var(--pink-deep)', { height: '0.375rem', width: '60%' }),
  }),
  screens: css({
    gridTemplateColumns: 'repeat(3, 1fr)',
    '& i': block('var(--card-white)', {
      border: '1.5px solid color-mix(in oklab, var(--card-white-ink) 40%, transparent)',
      borderRadius: '4px',
    }),
  }),
  board: css({
    gridTemplate: '1fr 1fr / 1.4fr 1fr',
    '& i:nth-child(1)': block('var(--card-lilac)', { gridRow: 'span 2' }),
    '& i:nth-child(2)': block('var(--myra-body)'),
    '& i:nth-child(3)': block('var(--card-mint)'),
  }),
  window: css({
    gridTemplateRows: '0.5rem 1fr',
    '& i:first-child': block('color-mix(in oklab, var(--card-white-ink) 28%, transparent)'),
    '& i:last-child': block('var(--card-white)'),
  }),
}

const count: Record<Thumb, number> = { quad: 4, columns: 6, flow: 4, tree: 4, scatter: 4, list: 3, screens: 3, board: 3, window: 2 }

// read by screen readers, unseen on screen
const hidden = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
})

const chipStyle = css({
  padding: '0.375rem 0.875rem',
  border: '1px solid var(--border)',
  borderRadius: '999px',
  background: 'var(--card-white)',
  color: 'var(--card-white-ink)',
  font: 'inherit',
  fontSize: '0.9375rem',
  fontWeight: 600,
  cursor: 'pointer',
  '& span': { marginLeft: '0.375rem', color: 'var(--card-white-soft)', fontWeight: 400 },
  '&[aria-pressed="true"]': { borderColor: 'var(--pink-deep)', background: 'var(--pink-deep)', color: 'var(--on-accent)' },
  '&[aria-pressed="true"] span': { color: 'inherit' },
  '&:focus-visible': { outline: '3px solid var(--select)', outlineOffset: '2px' },
})

export const TemplateGallery = clientEntry(
  import.meta.url,
  function TemplateGallery(handle: Handle<{ copy: TemplatesCopy }>) {
    let role: TemplateRole | null = null
    let chosen = false

    let choose = (next: TemplateRole | null) => {
      role = next
      chosen = true
      handle.update()
    }

    return () => {
      let { copy } = handle.props
      let matches = (template: (typeof templates)[number]) => !role || template.roles.includes(role)
      let shown = templates.filter(matches)

      return (
        <div mix={css({ display: 'grid', gap: '1.25rem' })}>
          {/* the chips render on the server too, so they take their space before the island starts; without
              JavaScript, which the head script marks with data-js, they stay hidden and all fifteen show */}
          <div
            role="group"
            aria-label={copy.filter}
            mix={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              ':root:not([data-js]) &': { display: 'none' },
            })}
          >
              <button type="button" aria-pressed={role === null} mix={[chipStyle, on('click', () => choose(null))]}>
                {copy.all}
                <span>{templates.length}</span>
              </button>
              {roles.map((each) => (
                <button
                  key={each}
                  type="button"
                  aria-pressed={role === each}
                  mix={[chipStyle, on('click', () => choose(each))]}
                >
                  {copy.roles[each]}
                  <span>{templates.filter((template) => template.roles.includes(each)).length}</span>
                </button>
              ))}
          </div>
          <p aria-live="polite" mix={hidden}>
            {chosen ? copy.shown.replace('{count}', String(shown.length)) : ''}
          </p>
          <ul
            mix={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 15.5rem), 1fr))',
              gap: '0.75rem',
              margin: 0,
              padding: 0,
              listStyle: 'none',
            })}
          >
            {/* every template stays in its place, so choosing a role never moves the page; the ones that don't suit
                it fade, and screen readers skip them, as they would a removed card */}
            {templates.map((template) => {
              let { name, line } = copy.items[template.id]
              let faded = !matches(template)
              return (
                <li
                  key={template.id}
                  data-template={template.id}
                  data-faded={faded ? '' : undefined}
                  aria-hidden={faded ? true : undefined}
                  mix={css({
                    display: 'grid',
                    gridTemplateColumns: '4.25rem minmax(0, 1fr)',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.75rem',
                    borderRadius: '18px',
                    cornerShape: 'squircle',
                    background: 'var(--card-white)',
                    color: 'var(--card-white-soft)',
                    boxShadow:
                      'var(--card-edge, 0 0 0 0 transparent), 0 6px 18px rgba(var(--sh), calc(.08 * var(--sh-k))), 0 1px 3px rgba(var(--sh), calc(.06 * var(--sh-k)))',
                    '&[data-faded]': { opacity: 0.3 },
                    '@media (prefers-reduced-motion: no-preference)': { transition: 'opacity 160ms ease' },
                  })}
                >
                  <span
                    aria-hidden="true"
                    mix={[
                      css({
                        display: 'grid',
                        gap: '3px',
                        height: '3.5rem',
                        padding: '0.3125rem',
                        borderRadius: '10px',
                        background: 'var(--card-peach)',
                      }),
                      thumbStyles[template.thumb],
                    ]}
                  >
                    {Array.from({ length: count[template.thumb] }, (_, index) => (
                      <i key={index} />
                    ))}
                  </span>
                  <span mix={css({ display: 'grid', gap: '0.125rem', minWidth: 0 })}>
                    <small
                      mix={css({ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' })}
                    >
                      {copy.groups[template.group]}
                    </small>
                    <strong mix={css({ color: 'var(--card-white-ink)', fontSize: '1rem', fontWeight: 800 })}>{name}</strong>
                    <span mix={css({ fontSize: '0.875rem', lineHeight: 1.4 })}>{line}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }
  },
)
