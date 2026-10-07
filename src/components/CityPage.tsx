import Link from 'next/link'
import NationwideOverview from './NationwideOverview'
import CityBookingActions from './CityBookingActions'
export default function CityPage({ city, regionName }: { city: string; regionName: string }) {
  return <main className="min-h-screen bg-white pb-12 text-rose-950">
    <nav aria-label="현재 위치" className="mx-auto flex max-w-5xl flex-wrap gap-3 px-6 py-5 text-sm">
      <Link prefetch={false} href="/" className="underline">굿데이 홈</Link><span>/</span><Link prefetch={false} href="/cities" className="underline">전국 지역 안내</Link><span>/</span><span>{regionName} {city}</span>
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
      <Link prefetch={false} href="/blog/business-trip-massage-booking-guide" className="mt-5 inline-block underline">예약 방법과 결제 안내 자세히 보기</Link>
    </section>
    <CityBookingActions regionName={regionName} city={city} />
  </main>
}

