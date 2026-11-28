import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { packIcons } from '../pack-icons.ts'
import type { PackIcon } from '../pack-icons.ts'
import type { Tone } from '../tile.tsx'
import { faint, line, playOnSeen, surface } from './base.ts'

// The drawings of Ideas and the work around them, and the icons of Yours, on your computer

// the dated rows land one after another, rising a little as they fade in; the overdue row's red pill pops in just after
// its row, so the one that needs attention arrives last. Each row ends where the still drawing has it
const dueMotion = css({
  '@keyframes tile-due-row': {
    '0%': { opacity: 0, transform: 'translateY(8px)' },
    '100%': { opacity: 1, transform: 'none' },
  },
  '@keyframes tile-due-flag': {
    '0%': { opacity: 0, transform: 'scale(0.6)' },
    '60%': { opacity: 1, transform: 'scale(1.12)' },
    '100%': { opacity: 1, transform: 'none' },
  },
})

export function DueList(handle: Handle<{ labels: readonly string[] }>) {
  return () => (
    <span
      mix={[dueMotion, css({ ...surface, display: 'grid', gap: '6px', width: '11rem', padding: '0.625rem 0.75rem', borderRadius: '12px' })]}
    >
      {handle.props.labels.map((label, index) => (
        <span
          key={index}
          mix={css({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            ...playOnSeen(
              { opacity: 0, transform: 'translateY(8px)' },
              `tile-due-row 0.8s ease-out ${index * 0.55}s both`,
            ),
          })}
        >
          <span
            style={{ background: index === 0 ? 'var(--pink-deep)' : faint, color: index === 0 ? 'var(--on-accent)' : 'inherit' }}
            mix={css({
              padding: '0 0.4rem',
              borderRadius: '999px',
              lineHeight: 1.5,
              transformOrigin: 'left center',
              ...(index === 0 ? playOnSeen({ opacity: 0, transform: 'scale(0.6)' }, `tile-due-flag 0.7s ease-out ${0.4 + (handle.props.labels.length - 1) * 0.55}s both`) : {}),
            })}
          >
            {label}
          </span>
          <span mix={css({ flex: 1, height: '5px', borderRadius: '3px', background: faint })} />
        </span>
      ))}
    </span>
  )
}

// a project and the folders inside it: the project lands first, then each folder slips out from its parent's indent,
// one after another, until the tree is as the still drawing has it
const foldersMotion = css({
  '@keyframes tile-folders-root': {
    '0%': { opacity: 0, transform: 'translateY(6px)' },
    '100%': { opacity: 1, transform: 'none' },
  },
  '@keyframes tile-folders-child': {
    '0%': { opacity: 0, transform: 'translate(-14px, -9px)' },
    '100%': { opacity: 1, transform: 'none' },
  },
})

export function Folders() {
  return () => (
    <span mix={[foldersMotion, css({ ...surface, display: 'grid', gap: '7px', width: '10rem', padding: '0.75rem', borderRadius: '12px' })]}>
      {[0, 1, 2, 1].map((depth, index) => (
        <span
          key={index}
          style={{ marginLeft: `${depth * 0.875}rem` }}
          mix={css({
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            ...(index === 0
              ? playOnSeen({ opacity: 0, transform: 'translateY(6px)' }, 'tile-folders-root 0.7s ease-out both')
              : playOnSeen(
                  { opacity: 0, transform: 'translate(-14px, -9px)' },
                  `tile-folders-child 0.8s ease-out ${0.5 + (index - 1) * 0.45}s both`,
                )),
          })}
        >
          <span
            style={{ background: depth === 0 ? 'var(--pink-deep)' : 'var(--card-sky)' }}
            mix={css({ width: '9px', height: '9px', borderRadius: '3px' })}
          />
          <span mix={css({ flex: 1, height: '5px', borderRadius: '3px', background: faint })} />
        </span>
      ))}
    </span>
  )
}

