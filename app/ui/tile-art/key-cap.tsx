import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { faint, playOnSeen, soft, surface } from './base.ts'
import type { Style } from './base.ts'

// A key cap presses each time its tile plays: it dips and gives a little, then comes back up. Where two sit side
// by side, the second presses just after the first. It plays wherever a drawing sits inside [data-tile], which the
// From raw to ripe steps' drawings do too, so the Catch step's Ctrl+K presses as well.
const pressMotion = css({
  '@keyframes tile-key-cap-press': {
    '0%, 100%': { transform: 'none' },
    '30%, 50%': { transform: 'translateY(3px) scale(0.95)' },
  },
})

// a later mixin wins over the animation shorthand above it, whatever the selector's weight
const secondPress = css({ '&:nth-child(2)': { animationDelay: '0.75s' } })

export function KeyCap(handle: Handle<{ label: string }>) {
  return () => (
    <span
      mix={[
        pressMotion,
        css({
          ...surface,
          padding: '0.3rem 0.75rem',
          border: `1px solid ${faint}`,
          borderBottomWidth: '3px',
          borderRadius: '10px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          ...playOnSeen({}, 'tile-key-cap-press 0.9s ease-in-out 0.2s both'),
        }),
        secondPress,
      ]}
    >
      {handle.props.label}
    </span>
  )
}

// The key caps of Myra's tiles: each presses as every key cap does, then shows what its key does. The parts around the
// key are invisible in the still drawing, which is the key cap alone, and sit out of the key's own box, so the key
// stays where it is without them
const keyBox = css({ position: 'relative', display: 'inline-grid' })
const aside: Style = { position: 'absolute', top: '50%', display: 'flex', alignItems: 'center' }

// + Add: after the press three things Myra can read slide out beside the key one after another, a picture, a text
// file and a note, then fade, so the key is alone again
const addMotion = css({
  '@keyframes tile-add-key-hand': {
    '0%': { opacity: 0, transform: 'translateX(-12px) scale(0.5)' },
    '16%': { opacity: 1, transform: 'translateX(1px) scale(1.1)' },
    '26%, 76%': { opacity: 1, transform: 'none' },
    '100%': { opacity: 0, transform: 'none' },
  },
})

const handed = (delay: number) =>
  css({
    ...surface,
    opacity: 0,
    width: '1.25rem',
    height: '1.5rem',
    borderRadius: '5px',
    ...playOnSeen(
      { opacity: 0, transform: 'translateX(-12px) scale(0.5)' },
      `tile-add-key-hand 1.6s ease-out ${delay}s both`,
    ),
  })
const handedPicture = handed(0.5)
const handedFile = handed(0.64)
const handedNote = handed(0.78)

export function AddKey(handle: Handle<{ label: string }>) {
  return () => (
    <span mix={[addMotion, keyBox]}>
      <KeyCap label={handle.props.label} />
      <span mix={css({ ...aside, left: 'calc(100% + 8px)', marginTop: '-0.75rem', gap: '5px' })}>
        <svg viewBox="0 0 20 24" mix={handedPicture}>
          <circle cx="14" cy="8" r="2.5" fill="var(--pink-deep)" />
          <path d="M3 20 L8 12 L12 17 L14.5 14 L17 20 Z" fill={soft} />
        </svg>
        <svg viewBox="0 0 20 24" fill="none" strokeWidth={2.5} strokeLinecap="round" mix={handedFile}>
          <path d="M5 6 H11" stroke={soft} />
          <path d="M5 11 H15" stroke={faint} />
          <path d="M5 15.5 H15" stroke={faint} />
          <path d="M5 20 H10" stroke={faint} />
        </svg>
        <svg viewBox="0 0 20 24" fill="none" strokeWidth={2.5} strokeLinecap="round" mix={handedNote}>
          <rect x="4" y="5" width="12" height="4" rx="2" fill={soft} />
          <path d="M5 14 H15" stroke={faint} />
          <path d="M5 19 H12" stroke={faint} />
        </svg>
      </span>
    </span>
  )
}

// Undo: two cards sit knocked out of place on either side of the key, the change. After the press they spring back to
// where they belong, with a little overshoot, the undo, then fade
const nudgeLeft = 'translate(-8px, 11px) rotate(-16deg)'
const nudgeRight = 'translate(9px, -11px) rotate(14deg)'

