'use client'
import Image from 'next/image'
import { Link } from '../router'
export default function ReviewPage({ onBook }: { onBook: () => void }) {
  return <section id="reviews" className="min-h-screen bg-rose-50 pb-24 text-rose-950">
    <Image width={1280} height={1280} sizes="100vw" priority src="/reviews-banner.webp" alt="굿데이 고객 후기 안내" className="h-auto w-full" />
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold">고객 후기 안내</h1>
      <p className="mt-4 leading-relaxed">굿데이 이용을 고민하고 계신가요? 후기를 참고할 때는 이용한 코스와 관리 방식, 방문 장소 등 나의 이용 조건과 비슷한 경험인지 함께 살펴보세요.</p>
      <p className="mt-3 text-sm leading-relaxed">공개할 이용 후기는 내용을 확인한 뒤 안내할 예정입니다. 현재는 예약 전에 비교하면 좋은 내용을 정리해 두었습니다.</p>
      <h2 className="mt-8 text-xl font-semibold">나에게 맞는 이용을 위한 체크 포인트</h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed"><li>코스와 이용 시간을 비교하고, 출장비를 포함한 최종 비용을 확인하세요.</li><li>방문할 주소와 희망 시간을 알려주고, 가능한 일정을 상담하세요.</li><li>담당자 프로필을 살펴보고, 선호하는 압과 오일 사용 여부를 전달하세요.</li><li>예약 변경·취소 조건과 건물의 방문객 출입 규정을 확인하세요.</li></ul>
      <p className="mt-6 leading-relaxed">처음이라 선택이 어렵다면 상담에서 궁금한 점을 편하게 물어보세요. 원하는 코스와 방문 조건을 확인한 뒤 예약을 결정하시면 됩니다.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link to="/services" className="inline-flex min-h-12 items-center rounded-xl border border-rose-200 bg-white px-4 underline">코스·가격 확인</Link><button type="button" onClick={onBook} className="min-h-12 rounded-xl bg-rose-800 px-5 font-semibold text-white">예약 상담하기</button></div>
    </div>
  </section>
}
