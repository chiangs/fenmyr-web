import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { faint, playOnSeen, soft, surface } from '../../ui/tile-art/base.ts'

// Try: you ask Myra in her chat and she builds the preview. The message pops in at the right, her three dots work for a
// moment at the left, and then the preview window grows in where they were. The dots and the pop wait invisible in the
// first frame and the dots are gone in the still drawing, which is the message and the finished preview
const askRest = 'translateY(0.5rem) scale(0.8)'
const dotsRest = 'translateY(3px)'
const windowRest = 'scale(0.7)'
const tryMotion = css({
  '@keyframes tile-try-ask': {
    '0%': { opacity: 0, transform: askRest },
    '12%': { opacity: 1, transform: 'scale(1.04)' },
    '18%, 100%': { opacity: 1, transform: 'none' },
  },
  '@keyframes tile-try-dots': {
    '0%, 20%': { opacity: 0, transform: dotsRest },
    '26%, 46%': { opacity: 1, transform: 'none' },
    '52%, 100%': { opacity: 0, transform: 'none' },
  },
  '@keyframes tile-try-dot': {
    '0%, 26%, 36%, 46%, 100%': { transform: 'none' },
    '31%, 41%': { transform: 'translateY(-3px)' },
  },
  '@keyframes tile-try-window': {
    '0%, 44%': { opacity: 0, transform: windowRest },
    '60%': { opacity: 1, transform: 'scale(1.04)' },
    '70%, 100%': { opacity: 1, transform: 'none' },
  },
})

const raised = css(surface)

const dot = (delay: number) =>
  css({
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: soft,
    ...playOnSeen({ transform: 'none' }, `tile-try-dot 2.4s ease-in-out ${delay}s both`),
  })

export function Ask(handle: Handle<{ label: string }>) {
  return () => (
    <span
      mix={[
        tryMotion,
        css({ display: 'grid', gap: '0.375rem', width: 'min(11rem, 100%)', color: 'var(--card-white-ink)' }),
      ]}
    >
      {/* the visitor's message, in the plain type of the page, since only Myra speaks in the hand */}
      <span
        mix={[
          raised,
          css({
            justifySelf: 'end',
            maxWidth: '100%',
            padding: '0.3rem 0.625rem',
            borderRadius: '12px 12px 4px 12px',
            background: 'var(--pink-deep)',
            color: 'var(--on-accent)',
            fontSize: '0.75rem',
            fontWeight: 600,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            transformOrigin: 'bottom right',
            ...playOnSeen({ opacity: 0, transform: askRest }, 'tile-try-ask 2.4s ease-out both'),
          }),
        ]}
      >
        {handle.props.label}
      </span>
      {/* the window and the dots share one grid cell, so the dots work where the preview then grows in */}
      <span mix={css({ display: 'grid', justifyItems: 'start' })}>
        <span
          mix={[
            raised,
            css({
              gridArea: '1 / 1',
              display: 'grid',
              gridTemplateRows: '0.625rem 1fr',
              width: '7.5rem',
              height: '4rem',
              overflow: 'hidden',
              borderRadius: '10px',
              transformOrigin: 'left top',
              ...playOnSeen({ opacity: 0, transform: windowRest }, 'tile-try-window 2.4s ease-out both'),
            }),
          ]}
        >
          <span mix={css({ background: 'color-mix(in oklab, var(--card-white-ink) 18%, var(--card-white))' })} />
          <span
            mix={css({
              display: 'grid',
              alignContent: 'start',
              gap: '4px',
              padding: '6px 8px',
              '& b': { display: 'block', width: '50%', height: '6px', borderRadius: '3px', background: soft },
              '& i': { display: 'block', width: '80%', height: '4px', borderRadius: '2px', background: faint },
              '& span': { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '3px' },
              '& u': { display: 'block', height: '14px', borderRadius: '3px', background: faint },
            })}
          >
            <b />
            <i />
            <span>
              <u />
              <u />
              <u />
            </span>
          </span>
        </span>
        <span
          mix={[
            raised,
            css({
              gridArea: '1 / 1',
              alignSelf: 'start',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              width: '2.75rem',
              height: '1.125rem',
              borderRadius: '999px',
              opacity: 0,
              ...playOnSeen({ opacity: 0, transform: dotsRest }, 'tile-try-dots 2.4s ease-out both'),
            }),
          ]}
        >
          {[0, 1, 2].map((index) => (
            <span key={index} mix={dot(index * 0.05)} />
          ))}
        </span>
      </span>
    </span>
  )
}