// the card in Done is picked up from the first column, as a butter card, and carried across to Done, turning mint as it
// lands. Three layers keep it to transforms and opacity: the outer one travels, the card lifts and drops on its own
// layer, and a butter layer over the mint card fades out. A column is 3rem wide with a 0.5rem gap, so Done is 7rem on
const columnsMotion = css({
  '@keyframes tile-columns-move': {
    '0%, 15%': { transform: 'translateX(-7rem)' },
    '85%, 100%': { transform: 'none' },
  },
  '@keyframes tile-columns-lift': {
    '0%, 100%': { transform: 'none' },
    '15%, 85%': { transform: 'translateY(-7px) scale(1.12)' },
  },
  '@keyframes tile-columns-butter': {
    '0%, 40%': { opacity: 1 },
    '80%, 100%': { opacity: 0 },
  },
})

function MovingCard() {
  return () => (
    <span mix={css(playOnSeen({ transform: 'translateX(-7rem)' }, 'tile-columns-move 2.2s ease-in-out both'))}>
      <span
        style={{ background: 'var(--card-mint)' }}
        mix={css({
          position: 'relative',
          display: 'block',
          height: '10px',
          borderRadius: '3px',
          ...playOnSeen({}, 'tile-columns-lift 2.2s ease-in-out both'),
        })}
      >
        <span
          mix={css({
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'var(--card-butter)',
            opacity: 0,
            ...playOnSeen({ opacity: 1 }, 'tile-columns-butter 2.2s ease-in-out both'),
          })}
        />
      </span>
    </span>
  )
}

export function Columns() {
  return () => (
    <span mix={[columnsMotion, css({ display: 'grid', gridTemplateColumns: 'repeat(3, 3rem)', gap: '0.5rem', alignItems: 'start' })]}>
      {[3, 2, 1].map((cards, column) => (
        <span key={column} mix={css({ ...surface, display: 'grid', gap: '4px', padding: '5px', borderRadius: '8px' })}>
          {column === 2 ? (
            <MovingCard />
          ) : (
            Array.from({ length: cards }, (_, index) => (
              <span key={index} style={{ background: 'var(--card-butter)' }} mix={css({ height: '10px', borderRadius: '3px' })} />
            ))
          )}
        </span>
      ))}
    </span>
  )
}

// the slash draws across the icon from its top left, the gap cut in the tile's colour just ahead of the line. pathLength
// makes the dash lengths relative to the whole path, so one keyframe fits both strokes; the dash pattern sits in the
// animation only, so the still drawing is a plain stroke
const slashMotion = css({
  '@keyframes tile-icon-slash': {
    '0%': { strokeDasharray: '1 2', strokeDashoffset: 1 },
    '100%': { strokeDasharray: '1 2', strokeDashoffset: 0 },
  },
})
const slashStart = { strokeDasharray: '1 2', strokeDashoffset: 1 }
const slashAnimation = 'tile-icon-slash 1.5s ease-in-out 0.3s both'

// Two icons move by their parts. The pack draws each as one path; it is split where a piece begins, so the still
// icon is exactly the pack's. The sparkle is the star, drawn by its first two subpaths, outline and hole, and two
// small sparkles that fade out and back in, one after the other. The download is the tray and the arrow; the arrow's
// subpath starts relative to the tray's start, so it is rewritten to start there in absolute terms.
const [star = '', hole = '', sparkleA = '', sparkleB = ''] = packIcons.sparkle.split(/(?=M)/)

function downloadParts(d: string) {
  let [tray = '', rest = ''] = d.split('Zm')
  let from = /^M(-?[\d.]+),(-?[\d.]+)/.exec(tray)
  let by = /^(-?[\d.]+),(-?[\d.]+)/.exec(rest)
  if (!from || !by) return null
  let x = Number(from[1]) + Number(by[1])
  let y = Number(from[2]) + Number(by[2])
  return { tray: `${tray}Z`, arrow: `M${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}${rest.slice(by[0].length)}` }
}
const download = downloadParts(packIcons.download)
// the file: its first subpath is the page's outer edge, so filling it alone gives the page's shape, used to hide the
// copy wherever the original sits over it
const [page = ''] = packIcons['file-text'].split(/(?=M)/)

