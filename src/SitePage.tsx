import App, { CityPageRoute } from './App'
import { getPageInfo } from './data/site'

export default function SitePage({ path, city = false }: { path: string; city?: boolean }) {
  const info = getPageInfo(path)
  return <>
    <script id="page-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(info.schema).replace(/</g, '\\u003c') }} />
    {city ? <CityPageRoute /> : <App />}
  </>
}
