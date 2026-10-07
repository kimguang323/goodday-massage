import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { render, getPageInfo, staticPaths, cityEntries, SITE_URL } from '../.prerender/render.js'

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const template = readFileSync('dist/index.html', 'utf8')
  .replace(/<title[^>]*>[\s\S]*?<\/title>/g, '')
  .replace(/<meta[^>]*(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '')
  .replace(/<link[^>]*rel="canonical"[^>]*>/g, '')
  .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '')

function head(info) {
  const properties = { 'og:type': 'website', 'og:site_name': '굿데이출장마사지', 'og:title': info.title, 'og:description': info.description, 'og:url': info.canonical, 'og:locale': 'ko_KR', 'og:image': SITE_URL + '/regions-banner.webp' }
  const names = { description: info.description, robots: info.noindex ? 'noindex, follow' : 'index, follow', 'twitter:card': 'summary_large_image', 'twitter:title': info.title, 'twitter:description': info.description, 'twitter:image': SITE_URL + '/regions-banner.webp' }
  return `<title>${escape(info.title)}</title>\n<link rel="canonical" href="${escape(info.canonical)}">\n`
    + Object.entries(properties).map(([key,value])=>`<meta property="${key}" content="${escape(value)}">`).join('\n')
    + Object.entries(names).map(([key,value])=>`<meta name="${key}" content="${escape(value)}">`).join('\n')
    + `<script id="page-schema" type="application/ld+json">${JSON.stringify(info.schema).replaceAll('<','\\u003c')}</script>`
}
for (const path of [...new Set(staticPaths), '/404']) {
  const info = getPageInfo(path)
  const html = template.replace('</head>', head(info) + '\n</head>').replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`)
  const destination = resolve('dist', path === '/' ? 'index.html' : decodeURI(path).slice(1) + '.html')
  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, html)
}
const indexable = [...new Set(staticPaths)].map(path => getPageInfo(path)).filter(page => !page.noindex)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map(page=>`<url><loc>${escape(page.canonical)}</loc></url>`).join('\n')}\n</urlset>`
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE_URL}/sitemap.xml</loc></sitemap></sitemapindex>`
for (const directory of ['dist', 'public']) {
  writeFileSync(`${directory}/sitemap.xml`, sitemap)
  writeFileSync(`${directory}/sitemap_index.xml`, sitemapIndex)
  writeFileSync(`${directory}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap_index.xml\n`)
}
const seen = new Set()
const redirects = cityEntries.filter(entry => { if (seen.has(entry.city)) return false; seen.add(entry.city); return true }).map(entry => ({ source: `/cities/${entry.city}`, destination: decodeURI(entry.path), permanent: true }))
writeFileSync('vercel.json', JSON.stringify({ buildCommand: 'pnpm run build', outputDirectory: 'dist', cleanUrls: true, trailingSlash: false, redirects }, null, 2) + '\n')
console.log(`Rendered ${staticPaths.length} pages; sitemap contains ${indexable.length} indexable URLs.`)
