import { createRouter, type RouterContext } from 'remix/router'
import { render } from 'remix/middleware/render'
import { staticFiles } from 'remix/middleware/static'

import controller from './actions/controller.tsx'
import { NotFoundPage } from './actions/not-found-page.tsx'
import { assets } from './assets.ts'
import { routes } from './routes.ts'

export const router = createRouter({
  middleware: [staticFiles('./public', { index: false }), render({ assets })],
  defaultHandler(context) {
    return context.render(<NotFoundPage />, { status: 404 })
  },
})

export type AppContext = RouterContext<typeof router>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

router.map(routes, controller)
