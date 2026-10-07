import type { MetadataRoute } from 'next'
import { getPageInfo, staticPaths } from '../src/data/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [...new Set(staticPaths)].map(getPageInfo).filter(page => !page.noindex).map(page => ({ url: page.canonical }))
}
