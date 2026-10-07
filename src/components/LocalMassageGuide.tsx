import Link from 'next/link'
import Image from 'next/image'
import { REGIONS } from '../data/regions'
import { cityPath } from '../data/site'
import { COURSE_COMBINATIONS, getLocalGuide } from '../data/local-guide'

export default function LocalMassageGuide({ region, city }: { region: string; city: string }) {
  const place = `${region} ${city}`
  const local = getLocalGuide(region, city)
  const related = REGIONS.find(item => item.name === region)?.cities.filter(name => name !== city).slice(0, 4) ?? []
  const sectionClass = 'mx-auto max-w-5xl px-6 py-10'
  return <>
    <section className={sectionClass} aria-labelledby="local-massage-guide">
      <p className="mb-2 text-xs font-semibold tracking-widest text-rose-700">출장마사지 이용 가이드</p>
      <h2 id="local-massage-guide" className="text-2xl font-semibold leading-snug">{place} 출장마사지, 처음이라면 이렇게 준비하세요</h2>
      <p className="mt-4 leading-relaxed">{city}에서 이용할 장소와 시간을 정하고, 원하는 마사지 종류와 관리 강도를 선택하세요.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ['01 · 장소와 일정', `${place}의 방문 주소, 장소 유형과 희망 날짜·시간을 준비하세요. 호텔은 체크인 이후 이용 가능한 시간을 확인해 주세요.`],
          ['02 · 코스와 선호', '오일 사용 여부, 원하는 압과 집중 관리 부위를 알려주세요. 이용 시간과 가격은 코스 안내에서 비교하세요.'],
          ['03 · 조건 확인', '배정 가능 여부와 예상 이동 시간, 출장비를 포함한 총 금액을 확인하세요. 신규 회원님은 예약하기로 문의해 주세요.'],
        ].map(([title, text]) => <article key={title} className="rounded-2xl border border-rose-100 bg-rose-50 p-5"><h3 className="font-semibold text-rose-800">{title}</h3><p className="mt-3 leading-relaxed">{text}</p></article>)}
      </div>
      <p className="mt-3 leading-relaxed">출장마사지는 고객님이 머무는 장소로 방문하는 서비스입니다. 굿데이는 자택·호텔·오피스텔 방문을 상담하며, 실제 배정과 일정은 주소와 요청 내용을 확인해 안내합니다.</p>
      <Link href="/services" prefetch={false} className="mt-5 inline-block font-semibold underline">마사지 코스·이용 시간·가격 비교하기</Link>
    </section>

    <figure className="mx-auto max-w-5xl px-6 pb-10">
      <Image src="/contact-new-banner.webp" width={1280} height={720} sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) calc(100vw - 48px), 976px" loading="lazy" alt="굿데이 출장마사지 방문 상담 서비스 소개 이미지" className="h-auto w-full rounded-2xl" />
      <figcaption className="mt-3 text-sm text-rose-800">{place} 방문 상담 · 굿데이 서비스 소개 이미지</figcaption>
    </figure>

    <section className="bg-rose-50" aria-labelledby="local-characteristics"><div className={sectionClass}>
      <h2 id="local-characteristics" className="text-2xl font-semibold leading-snug">{city} 지역 특성과 방문 체크포인트</h2>
      <p className="mt-4 leading-relaxed">{local.description}</p>
      <div className="mt-5 rounded-2xl bg-white p-5"><h3 className="font-semibold">{place} 예약 메모</h3><p className="mt-3 leading-relaxed">{local.tip}</p></div>
      {local.source && <a href={local.source} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm underline">{local.sourceLabel}</a>}
    </div></section>

    <section className={sectionClass} aria-labelledby="local-course-combinations">
      <h2 id="local-course-combinations" className="text-2xl font-semibold leading-snug">{place} 추천 코스 조합과 선택 예시</h2>
      <p className="mt-4 leading-relaxed">한 가지 코스로 정하기 어렵다면 아래 선택 예시를 상담에서 활용하세요. 조합은 구성 상담을 위한 예시이며, 별도 패키지·할인·총 이용 시간을 뜻하지 않습니다. 실제 조합 가능 여부와 가격은 예약 전에 확인하세요.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{COURSE_COMBINATIONS.map(item => <article key={item.title} className="overflow-hidden rounded-2xl border border-rose-100"><div className="bg-rose-950 p-5 text-white"><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-rose-200">{item.courses}</p></div><p className="p-5 leading-relaxed">{item.description}</p></article>)}</div>
      {related.length > 0 && <div className="mt-6 rounded-2xl bg-rose-50 p-5"><h3 className="font-semibold">주변 지역을 찾고 계신가요?</h3><p className="mt-2 leading-relaxed">방문 장소가 {city} 밖에 있다면 같은 시·도의 다른 지역 안내도 살펴보세요. 아래 링크는 거리순 추천이 아닌 관련 지역 안내입니다.</p><nav aria-label={`${city} 관련 지역`} className="mt-4 flex flex-wrap gap-3">{related.map(name => <Link key={name} href={cityPath(region, name)} prefetch={false} className="rounded-lg bg-white px-4 py-3 underline">{region} {name} 출장마사지</Link>)}</nav></div>}
    </section>

    <figure className="mx-auto max-w-5xl px-6 pb-10">
      <div className="mx-auto max-w-xl">
        <Image src="/reviews-banner.webp" width={1280} height={1280} sizes="(max-width: 640px) calc(100vw - 48px), 576px" loading="lazy" alt="굿데이 마사지 관리 분위기를 보여주는 서비스 소개 이미지" className="h-auto w-full rounded-2xl" />
        <figcaption className="mt-3 text-sm text-rose-800">머무는 공간에서 준비하는 방문 마사지 · 서비스 소개 이미지</figcaption>
      </div>
    </figure>

    <section className="bg-rose-950 text-white" aria-labelledby="why-goodday"><div className={sectionClass}>
      <h2 id="why-goodday" className="text-2xl font-semibold leading-snug">{city}에서 왜 굿데이 출장마사지를 선택할까요?</h2>
      <p className="mt-4 leading-relaxed">{place}에서 원하는 장소와 시간에 맞춰 방문 마사지를 준비할 수 있도록, 코스 선택부터 예약 조건 확인까지 한곳에서 안내합니다.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{[
        ['24시간 상담과 방문 운영', '일정이 늦게 끝나거나 심야 이용을 원할 때도 희망 시간을 상담할 수 있습니다. 실제 방문 일정은 배정 상황을 확인해 확정합니다.'],
        ['다양한 마사지 종류 비교', '홈타이 방문과 스웨디시·아로마·스포츠·림프순환·VIP를 안내합니다. 관리 방식과 시간을 비교해 원하는 코스를 상담하세요.'],
        ['100% 후불제 운영', '100% 후불제로 운영합니다. 신규 회원님은 예약하기로 문의해 이용 방법과 예약 조건을 확인하세요.'],
        ['머무는 장소로 방문', '별도로 매장을 찾아가기보다 자택·호텔·오피스텔에서 방문 서비스를 준비할 수 있습니다. 장소별 출입 규정과 이용 공간은 사전에 확인합니다.'],
        ['예약 전 조건을 확인하는 상담', '방문 주소와 코스에 따른 배정 가능 여부, 예상 이동 시간과 총 비용을 먼저 확인하고 예약을 결정할 수 있도록 안내합니다.'],
        ['상담창과 텔레그램으로 문의', '페이지의 방문 상담하기 또는 텔레그램 상담하기에서 문의하세요. 주소 등 필요한 예약 정보는 공개 글 대신 상담으로 전달해 주세요.'],
      ].map(([title, text]) => <article key={title} className="rounded-2xl border border-rose-700 bg-rose-900 p-5"><h3 className="font-semibold text-rose-100">{title}</h3><p className="mt-3 leading-relaxed">{text}</p></article>)}</div>
    </div></section>

    <section className={sectionClass} aria-labelledby="local-booking-tips">
      <h2 id="local-booking-tips" className="text-2xl font-semibold leading-snug">{place} 출장마사지 이용 꿀팁</h2>
      <div className="mt-6 space-y-3">{[
        ['예약 메시지는 한 번에 정리하기', `${place} · 장소 유형 · 희망 날짜와 시간 · 원하는 코스 · 이용 시간을 한 메시지에 정리하면 상담에 필요한 내용을 명확히 전달할 수 있습니다.`],
        ['호텔·오피스텔 출입 규정 먼저 확인하기', '외부 방문객 등록, 주차, 공동현관과 객실 출입 규정을 숙소나 관리실에 확인하세요. 장소 사용 조건과 다른 이용객의 편의도 고려해 주세요.'],
        ['선호하는 압과 오일을 구체적으로 말하기', '“약하게”, “오일 없이”, “어깨 위주”처럼 선호를 알려주세요. 오일이나 향에 민감한 경우 예약 전에 함께 전달하세요.'],
        ['일정 변경은 상담으로 먼저 알리기', '체크인이나 귀가 시간이 바뀌면 확정된 예약 시간 전에 상담으로 알려주세요. 변경·취소 조건은 예약을 확정하기 전에 확인하세요.'],
        ['최종 금액과 진행 내용을 다시 확인하기', '코스 안내에 표시된 가격과 상담에서 확정한 총 금액을 비교하세요. 추가 비용 유무, 관리 시간과 진행 범위를 확인한 뒤 예약을 결정하세요.'],
      ].map(([title, text]) => <details key={title} className="rounded-2xl border border-rose-100 bg-rose-50 p-5"><summary className="cursor-pointer font-semibold">{title}</summary><p className="mt-3 leading-relaxed">{text}</p></details>)}</div>
    </section>
  </>
}
