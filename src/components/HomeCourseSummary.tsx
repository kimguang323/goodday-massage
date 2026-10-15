import Link from 'next/link'

// Published entry prices from the course page; final travel costs are confirmed before booking.
const COURSES = [
  ['스포츠 마사지', '80분', '100,000원'],
  ['아로마 테라피', '80분', '120,000원'],
  ['스웨디시', '80분', '150,000원'],
  ['림프순환', '80분', '200,000원'],
  ['VIP', '80분', '150,000원'],
]

export default function HomeCourseSummary() {
  return <section aria-labelledby="home-course-heading" className="mx-auto max-w-5xl px-6 py-8 text-rose-950">
    <h2 id="home-course-heading" className="text-2xl font-bold">마사지 코스·시간·가격 한눈에 보기</h2>
    <p className="mt-3 leading-relaxed">처음 이용한다면 관리 방식과 이용 시간을 먼저 비교하세요. 아래는 코스 안내에 게시된 80분 기준 가격입니다.</p>
    <dl className="mt-5 grid gap-3 sm:grid-cols-2">
      {COURSES.map(([name, time, price]) => <div key={name} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4">
        <dt className="font-semibold">{name}</dt><dd>{time} · <strong>{price}</strong></dd>
      </div>)}
    </dl>
    <p className="mt-4 text-sm leading-relaxed">100% 후불제입니다. 주소별 방문 가능 여부와 출장비를 포함한 총 비용, 변경·취소 조건은 예약 전에 확인하세요. 신규 회원님은 예약 상담 후 일정을 확정해 주세요.</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <Link href="/services" prefetch={false} className="rounded-full bg-rose-900 px-5 py-3 font-semibold text-white">전체 코스·시간별 가격 보기</Link>
      <Link href="/contact" prefetch={false} className="rounded-full border border-rose-300 px-5 py-3 font-semibold">방문 일정·총 비용 상담</Link>
    </div>
    <nav aria-label="주요 지역 이용 안내" className="mt-6 flex flex-wrap gap-3">
      <Link href="/cities/서울/강남구" prefetch={false} className="rounded-lg bg-rose-50 px-4 py-3 underline">강남구 출장마사지 안내</Link>
      <Link href="/cities/경기/수원" prefetch={false} className="rounded-lg bg-rose-50 px-4 py-3 underline">수원 출장마사지 안내</Link>
    </nav>
  </section>
}
