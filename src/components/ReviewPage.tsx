'use client'
import Image from 'next/image'
import { useState } from 'react'
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

export default function ReviewPage({ onBook }: { onBook: () => void }) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const displayed = activeRegion
    ? REVIEW_REGIONS.filter(r => r.region === activeRegion)
    : REVIEW_REGIONS

  return (
    <section id="reviews" className="pb-24 min-h-screen" style={{ background: '#fff8fa' }}>
      {/* 메인 배너 */}
      <div className="w-full">
        <Image width={1280} height={1280} sizes="100vw" priority src="/reviews-banner.webp" alt="굿데이마사지 고객후기" className="w-full h-auto" style={{ display: 'block' }} />
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
              className="booking-shimmer inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-medium hover:opacity-90"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
              실시간 예약 상담
            </button>
            <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
              className="booking-shimmer inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white hover:opacity-90"
              style={{ background: '#2AABEE' }}>
              ✈️ 텔레그램 예약
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

