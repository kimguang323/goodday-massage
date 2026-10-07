'use client'

import Image from 'next/image'
import NationwideOverview from './components/NationwideOverview'
import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from './router'
import { REGIONS } from './data/regions'
import { cityPath, PAGE_PATHS } from './data/site'
import { BLOG_POSTS } from './data/blog'

declare global {
  interface Window {
    $crisp?: unknown[]
  }
}

const CRISP_CHAT_URL = 'https://go.crisp.chat/chat/embed/?website_id=8228327c-a1a7-4ba2-b41e-657b36b5105f'

function openCrispChat() {
  if (!window.$crisp) {
    window.$crisp = []
    ;(window as Window & { CRISP_WEBSITE_ID?: string }).CRISP_WEBSITE_ID = '8228327c-a1a7-4ba2-b41e-657b36b5105f'
    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    script.onerror = () => window.open(CRISP_CHAT_URL, '_blank', 'noopener,noreferrer')
    document.head.appendChild(script)
    window.$crisp.push(['on', 'chat:closed', () => window.$crisp?.push(['do', 'chat:hide'])])
  }
  if (window.$crisp) {
    window.$crisp.push(['do', 'chat:show'])
    window.$crisp.push(['do', 'chat:open'])
    return
  }

  window.open(CRISP_CHAT_URL, '_blank', 'noopener,noreferrer')
}


const NAV_ITEMS = [
  { label: '홈', href: '#home' },
  { label: '1:1 문의', href: '#contact' },
  { label: '코스보기', href: '#services' },
  { label: '테라피스트 보기', href: '#therapists' },
  { label: '지역선택', href: '#regions' },
  { label: '블로그', href: '#blog' },
  { label: 'FAQ', href: '#faq' },
  { label: '고객후기', href: '#reviews' },
]

const SERVICES = [
  {
    name: '스웨디시',
    tag: '전신 순환 · 숙면',
    desc: '전신 혈액순환 촉진 및 깊은 수면 유도에 특화된 클래식 마사지. 장거리 이동 후 피로 회복에 최적입니다.',
    time: '60 · 90 · 120분',
    recommend: '장거리 이동 후',
    icon: '🌸',
  },
  {
    name: '아로마',
    tag: '신경 과각성 완화',
    desc: '천연 에센셜 오일로 과민해진 신경계를 진정시키는 감각 테라피. 야간 릴랙스에 특화되어 있습니다.',
    time: '60 · 90 · 120분',
    recommend: '야간 릴랙스',
    icon: '🌿',
  },
  {
    name: '림프순환',
    tag: '부종 · 피로 관리',
    desc: '정밀한 드레나지 기법으로 부종과 피로를 동시에 해소합니다. 도보 또는 장거리 운전 후 권장합니다.',
    time: '60 · 90 · 120분',
    recommend: '도보 · 장거리 운전 후',
    icon: '💧',
  },
  {
    name: '스포츠 · 근막',
    tag: '근육 이동성 회복',
    desc: '뭉친 근막과 딥티슈를 집중 이완하는 전문 테라피. 운동 후 또는 현장 노동 직후 효과적입니다.',
    time: '60 · 90 · 120분',
    recommend: '운동 · 현장 노동 후',
    icon: '✦',
  },
]

const THERAPISTS = [
  { name: '가인', stars: 4.9, desc: '밝고 섬세한 응대, 밸런스 케어', status: '실시간 상담 가능', img: '/therapist-ga-in.webp' },
  { name: '나연', stars: 5.0, desc: '부드러운 리듬감, 꼼꼼한 컨디션 체크', status: '상담중', img: '/therapist-na-yeon.webp' },
  { name: '미영', stars: 4.9, desc: '활기찬 에너지, 압 조절, 피로 포인트 집중', status: '실시간 상담 가능', img: '/therapist-mi-young.webp' },
  { name: '미유', stars: 4.9, desc: '차분한 분위기, 릴랙싱 중심', status: '실시간 상담 가능', img: '/therapist-mi-yu.webp' },
  { name: '민영', stars: 4.9, desc: '부드러운 리듬, 스트레스 완화', status: '상담중', img: '/therapist-min-young.webp' },
  { name: '소연', stars: 5.0, desc: '정돈된 진행, 집중도 높은 케어', status: '실시간 상담 가능', img: '/therapist-so-yeon.webp' },
  { name: '수연', stars: 4.9, desc: '편안한 대화, 꼼꼼한 진행', status: '실시간 상담 가능', img: '/therapist-su-yeon.webp' },
  { name: '은별', stars: 4.9, desc: '경쾌한 분위기, 또렷한 리듬', status: '실시간 상담 가능', img: '/therapist-eun-byeol.webp' },
  { name: '은영', stars: 4.9, desc: '차분한 릴랙싱, 안정적 흐름', status: '실시간 상담 가능', img: '/therapist-eun-young.webp' },
  { name: '재인', stars: 5.0, desc: '안정적 압 조절, 완성도 높은 루틴', status: '상담중', img: '/therapist-jae-in.webp' },
  { name: '지은', stars: 4.9, desc: '밝은 분위기, 부드러운 진행', status: '실시간 상담 가능', img: '/therapist-ji-eun.webp' },
  { name: '하린', stars: 5.0, desc: '섬세하고 가벼운 리듬, 긴장 완화', status: '실시간 상담 가능', img: '/therapist-ha-rin.webp' },
  { name: '하은', stars: 4.9, desc: '균형 잡힌 템포, 전신 케어', status: '상담중', img: '/therapist-ha-eun.webp' },
]

const REVIEWS = [
  {
    name: '서울 — 강남구',
    date: '2026.02.14',
    service: '아로마 90분',
    stars: 5,
    title: '정말 최고의 서비스였어요',
    text: '출장이 잦아 몸이 많이 지쳐있었는데 방문 후 정말 개운하게 풀렸어요. 테라피스트분이 세심하게 케어해주셔서 너무 만족스러웠습니다. 다음에도 꼭 이용할게요.',
  },
  {
    name: '부산 — 해운대구',
    date: '2026.01.28',
    service: '스웨디시 60분',
    stars: 5,
    title: '호텔에서 스파 느낌 그대로',
    text: '호텔 방문 서비스인데 완전히 스파에 온 느낌이었어요. 위생 관리가 철저하고 예약도 간편해서 좋았습니다. 비즈니스 출장 때마다 이용하고 싶은 서비스예요.',
  },
  {
    name: '제주 — 서귀포시',
    date: '2026.01.11',
    service: '림프순환 120분',
    stars: 5,
    title: '제주 여행 중 최고의 선택',
    text: '제주 여행 중 이용했는데 정말 힐링이었어요. 담당 선생님이 친절하시고 프로페셔널하셨어요. 부기가 확실히 빠지는 게 느껴졌고 여행 내내 컨디션이 좋았습니다.',
  },
]

const FAQS = [
  { q: '서비스 철학이 궁금합니다.', a: '저희는 단순한 마사지를 넘어 고객의 몸과 마음을 진정으로 케어하는 프리미엄 테라피를 제공합니다. 상위 1% 고객을 위한 맞춤형 서비스로, 모든 예약에는 검증된 테라피스트만 배정됩니다.' },
  { q: '프리미엄 서비스란 무엇인가요?', a: '일회용 비품 사용, 사전·사후 위생 관리, 100% 예약제 안심 예약, 개인정보 즉시 삭제를 포함한 완전한 프라이버시 보호가 포함된 서비스입니다.' },
  { q: '일반 마사지와 어떻게 다른가요?', a: '국가 공인 자격을 보유한 테라피스트만 선발하며, 매 회 고객 맞춤 케어 플랜을 수립합니다. 고급 오일과 의료 등급 소모품을 사용하여 최상의 환경을 제공합니다.' },
  { q: '어느 지역까지 방문 가능한가요?', a: '전국 모든 지역의 고객을 대상으로 방문 서비스를 운영합니다. 목록에 없는 지역도 문의해 주세요. 정확한 배정 가능 여부와 도착 시간은 주소·희망 시간·이동 여건을 확인한 뒤 안내합니다.' },
  { q: '테라피스트 신원은 어떻게 확인하나요?', a: '모든 테라피스트는 입사 전 신원조회, 자격증 검증, 위생 교육을 완료합니다. 고객 방문 시 고유 인증 코드가 발급되며, 개인정보는 서비스 완료 즉시 삭제됩니다.' },
]



function Stars({ count }: { count: number }) {
  return <span className="text-rose-400">{'★'.repeat(count)}</span>
}

const REGION_TABS = [
  {
    label: '강남 · 여의도 · 광화문',
    areas: ['강남구', '서초구', '송파구', '영등포구', '종로구', '중구'],
    desc: '대한민국 비즈니스 핵심 권역. 특급 호텔 및 고급 오피스텔 밀집 지역으로 평균 배정 20~30분.',
    points: ['강남역 반경 3km 즉시 배정', '여의도 IFC·파크원 호텔 전담 동선', '광화문·시청 비즈니스 투숙객 우선 배정'],
  },
  {
    label: '홍대 · 성수 · 잠실',
    areas: ['마포구', '성동구', '광진구', '송파구', '강동구'],
    desc: '트렌디한 문화·상업 복합 권역. 레지던스 호텔 및 게스트하우스 이용 고객 다수.',
    points: ['홍대·합정 레지던스 프라이빗 입실', '성수 하이엔드 오피스텔 특화 동선', '잠실 롯데호텔·시그니엘 전담 배정'],
  },
  {
    label: '서울역 · 용산역 · 공항',
    areas: ['용산구', '중구', '강서구', '은평구'],
    desc: 'KTX 역세권 및 공항 인근 권역. 이동 직후 즉시 케어가 필요한 출장 고객에 최적화.',
    points: ['서울역·용산역 도보 5분 반경 배정', '김포공항 인근 호텔 당일 예약', 'KTX 이동 직후 즉시 케어 가능'],
  },
]