// overflow visible, so the arrow isn't cut off while it drops in from above the icon
const iconMotion = css({
  overflow: 'visible',
  '@keyframes tile-icon-twinkle-a': {
    '0%, 55%, 100%': { opacity: 1 },
    '25%': { opacity: 0.1 },
  },
  '@keyframes tile-icon-twinkle-b': {
    '0%, 40%, 100%': { opacity: 1 },
    '70%': { opacity: 0.1 },
  },
  // a copy of the file slides out from behind it, down and to the right, as a copied file does while it is dragged,
  // holds, and slides back in
  '@keyframes tile-icon-copy': {
    '0%, 8%': { opacity: 0, transform: 'none' },
    '34%, 70%': { opacity: 0.55, transform: 'translate(34px, 26px)' },
    '94%, 100%': { opacity: 0, transform: 'none' },
  },
  // the arrow sinks into the tray and fades, then drops back in from above and settles with a little bounce
  '@keyframes tile-icon-drop': {
    '0%': { transform: 'none', opacity: 1 },
    '32%': { transform: 'translateY(36px)', opacity: 0 },
    '33%': { transform: 'translateY(-64px)', opacity: 0 },
    '72%': { transform: 'translateY(4px)', opacity: 1 },
    '84%, 100%': { transform: 'none', opacity: 1 },
  },
})
const still = { opacity: 1 }

// one of the app's icons, large. off draws a slash through it, with a gap cut in the tile's own colour so the slash
// stands apart from the icon. on is the tile's colour, which the file needs to hide its copy behind it
export function Icon(handle: Handle<{ name: PackIcon; off?: Tone; on?: Tone }>) {
  return () => {
    let { name, off, on } = handle.props
    return (
      <svg
        viewBox="0 0 256 256"
        width="56"
        height="56"
        fill="currentColor"
        mix={[iconMotion, ...(off ? [slashMotion] : [])]}
      >
        {name === 'sparkle' ? (
          <>
            <path d={star + hole} />
            <path d={sparkleA} mix={css(playOnSeen(still, 'tile-icon-twinkle-a 2.4s ease-in-out both'))} />
            <path d={sparkleB} mix={css(playOnSeen(still, 'tile-icon-twinkle-b 2.4s ease-in-out both'))} />
          </>
        ) : name === 'file-text' && on ? (
          <>
            <path
              d={packIcons['file-text']}
              mix={css({ opacity: 0, ...playOnSeen({ opacity: 0, transform: 'none' }, 'tile-icon-copy 2.4s ease-in-out both') })}
            />
            <path d={page} fill={`var(--card-${on})`} />
            <path d={packIcons['file-text']} />
          </>
        ) : name === 'download' && download ? (
          <>
            <path d={download.tray} />
            <path
              d={download.arrow}
              mix={css(playOnSeen({ transform: 'none', opacity: 1 }, 'tile-icon-drop 2.2s ease-in-out both'))}
            />
          </>
        ) : (
          <path d={packIcons[name]} />
        )}
        {off ? (
          <>
            <path
              d="M40 40 L216 216"
              pathLength={1}
              stroke={`var(--card-${off})`}
              strokeWidth={44}
              strokeLinecap="round"
              mix={css(playOnSeen(slashStart, slashAnimation))}
            />
            <path
              d="M40 40 L216 216"
              pathLength={1}
              stroke={line}
              strokeWidth={16}
              strokeLinecap="round"
              mix={css(playOnSeen(slashStart, slashAnimation))}
            />
          </>
        ) : null}
      </svg>
    )
  }
}