const undoMotion = css({
  '@keyframes tile-undo-key-left': {
    '0%': { opacity: 0, transform: nudgeLeft },
    '14%, 26%': { opacity: 1, transform: nudgeLeft },
    '44%': { opacity: 1, transform: 'translate(2px, -2px) rotate(3deg)' },
    '54%, 80%': { opacity: 1, transform: 'none' },
    '100%': { opacity: 0, transform: 'none' },
  },
  '@keyframes tile-undo-key-right': {
    '0%': { opacity: 0, transform: nudgeRight },
    '14%, 26%': { opacity: 1, transform: nudgeRight },
    '44%': { opacity: 1, transform: 'translate(-2px, 2px) rotate(-3deg)' },
    '54%, 80%': { opacity: 1, transform: 'none' },
    '100%': { opacity: 0, transform: 'none' },
  },
})

const card = css({ ...surface, opacity: 0, width: '1.5rem', height: '1.875rem', borderRadius: '6px' })
const cardLeft = css(playOnSeen({ opacity: 0, transform: nudgeLeft }, 'tile-undo-key-left 2.2s ease-out both'))
const cardRight = css(playOnSeen({ opacity: 0, transform: nudgeRight }, 'tile-undo-key-right 2.2s ease-out both'))

export function UndoKey(handle: Handle<{ label: string }>) {
  return () => (
    <span mix={[undoMotion, keyBox]}>
      <KeyCap label={handle.props.label} />
      <span mix={css({ ...aside, right: 'calc(100% + 10px)', marginTop: '-0.9375rem' })}>
        <svg viewBox="0 0 24 30" fill="none" strokeWidth={2.5} strokeLinecap="round" mix={[card, cardLeft]}>
          <rect x="4" y="6" width="12" height="4" rx="2" fill={soft} stroke="none" />
          <path d="M5 16 H19" stroke={faint} />
          <path d="M5 22 H14" stroke={faint} />
        </svg>
      </span>
      <span mix={css({ ...aside, left: 'calc(100% + 10px)', marginTop: '-0.9375rem' })}>
        <svg viewBox="0 0 24 30" fill="none" strokeWidth={2.5} strokeLinecap="round" mix={[card, cardRight]}>
          <rect x="4" y="6" width="12" height="4" rx="2" fill="var(--pink-deep)" stroke="none" />
          <path d="M5 16 H19" stroke={faint} />
          <path d="M5 22 H14" stroke={faint} />
        </svg>
      </span>
    </span>
  )
}

// Ctrl+.: a chip of three bouncing dots, Myra working, sits under the key. The press stops them, they settle, and a
// small stop square takes their place, then the chip fades
const stopMotion = css({
  '@keyframes tile-stop-key-chip': {
    '0%': { opacity: 0, transform: 'translateY(4px)' },
    '5%, 80%': { opacity: 1, transform: 'none' },
    '100%': { opacity: 0, transform: 'none' },
  },
  '@keyframes tile-stop-key-dot': {
    '0%': { opacity: 0, transform: 'none' },
    '4%': { opacity: 1, transform: 'none' },
    '10%': { opacity: 1, transform: 'translateY(-5px)' },
    '16%': { opacity: 1, transform: 'none' },
    '22%': { opacity: 1, transform: 'translateY(-5px)' },
    '28%, 34%': { opacity: 1, transform: 'none' },
    '38%, 100%': { opacity: 0, transform: 'none' },
  },
  '@keyframes tile-stop-key-square': {
    '0%, 30%': { opacity: 0, transform: 'scale(0.4)' },
    '38%': { opacity: 1, transform: 'scale(1.15)' },
    '44%, 80%': { opacity: 1, transform: 'none' },
    '100%': { opacity: 0, transform: 'none' },
  },
})

const chip = css({
  ...surface,
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: '50%',
  marginLeft: '-1.375rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  width: '2.75rem',
  height: '1.125rem',
  borderRadius: '999px',
  opacity: 0,
  ...playOnSeen({ opacity: 0, transform: 'translateY(4px)' }, 'tile-stop-key-chip 2.4s ease-in-out both'),
})
const dot = (delay: number) =>
  css({
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: soft,
    opacity: 0,
    ...playOnSeen({ opacity: 0 }, `tile-stop-key-dot 2.4s ease-in-out ${delay}s both`),
  })
const stopSquare = css({
  position: 'absolute',
  inset: 0,
  margin: 'auto',
  width: '8px',
  height: '8px',
  borderRadius: '2px',
  background: 'var(--pink-deep)',
  opacity: 0,
  ...playOnSeen({ opacity: 0, transform: 'scale(0.4)' }, 'tile-stop-key-square 2.4s ease-in-out both'),
})

export function StopKey(handle: Handle<{ label: string }>) {
  return () => (
    <span mix={[stopMotion, keyBox]}>
      <KeyCap label={handle.props.label} />
      <span mix={chip}>
        {[0, 1, 2].map((index) => (
          <span key={index} mix={dot(index * 0.07)} />
        ))}
        <span mix={stopSquare} />
      </span>
    </span>
  )
}
