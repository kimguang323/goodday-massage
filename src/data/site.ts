import { REGIONS } from './regions'
import { BLOG_POSTS } from './blog'
import { MASSAGE_COURSES, NATIONWIDE_FAQS } from './service-content'
import { getLocalBookingFaqs } from './booking-faq'

export const SITE_URL = 'https://www.gdymassage.com'
export const PAGE_PATHS: Record<string, string> = {
  home: '/', contact: '/contact', services: '/services', therapists: '/therapists',
  regions: '/cities', blog: '/blog', faq: '/faq', reviews: '/reviews',
}
export const cityPath = (region: string, city: string) => `/cities/${encodeURIComponent(region)}/${encodeURIComponent(city)}`
export const cityEntries = REGIONS.flatMap(region => region.cities.map(city => ({ region: region.name, city, path: cityPath(region.name, city) })))
const pageCopy: Record<string, [string, string]> = {
  '/': ['전국 출장마사지 · 24시간 방문 서비스 | 굿데이', '전국 모든 지역의 자택·호텔·오피스텔로 찾아가는 굿데이 출장마사지. 홈타이·스웨디시·아로마·스포츠·림프순환·VIP 코스와 가격, 24시간 예약 상담을 안내합니다.'],
  '/contact': ['예약 상담·결제 안내 | 굿데이 출장마사지', '24시간 예약 상담에서 방문 지역과 희망 시간, 코스를 확인하세요. 100% 후불제·신규 회원 예약 문의 및 예약 이용 조건을 안내합니다.'],
  '/services': ['전국 출장마사지 종류·코스·가격 | 굿데이', '홈타이 방문 서비스와 스웨디시·아로마·스포츠·림프순환·VIP 마사지 종류를 확인하세요. 코스별 이용 시간·가격을 비교하고 전국 방문 일정과 총 비용을 24시간 상담합니다.'],
  '/therapists': ['테라피스트 프로필·예약 상담 | 굿데이', '굿데이 테라피스트 프로필을 확인하고 원하는 지역과 시간의 배정 가능 여부를 예약 상담으로 문의하세요.'],
  '/cities': ['전국 출장마사지 지역 안내 · 서울부터 제주까지 | 굿데이', '전국 17개 시·도 출장마사지 안내. 서울·경기·인천, 광역시와 강원·충청·전라·경상·제주 등 전국 모든 지역의 방문을 상담합니다. 목록에 없는 지역도 문의해 주세요.'],
  '/blog': ['출장마사지 이용·지역 가이드 | 굿데이', '굿데이 방문 마사지 이용 가이드와 지역별 안내. 예약 전 필요한 정보와 코스 선택 시 확인할 사항을 알아보세요.'],
  '/faq': ['전국 출장마사지 예약·코스·결제 FAQ | 굿데이', '전국 방문 지역, 마사지 종류, 24시간 예약 방법과 100% 후불제·신규 회원 예약 문의 기준을 확인하세요. 지역별 배정과 방문 일정은 상담을 통해 확정합니다.'],
  '/reviews': ['고객 후기 | 굿데이 출장마사지', '굿데이 출장마사지 이용 후기와 예약 상담 안내. 방문 가능 지역과 코스별 조건을 상담에서 확인하세요.'],
}

export function getPageInfo(pathname: string) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
  const city = cityEntries.find(entry => decodeURI(entry.path) === decodeURI(path))
  const post = BLOG_POSTS.find(entry => path === `/blog/${entry.slug}`)
  const copy = city
    ? [`${city.region} ${city.city} 출장마사지 · 24시간 방문 | 굿데이`, `굿데이 ${city.region} ${city.city} 출장마사지·출장안마. 자택·호텔·오피스텔 방문과 스웨디시·아로마·스포츠·림프순환·VIP 코스를 24시간 상담하세요. 100% 후불제 운영, 신규 회원님은 예약 문의.`]
    : post ? [post.title + ' | 굿데이', post.desc] : pageCopy[path]
  // Summary-only drafts stay usable but are not submitted for indexing.
  const noindex = !copy || !!(post && !post.body?.length)
  const [title, description] = copy ?? ['페이지를 찾을 수 없습니다 | 굿데이', '요청한 페이지가 없습니다. 홈 또는 지역 안내에서 원하는 정보를 확인하세요.']
  const canonical = SITE_URL + (city?.path ?? path)
  const organization = {
    '@type': 'Organization', '@id': SITE_URL + '/#organization', name: '굿데이출장마사지', url: SITE_URL,
    logo: { '@type': 'ImageObject', url: SITE_URL + '/apple-touch-icon.png', width: 180, height: 180 },
    contactPoint: { '@type': 'ContactPoint', contactType: '예약 상담', url: SITE_URL + '/contact', availableLanguage: 'ko', hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' } },
  }
  const graph: Record<string, unknown>[] = [organization, { '@type': 'WebSite', '@id': SITE_URL + '/#website', name: '굿데이출장마사지', url: SITE_URL, publisher: { '@id': organization['@id'] } },
    { '@type': 'WebPage', '@id': canonical + '#webpage', name: title, description, url: canonical, inLanguage: 'ko-KR', isPartOf: { '@id': SITE_URL + '/#website' } }]
  if (city || ['/', '/services', '/cities'].includes(path)) graph.push({
    '@type': 'Service', '@id': canonical + '#service',
    name: city ? `${city.region} ${city.city} 출장마사지` : '전국 출장마사지 방문 서비스',
    description, url: canonical, serviceType: '방문 마사지',
    provider: { '@id': organization['@id'] },
    areaServed: city ? { '@type': 'Place', name: `${city.region} ${city.city}` } : { '@type': 'Country', name: '대한민국' },
    hasOfferCatalog: { '@type': 'OfferCatalog', name: '마사지 코스 안내', itemListElement: MASSAGE_COURSES.map(course => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: course.name, description: course.description, url: SITE_URL + '/services' } })) },
  })
  if (post?.body?.length) graph.push({ '@type': 'Article', '@id': canonical + '#article', headline: post.title, description: post.desc, mainEntityOfPage: { '@id': canonical + '#webpage' }, author: { '@id': organization['@id'] }, publisher: { '@id': organization['@id'] }, inLanguage: 'ko-KR', ...(post.updated ? { dateModified: post.updated.replace(/\./g, '-') } : {}) })
  const faqs = city ? getLocalBookingFaqs(city.region, city.city) : ['/', '/cities', '/faq'].includes(path) ? NATIONWIDE_FAQS : []
  if (faqs.length) {
    const webPage = graph.find(item => item['@type'] === 'WebPage')!
    webPage['@type'] = ['WebPage', 'FAQPage']
    webPage.mainEntity = faqs.map(faq => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } }))
  }
  graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL + '/' },
    ...(path !== '/' ? [{ '@type': 'ListItem', position: 2, name: city ? '방문 지역' : post ? '블로그' : title.split(' | ')[0], item: city ? SITE_URL + '/cities' : post ? SITE_URL + '/blog' : canonical }] : []),
    ...(city || post ? [{ '@type': 'ListItem', position: 3, name: title.split(' | ')[0], item: canonical }] : []),
  ] })
  return { path, title, description, canonical, noindex, schema: { '@context': 'https://schema.org', '@graph': graph } }
}

export const staticPaths = [...Object.values(PAGE_PATHS), ...cityEntries.map(city => city.path), ...BLOG_POSTS.map(post => `/blog/${post.slug}`)]
