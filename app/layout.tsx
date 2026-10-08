import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import type { ReactNode } from 'react'
import '../src/index.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gdymassage.com'),
  verification: { google: 'JWJC6zNgbqpoZgMXv-ozVTY3b_TtVl4rf7-aq8OlL04' },
  icons: {
    icon: { url: '/favicon-burgundy.png', type: 'image/png', sizes: '96x96' },
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body>
    {children}
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-GYJQ38MVCQ" strategy="lazyOnload" />
    <Script id="google-analytics" strategy="lazyOnload">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-GYJQ38MVCQ');`}</Script>
  </body></html>
}
