import { clientEntry, css, on } from 'remix/component'
import type { Handle } from 'remix/component'

import { iconButtonStyle } from './icon-button.ts'

type Mode = 'light' | 'dark'

export interface ThemePickerGroup {
  mode: Mode
  label: string
  choices: { id: string; name: string }[]
}

export interface ThemePickerProps {
  label: string
  system: string
  groups: ThemePickerGroup[]
  storageKey: string
}

const rootStyle = css({
  display: 'contents',
  ':root:not([data-js]) &': { display: 'none' },
})

const panelStyle = css({
  display: 'none',
  '&:popover-open': { display: 'block' },
  position: 'fixed',
  inset: 'auto',
  top: 'calc(var(--header-h, 5.3125rem) + 0.5rem)',
  right: 'calc(max(0px, (100% - 72rem) / 2) + clamp(1rem, 4vw, 2rem))',
  width: 'min(17rem, calc(100% - 2rem))',
  maxHeight: 'calc(100dvh - var(--header-h, 5.3125rem) - 1rem)',
  overflow: 'auto',
  margin: 0,
  padding: '0.75rem',
  border: '1px solid var(--dot)',
  borderRadius: '24px',
  cornerShape: 'squircle',
  background: 'var(--board)',
  color: 'var(--ink)',
  boxShadow: '0 18px 40px rgba(var(--sh), calc(.16 * var(--sh-k)))',
  '& fieldset': { display: 'grid', gap: '0.125rem', minWidth: 0, margin: 0, padding: 0, border: 0 },
  '& fieldset fieldset': { marginTop: '0.5rem' },
  '& legend': {
    padding: '0 0.5rem 0.25rem',
    color: 'var(--ink-soft)',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  '& > fieldset > legend': { color: 'var(--ink)', fontSize: '1rem', fontWeight: 800 },
  '& label': {
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr',
    alignItems: 'center',
    gap: '0.625rem',
    minHeight: '2.75rem',
    paddingInline: '0.5rem',
    borderRadius: 'var(--pill-r)',
    cornerShape: 'squircle',
    cursor: 'pointer',
  },
  '& label:hover, & label:has(:checked)': { background: 'color-mix(in oklab, var(--ink) 7%, transparent)' },
  '& input': { margin: 0, accentColor: 'var(--accent-text)' },
  '@media (prefers-reduced-motion: no-preference)': {
    '&:popover-open': {
      transition: 'opacity 160ms ease-out, translate 160ms ease-out',
      '@starting-style': { opacity: 0, translate: '0 -0.375rem' },
    },
  },
})

const swatchStyle = css({
  display: 'flex',
  width: '2.5rem',
  height: '1.75rem',
  overflow: 'hidden',
  borderRadius: '8px',
  cornerShape: 'squircle',
  boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--ink) 30%, transparent)',
  '& > span': {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    background: 'var(--board)',
  },
  '& > span::before, & > span::after': {
    content: '""',
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    background: 'var(--pink-deep)',
  },
  '& > span::after': { background: 'var(--ink)' },
  '& > span + span::before': { display: 'none' },
  '& > span:has(+ span)::after': { display: 'none' },
})

function systemMode(): Mode {
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function shownMode(): Mode {
  let mode = document.documentElement.dataset.mode
  return mode === 'light' || mode === 'dark' ? mode : systemMode()
}

function near(element: Element | null) {
  if (!element) return false
  let { top, bottom } = element.getBoundingClientRect()
  return bottom > -innerHeight && top < innerHeight * 2
}

async function loadScreenshots(mode: Mode) {
  let images = Array.from(document.querySelectorAll<HTMLImageElement>(`picture[data-variant="${mode}"] img`)).filter(
    (image) => near(image.closest('picture')?.parentElement ?? null),
  )
  for (let image of images) image.loading = 'eager'
  await Promise.race([
    Promise.allSettled(images.map((image) => image.decode())),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ])
}

function save(key: string, id: string) {
  try {
    if (id) localStorage.setItem(key, id)
    else localStorage.removeItem(key)
  } catch {}
}

export const ThemePicker = clientEntry(import.meta.url, function ThemePicker(handle: Handle<ThemePickerProps>) {
  let selected = typeof document === 'undefined' ? '' : (document.documentElement.dataset.theme ?? '')
  let latest = 0

  async function choose(id: string, mode: Mode | null) {
    let ticket = ++latest
    selected = id
    handle.update()
    save(handle.props.storageKey, id)
    let apply = () => {
      let root = document.documentElement
      if (mode) {
        root.dataset.theme = id
        root.dataset.mode = mode
      } else {
        delete root.dataset.theme
        delete root.dataset.mode
      }
    }
    if (typeof document.startViewTransition !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply()
      return
    }
    let next = mode ?? systemMode()
    if (next !== shownMode()) await loadScreenshots(next)
    if (ticket !== latest) return
    document.startViewTransition(apply).ready.catch(() => {})
  }

  return () => {
    let { label, system, groups } = handle.props
    let light = groups.find((group) => group.mode === 'light')?.choices[0]?.id
    let dark = groups.find((group) => group.mode === 'dark')?.choices[0]?.id

    return (
      <div mix={rootStyle}>
        <button type="button" popovertarget="theme-picker" aria-label={label} mix={iconButtonStyle}>
          <svg
            viewBox="0 0 24 24"
            width={24}
            height={24}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
          >
            <path d="M12 3a9 9 0 0 0 0 18c1.2 0 2-.8 2-1.9 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-1.9 2-1.9h2a4 4 0 0 0 4-4C21 6.4 17 3 12 3Z" />
            <circle cx="7.5" cy="11" r="1" fill="currentColor" />
            <circle cx="10.5" cy="7" r="1" fill="currentColor" />
            <circle cx="15.5" cy="7.5" r="1" fill="currentColor" />
          </svg>
        </button>
        <div
          id="theme-picker"
          popover
          mix={[
            panelStyle,
            on('toggle', (event) => {
              if (!event.currentTarget.matches(':popover-open')) return
              let checked = event.currentTarget.querySelector('input:checked')
              if (checked instanceof HTMLElement) checked.focus()
            }),
          ]}
        >
          <fieldset>
            <legend>{label}</legend>
            <label>
              <input
                type="radio"
                name="theme"
                value=""
                checked={selected === ''}
                mix={on('change', () => choose('', null))}
              />
              <span mix={swatchStyle}>
                <span data-theme={light} />
                <span data-theme={dark} />
              </span>
              <span>{system}</span>
            </label>
            {groups.map((group) => (
              <fieldset key={group.mode}>
                <legend>{group.label}</legend>
                {group.choices.map((choice) => (
                  <label key={choice.id}>
                    <input
                      type="radio"
                      name="theme"
                      value={choice.id}
                      checked={selected === choice.id}
                      mix={on('change', () => choose(choice.id, group.mode))}
                    />
                    <span data-theme={choice.id} mix={swatchStyle}>
                      <span />
                    </span>
                    <span>{choice.name}</span>
                  </label>
                ))}
              </fieldset>
            ))}
          </fieldset>
        </div>
      </div>
    )
  }
})
