'use client'
import Image from 'next/image'
import { Link } from '../router'
export default function ReviewPage({ onBook }: { onBook: () => void }) {
  return <section id="reviews" className="min-h-screen bg-rose-50 pb-24 text-rose-950">
    <Image width={1280} height={1280} sizes="100vw" priority src="/reviews-banner.webp" alt="굿데이 고객 후기 안내" className="h-auto w-full" />
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold">고객 후기 안내</h1>
      <p className="mt-4 leading-relaxed">현재 공개할 수 있는 이용 후기와 집계 자료를 확인 중입니다. 확인되지 않은 평점·후기 건수·만족도는 표시하지 않습니다.</p>
      <h2 className="mt-8 text-xl font-semibold">예약 전 직접 확인할 내용</h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed"><li>원하는 코스의 이용 시간과 출장비를 포함한 최종 비용</li><li>방문 주소와 희망 시간에 따른 배정 가능 여부</li><li>담당자 프로필, 원하는 압과 오일 사용 선호</li><li>예약 변경·취소 조건과 장소 출입 규정</li></ul>
      <div className="mt-6 flex flex-wrap gap-3"><Link to="/services" className="inline-flex min-h-12 items-center rounded-xl border border-rose-200 bg-white px-4 underline">코스·가격 확인</Link><button type="button" onClick={onBook} className="min-h-12 rounded-xl bg-rose-800 px-5 font-semibold text-white">예약 상담하기</button></div>
    </div>
  </section>
}