import { readFile } from 'node:fs/promises'
import { createController } from 'remix/router'

import { assets } from '../assets.ts'
import { routes } from '../routes.ts'
import { HomePage } from './home/page.tsx'

export default createController(routes, {
  actions: {
    async assets(context) {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
    },
    home(context) {
      return context.render(<HomePage />)
    },
    async licences() {
      let notice = await readFile(new URL('../../NOTICE', import.meta.url), 'utf8')
      return new Response(notice, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
    },
  },
})
