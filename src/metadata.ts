import type { Metadata } from 'next'
import { getPageInfo, SITE_URL } from './data/site'

export function pageMetadata(path: string): Metadata {
  const page = getPageInfo(path)
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonical },
    robots: { index: !page.noindex, follow: true },
    openGraph: { type: 'website', siteName: '굿데이출장마사지', title: page.title, description: page.description, url: page.canonical, locale: 'ko_KR', images: [{ url: SITE_URL + '/regions-banner.webp', alt: '굿데이 출장마사지 방문 서비스' }] },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [SITE_URL + '/regions-banner.webp'] },
  }
}
