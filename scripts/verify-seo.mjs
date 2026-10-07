import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { getPageInfo, staticPaths, cityEntries, SITE_URL } from '../.prerender/render.js'

const sitemap = readFileSync('dist/sitemap.xml', 'utf8')
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
assert.equal(new Set(locations).size, locations.length, 'Sitemap URLs must be unique')
for (const path of [...staticPaths, '/404']) {
  const filename = path === '/' ? 'index.html' : decodeURI(path).slice(1) + '.html'
  const html = readFileSync('dist/' + filename, 'utf8')
  const info = getPageInfo(path)
  assert.equal((html.match(/<title>/g) ?? []).length, 1, path + ': one title')
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, path + ': one canonical')
  assert.equal((html.match(/name="description"/g) ?? []).length, 1, path + ': one description')
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, path + ': one rendered main heading')
  assert.ok(html.includes(`href="${info.canonical}"`), path + ': correct canonical')
  assert.ok(html.includes(info.noindex ? 'content="noindex, follow"' : 'content="index, follow"'), path + ': correct indexing')
  assert.equal(locations.includes(info.canonical), !info.noindex, path + ': sitemap inclusion')
  const schema = JSON.parse(html.match(/<script id="page-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  assert.ok(schema['@graph'].some(item => item['@type'] === 'WebPage' && item.url === info.canonical))
  assert.ok(!html.includes('https://gooddaymassage.com'), path + ': no stale domain')
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]+\.(?:webp|png|svg|mp4|css|js))"/g)) {
    assert.ok(existsSync('dist' + match[1]), path + ': missing local asset ' + match[1])
  }
}
const cityPaths = cityEntries.map(entry => entry.path)
assert.equal(new Set(cityPaths).size, cityPaths.length, 'Regional paths must not collide')
assert.notEqual(cityEntries.find(entry => entry.region === '서울' && entry.city === '중구').path, cityEntries.find(entry => entry.region === '부산' && entry.city === '중구').path)
const home = readFileSync('dist/index.html', 'utf8')
assert.ok(!/<video[^>]*autoPlay/i.test(home), 'Homepage must not eagerly autoplay the large video')
assert.ok(!home.includes('client.crisp.chat/l.js'), 'Chat loader must wait for a user action')
assert.ok(home.includes('/services') && home.includes('/contact') && home.includes('/cities'))
const config = JSON.parse(readFileSync('vercel.json', 'utf8'))
assert.ok(config.cleanUrls && !config.routes && !config.rewrites, 'Static pages must not be rewritten to the home shell')
assert.ok(config.redirects.every(redirect => cityPaths.includes(encodeURI(redirect.destination))))
assert.ok(locations.every(url => url.startsWith(SITE_URL)))
console.log(`Passed: ${staticPaths.length + 1} rendered pages, ${locations.length} sitemap URLs, assets, region collision and Vercel routing checks.`)