function seededRandom(seed: number) {
  let x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function getTherapistsForCity(cityName: string): typeof THERAPISTS {
  const today = new Date()
  const dateKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  let hash = dateKey
  for (let i = 0; i < cityName.length; i++) hash = hash * 31 + cityName.charCodeAt(i)

  const indices = Array.from({ length: THERAPISTS.length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(hash + i) * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices.slice(0, 6).map(i => THERAPISTS[i])
}

function CityModal({ city, therapists, onClose }: {
  city: string
  therapists: typeof THERAPISTS
  onClose: () => void
}) {
  const [zoomedImg, setZoomedImg] = useState<{ src: string; name: string } | null>(null)

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(30,10,20,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <div
          className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden"
          style={{ background: 'white', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #fce8ef' }}>
            <div>
              <div className="text-xs tracking-widest mb-0.5" style={{ color: '#c0406a' }}>상담 가능 테라피스트</div>
              <h3 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: '1.4rem', color: '#3a1828', fontWeight: 400 }}>
                {city} 배정 가능
              </h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-lg"
              style={{ background: '#fff0f4', color: '#c0406a' }}>×</button>
          </div>

          {/* 테라피스트 4명 */}
          <div className="p-5 grid grid-cols-2 gap-3">
            {therapists.map(t => (
              <div key={t.name} className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
                <div
                  className="relative cursor-zoom-in"
                  style={{ paddingTop: '120%' }}
                  onClick={() => setZoomedImg({ src: t.img, name: t.name })}
                >
                  <img loading="lazy" decoding="async" src={t.img} alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  {/* 확대 힌트 */}
                  <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full opacity-80"
                    style={{ background: 'rgba(0,0,0,0.45)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 px-2 py-1.5" style={{ background: 'linear-gradient(to top, rgba(58,24,40,0.85), transparent)' }}>
                    <div className="flex gap-1 mb-0.5" style={{ flexWrap: 'nowrap' }}>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap font-medium" style={{ background: 'rgba(253,164,178,0.25)', color: '#fda4b2', border: '1px solid rgba(253,164,178,0.3)' }}>한국인</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap font-medium" style={{ background: 'rgba(253,164,178,0.25)', color: '#fda4b2', border: '1px solid rgba(253,164,178,0.3)' }}>100%실사</span>
                    </div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-medium"
                    style={{ background: t.status === '실시간 상담 가능' ? '#10b981' : '#f59e0b', color: 'white' }}>
                    {t.status === '실시간 상담 가능' ? '상담가능' : '상담중'}
                  </div>
                </div>
                <div className="px-2.5 py-2">
                  <div className="text-[10px]" style={{ color: '#fda4b2' }}>{'★'.repeat(Math.round(t.stars))} {t.stars}</div>
                  <p className="text-[10px] leading-snug mt-0.5" style={{ color: '#7a4055' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 예약 버튼 */}
          <div className="px-5 pb-6 flex flex-col gap-2">
            <button type="button" onClick={openCrispChat}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-medium text-sm transition-all hover:opacity-90"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
              카카오톡으로 바로 예약
            </button>
            <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-medium text-sm text-white transition-all hover:opacity-90"
              style={{ background: '#2AABEE' }}>
              ✈️ 텔레그램 상담
            </a>
          </div>
        </div>
      </div>

      {/* 사진 전체화면 라이트박스 */}
      {zoomedImg && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(10,0,8,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={() => setZoomedImg(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-xl font-light"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}
            onClick={() => setZoomedImg(null)}
          >×</button>
          <div className="flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            <img
              src={zoomedImg.src}
              alt={zoomedImg.name}
              className="rounded-2xl shadow-2xl"
              style={{ maxHeight: '80vh', maxWidth: '90vw', objectFit: 'contain' }}
            />
            <span className="text-sm font-medium" style={{ color: '#fda4b2', fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: '1.1rem' }}>
              {zoomedImg.name}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

const FAQ_DATA = [
  {
    cat: '예약',
    items: [
      { q: '예약은 어떻게 하나요?', a: '카카오톡 채널 또는 텔레그램으로 문의하시면 됩니다. 24시간 상담이 가능하며, 원하시는 코스·시간·장소를 말씀해주시면 빠르게 안내해드립니다.' },
      { q: '예약 후 취소나 변경이 가능한가요?', a: '테라피스트 배정 전에는 자유롭게 변경·취소가 가능합니다. 배정 이후에는 취소 정책이 적용될 수 있으니 가급적 빠르게 연락해주세요.' },
      { q: '당일 예약도 가능한가요?', a: '네, 가능합니다. 24시간 운영하며 당일 즉시 예약도 지원합니다. 다만 시간대와 지역에 따라 배정 상황이 다를 수 있습니다.' },
      { q: '예약 후 대기 시간은 얼마나 되나요?', a: '전 지역 평균 30~60분 내 배정을 목표로 합니다. 지역·시간대에 따라 다소 차이가 있을 수 있으며, 배정 즉시 안내해드립니다.' },
      { q: '장소는 어디서 받을 수 있나요?', a: '호텔, 오피스텔, 자택 등 고객님이 계신 곳으로 방문합니다. 주소를 알려주시면 됩니다.' },
    ],
  },
  {
    cat: '결제',
    items: [
      { q: '결제는 어떻게 하나요?', a: '서비스 완료 후 현장에서 현금 또는 계좌이체로 결제하시면 됩니다. 사전 결제는 진행하지 않습니다.' },
      { q: '영수증 발급이 되나요?', a: '요청하시면 계좌이체 영수증을 제공해드릴 수 있습니다. 세금계산서 발급은 별도 문의 부탁드립니다.' },
      { q: '환불 정책은 어떻게 되나요?', a: '서비스 품질에 문제가 있을 경우 사실 확인 후 교체·재배정·환불을 검토해드립니다. 단순 변심에 의한 환불은 어려울 수 있습니다.' },
    ],
  },
  {
    cat: '서비스',
    items: [
      { q: '어떤 코스가 있나요?', a: '스웨디시, 아로마, 스포츠, 림프순환, VIP 프리미엄 등 다양한 코스를 제공합니다. 코스보기 메뉴에서 상세 내용을 확인하실 수 있습니다.' },
      { q: '서비스 시간은 얼마나 되나요?', a: '코스에 따라 80분, 110분, 140분 등 다양하게 선택 가능합니다. VIP 코스는 90분부터 시작합니다.' },
      { q: '어느 지역까지 방문 가능한가요?', a: '전국 모든 지역에서 방문을 요청하실 수 있습니다. 목록에 없는 지역도 상담해 주세요. 실제 배정과 방문 일정은 요청하신 지역과 시간에 따라 확정합니다.' },
      { q: '운영 시간이 어떻게 되나요?', a: '연중무휴 24시간 운영합니다. 지역별 배정 상황에 따라 다소 차이가 있을 수 있습니다.' },
      { q: '음주 상태에서 서비스 이용이 가능한가요?', a: '안전상의 이유로 음주 상태에서는 서비스 진행이 제한되거나 불가할 수 있습니다.' },
    ],
  },
  {
    cat: '안전·위생',
    items: [
      { q: '테라피스트 신원은 어떻게 확인하나요?', a: '모든 테라피스트는 입사 전 신원조회, 자격증 검증, 위생 교육을 완료합니다. 고객 방문 시 고유 인증 코드가 발급됩니다.' },
      { q: '위생 관리는 어떻게 하나요?', a: '모든 소모품은 1회용으로 1회 사용 후 즉시 폐기됩니다. 도착 전·서비스 완료 후 철저한 위생 관리를 수행합니다.' },
      { q: '개인정보는 어떻게 관리되나요?', a: '고객 개인정보는 최소한만 수집하며, 서비스 완료 즉시 삭제합니다. 보관기간 경과 시 완전히 파기됩니다.' },
      { q: '의료 행위도 제공하나요?', a: '아니요. 저희 서비스는 힐링·컨디셔닝 범위 내에서만 제공되며, 의료 행위는 제공하지 않습니다.' },
    ],
  },
  {
    cat: '기타',
    items: [
      { q: '성적인 서비스도 제공하나요?', a: '절대 제공하지 않습니다. 의료·성적·불법적 요청은 즉시 서비스를 중단하고 퇴장합니다.' },
      { q: '테라피스트 지명이 가능한가요?', a: '특정 테라피스트 지명은 어려우나, 선호하는 스타일이나 특이사항을 말씀해주시면 최대한 반영해드립니다.' },
      { q: '서비스 중 불편사항이 생기면 어떻게 하나요?', a: '즉시 담당자에게 연락해주세요. 사실 확인 후 교체·재배정 등 신속히 처리해드립니다.' },
    ],
  },
]

function ContactFaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: '#fce8ef' }}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-rose-50/40 transition-colors">
        <span className="text-sm font-medium" style={{ color: '#3a1828' }}>Q. {faq.q}</span>
        <span style={{ color: '#c0406a', flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none', display: 'inline-block', fontSize: '1.1rem' }}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-sm leading-relaxed border-t" style={{ color: '#7a4055', borderColor: '#fce8ef', background: '#fff8fa' }}>
          <span className="font-medium" style={{ color: '#c0406a' }}>A. </span>{faq.a}
        </div>
      )}
    </div>
  )
}

const REVIEW_REGIONS = [
  { region: '서울특별시', cases: [
    { area: '강남', course: '스웨디시', badges: ['Verified', '고객방문형', '후불제', '야간'], text: '압 조절이 정확하고 마무리 스트레칭까지 꼼꼼하게 해주셨어요. 최고였습니다.' },
    { area: '마포', course: '아로마', badges: ['Verified', '호텔', '심야'], text: '향이 은은하고 림프 케어가 섬세해요. 심야인데도 빠른 배정 감사합니다.' },
    { area: '용산', course: '딥티슈', badges: ['자택'], text: '뭉친 어깨가 단번에 풀렸습니다. 딥티슈가 이렇게 시원한지 몰랐어요.' },
  ]},
  { region: '경기도', cases: [
    { area: '수원', course: '스포츠', badges: ['Verified', '자택', '후불제'], text: '딥티슈가 시원하고 회복이 빨랐어요. 다음에도 꼭 이용하겠습니다.' },
    { area: '성남', course: '림프', badges: ['Verified', '호텔'], text: '부종이 가볍게 빠졌습니다. 다리가 눈에 띄게 가벼워졌어요.' },
    { area: '부천', course: '스웨디시', badges: ['야간'], text: '편안해서 금방 잠들었어요. 야간 배정도 빠르고 친절했습니다.' },
  ]},
  { region: '인천광역시', cases: [
    { area: '송도', course: '아로마', badges: ['Verified', '호텔'], text: '향과 터치가 완벽했습니다. 호텔에서 받으니 더욱 특별했어요.' },
    { area: '부평', course: '림프', badges: ['후불제', '자택'], text: '부종이 바로 가벼워졌어요. 후불제라 믿고 이용할 수 있었습니다.' },
    { area: '계양', course: '스포츠', badges: ['Verified'], text: '핵심만 정확히 풀어줍니다. 운동 후 피로 회복에 딱이었어요.' },
  ]},
  { region: '부산광역시', cases: [
    { area: '해운대', course: '림프', badges: ['Verified', '호텔'], text: '여행 피로가 싹 풀렸어요. 해운대 호텔에서 받은 최고의 서비스였습니다.' },
    { area: '서면', course: '스포츠', badges: ['Verified', '퇴근 후'], text: '강약 조절이 좋고 스트레칭이 시원했습니다. 퇴근 후 최고의 선택이에요.' },
    { area: '광안리', course: '스웨디시', badges: ['야간'], text: '편안하게 잠들었고 다음날까지 개운해요. 야간 서비스 추천합니다.' },
  ]},
  { region: '대구광역시', cases: [
    { area: '수성', course: '딥티슈', badges: ['Verified', '자택'], text: '핵심을 정확히 눌러줘요. 자택 방문이라 이동 없이 편하게 받았습니다.' },
    { area: '동성로', course: '아로마', badges: ['Verified', '후불제'], text: '은은한 향과 섬세한 케어가 인상적. 후불제라 신뢰가 갔어요.' },
    { area: '달서', course: '스포츠', badges: ['야간'], text: '뭉친 부위만 시원하게 공략합니다. 심야 배정도 빠르게 해주셨어요.' },
  ]},
  { region: '광주광역시', cases: [
    { area: '상무지구', course: '스포츠', badges: ['Verified', '호텔'], text: '강약 조절이 완벽합니다. 호텔에서 프로 케어를 받은 느낌이었어요.' },
    { area: '첨단', course: '림프', badges: ['Verified', '후불제'], text: '부종 관리에 효과적이었어요. 다음날 몸이 확실히 달랐습니다.' },
    { area: '동구', course: '스웨디시', badges: ['자택'], text: '편안해서 푹 잤습니다. 자택 방문이라 더 편안하게 받을 수 있었어요.' },
  ]},
  { region: '대전광역시', cases: [
    { area: '유성', course: '스웨디시', badges: ['Verified', '자택'], text: '호흡 맞춤 힐링이 좋았어요. 편안하게 릴랙스할 수 있었습니다.' },
    { area: '둔산', course: '스포츠', badges: ['Verified', '후불제'], text: '뭉친 부위만 시원하게 공략. 전문적인 케어에 만족했습니다.' },
    { area: '정부청사', course: '림프', badges: ['오피스텔'], text: '붓기 감소 체감했어요. 오피스텔에서도 완벽한 서비스였습니다.' },
  ]},
  { region: '울산광역시', cases: [
    { area: '남구', course: '스포츠', badges: ['Verified', '자택'], text: '등·어깨가 가벼워졌습니다. 정확한 포인트 케어가 인상적이었어요.' },
    { area: '중구', course: '림프', badges: ['Verified', '후불제'], text: '붓기가 눈에 띄게 줄었어요. 전문적인 림프 드레나쥐였습니다.' },
    { area: '동구', course: '스웨디시', badges: ['야간'], text: '편안해서 금방 잠들었어요. 야간 서비스도 퀄리티가 동일해요.' },
  ]},
  { region: '세종특별자치시', cases: [
    { area: '행정중심', course: '스웨디시', badges: ['Verified', '오피스텔'], text: '업무 피로가 싹 풀렸습니다. 오피스텔에서도 완벽한 준비물이었어요.' },
    { area: '정부세종', course: '아로마', badges: ['Verified', '후불제'], text: '향이 은은해 숙면했어요. 다음날 컨디션이 완전히 달랐습니다.' },
    { area: '새롬동', course: '림프', badges: ['자택'], text: '붓기 완화가 확실했어요. 자택 방문으로 편하게 받았습니다.' },
  ]},
  { region: '강원특별자치도', cases: [
    { area: '강릉', course: '림프', badges: ['Verified', '호텔'], text: '여행 피로 회복에 최고예요. 강릉 여행에 가장 잘한 선택이었습니다.' },
    { area: '원주', course: '스포츠', badges: ['Verified', '자택'], text: '허리·하체가 눈에 띄게 가벼워졌어요. 전문 케어가 확실히 달랐습니다.' },
    { area: '속초', course: '스웨디시', badges: ['호텔'], text: '편안한 숙면을 도와줍니다. 여행 피로가 다음날 완전히 풀렸어요.' },
  ]},
  { region: '충청북도', cases: [
    { area: '청주', course: '스웨디시', badges: ['Verified', '오피스텔'], text: '부드럽고 촘촘한 케어가 좋았어요. 숙면 유도 효과가 확실했습니다.' },
    { area: '충주', course: '스포츠', badges: ['Verified', '후불제'], text: '핵심만 정확히 풀어줍니다. 후불제라 더 믿음이 갔어요.' },
    { area: '제천', course: '림프', badges: ['자택'], text: '붓기 관리에 효과적이었습니다. 다음날 다리가 확실히 달랐어요.' },
  ]},
  { region: '충청남도', cases: [
    { area: '천안', course: '림프', badges: ['Verified', '자택'], text: '부종이 빠르게 가벼워졌어요. 전문적인 케어에 만족했습니다.' },
    { area: '아산', course: '스포츠', badges: ['Verified', '후불제'], text: '등·어깨 집중 케어가 만족스러워요. 재방문 의사 100%입니다.' },
    { area: '당진', course: '스웨디시', badges: ['자택'], text: '편안해서 깊게 잤습니다. 자택 방문 서비스 강력 추천해요.' },
  ]},
  { region: '전라북도', cases: [
    { area: '전주', course: '아로마', badges: ['Verified', '호텔'], text: '향과 터치가 조화롭습니다. 한옥마을 여행 후 완벽한 마무리였어요.' },
    { area: '익산', course: '스포츠', badges: ['Verified', '자택'], text: '강약 조절이 좋아요. 허리 통증이 바로 완화됐습니다.' },
    { area: '군산', course: '스웨디시', badges: ['호텔'], text: '피로가 싹 풀렸어요. 다음날 아침 컨디션이 최상이었습니다.' },
  ]},
  { region: '전라남도', cases: [
    { area: '여수', course: '림프', badges: ['Verified', '호텔'], text: '여행 피로가 빠르게 풀렸습니다. 여수 야경과 함께 최고의 힐링이었어요.' },
    { area: '순천', course: '스웨디시', badges: ['Verified', '후불제'], text: '편안해서 금방 잠들었어요. 후불제로 부담 없이 이용했습니다.' },
    { area: '목포', course: '스포츠', badges: ['자택'], text: '딥티슈가 제대로 들어갑니다. 자택 방문이라 더 편안했어요.' },
  ]},
  { region: '경상북도', cases: [
    { area: '포항', course: '스포츠', badges: ['Verified', '자택'], text: '딥티슈가 시원합니다. 운동 후 회복이 확실히 빨랐어요.' },
    { area: '경주', course: '스웨디시', badges: ['Verified', '호텔'], text: '편안한 수면을 도와줬어요. 경주 여행의 완벽한 마무리였습니다.' },
    { area: '구미', course: '림프', badges: ['후불제'], text: '붓기 완화가 확실해요. 후불제 덕분에 믿고 첫 이용 했습니다.' },
  ]},
  { region: '경상남도', cases: [
    { area: '창원', course: '림프', badges: ['Verified', '자택'], text: '붓기 관리에 큰 도움이 됐어요. 전문 케어 퀄리티가 놀라웠습니다.' },
    { area: '김해', course: '스포츠', badges: ['Verified', '후불제'], text: '핵심 근육을 정확히 풀어줍니다. 재이용 의사 100%입니다.' },
    { area: '통영', course: '스웨디시', badges: ['호텔'], text: '편안하고 개운합니다. 통영 여행의 완벽한 힐링이었어요.' },
  ]},
  { region: '제주특별자치도', cases: [
    { area: '제주시', course: '스웨디시', badges: ['Verified', '호텔'], text: '여행 피로가 싹 풀리고 개운해요. 제주 여행 필수 코스로 추천합니다.' },
    { area: '서귀포', course: '아로마', badges: ['Verified', '후불제'], text: '향과 터치가 편안해 금방 잠들었어요. 풀빌라에서 받으니 완벽했습니다.' },
    { area: '애월', course: '림프', badges: ['호텔'], text: '부종 케어 효과가 확실했습니다. 애월 감성에 최고의 힐링이었어요.' },
  ]},
]

function ReviewPage({ onBook }: { onBook: () => void }) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const displayed = activeRegion
    ? REVIEW_REGIONS.filter(r => r.region === activeRegion)
    : REVIEW_REGIONS

  return (
    <section id="reviews" className="pb-24 min-h-screen" style={{ background: '#fff8fa' }}>
      {/* 메인 배너 */}
      <div className="w-full">
        <img loading="lazy" decoding="async" src="/reviews-banner.webp" alt="굿데이마사지 고객후기" className="w-full" style={{ display: 'block' }} />
      </div>
      {/* 히어로 */}
      <div className="py-10 text-center" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#fda4b2' }}>Reviews</div>
        <h1 style={{ color: 'white', fontWeight: 400, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>고객 후기</h1>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,210,225,0.8)' }}>실제 이용 고객님들의 생생한 관리 사례입니다</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 divide-x border-b" style={{ background: '#2a1020', borderColor: '#4a2038' }}>
        {[['1,284건', '최근 30일 관리 사례', '+12% 증가'], ['97%', '재이용 의사', '신뢰도'], ['98%', '배정 만족도', '신속 배정']].map(([val, label, sub]) => (
          <div key={label} className="py-5 text-center">
            <div className="font-bold text-xl" style={{ color: '#fda4b2' }}>{val}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,210,225,0.7)' }}>{label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,210,225,0.4)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* 지역 필터 탭 */}
      <div className="sticky top-16 z-10 border-b overflow-x-auto" style={{ background: 'white', borderColor: '#fce8ef' }}>
        <div className="flex gap-0 min-w-max px-4">
          <button onClick={() => setActiveRegion(null)}
            className="px-4 py-3 text-xs whitespace-nowrap border-b-2 transition-all"
            style={{ borderColor: activeRegion === null ? '#c0406a' : 'transparent', color: activeRegion === null ? '#c0406a' : '#9a7080', fontWeight: activeRegion === null ? 600 : 400 }}>
            전체
          </button>
          {REVIEW_REGIONS.map(r => (
            <button key={r.region} onClick={() => setActiveRegion(r.region === activeRegion ? null : r.region)}
              className="px-4 py-3 text-xs whitespace-nowrap border-b-2 transition-all"
              style={{ borderColor: activeRegion === r.region ? '#c0406a' : 'transparent', color: activeRegion === r.region ? '#c0406a' : '#9a7080', fontWeight: activeRegion === r.region ? 600 : 400 }}>
              {r.region.replace('특별시', '').replace('광역시', '').replace('특별자치시', '').replace('특별자치도', '').replace('특별자치도', '')}
            </button>
          ))}
        </div>
      </div>

      {/* 지역별 후기 */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {displayed.map(({ region, cases }) => (
          <div key={region} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h3 className="font-semibold text-sm" style={{ color: '#3a1828' }}>{region}</h3>
              <div className="flex-1 h-px" style={{ background: '#fce8ef' }} />
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#fce8ef', color: '#c0406a' }}>{cases.length}건</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {cases.map((c, i) => (
                <div key={i} className="rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-medium text-sm" style={{ color: '#3a1828' }}>{c.area}</span>
                      <span className="mx-1.5 text-xs" style={{ color: '#fda4b2' }}>·</span>
                      <span className="text-xs" style={{ color: '#c0406a' }}>{c.course}</span>
                    </div>
                    <div className="text-yellow-400 text-xs tracking-tight">★★★★★</div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {c.badges.map(b => (
                      <span key={b} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: b === 'Verified' ? '#fce8ef' : '#f5f5f5', color: b === 'Verified' ? '#c0406a' : '#7a4055' }}>
                        {b === 'Verified' ? '✓ Verified' : b}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#5a3040' }}>"{c.text}"</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="rounded-2xl p-8 text-center mt-4" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
          <p className="text-sm mb-1 font-medium" style={{ color: 'white' }}>나도 후기의 주인공이 되어보세요</p>
          <p className="text-xs mb-5" style={{ color: 'rgba(255,210,225,0.7)' }}>지금 바로 예약하고 특별한 힐링을 경험하세요</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onBook}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-medium hover:opacity-90"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
              실시간 예약 상담
            </button>
            <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white hover:opacity-90"
              style={{ background: '#2AABEE' }}>
              ✈️ 텔레그램 예약
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function BlogPage() {
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:opacity-90"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              실시간 예약 상담
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <section id="blog" className="min-h-screen pb-24" style={{ background: '#fff8fa' }}>
      {/* 메인 배너 */}
      <div className="w-full">
        <img loading="lazy" decoding="async" src="/blog-banner.webp" alt="굿데이마사지 블로그" className="w-full" style={{ display: 'block' }} />
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

function FaqPage() {
  const [activeCat, setActiveCat] = useState(0)
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const items = FAQ_DATA[activeCat].items
  return (
    <section id="faq" className="min-h-screen pb-24" style={{ background: '#fff8fa' }}>
      {/* 히어로 */}
      <div className="py-8 sm:py-12 text-center" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#fda4b2' }}>FAQ</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'white', fontWeight: 400 }}>자주 묻는 질문</h1>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,210,225,0.8)' }}>궁금하신 점을 빠르게 확인하세요</p>
      </div>

      {/* 상황별 가이드 */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '⚡', title: '급한 예약', desc: '카카오톡 또는 텔레그램으로 즉시 문의하시면 빠르게 안내해드립니다.' },
            { icon: '⏱️', title: '배정 지연 시', desc: '배정 상황에 따라 지연될 수 있으며, 담당자가 실시간으로 안내드립니다.' },
            { icon: '🏨', title: '장소 준비', desc: '호텔·오피스텔·자택 모두 가능합니다. 편안한 환경을 미리 준비해주세요.' },
          ].map(g => (
            <div key={g.title} className="rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
              <div className="text-2xl mb-2">{g.icon}</div>
              <div className="font-medium text-sm mb-1" style={{ color: '#3a1828' }}>{g.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: '#9a607a' }}>{g.desc}</p>
            </div>
          ))}
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FAQ_DATA.map((d, i) => (
            <button key={d.cat} onClick={() => { setActiveCat(i); setOpenIdx(null) }}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={activeCat === i
                ? { background: '#c0406a', color: 'white' }
                : { background: 'white', color: '#7a4055', border: '1px solid #fce8ef' }}>
              {d.cat}
            </button>
          ))}
        </div>

        {/* FAQ 아코디언 */}
        <div className="flex flex-col gap-2">
          {items.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: '#fce8ef' }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-rose-50/40 transition-colors">
                <span className="text-sm font-medium" style={{ color: '#3a1828' }}>Q. {faq.q}</span>
                <span style={{ color: '#c0406a', flexShrink: 0, transition: 'transform 0.2s', transform: openIdx === i ? 'rotate(45deg)' : 'none', display: 'inline-block', fontSize: '1.1rem' }}>+</span>
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 pt-1 text-sm leading-relaxed border-t" style={{ color: '#7a4055', borderColor: '#fce8ef', background: '#fff8fa' }}>
                  <span className="font-medium" style={{ color: '#c0406a' }}>A. </span>{faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 서비스 보증 */}
        <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(160deg, #fdf2f5, #fce8ef)' }}>
          <h3 className="font-medium mb-2" style={{ color: '#3a1828', fontSize: '1.1rem' }}>굿데이 출장마사지, 안심하고 이용하세요</h3>
          <p className="text-xs mb-6" style={{ color: '#7a4055' }}>100% 예약제 · 1인 1세트 위생 · 완벽한 개인정보 보호</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🧴', title: '1회용 비품', desc: '모든 소모품은 1회 사용 후 즉시 폐기됩니다.' },
              { icon: '🔒', title: '개인정보 즉시 삭제', desc: '서비스 완료 즉시 고객 정보를 삭제합니다.' },
              { icon: '✓', title: '방문 전후 위생', desc: '도착 전·서비스 후 철저한 위생 관리를 합니다.' },
            ].map(item => (
              <div key={item.title} className="rounded-xl p-4 bg-white/70">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-medium text-xs mb-1" style={{ color: '#3a1828' }}>{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: '#9a607a' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function VipPage({ onClose, onGoTherapists }: { onClose: () => void; onGoTherapists: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  return (
    <div className="min-h-screen pb-24" style={{ background: '#fdf8f9', fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 상단 네비 */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 bg-white/95 backdrop-blur border-b" style={{ borderColor: '#fce8ef' }}>
        <button onClick={onClose} className="flex items-center gap-1.5 text-sm" style={{ color: '#c0406a' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          코스 목록
        </button>
        <span style={{ color: '#fce8ef' }}>|</span>
        <span className="text-sm" style={{ color: '#7a4055' }}>VIP 프리미엄 힐링 코스</span>
      </div>

      {/* VIP 배너 이미지 */}
      <div className="w-full overflow-hidden" style={{ maxHeight: 340 }}>
        <img loading="lazy" decoding="async" src="/vip-banner.webp" alt="굿데이마사지 VIP" className="w-full object-cover object-top" style={{ maxHeight: 340 }} />
      </div>

      {/* 히어로 */}
      <div className="relative py-20 text-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, #fda4b2, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="text-xs tracking-widest uppercase mb-4" style={{ color: '#fda4b2' }}>PREMIUM · VIP</div>
          <h1 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: 'white', fontWeight: 400 }}>
            VIP 프리미엄 힐링 코스<br /><span style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontWeight: 700, letterSpacing: '-0.02em' }}>(90분~)</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,210,225,0.85)' }}>
            과로·야근·출장·여행 후 완전한 회복을 위한<br />단 1%를 위한 프리미엄 케어
          </p>
          {/* 메타 정보 */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[['★★★★★', '4.9/5.0 · 후기 128건'], ['💰', '150,000원~'], ['🚗', '방문형 · 출장마사지'], ['🕐', '연중무휴 · 24시간']].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,220,230,0.9)', border: '1px solid rgba(253,164,178,0.25)' }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button type="button" onClick={openCrispChat}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
              바로 예약하기
            </button>
            <button onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm text-white border hover:bg-white/10 transition-all"
              style={{ borderColor: 'rgba(253,164,178,0.5)' }}>
              코스 보러가기
            </button>
          </div>
        </div>
      </div>

      {/* 코스 핵심 안내 배너 */}
      <div className="w-full overflow-hidden" style={{ maxHeight: 340 }}>
        <img loading="lazy" decoding="async" src="/course-banner.webp" alt="굿데이마사지 코스안내" className="w-full object-cover object-top" style={{ maxHeight: 340 }} />
      </div>

      {/* 코스 핵심 안내 */}
      <div className="py-14" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Core Info</div>
            <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>코스 핵심 안내</h2>
          </div>
          <p className="text-sm leading-relaxed mb-8 text-center" style={{ color: '#5a3040' }}>
            단순히 "강하게만"이 아닌, 밀도와 회복을 중심으로 설계된 루틴입니다.<br />컨디션 체크 후 그날의 상태에 맞게 루틴을 조정합니다.
          </p>
          <ul className="flex flex-col gap-4">
            {[
              ['✦', '전용 루틴', '외부에 공개되지 않은 VIP 전용 관리 기법으로 진행됩니다.'],
              ['🌿', '시크릿 아로마', '컨디션에 맞춰 블렌딩한 프리미엄 아로마 오일을 사용합니다.'],
              ['🎯', '맞춤 압·리듬', '단순 강약이 아닌 정밀한 압 조절과 리듬으로 케어합니다.'],
              ['💆', '집중 케어', '어깨·등·허리·하체 등 집중이 필요한 부위를 타겟 케어합니다.'],
              ['🏠', '편의성', '자택·숙소·오피스텔 등 고객님이 계신 곳으로 방문합니다.'],
            ].map(([icon, title, desc]) => (
              <li key={title as string} className="flex items-start gap-4 rounded-xl p-5 border" style={{ background: '#fff8fa', borderColor: '#fce8ef' }}>
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: '#3a1828' }}>{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#7a4055' }}>{desc}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-center" style={{ color: '#9a607a' }}>
            VIP 코스는 심야 시간대를 포함한 피크 시간에도 동일한 매뉴얼로 운영됩니다.
          </p>
        </div>
      </div>

      {/* 시간 & 가격 구성 */}
      <div className="py-14" style={{ background: '#fff8fa' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Pricing</div>
            <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>시간 & 가격 구성</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: '👍', time: '80분', price: '150,000원', desc: '짧게 컨디션 리셋' },
              { icon: '✌️', time: '120분', price: '200,000원', desc: '어깨·허리·하체 집중' },
              { icon: '🔥', time: '240분', price: '300,000원', desc: '장시간 회복 / 숙면' },
            ].map(t => (
              <div key={t.time} className="rounded-2xl p-6 text-center border bg-white" style={{ borderColor: '#fce8ef' }}>
                <div className="text-3xl mb-3">{t.icon}</div>
                <div className="text-lg font-medium mb-1" style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: '#3a1828' }}>{t.time}</div>
                <div className="text-xl font-semibold mb-2" style={{ color: '#c0406a' }}>{t.price}</div>
                <div className="text-xs" style={{ color: '#9a607a' }}>{t.desc}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl px-5 py-4 text-sm text-center" style={{ background: '#fff0f4', border: '1px solid #fce8ef', color: '#7a4055' }}>
            💡 시간 선택은 단순히 "길수록 좋다"가 아니라, 신체 컨디션과 피로 유형에 맞게 결정하세요.
          </div>
          <div className="text-center mt-6">
            <button onClick={onGoTherapists}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
              테라피스트 더보기 →
            </button>
          </div>
        </div>
      </div>

      {/* 실제 이용 후기 */}
      <div className="py-14" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Reviews</div>
            <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>VIP 코스 실제 이용 후기</h2>
            <p className="mt-2 text-sm" style={{ color: '#fda4b2' }}>★★★★★ 4.9/5.0 · 인증 후기 포함</p>
          </div>
          <p className="text-xs leading-relaxed mb-6 text-center" style={{ color: '#7a4055' }}>
            모든 후기는 실제 이용 고객의 경험을 바탕으로 작성되었습니다.<br />
            전국 모든 지역, 모든 시간대에서 동일한 품질을 보장합니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { area: '강남', time: '방금 전', text: '야근 후 예약했는데 정말 개운하게 풀렸어요. VIP만의 루틴이 확실히 다릅니다. 압 조절이 너무 세심해요.' },
              { area: '여의도', time: '어젯밤', text: '출장 중에 이용했는데 호텔 입실도 자연스럽고 서비스 퀄리티가 일반 코스와 확연히 달랐습니다.' },
              { area: '잠실', time: '2일 전', text: '240분 코스 이용했는데 진짜 숙면 유도가 됩니다. 다음날 컨디션이 완전히 달랐어요. 강추합니다.' },
              { area: '마포', time: '3일 전', text: '시크릿 아로마가 특히 좋았어요. 향이 은은하고 릴랙싱이 잘 됩니다. 재방문 결정했습니다.' },
            ].map((r, i) => (
              <div key={i} className="rounded-2xl p-5 border" style={{ background: '#fff8fa', borderColor: '#fce8ef' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: '#fce8ef', color: '#c0406a' }}>{r.area}</span>
                  <span className="text-xs" style={{ color: '#c0a0a8' }}>{r.time}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: '#fda4b2' }}>★★★★★</div>
                <p className="text-xs leading-relaxed" style={{ color: '#5a3040' }}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-14" style={{ background: '#fff8fa' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>FAQ</div>
            <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>자주 묻는 질문</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
            {[
              { q: 'VIP 코스는 어떤 분께 적합한가요?', a: '과로·회식·출장·여행 후 정밀한 회복이 필요하신 분, 정확한 압 조절을 원하시는 분께 적합합니다.' },
              { q: '준비물이 있나요?', a: '기본 소모품은 제공됩니다. 편안한 복장과 쉬실 수 있는 공간만 준비해 주시면 됩니다.' },
              { q: '지역마다 품질이 동일한가요?', a: '모든 테라피스트는 동일한 VIP 매뉴얼로 교육받습니다. 전국 어디서든 균일한 서비스를 보장합니다.' },
              { q: '아로마·스웨디시와 어떻게 다른가요?', a: 'VIP 코스는 관리 밀도와 맞춤 설계에 초점을 맞춘 프리미엄 티어입니다. 단순 이완을 넘어 정밀한 회복을 목표로 합니다.' },
            ].map((faq, i, arr) => (
              <div key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid #fce8ef' : 'none' }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
                  style={{ background: openFaq === i ? '#fff0f4' : 'white', color: '#3a1828' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span style={{ color: '#c0406a', fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-xs leading-relaxed" style={{ color: '#7a4055', background: '#fff0f4' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="py-14 text-center px-6" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'white', fontWeight: 400, marginBottom: '1rem' }}>
          지금 VIP 코스를 예약하세요
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,210,225,0.8)' }}>24시간 연중무휴 · 전국 방문</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={openCrispChat}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
            style={{ background: '#FEE500', color: '#3a1828' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
            실시간 상담
          </button>
          <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-white hover:opacity-90 transition-opacity"
            style={{ background: '#2AABEE' }}>
            ✈️ 텔레그램 상담
          </a>
        </div>
      </div>
    </div>
  )
}

function CityPage({ city, regionName }: { city: string; regionName: string; onClose: () => void }) {
  return <main className="min-h-screen bg-white pb-12 text-rose-950">
    <nav aria-label="현재 위치" className="mx-auto flex max-w-5xl flex-wrap gap-3 px-6 py-5 text-sm">
      <Link to="/" className="underline">굿데이 홈</Link><span>/</span><Link to="/cities" className="underline">전국 지역 안내</Link><span>/</span><span>{regionName} {city}</span>
    </nav>
    <header className="bg-rose-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold leading-snug">{regionName} {city} 출장마사지 · 24시간 방문 서비스</h1>
        <p className="mt-5 leading-relaxed">전국 출장마사지 굿데이는 {regionName} {city}의 고객님이 요청하신 자택·호텔·오피스텔로 방문하는 마사지 서비스를 안내합니다. 스웨디시·아로마·스포츠·림프순환·VIP 등 원하는 코스와 시간을 상담해 주세요.</p>
        <p className="mt-3 leading-relaxed">{regionName} {city}의 상세 주소와 희망 시간을 알려주시면 배정 가능 여부, 예상 이동 시간과 이용 비용을 확인해 드립니다. 100% 후불제이며, 신규 회원님은 예약하기로 문의해 주세요.</p>
      </div>
    </header>
    <NationwideOverview region={regionName} city={city} />
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="text-2xl font-semibold">{regionName} {city} 방문 장소를 안내할 때</h2>
      <p className="mt-4 leading-relaxed">같은 이름의 구·군이 다른 시·도에 있을 수 있으므로 ‘{regionName} {city}’처럼 시·도와 지역명을 함께 알려주세요. 호텔이나 오피스텔은 방문객 출입 방법과 주차 가능 여부를 확인해 주세요. 상세 주소와 필요한 출입 안내는 예약 상담에서 전달하시면 됩니다.</p>
      <p className="mt-4 leading-relaxed">지역명만으로 정확한 도착 시간이나 추가 비용을 확정할 수 없습니다. 도로·이동 여건과 당일 배정 상황을 확인한 뒤 확정된 안내를 받으세요.</p>
      <Link to="/blog/business-trip-massage-booking-guide" className="mt-5 inline-block underline">예약 방법과 결제 안내 자세히 보기</Link>
    </section>
    <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 px-6">
      <button type="button" onClick={openCrispChat} className="min-h-12 w-full rounded-full bg-rose-800 px-6 py-4 font-semibold text-white sm:w-80">{regionName} {city} 방문 상담하기</button>
      <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#087eaf] px-6 py-4 font-semibold text-white hover:opacity-90 sm:w-80">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M21.7 3.3a1 1 0 0 0-1.1-.2L2.7 10a1 1 0 0 0 .1 1.9l4.6 1.4 1.8 5.5a1 1 0 0 0 1.7.4l2.6-2.7 4.6 3.4a1 1 0 0 0 1.6-.6l2.3-15a1 1 0 0 0-.3-1ZM9.1 12.7l9-6.1-6.9 7.6-.9 2.9-1.2-4.4Z" /></svg>
        텔레그램 상담하기
      </a>
    </div>
  </main>
}

function ServiceFaqItem({ faq, last }: { faq: { q: string; a: string }; last: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid #fce8ef' }}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
        style={{ background: open ? '#fff0f4' : 'white', color: '#3a1828' }}
        onClick={() => setOpen(o => !o)}
      >
        {faq.q}
        <span style={{ color: '#c0406a', fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs leading-relaxed" style={{ color: '#7a4055', background: '#fff0f4' }}>
          {faq.a}
        </div>
      )}
    </div>
  )
}

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#fce8ef' }}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
        style={{ background: open ? '#fff0f4' : 'white', color: '#3a1828' }}
        onClick={() => setOpen(o => !o)}
      >
        {faq.q}
        <span style={{ color: '#c0406a', fontSize: '1.2rem', lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs leading-relaxed" style={{ color: '#7a4055', background: '#fff0f4' }}>
          {faq.a}
        </div>
      )}
    </div>
  )
}

function CitiesDirectory() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const openCrispChat = () => {
    try { (window as any).$crisp?.push(['do', 'chat:open']) } catch {}
  }
  const q = query.trim().toLowerCase()
  const filtered = q
    ? REGIONS.map(r => ({
        ...r,
        cities: r.cities.filter(c => c.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)),
      })).filter(r => r.cities.length > 0)
    : REGIONS

  return (
    <div style={{ background: '#fff8fa' }}>
      {/* 검색 바 */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0406a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="지역명으로 검색 (예: 강남, 수원, 해운대)"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'white', border: '1.5px solid #fce8ef', color: '#3a1828' }}
          />
        </div>
      </div>

      {/* 지역 목록 */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-rose-950"><p>해당 지역의 안내 페이지가 아직 없습니다. 전국 방문 서비스를 운영하므로 지역명을 알려주시면 상담해 드립니다.</p><Link to="/contact" className="mt-4 inline-block rounded-full bg-rose-800 px-6 py-3 text-white">목록에 없는 지역 방문 문의</Link></div>
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: '#fce8ef' }}>
            {filtered.map(region => (
              <div key={region.name} id={`region-${region.name}`} className="scroll-mt-20 flex flex-col sm:flex-row gap-4 sm:gap-8 py-6">
                <div className="flex-shrink-0 sm:w-20 pt-0.5">
                  <span className="text-sm font-medium" style={{ color: '#c0406a' }}>{region.name} 출장마사지</span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {region.cities.map(city => (
                    <Link
                      key={city}
                      to={cityPath(region.name, city)}
                      className="text-sm transition-colors text-left hover:underline"
                      style={{ color: '#5a3040' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#c0406a')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#5a3040')}
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

function CitiesPage() {
  const [query, setQuery] = useState('')
  const filtered = query.trim()
    ? REGIONS.map(r => ({ ...r, cities: r.cities.filter(c => c.includes(query.trim())) })).filter(r => r.cities.length > 0)
    : REGIONS
  return (
    <div style={{ background: 'white' }}>
      {/* 히어로 */}
      <div className="relative py-20 text-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #fda4b2, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="text-xs tracking-widest uppercase mb-4" style={{ color: '#fda4b2' }}>지역 선택 · Coverage</div>
          <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', fontWeight: 400 }}>
            굿데이 마사지 서비스 지역
          </h2>
          <p className="mt-3 mb-8 text-sm" style={{ color: 'rgba(255,220,230,0.8)' }}>
            원하시는 지역명을 검색하거나 시·도를 선택하세요
          </p>
          {/* 검색창 */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="지역명을 입력하세요 (예: 강남, 해운대, 제주)"
              className="w-full px-5 py-3.5 rounded-full text-sm outline-none"
              style={{ background: 'white', color: '#3a1828', paddingRight: '3rem' }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-300 text-lg">🔍</span>
          </div>
          {query && filtered.length === 0 && (
            <p className="mt-4 text-sm" style={{ color: 'rgba(255,200,220,0.8)' }}>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
      {/* 도시 목록 */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-10">
            {filtered.map(r => (
              <div key={r.name} id={`region-${r.name}`} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-medium" style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: '1.4rem', color: '#3a1828' }}>{r.name} 출장마사지</h3>
                  <div className="flex-1 h-px" style={{ background: '#fce8ef' }} />
                  <span className="text-xs" style={{ color: '#c0a0a8' }}>{r.cities.length}개 지역</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.cities.map(city => (
                    <a key={city} href="#contact"
                      onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                      className="group flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ borderColor: '#fce8ef', color: '#5a3040', background: '#fff8fa' }}>
                      <span style={{ color: '#fda4b2', fontSize: '0.6rem' }}>●</span>
                      {city}
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#c0406a' }}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #fff0f4, #fce8ef)' }}>
          <p className="text-sm mb-4" style={{ color: '#7a4055' }}>원하시는 지역이 목록에 없으신가요?<br />1:1 문의로 확인해 드립니다.</p>
          <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
            지역 문의하기 →
          </a>
        </div>
      </div>
      {/* 지도 */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202391.14!2d126.7784!3d37.5665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca2012d5c39cf%3A0x7e11eca1405bf29b!2z7ISc7Jq4!5e0!3m2!1sko!2skr!4v1"
        width="100%" height="300"
        style={{ border: 0, display: 'block' }}
        allowFullScreen loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="전국 서비스 지역 지도"
      />
    </div>
  )
}

function RegionTabs() {
  const [active, setActive] = useState(0)
  const tab = REGION_TABS[active]
  return (
    <div className="py-16" style={{ background: 'white' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Area Guide</div>
          <h3 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#3a1828', fontWeight: 400 }}>권역별 케어 가이드</h3>
        </div>
        {/* Tab buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          {REGION_TABS.map((t, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active === i ? 'linear-gradient(135deg, #f9a8b8, #e05080)' : '#fff8fa',
                color: active === i ? 'white' : '#7a4055',
                border: `1px solid ${active === i ? 'transparent' : '#fce8ef'}`,
              }}>
              <span style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: '1.1rem', fontWeight: 600 }}>{i + 1}</span>
              <span className="text-xs text-left leading-tight">{t.label}</span>
            </button>
          ))}
        </div>
        {/* Tab content */}
        <div className="rounded-2xl p-7 border" style={{ borderColor: '#fce8ef', background: '#fff8fa' }}>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#7a4055' }}>{tab.desc}</p>
          <ul className="flex flex-col gap-2 mb-6">
            {tab.points.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#5a3040' }}>
                <span style={{ color: '#c0406a', flexShrink: 0 }}>✦</span>
                {pt}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {tab.areas.map(a => (
              <span key={a} className="text-xs px-3 py-1 rounded-full" style={{ background: '#fce8ef', color: '#c0406a' }}>{a}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PullToRefresh({ children }: { children: ReactNode }) {
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const distanceRef = useRef(0)
  const pulling = useRef(false)
  const lastScrollTime = useRef(0)

  useEffect(() => {
    const onScroll = () => { lastScrollTime.current = Date.now() }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const updateDistance = (distance: number) => {
      distanceRef.current = distance
      setPullDistance(distance)
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (window.scrollY !== 0 || event.touches.length !== 1 || refreshing) return
      if (Date.now() - lastScrollTime.current < 800) return
      startY.current = event.touches[0].clientY
      pulling.current = true
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!pulling.current || window.scrollY !== 0 || event.touches.length !== 1) return

      const movement = event.touches[0].clientY - startY.current
      if (movement <= 0) {
        updateDistance(0)
        return
      }

      event.preventDefault()
      updateDistance(Math.min(112, movement * 0.48))
    }

    const handleTouchEnd = () => {
      if (!pulling.current) return
      pulling.current = false

      if (distanceRef.current >= 72) {
        setRefreshing(true)
        updateDistance(56)
        window.setTimeout(() => window.location.reload(), 250)
        return
      }

      updateDistance(0)
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [refreshing])

  const ready = pullDistance >= 72

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full border bg-white/95 px-4 py-2 text-xs shadow-lg backdrop-blur-md transition-[transform,opacity] duration-150"
        style={{
          top: 'max(10px, env(safe-area-inset-top))',
          borderColor: '#fce8ef',
          color: '#7a4055',
          opacity: pullDistance > 4 ? 1 : 0,
          transform: `translate(-50%, ${Math.max(-48, pullDistance - 48)}px)`,
        }}
      >
        <span
          className={`block h-4 w-4 rounded-full border-2 border-rose-200 border-t-rose-500 ${refreshing ? 'animate-spin' : ''}`}
          style={!refreshing ? { transform: `rotate(${pullDistance * 3}deg)` } : undefined}
        />
        <span>{refreshing ? '새로고침 중' : ready ? '놓아서 새로고침' : '아래로 당겨 새로고침'}</span>
      </div>
      {children}
    </>
  )
}

export default function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightboxImg, setLightboxImg] = useState<{ src: string; name: string } | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [showVip, setShowVip] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const pageKey = Object.keys(PAGE_PATHS).find(key => PAGE_PATHS[key] === location.pathname)
  const currentPage = location.pathname.startsWith('/blog/') ? 'blog' : (pageKey ?? 'home')
  const navigateTo = useCallback((href: string) => {
    setMenuOpen(false)
    navigate(PAGE_PATHS[href.replace('#', '')] ?? '/')
  }, [navigate])

  useEffect(() => {
    const legacyPage = location.hash.slice(1)
    if (location.pathname === '/' && PAGE_PATHS[legacyPage]) {
      navigate(PAGE_PATHS[legacyPage], { replace: true })
      return
    }
    if (location.hash) {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash, navigate])

  return (
    <PullToRefresh>
      <div className={`min-h-screen overflow-x-hidden ${currentPage !== 'home' ? 'pt-14' : ''}`} style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", background: '#fdf8f9' }}>

      {showVip && <VipPage onClose={() => setShowVip(false)} onGoTherapists={() => { setShowVip(false); navigateTo('#therapists') }} />}

      {/* ── TOP NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex flex-col leading-none">
            <span style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: '1.4rem', fontWeight: 600, color: '#c0406a', letterSpacing: '0.05em' }}>굿데이</span>
            <span style={{ fontSize: '0.65rem', color: '#000000', letterSpacing: '0.15em', fontWeight: 700 }}>출장마사지</span>
          </Link>
          {/* Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map(item => {
              const pageId = item.href.replace('#', '')
              const active = currentPage === pageId
              return (
                <Link key={item.label} to={PAGE_PATHS[item.href.slice(1)]} onClick={() => setMenuOpen(false)}
                  className="text-xs transition-colors tracking-wide whitespace-nowrap relative"
                  style={{ color: active ? '#c0406a' : undefined }}
                  >
                  <span className={active ? 'text-rose-500 font-medium' : 'text-rose-900/70 hover:text-rose-500'}>
                    {item.label}
                  </span>
                  {active && <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ background: '#c0406a' }} />}
                </Link>
              )
            })}
          </nav>
          <button type="button" onClick={openCrispChat}
            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
            📞 1:1 예약 문의
          </button>
          {/* Mobile hamburger */}
          <button aria-label={menuOpen ? '메뉴 닫기' : '더보기'} aria-expanded={menuOpen} className="lg:hidden flex items-center gap-1.5 p-1" onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#c0406a' }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
            </svg>
            {!menuOpen && <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 700 }}>더보기</span>}
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-rose-50 px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(item => (
              <Link key={item.label} to={PAGE_PATHS[item.href.slice(1)]} onClick={() => setMenuOpen(false)}
                className="text-sm text-rose-900/70 hover:text-rose-500 py-2 text-left border-b border-rose-50 last:border-0">
                {item.label}
              </Link>
            ))}
            <button type="button" onClick={openCrispChat}
              className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
              📞 1:1 예약 문의
            </button>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      {currentPage === 'home' && <section id="home" className="relative flex flex-col justify-start overflow-hidden pt-14 sm:min-h-[80vh] sm:justify-center sm:pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          <Image src="/regions-banner.webp" fill sizes="100vw" priority alt="굿데이 출장마사지 방문 서비스 안내" className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(35,10,25,0.72)' }} />
        </div>
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 sm:py-16 text-center text-white">
          <h1 className="text-3xl sm:text-5xl font-bold leading-snug"><span className="nationwide-color-slide">전국 출장마사지</span><br /><span className="nationwide-color-slide">굿데이 24시간 방문 서비스</span></h1>
          <p className="mt-6 leading-relaxed">전국 모든 지역의 자택·호텔·오피스텔로 찾아갑니다.<br />홈타이·스웨디시·아로마·스포츠·림프순환·VIP 등 원하는 마사지 종류와 방문 시간을 상담해 주세요.</p>
          <ul aria-label="서비스 핵심 포인트" className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              { label: '100% 후불제', icon: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18m-12 5 2 2 4-4" /></> },
              { label: '30분 내 도착', icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
              { label: '철저한 프라이버시', icon: <><path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z" /><path d="m8 12 3 3 5-5" /></> },
            ].map(point => (
              <li key={point.label} className="flex items-center gap-2 rounded-full border border-rose-300/40 bg-[#3a1828] px-4 py-2 text-sm font-semibold text-white">
                <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fda4b2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">{point.icon}</svg>
                <span>{point.label}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link to="/contact" className="inline-flex h-12 w-40 items-center justify-center rounded-full bg-yellow-300 text-rose-950 px-3 font-semibold">예약 상담</Link>
            <Link to="/services" className="inline-flex h-12 w-40 items-center justify-center rounded-full bg-white text-rose-950 px-3 font-semibold">코스·가격 확인</Link>
            <Link to="/cities" className="rounded-full border border-white px-6 py-3">방문 지역 확인</Link>
          </div>
          <details className="mt-8"><summary className="cursor-pointer text-sm">소개 영상 보기</summary><video src="/hero-video.mp4" controls muted playsInline preload="none" className="mt-4 mx-auto max-h-96" aria-label="굿데이 소개 영상" /></details>
        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-8 inset-x-0 hidden sm:flex justify-center z-10 animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,200,220,0.6)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round"/></svg>
        </div>
      </section>}

      {currentPage === 'home' && <NationwideOverview />}

      {/* ── SERVICES ── */}
      {currentPage === 'services' && <section id="services" className="py-0 min-h-screen" style={{ background: 'white' }}>
        <NationwideOverview compact />

        {/* 코스 상세 안내 */}
        <div className="py-16" style={{ background: '#fff8fa' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Course Details</div>
              <h1 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#3a1828', fontWeight: 400 }}>코스 상세 안내</h1>
            </div>
            <div className="flex flex-col gap-6">

              {/* VIP */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #2a1020, #5a1838)', boxShadow: '0 8px 40px rgba(90,24,56,0.35)' }}>
                {/* VIP 헤더 */}
                <div className="px-6 pt-7 pb-4 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fda4b2, transparent 55%)' }} />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                      style={{ background: 'rgba(253,164,178,0.15)', border: '1px solid rgba(253,164,178,0.4)' }}>
                      <span className="text-[10px] tracking-widest font-semibold" style={{ color: '#fda4b2' }}>❤️ PREMIUM · VIP ONLY</span>
                    </div>
                    <h3 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'white', fontWeight: 400 }}>
                      VIP 남성 전용
                    </h3>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,210,225,0.7)' }}>오직 당신만을 위한, 단 1%의 특권</p>
                  </div>
                </div>

                {/* 가격 카드 3개 나란히 */}
                <div className="px-5 pb-5 grid grid-cols-3 gap-3">
                  {[
                    { icon: '👍', time: '80분', price: '150,000원', desc: '컨디션 리셋' },
                    { icon: '✌️', time: '120분', price: '200,000원', desc: '집중 케어' },
                    { icon: '🔥', time: '240분', price: '300,000원', desc: '완전 회복' },
                  ].map((t, i) => (
                    <div key={t.time} className="rounded-xl py-5 px-3 text-center flex flex-col items-center gap-1.5"
                      style={{
                        background: i === 1 ? 'rgba(253,164,178,0.18)' : 'rgba(255,255,255,0.07)',
                        border: i === 1 ? '1px solid rgba(253,164,178,0.45)' : '1px solid rgba(255,255,255,0.1)',
                      }}>
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-sm font-medium" style={{ color: 'white' }}>{t.time}</span>
                      <span className="text-base font-bold" style={{ color: '#fda4b2' }}>{t.price}</span>
                      <span className="text-[10px]" style={{ color: 'rgba(255,210,225,0.6)' }}>{t.desc}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-5 pb-6 flex justify-center">
                  <button
                    onClick={() => setShowVip(true)}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)', color: 'white', boxShadow: '0 6px 20px rgba(224,80,128,0.5)' }}>
                    ✦ VIP 자세히 보기
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>

              {/* 일반 코스 4개 */}
              {[
                {
                  name: '스포츠 마사지', icon: '💪', tag: '근막 이완 · 피로회복 · 가동범위 개선',
                  desc: '강한 압으로 뭉친 근육과 근막을 집중 이완합니다. 운동 후 또는 육체 노동 직후에 효과적입니다.',
                  prices: [['80분', '100,000원'], ['110분', '130,000원'], ['140분', '190,000원']],
                },
                {
                  name: '아로마 테라피', icon: '🌿', tag: '심신 이완 · 숙면 · 전신 순환 촉진',
                  desc: '천연 에센셜 오일 블렌딩으로 감각을 깨우고 정서적 안정을 유도합니다. 야간 릴랙스에 특화됩니다.',
                  prices: [['80분', '120,000원'], ['110분', '150,000원'], ['140분', '210,000원']],
                },
                {
                  name: '스웨디시', icon: '🌸', tag: '정서 안정 · 피부 보습 · 컨디션 회복',
                  desc: '오일을 활용한 부드럽고 리드미컬한 전신 테크닉. 심신 안정과 깊은 숙면 유도에 탁월합니다.',
                  prices: [['80분', '150,000원'], ['110분', '180,000원'], ['140분', '240,000원']],
                },
                {
                  name: '림프순환', icon: '💧', tag: '부종 완화 · 노폐물 배출 · 회복 촉진',
                  desc: '정밀한 드레나지 기법으로 부종과 피로를 동시에 해소합니다. 좌식·입식 직군에 강력 추천합니다.',
                  prices: [['80분', '200,000원'], ['110분', '230,000원'], ['140분', '290,000원']],
                },
              ].map(svc => (
                <div key={svc.name} className="rounded-2xl border overflow-hidden" style={{ borderColor: '#fce8ef', background: 'white' }}>
                  {/* 헤더 */}
                  <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#fff0f4', borderBottom: '1px solid #fce8ef' }}>
                    <span className="text-2xl">{svc.icon}</span>
                    <div>
                      <h3 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: '1.3rem', color: '#3a1828', fontWeight: 400 }}>{svc.name}</h3>
                      <div className="text-xs mt-0.5" style={{ color: '#c0406a' }}>{svc.tag}</div>
                    </div>
                  </div>
                  {/* 소개 */}
                  <div className="px-6 pt-5 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: '#5a3040' }}>{svc.desc}</p>
                  </div>
                  {/* 시간 / 가격 테이블 */}
                  <div className="px-6 pb-6">
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 text-xs font-medium text-center" style={{ background: '#3a1828', color: '#fda4b2' }}>시간</div>
                        <div className="px-4 py-2 text-xs font-medium text-center" style={{ background: '#3a1828', color: '#fda4b2', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>가격</div>
                      </div>
                      {svc.prices.map(([time, price], i) => (
                        <div key={time} className="grid grid-cols-2" style={{ background: i % 2 === 0 ? 'white' : '#fff8fa', borderTop: '1px solid #fce8ef' }}>
                          <div className="px-4 py-3 text-sm font-medium text-center" style={{ color: '#3a1828' }}>{time}</div>
                          <div className="px-4 py-3 text-sm font-semibold text-center" style={{ color: '#c0406a', borderLeft: '1px solid #fce8ef' }}>{price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 코스 비교표 */}
        <div className="py-16" style={{ background: 'white' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Comparison</div>
              <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>코스 비교표</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #3a1828, #6b2040)' }}>
                    {['코스명', '압 강도', '추천 대상'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#fda4b2' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['스포츠', 5, '강', '운동 후 피로'],
                    ['스웨디시', 3, '중', '정서적 휴식'],
                    ['아로마', 2, '약~중', '향 선호'],
                    ['림프순환', 3, '중', '좌·입식 직군'],
                  ].map(([name, level, label, target], i) => (
                    <tr key={name as string} style={{ background: i % 2 === 0 ? 'white' : '#fff8fa' }}>
                      <td className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: '#3a1828' }}>{name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {[1,2,3,4,5].map(n => (
                            <span key={n} className="rounded-full" style={{ width: 8, height: 8, display: 'inline-block', background: n <= (level as number) ? '#c0406a' : '#fce8ef' }} />
                          ))}
                          <span className="text-xs ml-1" style={{ color: '#c0406a' }}>{label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#7a4055' }}>{target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 이용 후기 */}
        <div className="py-16" style={{ background: '#fff8fa' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Reviews</div>
              <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>실제 이용 후기</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { area: '강남', svc: '스포츠 90분', text: '운동 직후 예약했는데 30분 만에 도착해주셨어요. 압이 세서 뭉친 근육이 확실히 풀렸습니다. 최고예요.' },
                { area: '여의도', svc: '스웨디시 120분', text: '호텔 출장 중 이용했는데 프라이빗하게 입실해주셔서 좋았어요. 릴랙싱이 확실히 됐습니다.' },
                { area: '마포', svc: '아로마 90분', text: '오일 향이 너무 좋았고, 스트레스가 확 풀리는 느낌이었어요. 심야에도 빠르게 배정해주셨습니다.' },
              ].map((r, i) => (
                <div key={i} className="rounded-2xl p-6 border bg-white" style={{ borderColor: '#fce8ef' }}>
                  <div style={{ color: '#fda4b2' }}>{'★★★★★'}</div>
                  <p className="text-xs leading-relaxed my-4" style={{ color: '#5a3040' }}>"{r.text}"</p>
                  <div className="border-t pt-3" style={{ borderColor: '#fce8ef' }}>
                    <div className="text-xs font-medium" style={{ color: '#3a1828' }}>{r.area}</div>
                    <div className="text-xs" style={{ color: '#c0406a' }}>{r.svc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 코스 선택 가이드 */}
        <div className="py-16" style={{ background: 'white' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Guide</div>
              <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>코스 선택 가이드</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { cond: '운동 후 근육 피로', rec: '스포츠 마사지', icon: '🏋️' },
                { cond: '스트레스·불면증', rec: '스웨디시 또는 아로마', icon: '🌙' },
                { cond: '향기 테라피 선호', rec: '아로마 테라피', icon: '🌿' },
                { cond: '부종·순환 문제', rec: '림프순환 마사지', icon: '💧' },
              ].map(g => (
                <div key={g.cond} className="flex items-start gap-4 rounded-xl p-5" style={{ background: '#fff8fa', border: '1px solid #fce8ef' }}>
                  <span className="text-2xl flex-shrink-0">{g.icon}</span>
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#9a607a' }}>{g.cond}</div>
                    <div className="text-sm font-medium" style={{ color: '#3a1828' }}>→ {g.rec}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 관리 팁 */}
        <div className="py-16" style={{ background: '#fff8fa' }}>
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Care Tips</div>
              <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>마사지 효과 오래 유지하는 관리 팁</h2>
            </div>
            <ul className="flex flex-col gap-4">
              {[
                ['💧', '수분 보충', '시술 후 물을 충분히 마셔 노폐물 배출을 도와주세요.'],
                ['🧘', '가벼운 스트레칭', '이완된 근육을 유지하려면 무리한 운동보다 스트레칭이 효과적입니다.'],
                ['🚫', '음주 자제', '시술 당일 음주는 피하시고 24시간 이후 가볍게 즐기세요.'],
                ['😴', '충분한 수면', '근육 회복은 수면 중에 일어납니다. 충분한 수면을 취해주세요.'],
                ['🧴', '보습 관리', '아로마·스웨디시 후에는 보습 케어로 피부 상태를 유지하세요.'],
              ].map(([icon, title, desc]) => (
                <li key={title as string} className="flex items-start gap-4 rounded-xl p-4 bg-white border" style={{ borderColor: '#fce8ef' }}>
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <div>
                    <div className="text-sm font-medium mb-0.5" style={{ color: '#3a1828' }}>{title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: '#7a4055' }}>{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-16" style={{ background: 'white' }}>
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>FAQ</div>
              <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>자주 묻는 질문</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
              {[
                { q: '코스는 어떻게 선택하나요?', a: '컨디션과 목적에 따라 테라피스트와 상담 후 결정하실 수 있습니다. 처음이라면 스웨디시나 아로마를 추천드립니다.' },
                { q: '가격이 변동되나요?', a: '100% 예약제로 운영되며 표시된 가격 외 추가 요금은 없습니다. 투명한 가격을 보장합니다.' },
                { q: '시술 전 준비사항이 있나요?', a: '특별한 준비는 필요 없습니다. 편안한 복장을 준비해 주시면 됩니다.' },
                { q: '심야 예약도 가능한가요?', a: '24시간 연중무휴 운영합니다. 심야에도 동일한 서비스를 제공합니다.' },
              ].map((faq, i, arr) => (
                <ServiceFaqItem key={i} faq={faq} last={i === arr.length - 1} />
              ))}
            </div>
          </div>
        </div>

      </section>}

      {/* ── THERAPISTS ── */}
      {currentPage === 'therapists' && <section id="therapists" className="py-0 min-h-screen" style={{ background: 'white' }}>
        {/* LIVE 헤더 배너 */}
        <div className="pt-20 pb-12 px-6 text-center" style={{ background: 'linear-gradient(160deg, #3a1828 0%, #6b2040 60%, #3a1828 100%)' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(253,164,178,0.15)', border: '1px solid rgba(253,164,178,0.35)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#fda4b2' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#fb7190' }} />
            </span>
            <span className="text-xs font-medium tracking-widest" style={{ color: '#fda4b2' }}>LIVE 테라피스트 프로필</span>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h1 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', color: 'white', fontWeight: 400, margin: 0 }}>현재 매칭 가능한 테라피스트 확인하기</h1>
          </div>
          <p className="mt-3 text-sm" style={{ color: 'rgba(255,210,225,0.8)' }}>
            고객님 인근에서 상담 가능한 테라피스트 프로필을 한눈에 확인하세요.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Our Team</div>
            <h2 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#3a1828', fontWeight: 400 }}>
              테라피스트 소개
            </h2>
            <p className="text-xs mt-3" style={{ color: '#9a607a' }}>검증된 여성 전문 테라피스트만 배정됩니다</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {THERAPISTS.map(t => (
              <div key={t.name}
                className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                style={{ background: 'white', borderColor: '#fce8ef' }}
                onClick={() => t.img && setLightboxImg({ src: t.img, name: t.name })}>
                {/* Photo */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: 'linear-gradient(160deg, #fce8ef, #f9d0de)' }}>
                  {t.img ? (
                    <>
                      <img loading="lazy" decoding="async" src={t.img} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'rgba(58,24,40,0.25)' }}>
                        <div className="bg-white/80 rounded-full px-3 py-1 text-xs font-medium" style={{ color: '#c0406a' }}>🔍 크게 보기</div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span style={{ fontSize: '3rem', opacity: 0.2 }}>👤</span>
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(58,24,40,0.45) 0%, transparent 55%)' }} />
                  <div className="absolute top-2 right-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: t.status === '실시간 상담 가능' ? 'rgba(34,197,94,0.85)' : 'rgba(251,191,36,0.85)', color: 'white', backdropFilter: 'blur(4px)', fontSize: '0.6rem' }}>
                      {t.status === '실시간 상담 가능' ? '● 상담가능' : '● 상담중'}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1.5" style={{ flexWrap: 'nowrap' }}>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: '#fff0f4', color: '#c0406a', border: '1px solid #fda4b2', fontSize: '0.6rem' }}>한국인</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: '#fff0f4', color: '#c0406a', border: '1px solid #fda4b2', fontSize: '0.6rem' }}>100% 실사</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: '1.15rem', color: '#3a1828', fontWeight: 500 }}>{t.name}</h3>
                    <span style={{ fontSize: '0.7rem', color: '#c0406a' }}>★ {t.stars}</span>
                  </div>
                  <p className="text-xs leading-relaxed mt-0.5" style={{ color: '#9a607a', fontSize: '0.68rem' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button type="button" onClick={openCrispChat}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
              테라피스트 예약 문의하기
            </button>
          </div>
        </div>
      </section>}


      {/* ── REVIEWS ── */}
      {currentPage === 'reviews' && <ReviewPage onBook={openCrispChat} />}

      {/* ── BLOG ── */}
      {currentPage === 'blog' && <BlogPage />}

      {/* ── FAQ ── */}
      {currentPage === 'faq' && <><FaqPage /><NationwideOverview compact /></>}

      {/* ── REGIONS ── */}
      {currentPage === 'regions' && <section id="regions" className="py-0 min-h-screen" style={{ background: 'white' }}>

        {/* 히어로 */}
        {/* 메인 배너 */}
        <div className="w-full">
          <img loading="lazy" decoding="async" src="/regions-banner.webp" alt="굿데이마사지 지역선택" className="w-full" style={{ display: 'block' }} />
        </div>

        <div className="relative pt-12 pb-14 overflow-hidden" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #fda4b2 0%, transparent 60%)' }} />
          <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#fda4b2' }}>지역 선택 · Coverage</div>
              <h1 style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: 'white', fontWeight: 400 }}>
                굿데이 마사지 서비스 지역
              </h1>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,220,230,0.85)' }}>
                서울 전 구역부터 전국 광역시·도까지<br />24시간 언제 어디서든 방문합니다
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              {[['🏙️', '서울·수도권'], ['🌆', '6대 광역시'], ['🌴', '제주·전국']].map(([icon, label]) => (
                <div key={label as string} className="text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-xs whitespace-nowrap" style={{ color: 'rgba(255,210,225,0.8)' }}>{label as string}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <NationwideOverview />
        {/* 검색 + 지역 디렉토리 */}
        <CitiesDirectory />

      </section>}

      {/* ── CONTACT CTA ── */}
      {currentPage === 'contact' && <section id="contact" className="pb-24 min-h-screen" style={{ background: '#fff8fa' }}>

        {/* 배너 이미지 */}
        <div className="w-full">
          <img loading="lazy" decoding="async" src="/contact-new-banner.webp" alt="굿데이마사지 예약문의" className="w-full" style={{ display: 'block' }} />
        </div>

        {/* 헤더 */}
        <div className="py-14 text-center px-6" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h1 style={{ color: 'white', fontWeight: 400, fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', margin: 0 }}>24시간 전국 방문 예약 상담</h1>
          </div>
          <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'rgba(255,210,225,0.85)' }}>
            서울 포함 전국 서비스 · 홈타이·스웨디시 등 다양한 코스<br />24시간 실시간 상담 제공
          </p>

          <button
            type="button"
            onClick={openCrispChat}
            className="mt-7 flex flex-col items-center gap-2 mx-auto"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span
              className="px-5 py-2 rounded-full text-sm font-medium tracking-wide"
              style={{
                background: 'rgba(253,164,178,0.18)',
                border: '1px solid rgba(253,164,178,0.5)',
                color: '#ffffff',
                letterSpacing: '0.08em',
                fontWeight: 700,
              }}
            >
              터치시 상담연결
            </span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="#fda4b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 예약 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button type="button" onClick={openCrispChat}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
              번호공개❌ 익명 예약 (추천)
            </button>
            <button type="button" onClick={openCrispChat}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
              실시간 예약 상담
            </button>
            <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: '#2AABEE' }}>
              ✈️ 텔레그램 예약
            </a>
          </div>
        </div>


        {/* 왜 굿데이인가 */}
        <div className="max-w-3xl mx-auto px-6 mt-10">
          <h3 className="font-medium mb-5 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>왜 굿데이일까요?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🕐', title: '24시간 운영', desc: '심야·주말 상시 상담·배정' },
              { icon: '🗺️', title: '전국 커버리지', desc: '서울·수도권·광역시 전역' },
              { icon: '👩', title: '여성 전담팀', desc: '숙련 테라피스트 매칭' },
              { icon: '🧴', title: '위생·안전', desc: '일회용·소독·프라이버시 철저' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
                <div className="text-2xl">{f.icon}</div>
                <div>
                  <div className="font-medium text-sm mb-1" style={{ color: '#3a1828' }}>{f.title}</div>
                  <p className="text-xs" style={{ color: '#9a607a' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 서비스 진행 5단계 */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <h3 className="font-medium mb-6 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>서비스 진행 과정</h3>
          <div className="flex flex-col gap-3">
            {[
              { step: '01', title: '상담', desc: '지역·코스·선호/주의 부위 확인' },
              { step: '02', title: '배정', desc: '평균 20~30분 내 테라피스트 매칭 안내' },
              { step: '03', title: '방문·진행', desc: '호텔·오피스텔·자택 방문 서비스' },
              { step: '04', title: '결제', desc: '100% 후불제 · 신규 회원은 예약하기로 문의' },
              { step: '05', title: '사후 안내', desc: '케어 포인트 및 재방문 추천 안내' },
            ].map((s, i, arr) => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: '#c0406a' }}>{s.step}</div>
                  {i < arr.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: '#fce8ef', minHeight: 20 }} />}
                </div>
                <div className="pb-4">
                  <div className="font-medium text-sm" style={{ color: '#3a1828' }}>{s.title}</div>
                  <p className="text-xs mt-0.5" style={{ color: '#9a607a' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 이용 후기 */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <h3 className="font-medium mb-5 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>실제 이용 후기</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { area: '강남 · 스웨디시 90분', text: '어깨·목이 확 풀렸어요. 다음 날 일정이 훨씬 가벼웠습니다.' },
              { area: '마포 · 아로마 60분', text: '심야인데 배정이 빠르고, 위생·매너 모두 만족합니다.' },
              { area: '잠실 · 림프 90분', text: '붓기가 빠졌어요. 친절한 설명 덕분에 신뢰가 갔습니다.' },
            ].map(r => (
              <div key={r.area} className="rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
                <div className="text-yellow-400 text-sm mb-2">★★★★★</div>
                <div className="text-xs font-medium mb-2" style={{ color: '#c0406a' }}>{r.area}</div>
                <p className="text-xs leading-relaxed" style={{ color: '#7a4055' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 이용 유의사항 */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <h3 className="font-medium mb-5 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>이용 유의사항</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: '예약·변경·취소', items: ['배정 확정 전 일정·코스 변경 가능', '확정 후 취소 시 콜 이동 비용 발생 가능', '지연·부재 시 진행 시간 단축 가능', '100% 후불제로 운영', '신규 회원님은 예약하기로 문의', '10년 이상 한결같이 운영된 신뢰도 높은 업체'] },
              { title: '서비스 이용 안내', items: ['맘에 드시는 테라피스트 선택 및 출장여부 확인', '상담매니저와 스케줄 잡기 (이름 / 장소 / 시간)', '신규 회원님은 예약하기로 문의', '예약완료'] },
              { title: '위생·방역', items: ['일회용 시트/타월, 장비 현장 소독', '손 위생 및 위생 프로토콜 준수', '감염성 증상 시 예약 보류 권장'] },
              { title: '프라이버시', items: ['민감 정보 최소 보관', 'CCTV 각도 조정·가림 권장', '무단 촬영 금지'] },
            ].map(g => (
              <div key={g.title} className="rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
                <div className="font-medium text-sm mb-3" style={{ color: '#3a1828' }}>{g.title}</div>
                <ul className="flex flex-col gap-1.5">
                  {g.items.map(item => (
                    <li key={item} className="text-xs flex items-start gap-2" style={{ color: '#7a4055' }}>
                      <span style={{ color: '#c0406a', flexShrink: 0 }}>·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <h3 className="font-medium mb-5 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>자주 묻는 질문</h3>
          <div className="flex flex-col gap-2">
            {[
              { q: '심야에도 가능한가요?', a: '연중무휴 24시간 운영합니다. 심야·우천·행사 시즌은 배정 소요 시간이 변동될 수 있습니다.' },
              { q: '테라피스트 지정이 가능한가요?', a: '가능 시 우선 배정해드립니다. 선호 압·스타일·이전 이용 이력을 제공하시면 매칭 정확도가 높아집니다.' },
              { q: '신규 회원은 어떻게 예약하나요?', a: '100% 후불제로 운영합니다. 신규 회원님은 예약하기에서 이용 방법과 예약 조건을 문의해 주세요.' },
            ].map((faq, i, arr) => (
              <ContactFaqItem key={i} faq={faq} />
            ))}
          </div>
        </div>

        {/* 하단 예약 CTA */}
        <div className="max-w-3xl mx-auto px-6 mt-12 text-center">
          <div className="rounded-2xl py-10 px-6" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,210,225,0.85)' }}>지금 바로 문의하고 빠른 배정 받으세요</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" onClick={openCrispChat}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm hover:opacity-90"
                style={{ background: '#FEE500', color: '#3a1828' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
                실시간 상담
              </button>
              <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm text-white hover:opacity-90"
                style={{ background: '#2AABEE' }}>
                ✈️ 텔레그램 상담
              </a>
            </div>
          </div>
        </div>

      </section>}


{/* ── FOOTER (home에서만) ── */}
      {currentPage === 'home' && <footer className="py-10 border-t" style={{ background: '#2a1020', borderColor: '#4a2038' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-6">
            <div>
              <div style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: '1.4rem', color: '#fda4b2', fontWeight: 600 }}>굿데이</div>
              <div className="text-xs tracking-widest mt-0.5" style={{ color: '#9a607a' }}>프리미엄 출장마사지</div>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: '#7a4055' }}>
                (주) 굿데이출장마사지<br />
                대표이사: 강우빈<br />
                사업자등록번호: 641-46-12023<br />
                본사 주소: 서울 서대문구 신촌로 109
              </p>
            </div>
          </div>
          <div className="border-t pt-5 text-xs" style={{ borderColor: '#4a2038', color: '#5a3040' }}>
            © 2026 굿데이 출장마사지. All rights reserved.
          </div>
        </div>
      </footer>}

      {/* ── BOTTOM STICKY BAR (krmassage.com 동일) ── */}
<div className="fixed bottom-0 inset-x-0 z-50 flex" style={{ background: 'white', borderTop: '1px solid #fce8ef', boxShadow: '0 -4px 20px rgba(200,70,110,0.1)' }}>
        <Link to={PAGE_PATHS.contact}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium transition-opacity hover:opacity-90"
          style={{ background: '#FEE500', color: '#3a1828' }}>
          <span>📞</span>
          <span>예약하기</span>
        </Link>
        <Link to={PAGE_PATHS.therapists}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium border-l border-r transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)', color: 'white', borderColor: '#fce8ef' }}>
          <span>🔥</span>
          <span>테라피스트 보기</span>
        </Link>
        <Link to={PAGE_PATHS.services}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium"
          style={{ color: '#c0406a' }}>
          <span>📋</span>
          <span>코스안내</span>
        </Link>
      </div>

      {/* ── PAGE TRANSITION OVERLAY ── */}
      <div className="fixed inset-0 z-[200] pointer-events-none"
        style={{
          background: 'linear-gradient(160deg, #fce8ef, #f9a8b8)',
          opacity: transitioning ? 1 : 0,
          transition: transitioning ? 'opacity 0.25s ease-in' : 'opacity 0.25s ease-out',
        }} />

      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(30,10,20,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setLightboxImg(null)}>
          <div className="relative max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxImg(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-2xl transition-colors">✕</button>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img loading="lazy" decoding="async" src={lightboxImg.src} alt={lightboxImg.name} className="w-full object-contain max-h-[80vh]" />
            </div>
            <div className="text-center mt-4">
              <span style={{ fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", fontSize: '1.5rem', color: 'white', fontWeight: 400 }}>{lightboxImg.name}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </PullToRefresh>
  )
}

export function CityPageRoute() {
  const { city, region } = useParams<{ city: string; region: string }>()
  const navigate = useNavigate()
  const regionName = region ?? REGIONS.find(r => r.cities.includes(city ?? ''))?.name ?? ''
  return <CityPage city={city ?? ''} regionName={regionName} onClose={() => navigate('/cities')} />
}
