import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router'
import App, { CityPageRoute } from './App'
import { cityEntries, getPageInfo, PAGE_PATHS } from './data/site'
import { BLOG_POSTS } from './data/blog'

function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const info = getPageInfo(pathname)
    document.title = info.title
    const setMeta = (key: string, value: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`)
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element) }
      element.setAttribute('content', value)
    }
    setMeta('description', info.description)
    setMeta('robots', info.noindex ? 'noindex, follow' : 'index, follow')
    for (const [key, value] of Object.entries({ 'og:title': info.title, 'og:description': info.description, 'og:url': info.canonical, 'og:type': 'website', 'og:site_name': '굿데이출장마사지', 'og:locale': 'ko_KR', 'og:image': 'https://www.gdymassage.com/regions-banner.webp' })) setMeta(key, value, 'property')
    for (const [key, value] of Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': info.title, 'twitter:description': info.description, 'twitter:image': 'https://www.gdymassage.com/regions-banner.webp' })) setMeta(key, value)
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical) }
    canonical.setAttribute('href', info.canonical)
    let schema = document.getElementById('page-schema')
    if (!schema) { schema = document.createElement('script'); schema.id = 'page-schema'; schema.setAttribute('type', 'application/ld+json'); document.head.appendChild(schema) }
    schema.textContent = JSON.stringify(info.schema)
  }, [pathname])
  return null
}

export function NotFound() {
  return <main className="max-w-2xl mx-auto px-6 py-20"><h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1><p className="my-6">주소를 확인하거나 홈에서 원하는 정보를 찾아주세요.</p><Link to="/" className="underline">홈으로 이동</Link> · <Link to="/cities" className="underline">지역 안내</Link></main>
}
function CityRoute() {
  const { region, city } = useParams()
  return cityEntries.some(entry => entry.region === region && entry.city === city) ? <CityPageRoute /> : <NotFound />
}
function LegacyCity() {
  const { city } = useParams()
  const entry = cityEntries.find(entry => entry.city === city)
  return entry ? <Navigate to={entry.path} replace /> : <NotFound />
}
function BlogRoute() {
  const { slug } = useParams()
  return BLOG_POSTS.some(post => post.slug === slug) ? <App /> : <NotFound />
}
export function SiteRoutes() {
  return <><Seo /><Routes>
    {Object.values(PAGE_PATHS).map(path => <Route key={path} path={path} element={<App />} />)}
    <Route path="/blog/:slug" element={<BlogRoute />} />
    <Route path="/cities/:region/:city" element={<CityRoute />} />
    <Route path="/cities/:city" element={<LegacyCity />} />
    <Route path="*" element={<NotFound />} />
  </Routes></>
}
