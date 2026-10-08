import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)])
}
const directory = '.next/server/app'
const pages = walk(directory).filter(file => file.endsWith('.html') && !file.endsWith('_global-error.html'))
assert.equal(pages.length, 285, 'All site pages and the custom 404 must be prerendered')
const sitemap = readFileSync(join(directory, 'sitemap.xml.body'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
assert.equal(urls.length, 186, 'Only complete, indexable pages belong in the sitemap')
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique')
let noindex = 0
let faqPages = 0
for (const file of pages) {
  const html = readFileSync(file, 'utf8')
  assert.ok(!html.includes('선불'), file + ': no obsolete prepaid policy')
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, file + ': one main heading')
  if (file.endsWith('_not-found.html')) { assert.ok(html.includes('noindex')); continue }
  assert.equal((html.match(/<title>/g) ?? []).length, 1, file + ': one title')
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, file + ': one canonical')
  assert.equal((html.match(/name="description"/g) ?? []).length, 1, file + ': one description')
  const canonical = new URL(html.match(/<link rel="canonical" href="([^"]+)"/)[1]).href
  assert.ok(canonical.startsWith('https://www.gdymassage.com/'), file + ': canonical domain')
  assert.ok(!html.includes('https://gooddaymassage.com'), file + ': no obsolete domain')
  const excluded = /<meta name="robots" content="noindex, follow"/.test(html)
  if (excluded) noindex++
  assert.equal(urls.includes(canonical), !excluded, file + ': sitemap agrees with indexing policy')
  const json = html.match(/<script id="page-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)
  assert.ok(json, file + ': structured data')
  const schema = JSON.parse(json[1])
  assert.ok(schema['@graph'].some(item => [item['@type']].flat().includes('WebPage') && item.url === canonical))
  const faqPage = schema['@graph'].find(item => [item['@type']].flat().includes('FAQPage'))
  if (faqPage) {
    faqPages++
    const visibleHtml = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, '').replace(/<!--.*?-->/g, '')
    for (const question of faqPage.mainEntity) {
      assert.ok(visibleHtml.includes(question.name), file + ': schema question must be visible')
      assert.ok(visibleHtml.includes(question.acceptedAnswer.text), file + ': schema answer must match visible text')
    }
  }
  for (const match of html.matchAll(/src="(\/[^"?#]+\.(?:webp|png|svg|mp4))"/g)) assert.ok(existsSync('public' + match[1]), file + ': local asset ' + match[1])
}
assert.equal(noindex, 98, 'Summary-only articles must not be submitted as complete articles')
assert.equal(faqPages, 177, '174 local pages plus home, region directory and FAQ must expose matching answers')
const home = readFileSync(join(directory, 'index.html'), 'utf8')
assert.ok(home.includes('굿데이 출장마사지') && home.includes('100% 후불제'))
assert.ok(home.includes('/_next/image'), 'Hero must use the Next.js image optimizer')
assert.ok(!/<video[^>]*autoPlay/i.test(home), 'Large video must not autoplay on first load')
assert.ok(!home.includes('소개 영상 보기') && !home.includes('/hero-video.mp4'), 'Home video control must be removed')
assert.ok(home.includes('home-welcome-banner.webp'), 'Home must include the supplied welcome banner')
assert.ok(!home.includes('client.crisp.chat/l.js'), 'Chat loader must wait for a user action')
assert.ok(home.includes('전국 모든 지역') && home.includes('전국 17개 시·도'), 'Nationwide coverage must be readable without JavaScript')
const homeSchema = JSON.parse(home.match(/<script id="page-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
const service = homeSchema['@graph'].find(item => item['@type'] === 'Service')
assert.equal(service.areaServed.name, '대한민국', 'National service must identify Korea as its service area')
assert.equal(service.hasOfferCatalog.itemListElement.length, 6, 'Published course catalogue must match the visible course list')
const directoryHtml = readFileSync(join(directory, 'cities.html'), 'utf8')
for (const match of home.matchAll(/href="\/cities#(region-[^"]+)"/g)) {
  assert.ok(directoryHtml.includes(`id="${decodeURIComponent(match[1])}"`), 'Every nationwide link must target a real region section')
}
for (const file of pages.filter(path => path.includes(join('app', 'cities') + '\\') || path.includes('/app/cities/'))) {
  const html = readFileSync(file, 'utf8')
  assert.ok(!html.includes('일대 실제 이용 사례'), 'Region templates must not create fabricated local reviews')
  assert.ok(html.includes('예상 이동 시간') && html.includes('방문 상담하기'), 'Regional pages must explain how to confirm an actual visit')
}
assert.ok(!readFileSync('src/index.css', 'utf8').includes('fonts.googleapis.com'), 'No blocking remote font import')
assert.ok(readFileSync(join(directory, 'robots.txt.body'), 'utf8').includes('https://www.gdymassage.com/sitemap_index.xml'))
const profiles = readFileSync('src/data/regional-profiles.ts', 'utf8').split('\n').filter(line => /^\s*\[/.test(line)).map(line => JSON.parse(line.trim().replace(/,$/, '').replaceAll("'", '"')))
assert.equal(profiles.length, 174, 'Every detailed region must have researched local content')
assert.equal(new Set(profiles.map(row => row[0])).size, 174, 'Regional introductions must not duplicate keys')
for (const [key, landmark, , source] of profiles) {
  const html = readFileSync(join(directory, 'cities', key + '.html'), 'utf8')
  assert.ok(!html.includes('전국'), key + ': regional detail must only promote its own locality')
  assert.ok(!html.includes('주변 지역을 찾고 계신가요'), key + ': no other-city promotion')
  for (const image of ['local-brand-banner.webp', 'local-homecare-banner.webp', 'local-swedish-banner.webp']) {
    assert.ok(html.includes(image), key + ': supplied service image ' + image)
  }
  assert.ok(html.includes('마사지샵을 비교할 때, 이 네 가지를 확인하세요'), key + ': useful comparison criteria')
  assert.ok(html.includes('내 일정에 맞추고, 내 공간에서 쉬고, 내 취향으로 선택하세요.'), key + ': brand value proposition')
  const local = html.split('id="local-characteristics"')[1].split('</section>')[0].replace(/<[^>]+>/g, '')
  assert.ok(local.includes(landmark.split('·')[0]), key + ': local landmark must be rendered')
  assert.ok(local.includes('출장마사지·출장안마') && local.includes('24시간 상담'), key + ': service introduction')
  assert.ok(source.startsWith('https://') && new URL(source).hostname.endsWith('.go.kr'), key + ': official research source')
}
console.log(`Passed: ${pages.length} Next.js HTML pages, ${urls.length} sitemap URLs, ${noindex} summaries, metadata, images and structured data.`)
