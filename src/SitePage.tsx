import App from './App'
import CityPage from './components/CityPage'
import { cityEntries } from './data/site'
import { getPageInfo } from './data/site'

export default function SitePage({ path, city = false }: { path: string; city?: boolean }) {
  const info = getPageInfo(path)
  const entry = city ? cityEntries.find(entry => entry.path === path) : undefined
  return <>
    <script id="page-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(info.schema).replace(/</g, '\\u003c') }} />
    {entry ? <CityPage city={entry.city} regionName={entry.region} /> : <App />}
  </>
}
