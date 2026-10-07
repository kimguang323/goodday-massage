import { REGIONS } from './regions'
import { BLOG_POSTS } from './blog'

export const SITE_URL = 'https://www.gdymassage.com'
export const PAGE_PATHS: Record<string, string> = {
  home: '/', contact: '/contact', services: '/services', therapists: '/therapists',
  regions: '/cities', blog: '/blog', faq: '/faq', reviews: '/reviews',
}
export const cityPath = (region: string, city: string) => `/cities/${encodeURIComponent(region)}/${encodeURIComponent(city)}`
export const cityEntries = REGIONS.flatMap(region => region.cities.map(city => ({ region: region.name, city, path: cityPath(region.name, city) })))
const pageCopy: Record<string, [string, string]> = {
  '/': ['굿데이 출장마사지 | 24시간 방문 서비스', '굿데이 출장마사지 코스·가격·방문 지역과 24시간 예약 상담 안내. 신규 고객은 선불, 기존 고객은 후불로 이용합니다.'],
  '/contact': ['예약 상담·결제 안내 | 굿데이 출장마사지', '24시간 예약 상담에서 방문 지역과 희망 시간, 코스를 확인하세요. 신규 고객 선불·기존 고객 후불 및 예약 이용 조건을 안내합니다.'],
  '/services': ['출장마사지 코스·가격 안내 | 굿데이', '스포츠·아로마·스웨디시·림프순환·VIP 코스별 이용 시간과 가격을 비교하세요. 방문 가능 여부와 결제 조건은 예약 상담에서 확인합니다.'],
  '/therapists': ['테라피스트 프로필·예약 상담 | 굿데이', '굿데이 테라피스트 프로필을 확인하고 원하는 지역과 시간의 배정 가능 여부를 예약 상담으로 문의하세요.'],
  '/cities': ['출장마사지 방문 지역 안내 | 굿데이', '시·도와 지역별 굿데이 방문 서비스 안내를 확인하세요. 실제 방문 가능 여부와 일정은 24시간 예약 상담에서 확인합니다.'],
  '/blog': ['출장마사지 이용·지역 가이드 | 굿데이', '굿데이 방문 마사지 이용 가이드와 지역별 안내. 예약 전 필요한 정보와 코스 선택 시 확인할 사항을 알아보세요.'],
  '/faq': ['자주 묻는 질문 | 굿데이 출장마사지', '굿데이 방문 서비스, 예약 상담, 이용 안내에 대한 자주 묻는 질문을 확인하세요.'],
  '/reviews': ['고객 후기 | 굿데이 출장마사지', '굿데이 출장마사지 이용 후기와 예약 상담 안내. 방문 가능 지역과 코스별 조건을 상담에서 확인하세요.'],
}

export function getPageInfo(pathname: string) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
  const city = cityEntries.find(entry => decodeURI(entry.path) === decodeURI(path))
  const post = BLOG_POSTS.find(entry => path === `/blog/${entry.slug}`)
  const copy = city
    ? [`${city.region} ${city.city} 출장마사지 | 굿데이`, `${city.region} ${city.city} 방문 마사지 서비스 안내. 코스와 희망 시간을 24시간 예약 상담에서 확인하세요. 신규 고객 선불, 기존 고객 후불.`]
    : post ? [post.title + ' | 굿데이', post.desc] : pageCopy[path]
  // Summary-only drafts stay usable but are not submitted for indexing.
  const noindex = !copy || !!(post && !post.body?.length)
  const [title, description] = copy ?? ['페이지를 찾을 수 없습니다 | 굿데이', '요청한 페이지가 없습니다. 홈 또는 지역 안내에서 원하는 정보를 확인하세요.']
  const canonical = SITE_URL + (city?.path ?? path)
  const organization = { '@type': 'Organization', '@id': SITE_URL + '/#organization', name: '굿데이출장마사지', url: SITE_URL }
  const graph: Record<string, unknown>[] = [organization, { '@type': 'WebSite', '@id': SITE_URL + '/#website', name: '굿데이출장마사지', url: SITE_URL, publisher: { '@id': organization['@id'] } },
    { '@type': 'WebPage', '@id': canonical + '#webpage', name: title, description, url: canonical, inLanguage: 'ko-KR', isPartOf: { '@id': SITE_URL + '/#website' } }]
  if (city) graph.push({ '@type': 'Service', name: `${city.region} ${city.city} 방문 마사지`, url: canonical, provider: { '@id': organization['@id'] }, areaServed: { '@type': 'Place', name: `${city.region} ${city.city}` } })
  graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL + '/' },
    ...(path !== '/' ? [{ '@type': 'ListItem', position: 2, name: city ? '방문 지역' : post ? '블로그' : title.split(' | ')[0], item: city ? SITE_URL + '/cities' : post ? SITE_URL + '/blog' : canonical }] : []),
    ...(city || post ? [{ '@type': 'ListItem', position: 3, name: title.split(' | ')[0], item: canonical }] : []),
  ] })
  return { path, title, description, canonical, noindex, schema: { '@context': 'https://schema.org', '@graph': graph } }
}

export const staticPaths = [...Object.values(PAGE_PATHS), ...cityEntries.map(city => city.path), ...BLOG_POSTS.map(post => `/blog/${post.slug}`)]
