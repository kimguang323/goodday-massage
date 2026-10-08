import Link from 'next/link'
import Image from 'next/image'
import { COURSE_COMBINATIONS, getLocalGuide } from '../data/local-guide'

function LocalIntroText({ text, highlights = [] }: { text: string; highlights?: string[] }) {
  if (!highlights.length) return <>{text}</>
  const parts = text.split(new RegExp(`(${highlights.join('|')})`, 'g'))
  return <>{parts.map((part, index) => highlights.includes(part) ? <strong key={index} className="font-semibold text-rose-900">{part}</strong> : part)}</>
}

export default function LocalMassageGuide({ region, city }: { region: string; city: string }) {
  const place = `${region} ${city}`
  const local = getLocalGuide(region, city)
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
      <div className="mx-auto max-w-xl">
        <Image src="/local-homecare-banner.webp" width={960} height={960} sizes="(max-width: 640px) calc(100vw - 48px), 576px" loading="lazy" alt={`${place} 홈타이 방문 서비스 소개 이미지`} className="h-auto w-full rounded-2xl" />
        <figcaption className="mt-3 text-sm text-rose-800">{place} 홈케어 서비스 소개 이미지 · 실제 배정은 상담으로 확인합니다.</figcaption>
      </div>
    </figure>

    <section className="bg-rose-50" aria-labelledby="local-characteristics"><div className={sectionClass}>
      <h2 id="local-characteristics" className="text-2xl font-semibold leading-snug">{city} 지역 특성과 굿데이 방문 서비스</h2>
      <p className="mt-4 leading-relaxed"><LocalIntroText text={local.description} highlights={local.highlights} /></p>
      {local.serviceIntro && <p className="mt-4 leading-relaxed"><LocalIntroText text={local.serviceIntro} highlights={local.highlights} /></p>}
      <div className="mt-5 rounded-2xl bg-white p-5"><h3 className="font-semibold">{place} 예약 메모</h3><p className="mt-3 leading-relaxed">{local.tip}</p></div>
      {local.source && <a href={local.source} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm underline">{local.sourceLabel}</a>}
    </div></section>

    <section className={sectionClass} aria-labelledby="local-course-combinations">
      <h2 id="local-course-combinations" className="text-2xl font-semibold leading-snug">{place} 추천 코스 조합과 선택 예시</h2>
      <p className="mt-4 leading-relaxed">한 가지 코스로 정하기 어렵다면 아래 선택 예시를 상담에서 활용하세요. 조합은 구성 상담을 위한 예시이며, 별도 패키지·할인·총 이용 시간을 뜻하지 않습니다. 실제 조합 가능 여부와 가격은 예약 전에 확인하세요.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{COURSE_COMBINATIONS.map(item => <article key={item.title} className="overflow-hidden rounded-2xl border border-rose-100"><div className="bg-rose-950 p-5 text-white"><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-rose-200">{item.courses}</p></div><p className="p-5 leading-relaxed">{item.description}</p></article>)}</div>
    </section>

    <figure className="mx-auto max-w-5xl px-6 pb-10">
      <div className="mx-auto max-w-xl">
        <Image src="/local-swedish-banner.webp" width={960} height={800} sizes="(max-width: 640px) calc(100vw - 48px), 576px" loading="lazy" alt="굿데이 스웨디시와 편안한 관리 공간을 소개하는 홍보 이미지" className="h-auto w-full rounded-2xl" />
        <figcaption className="mt-3 text-sm text-rose-800">스웨디시 서비스 분위기 소개 이미지 · 사진 속 공간은 {city}의 실제 방문 장소를 뜻하지 않습니다.</figcaption>
      </div>
    </figure>

    <section className="bg-rose-950 text-white" aria-labelledby="why-goodday"><div className={sectionClass}>
      <h2 id="why-goodday" className="text-2xl font-semibold leading-snug">{city}에서 왜 굿데이 출장마사지를 선택할까요?</h2>
      <p className="mt-4 text-xl font-semibold leading-relaxed text-rose-100">내 일정에 맞추고, 내 공간에서 쉬고, 내 취향으로 선택하세요.</p>
      <p className="mt-4 leading-relaxed">{place} 출장마사지를 고를 때 중요한 것은 화려한 문구보다 나에게 맞는 이용 조건입니다. 굿데이출장마사지는 머무는 장소로 방문하는 편의, 24시간 상담, 100% 후불제와 코스별 비교 안내를 함께 제공합니다. 원하는 압과 관리 방식부터 총 비용까지 확인하고, 나만의 휴식 시간을 준비하세요.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{[
        ['늦게 끝난 하루에도, 24시간 상담', `${city}에서 업무나 나들이를 마친 뒤에도 원하는 시간을 문의하세요. 심야를 포함한 방문 서비스를 운영하며 실제 일정은 당일 배정 상황을 확인해 정합니다.`],
        ['취향에 맞춰 고르는 여섯 가지 코스', '홈타이·스웨디시·아로마·스포츠·림프순환·VIP의 관리 방식과 시간을 비교하세요. 부드러운 압, 오일 선호, 집중 관리 부위를 알려주시면 원하는 코스를 상담할 수 있습니다.'],
        ['결제 기준은 분명하게, 100% 후불제', '굿데이는 100% 후불제로 운영합니다. 신규 회원님은 예약하기로 문의해 이용 방법과 예약 조건을 먼저 확인해 주세요.'],
        ['이동 시간을 줄이는 자택·숙소 방문', `${place}의 자택·호텔·오피스텔에서 편안하게 준비하세요. 머무는 공간을 기준으로 상담하므로 따로 매장을 찾아 이동할 부담을 줄일 수 있습니다.`],
        ['예약 결정 전에 총 비용 확인', '코스만 고르고 끝내지 않습니다. 방문 주소와 이용 시간, 출장비를 포함한 총 비용, 예상 도착 시간과 변경·취소 조건을 확인한 뒤 예약을 결정하세요.'],
        ['공개 글 대신 상담으로 예약 정보 전달', '방문 상담하기와 텔레그램 상담하기를 고정으로 제공합니다. 상세 주소와 출입 안내는 공개 게시글에 남기지 않고 상담 채널로 전달할 수 있습니다.'],
      ].map(([title, text]) => <article key={title} className="rounded-2xl border border-rose-700 bg-rose-900 p-5"><h3 className="font-semibold text-rose-100">{title}</h3><p className="mt-3 leading-relaxed">{text}</p></article>)}</div>
      <div className="mt-8 rounded-2xl bg-white p-5 text-rose-950">
        <h3 className="text-lg font-semibold">마사지샵을 비교할 때, 이 네 가지를 확인하세요</h3>
        <dl className="mt-4 space-y-4">
          {[
            ['장소와 일정', `${city}의 내 주소에서 원하는 시간에 이용할 수 있는지 확인하세요. 굿데이는 자택·숙소 방문과 24시간 상담을 안내합니다.`],
            ['관리 방식', '이름만 보고 고르기보다 압과 오일 사용 여부를 비교하세요. 굿데이는 코스별 설명과 선택 예시를 제공합니다.'],
            ['최종 비용', '표시 가격뿐 아니라 출장비와 추가 비용 유무까지 확인하세요. 굿데이 예약 상담에서 총 금액을 확인하고 결정할 수 있습니다.'],
            ['문의 동선', '일정이나 요청사항을 전달하기 쉬운지 살펴보세요. 굿데이는 페이지 하단의 방문 상담과 텔레그램으로 바로 문의할 수 있습니다.'],
          ].map(([label, text]) => <div key={label}><dt className="font-semibold text-rose-800">{label}</dt><dd className="mt-1 leading-relaxed">{text}</dd></div>)}
        </dl>
      </div>
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
