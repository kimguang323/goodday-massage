/**
 * Post-build prerender script.
 * For each city, generates dist/cities/[city]/index.html with
 * city-specific <title>, <meta description>, canonical, OG tags,
 * and JSON-LD so Googlebot can read them without running JavaScript.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '../dist')
const SITE_URL = process.env.SITE_URL || 'https://goodday-massage.com'

const REGIONS = [
  { name: '서울', cities: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'] },
  { name: '경기', cities: ['수원', '성남', '고양', '용인', '부천', '안산', '화성', '남양주', '안양', '평택', '의정부', '시흥', '파주', '광명', '김포', '군포', '광주', '이천', '양주', '오산', '구리', '안성', '포천', '의왕', '하남', '여주'] },
  { name: '인천', cities: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'] },
  { name: '부산', cities: ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'] },
  { name: '대구', cities: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'] },
  { name: '광주', cities: ['동구', '서구', '남구', '북구', '광산구', '나주', '화순'] },
  { name: '대전', cities: ['동구', '중구', '서구', '유성구', '대덕구', '세종'] },
  { name: '울산', cities: ['중구', '남구', '동구', '북구', '울주군'] },
  { name: '세종', cities: ['세종시'] },
  { name: '강원', cities: ['춘천', '원주', '강릉', '동해', '태백', '속초', '삼척', '홍천'] },
  { name: '충북', cities: ['청주', '충주', '제천', '보은', '옥천', '영동', '증평', '진천'] },
  { name: '충남', cities: ['천안', '공주', '보령', '아산', '서산', '논산', '계룡', '당진', '금산', '부여', '서천'] },
  { name: '전북', cities: ['전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수', '임실'] },
  { name: '전남', cities: ['목포', '여수', '순천', '나주', '광양', '담양', '곡성'] },
  { name: '경북', cities: ['포항', '경주', '김천', '안동', '구미', '영주', '영천', '상주', '문경', '경산', '군위', '의성'] },
  { name: '경남', cities: ['창원', '진주', '통영', '사천', '김해', '밀양', '거제', '양산', '의령', '함안', '창녕', '고성', '하동'] },
  { name: '제주', cities: ['제주시', '서귀포시'] },
]

function escape(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildCityHead(city, regionName) {
  const url = `${SITE_URL}/cities/${encodeURIComponent(city)}`
  const title = `${city} 출장마사지 | 굿데이출장마사지`
  const desc = `${city} 전 지역 24시간 출장마사지·출장안마·스웨디시. 호텔·오피스텔·자택 방문. 365일 연중무휴. 즉시 배정 가능.`

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}#business`,
    name: `굿데이출장마사지 ${city}`,
    description: `${city} 전 지역 24시간 출장마사지·출장안마·스웨디시 서비스`,
    url,
    openingHours: 'Mo-Su 00:00-24:00',
    areaServed: { '@type': 'City', name: city },
    serviceType: ['출장마사지', '출장안마', '스웨디시', '홈케어'],
    priceRange: '₩₩',
    inLanguage: 'ko-KR',
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '지역 선택', item: `${SITE_URL}/#regions` },
      { '@type': 'ListItem', position: 3, name: `${regionName}`, item: `${SITE_URL}/#regions` },
      { '@type': 'ListItem', position: 4, name: `${city} 출장마사지`, item: url },
    ],
  }

  return `
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(desc)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="ko_KR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(desc)}" />
    <script type="application/ld+json">${JSON.stringify(localBusiness)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`
}

const template = readFileSync(`${DIST}/index.html`, 'utf-8')

let count = 0
for (const region of REGIONS) {
  for (const city of region.cities) {
    const cityHead = buildCityHead(city, region.name)
    // Replace the existing <title> and inject our tags right before </head>
    const h1 = `<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap">${escape(city)} 출장마사지 | 굿데이출장마사지 24시간 방문 케어</h1>`
    const html = template
      .replace(/<title>[^<]*<\/title>/, '')
      .replace('</head>', `${cityHead}\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${h1}</div>`)

    const dir = `${DIST}/cities/${encodeURIComponent(city)}`
    mkdirSync(dir, { recursive: true })
    writeFileSync(`${dir}/index.html`, html, 'utf-8')
    count++
  }
}

console.log(`✅ Prerendered ${count} city pages in dist/cities/`)
