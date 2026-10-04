import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const today = new Date().toISOString().split('T')[0]

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/cities', priority: '0.9', changefreq: 'weekly' },
]

const cityPages = REGIONS.flatMap(r =>
  r.cities.map(city => ({
    url: `/cities/${encodeURIComponent(city)}`,
    priority: '0.8',
    changefreq: 'monthly',
  }))
)

const allPages = [...staticPages, ...cityPages]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

const outPath = resolve(__dirname, '../public/sitemap.xml')
writeFileSync(outPath, sitemap, 'utf-8')
console.log(`✅ sitemap.xml 생성 완료 — ${allPages.length}개 URL`)

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`
writeFileSync(resolve(__dirname, '../public/sitemap_index.xml'), sitemapIndex, 'utf-8')
console.log(`✅ sitemap_index.xml 생성 완료`)
