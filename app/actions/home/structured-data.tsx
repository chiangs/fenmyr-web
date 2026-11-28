import { unsafeHTML } from 'remix/component'

import { en } from '../../content/en.tsx'
import { routes } from '../../routes.ts'
import { absolute, preview } from '../../site.ts'

// What search engines read about Fenmyr as an app, as schema.org JSON-LD: free, open source, for Linux and macOS.
// The WebSite entry gives results the site's name. Google's Rich Results Test shows how it is read.
const data = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: en.header.brand,
      url: absolute(routes.home.href()),
    },
    {
      '@type': 'SoftwareApplication',
      name: en.header.brand,
      description: en.document.description,
      url: absolute(routes.home.href()),
      image: absolute(preview.path),
      applicationCategory: 'DesignApplication',
      operatingSystem: en.document.platforms,
      downloadUrl: 'https://github.com/chiangs/fenmyr/releases',
      license: 'https://interoperable-europe.ec.europa.eu/collection/eupl/eupl-text-eupl-12',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      author: { '@type': 'Person', name: en.document.author, url: 'https://github.com/chiangs' },
    },
  ],
}

// `<` is escaped so no string in the data can close the script
const json = JSON.stringify(data).replaceAll('<', '\\u003c')

export function StructuredData() {
  return () => <script type="application/ld+json" innerHTML={unsafeHTML(json)} />
}
