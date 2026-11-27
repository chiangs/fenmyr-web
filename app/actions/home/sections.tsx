import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import type { SectionId } from '../../content/content.ts'
import { en } from '../../content/en.tsx'
import { ButtonLink } from '../../ui/button-link.tsx'
import { Myra } from '../../ui/public/myra.tsx'
import { Screenshot } from '../../ui/screenshot.tsx'

const { prototype, myra, local, linux, access, built, install, support } = en.sections

export interface HomeSection {
  id: SectionId
  title: string
  nav?: string
  content: RemixNode
}

const cardStyle = css({
  borderRadius: '24px',
  cornerShape: 'squircle',
  background: 'var(--card-white)',
  boxShadow: '0 10px 30px rgba(var(--sh), calc(.10 * var(--sh-k))), 0 1px 3px rgba(var(--sh), calc(.06 * var(--sh-k)))',
})

const proseStyle = css({
  display: 'grid',
  gap: '1rem',
  maxWidth: '44rem',
  color: 'var(--ink-soft)',
})

function Lead(handle: Handle<{ icon: string; tone: string; children?: RemixNode }>) {
  return () => {
    let { icon, tone, children } = handle.props

    return (
      <div mix={css({ display: 'flex', alignItems: 'flex-start', gap: '1rem', maxWidth: '44rem' })}>
        <span
          style={{ background: `var(--card-${tone})` }}
          mix={css({
            flex: 'none',
            display: 'grid',
            placeItems: 'center',
            width: '3rem',
            height: '3rem',
            borderRadius: 'var(--pill-r)',
            cornerShape: 'squircle',
          })}
        >
          <img src={`/images/${icon}.svg`} alt="" width={256} height={256} loading="lazy" mix={css({ width: '1.75rem', height: '1.75rem' })} />
        </span>
        <p mix={css({ alignSelf: 'center', fontSize: 'clamp(1.0625rem, 2vw, 1.1875rem)', color: 'var(--ink)' })}>{children}</p>
      </div>
    )
  }
}

function Points(handle: Handle<{ items: RemixNode[] }>) {
  return () => (
    <ul
      mix={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))',
        gap: '1rem',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        '& strong': { color: 'var(--ink)', fontWeight: 800 },
      })}
    >
      {handle.props.items.map((item, index) => (
        <li key={index} mix={[cardStyle, css({ padding: '1.25rem 1.375rem', color: 'var(--ink-soft)' })]}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export const sections: readonly HomeSection[] = [
  {
    id: 'prototype',
    title: prototype.title,
    nav: prototype.nav,
    content: (
      <>
        <Lead icon="prototype" tone="butter">
          {prototype.lead}
        </Lead>
        <Screenshot
          light="/images/proto-built-light.png"
          dark="/images/proto-built-dark.png"
          alt={prototype.screenshotAlt}
          width={1760}
          height={1100}
        />
        <Points items={prototype.points} />
      </>
    ),
  },
  {
    id: 'myra',
    title: myra.title,
    content: (
      <>
        <Lead icon="myra" tone="pink">
          {myra.lead}
        </Lead>
        <Points items={myra.points} />
      </>
    ),
  },
  {
    id: 'local',
    title: local.title,
    content: (
      <>
        <Lead icon="local" tone="mint">
          {local.lead}
        </Lead>
        <Points items={local.points} />
      </>
    ),
  },
  {
    id: 'linux',
    title: linux.title,
    content: (
      <>
        <Lead icon="linux" tone="sky">
          {linux.lead}
        </Lead>
        <div mix={proseStyle}>
          <p>{linux.body}</p>
          <p>{linux.macos}</p>
        </div>
      </>
    ),
  },
  {
    id: 'access',
    title: access.title,
    content: (
      <>
        <Lead icon="access" tone="lilac">
          {access.lead}
        </Lead>
        <Points items={access.points} />
      </>
    ),
  },
  {
    id: 'built',
    title: built.title,
    content: (
      <>
        <Lead icon="built" tone="peach">
          {built.lead}
        </Lead>
        <Points items={built.points} />
        <div mix={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem 1.5rem' })}>
          <p mix={css({ maxWidth: '36rem', color: 'var(--ink-soft)' })}>{built.codeMap}</p>
          <ButtonLink href="https://code-map.fenmyr.com/" quiet>
            {built.codeMapButton}
          </ButtonLink>
        </div>
      </>
    ),
  },
  {
    id: 'install',
    title: install.title,
    nav: install.nav,
    content: (
      <>
        <p mix={css({ maxWidth: '44rem', color: 'var(--ink-soft)' })}>{install.needs}</p>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))',
            gap: '1.25rem',
          })}
        >
          <div mix={[cardStyle, css({ display: 'grid', alignContent: 'start', gap: '1rem', padding: '1.5rem' })]}>
            <h3 mix={css({ fontSize: '1.375rem' })}>{install.fromCode.title}</h3>
            <p mix={css({ color: 'var(--ink-soft)' })}>{install.fromCode.note}</p>
            <pre
              mix={css({
                margin: 0,
                padding: '1rem 1.125rem',
                overflowX: 'auto',
                borderRadius: 'var(--pill-r)',
                cornerShape: 'squircle',
                background: 'color-mix(in oklab, var(--ink) 7%, var(--card-white))',
                color: 'var(--ink)',
                lineHeight: 1.7,
              })}
            >
              <code>
                {'git clone https://github.com/chiangs/fenmyr.git\ncd fenmyr\n./install.sh'}
              </code>
            </pre>
            <p mix={css({ color: 'var(--ink-soft)' })}>{install.fromCode.result}</p>
          </div>
          <div mix={[cardStyle, css({ display: 'grid', alignContent: 'start', gap: '1rem', padding: '1.5rem' })]}>
            <h3 mix={css({ fontSize: '1.375rem' })}>{install.appImage.title}</h3>
            <p mix={css({ color: 'var(--ink-soft)' })}>{install.appImage.note}</p>
            <div>
              <ButtonLink href="https://github.com/chiangs/fenmyr/releases">{install.appImage.button}</ButtonLink>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'support',
    title: support.title,
    nav: support.nav,
    content: (
      <div
        mix={[
          cardStyle,
          css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1.5rem 2rem',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          }),
        ]}
      >
        <Myra pose="love" label={support.myraAlt} size="6.375rem" lazy />
        <div mix={css({ flex: '1 1 20rem', display: 'grid', gap: '1rem', color: 'var(--ink-soft)' })}>
          <p mix={css({ fontSize: '1.1875rem', color: 'var(--ink)' })}>{support.pitch}</p>
          <ul mix={css({ margin: 0, paddingLeft: '1.25rem' })}>
            <li>{support.ways.star}</li>
            <li>{support.ways.beta}</li>
          </ul>
          <div>
            <ButtonLink href="https://github.com/sponsors/chiangs">{support.sponsor}</ButtonLink>
          </div>
        </div>
      </div>
    ),
  },
]
