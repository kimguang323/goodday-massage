'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Link, useParams, useNavigate } from '../router'
import { BLOG_POSTS } from '../data/blog'
import { openCrispChat } from '../crisp'
export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>()
  const selected = BLOG_POSTS.find(post => post.slug === slug)
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState<string>('전체')
  const cats = ['전체', ...Array.from(new Set(BLOG_POSTS.map(p => p.cat)))]
  const filtered = activeCat === '전체' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.cat === activeCat)

  if (selected) {
    return (
      <article className="min-h-screen pb-24" style={{ background: 'white' }}>
        <div className="pt-20 pb-10" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <button onClick={() => navigate('/blog')} className="flex items-center gap-1.5 text-xs mb-6 hover:opacity-80" style={{ color: '#fda4b2' }}>
              ← 블로그 목록
            </button>
            <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'rgba(255,164,178,0.2)', color: '#fda4b2' }}>{selected.cat}</span>
            <h1 className="mt-3 leading-snug font-medium" style={{ color: 'white', fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>{selected.title}</h1>
            <div className="flex items-center gap-3 mt-4 text-xs" style={{ color: 'rgba(255,210,225,0.6)' }}>
              <span>{selected.updated ? `수정 ${selected.updated}` : selected.date}</span>
              <span>·</span>
              <span>{selected.body?.length ? '이용 안내' : '지역 안내 요약'}</span>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#5a3040' }}>{selected.desc}</p>
          {(selected.body ?? []).map((sec, i) => (
            <div key={i} className="mb-8">
              <h2 className="font-semibold mb-3" style={{ color: '#3a1828', fontSize: '1.05rem' }}>{sec.h}</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#5a3040' }}>{sec.p}</p>
            </div>
          ))}
          <div className="mt-12 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
            <p className="text-sm font-medium mb-4" style={{ color: 'white' }}>지금 바로 예약하고 경험하세요</p>
            <button type="button" onClick={openCrispChat}
              className="booking-shimmer inline-flex min-h-12 w-full items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 sm:w-64"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              실시간 예약 상담
            </button>
            {selected.slug === 'nationwide-massage-service-guide' && <div className="mt-3">
              <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer" className="booking-shimmer inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#087eaf] px-6 py-3 text-sm font-medium text-white hover:opacity-90 sm:w-64">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M21.7 3.3a1 1 0 0 0-1.1-.2L2.7 10a1 1 0 0 0 .1 1.9l4.6 1.4 1.8 5.5a1 1 0 0 0 1.7.4l2.6-2.7 4.6 3.4a1 1 0 0 0 1.6-.6l2.3-15a1 1 0 0 0-.3-1ZM9.1 12.7l9-6.1-6.9 7.6-.9 2.9-1.2-4.4Z" /></svg>
                텔레그램 상담하기
              </a>
            </div>}
          </div>
        </div>
      </article>
    )
  }

  return (
    <section id="blog" className="min-h-screen pb-24" style={{ background: '#fff8fa' }}>
      {/* 메인 배너 */}
      <div className="w-full">
        <Image width={1280} height={720} sizes="100vw" priority src="/blog-banner.webp" alt="굿데이마사지 블로그" className="w-full h-auto" style={{ display: 'block' }} />
      </div>

      {/* 히어로 */}
      <div className="py-8 text-center" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#fda4b2' }}>Blog</div>
        <h1 style={{ color: 'white', fontWeight: 400, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>케어 블로그</h1>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,210,225,0.7)' }}>출장마사지 이용 가이드 · 건강 정보 · 지역별 안내</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="sticky top-16 z-10 border-b overflow-x-auto" style={{ background: 'white', borderColor: '#fce8ef' }}>
        <div className="flex min-w-max px-4">
          {cats.map(c => (
            <button key={c} onClick={() => setActiveCat(c)}
              className="px-4 py-3 text-xs whitespace-nowrap border-b-2 transition-all"
              style={{ borderColor: activeCat === c ? '#c0406a' : 'transparent', color: activeCat === c ? '#c0406a' : '#9a7080', fontWeight: activeCat === c ? 600 : 400 }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 포스트 그리드 */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <article key={i} className="group cursor-pointer bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow"
              style={{ borderColor: '#fce8ef' }}
              onClick={() => navigate(`/blog/${post.slug}`)}>
              <div className="p-5">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full" style={{ background: '#fce8ef', color: '#c0406a' }}>{post.cat}</span>
                <h3 className="mt-3 text-sm font-medium leading-snug mb-2" style={{ color: '#3a1828' }}><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: '#9a607a' }}>{post.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#c0a0a8' }}>{post.date}</span>
                  <span className="text-xs" style={{ color: '#c0406a' }}>{post.body?.length ? '이용 안내' : '지역 안내 요약'} →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

