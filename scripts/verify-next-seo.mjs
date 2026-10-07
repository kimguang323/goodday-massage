import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)])
}
const directory = '.next/server/app'
const pages = walk(directory).filter(file => file.endsWith('.html') && !file.endsWith('_global-error.html'))
assert.equal(pages.length, 286, 'All site pages and the custom 404 must be prerendered')
const sitemap = readFileSync(join(directory, 'sitemap.xml.body'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
assert.equal(urls.length, 187, 'Only complete, indexable pages belong in the sitemap')
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique')
let noindex = 0
for (const file of pages) {
  const html = readFileSync(file, 'utf8')
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
  assert.ok(schema['@graph'].some(item => item['@type'] === 'WebPage' && item.url === canonical))
  for (const match of html.matchAll(/src="(\/[^"?#]+\.(?:webp|png|svg|mp4))"/g)) assert.ok(existsSync('public' + match[1]), file + ': local asset ' + match[1])
}
assert.equal(noindex, 98, 'Summary-only articles must not be submitted as complete articles')
const home = readFileSync(join(directory, 'index.html'), 'utf8')
assert.ok(home.includes('굿데이 출장마사지') && home.includes('신규 고객은 선불'))
assert.ok(home.includes('/_next/image'), 'Hero must use the Next.js image optimizer')
assert.ok(!/<video[^>]*autoPlay/i.test(home), 'Large video must not autoplay on first load')
assert.ok(!home.includes('client.crisp.chat/l.js'), 'Chat loader must wait for a user action')
assert.ok(readFileSync(join(directory, 'robots.txt.body'), 'utf8').includes('https://www.gdymassage.com/sitemap_index.xml'))
console.log(`Passed: ${pages.length} Next.js HTML pages, ${urls.length} sitemap URLs, ${noindex} summaries, metadata, images and structured data.`)
