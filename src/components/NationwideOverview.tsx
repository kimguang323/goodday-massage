import Link from 'next/link'
import { REGIONS } from '../data/regions'
import { cityPath } from '../data/site'
import { MASSAGE_COURSES, NATIONWIDE_FAQS } from '../data/service-content'

export default function NationwideOverview({ compact = false, region, city }: { compact?: boolean; region?: string; city?: string }) {
  const selectedRegion = REGIONS.find(item => item.name === region)
  return <section className="bg-rose-50 px-6 py-12 text-rose-950" aria-label="전국 출장마사지 이용 안내">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-2xl font-semibold leading-snug">{city ? `${region} ${city}에서 이용하는 출장마사지` : '전국 모든 지역으로 찾아가는 마사지 서비스'}</h2>
      <p className="mt-4 leading-relaxed">굿데이는 전국 모든 지역의 고객을 대상으로 자택·호텔·오피스텔에 방문하는 출장마사지 서비스를 제공합니다. 홈타이·스웨디시·아로마·스포츠·림프순환·VIP 등 원하시는 마사지 종류를 선택해 주세요. 24시간 상담과 방문 서비스를 운영하며, 실제 배정과 일정은 요청하신 지역·시간·코스에 따라 확인합니다.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/services" prefetch={false} className="rounded-full bg-white px-5 py-3 underline">마사지 코스·가격 비교</Link>
        <Link href="/contact" prefetch={false} className="rounded-full bg-rose-800 px-5 py-3 font-semibold text-white">전국 방문 예약 상담</Link>
        <Link href="/cities" prefetch={false} className="rounded-full bg-white px-5 py-3 underline">지역별 안내</Link>
      </div>
      {!compact && <>
        <h3 className="mt-10 text-xl font-semibold">출장으로 이용하는 마사지 종류</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MASSAGE_COURSES.map(course => <article key={course.name} className="rounded-2xl bg-white p-5">
            <h4 className="font-semibold">{course.name}</h4><p className="mt-2 text-sm leading-relaxed">{course.description}</p>
          </article>)}
        </div>
        <h3 className="mt-10 text-xl font-semibold">{selectedRegion ? `${region}의 다른 지역 안내` : '전국 17개 시·도 방문 안내'}</h3>
        <nav aria-label={selectedRegion ? `${region} 지역 안내` : '전국 시도 안내'} className="mt-4 flex flex-wrap gap-3">
          {selectedRegion ? selectedRegion.cities.filter(name => name !== city).map(name => <Link key={name} href={cityPath(region!, name)} prefetch={false} className="rounded-lg bg-white px-4 py-3 underline">{region} {name}</Link>) : REGIONS.map(item => <Link key={item.name} href={`/cities#region-${encodeURIComponent(item.name)}`} prefetch={false} className="rounded-lg bg-white px-4 py-3 underline">{item.name}</Link>)}
        </nav>
        <p className="mt-4 text-sm leading-relaxed">지역 목록은 안내 페이지가 있는 지역입니다. 서비스 대상 지역을 제한하는 목록이 아닙니다. 목록에 없는 시·군·구와 도서·산간 지역도 주소와 희망 시간을 알려주시면 방문 조건을 상담해 드립니다.</p>
        <h3 className="mt-10 text-xl font-semibold">전국 방문 예약 전 확인할 내용</h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed">
          <li>{city ? `${region} ${city}의` : '방문할 시·도와 시·군·구의'} 주소, 자택·호텔·오피스텔 등 장소 유형을 알려주세요.</li>
          <li>희망 날짜·시간, 원하는 마사지 코스와 이용 시간을 선택해 주세요.</li>
          <li>배정 가능 여부, 예상 이동 시간, 출장비를 포함한 총 비용을 확인해 주세요.</li>
          <li>100% 후불제와 변경·취소 조건을 확인해 주세요. 신규 회원님은 예약하기로 문의한 뒤 예약을 확정해 주세요.</li>
        </ol>
        <div className="mt-8 space-y-3">{NATIONWIDE_FAQS.map(faq => <details key={faq.q} className="rounded-xl bg-white p-5">
          <summary className="cursor-pointer font-semibold">{faq.q}</summary><p className="mt-3 leading-relaxed">{faq.a}</p>
        </details>)}</div>
        <Link href="/blog/nationwide-massage-service-guide" prefetch={false} className="mt-6 inline-block underline">전국 출장마사지 이용 가이드 읽기</Link>
      </>}
    </div>
  </section>
}
