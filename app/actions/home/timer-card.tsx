import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import type { TimerCopy } from '../../content/content.ts'
import { cardStyle } from '../../ui/card.ts'

// Phosphor's timer and close icons, as the app's own icon pack draws them
const timerIcon = 'M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32l40-40A8,8,0,0,1,173.66,90.34ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z'
const closeIcon = 'M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z'

function Icon(handle: Handle<{ d: string; size: number }>) {
  return () => (
    <svg viewBox="0 0 256 256" width={handle.props.size} height={handle.props.size} fill="currentColor">
      <path d={handle.props.d} />
    </svg>
  )
}

const shadow = '0 6px 18px rgba(var(--sh), calc(.16 * var(--sh-k)))'

// the app's timer chip: the time, what it's for, a close button and a bar for the time left
function Chip(handle: Handle<{ time: string; purpose: string }>) {
  return () => (
    <span
      mix={css({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        height: '2.5rem',
        padding: '0 0.5rem 0 0.875rem',
        overflow: 'hidden',
        borderRadius: 'var(--pill-r)',
        cornerShape: 'squircle',
        background: 'var(--card-white)',
        color: 'var(--card-white-soft)',
        boxShadow: shadow,
        fontSize: '0.9375rem',
        whiteSpace: 'nowrap',
        '& b': { color: 'var(--card-white-ink)', fontVariantNumeric: 'tabular-nums' },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '62%',
          height: '3px',
          background: 'var(--pink-deep)',
        },
      })}
    >
      <Icon d={timerIcon} size={17} />
      <b>{handle.props.time}</b>
      <span>{handle.props.purpose}</span>
      <Icon d={closeIcon} size={14} />
    </span>
  )
}

const halo = (glow: string, blur: number, spread: number, strength: number) =>
  `${shadow}, 0 0 ${blur}px ${spread}px color-mix(in srgb, ${glow} ${strength}%, transparent)`

const pulse = (glow: string) => ({
  '0%, 100%': { boxShadow: halo(glow, 16, 2, 44) },
  '50%': { boxShadow: halo(glow, 32, 7, 78) },
})

const pillStyle = css({
  display: 'grid',
  placeItems: 'center',
  width: '4.5rem',
  height: '3.25rem',
  borderRadius: 'var(--pill-r)',
  cornerShape: 'squircle',
  background: 'var(--card-white)',
})

// Myra's pill as it glows when a timer ends: red after work, green after a break, pulsing as in the app
const glowStyles = {
  red: css({
    boxShadow: halo('var(--glow-red)', 24, 4, 62),
    '@media (prefers-reduced-motion: no-preference)': { animation: 'timer-glow-red 3.6s ease-in-out infinite' },
    '@keyframes timer-glow-red': pulse('var(--glow-red)'),
  }),
  green: css({
    boxShadow: halo('var(--glow-green)', 24, 4, 62),
    '@media (prefers-reduced-motion: no-preference)': { animation: 'timer-glow-green 3.6s ease-in-out infinite' },
    '@keyframes timer-glow-green': pulse('var(--glow-green)'),
  }),
}

function Pill(handle: Handle<{ glow: keyof typeof glowStyles }>) {
  return () => (
    <span mix={[pillStyle, glowStyles[handle.props.glow]]}>
      <img
        src="/images/myra-hello-still.png"
        alt=""
        width={136}
        height={160}
        mix={css({ width: '2rem', height: 'auto', imageRendering: 'pixelated' })}
      />
    </span>
  )
}

export function TimerCard(handle: Handle<{ copy: TimerCopy }>) {
  return () => {
    let { copy } = handle.props

    return (
      <div
        mix={[
          cardStyle,
          css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '0.875rem 0.875rem 0.875rem',
            color: 'var(--card-white-soft)',
          }),
        ]}
      >
        <div
          aria-hidden="true"
          mix={css({
            display: 'grid',
            justifyItems: 'center',
            gap: '1.5rem',
            padding: '2rem 1rem',
            borderRadius: '16px',
            cornerShape: 'squircle',
            background: 'var(--card-peach)',
          })}
        >
          <Chip time={copy.time} purpose={copy.purpose} />
          <span mix={css({ display: 'flex', gap: '1.75rem' })}>
            <Pill glow="red" />
            <Pill glow="green" />
          </span>
          <span mix={css({ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' })}>
            {copy.presets.map((preset) => (
              <span
                key={preset}
                mix={css({
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  background: 'var(--card-white)',
                  color: 'var(--card-white-ink)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                })}
              >
                {preset}
              </span>
            ))}
          </span>
        </div>
        <div mix={css({ display: 'grid', gap: '0.75rem', padding: '0.5rem 0.75rem 1rem', '& code': { color: 'var(--card-white-ink)' } })}>
          <h3 mix={css({ fontSize: '1.5rem', color: 'var(--card-white-ink)' })}>{copy.title}</h3>
          <p>{copy.how}</p>
          <p>{copy.faces}</p>
        </div>
      </div>
    )
  }
}
