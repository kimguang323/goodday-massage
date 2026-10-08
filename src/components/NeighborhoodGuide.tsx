import neighborhoods from '../data/neighborhoods.json'

type Area = { groups: { name: string; names: string[] }[]; note?: string }
const areas: Record<string, Area> = neighborhoods

export default function NeighborhoodGuide({ region, city }: { region: string; city: string }) {
  const area = areas[`${region}/${city}`]
  if (!area) return null
  const count = area.groups.reduce((total, group) => total + group.names.length, 0)
  const example = area.groups[0].names[0]
  const rural = area.groups.some(group => group.names.some(name => /[읍면]$/.test(name)))
  return <section className="mx-auto max-w-5xl px-6 py-10" aria-labelledby="neighborhood-guide">
    <p className="mb-2 text-sm font-semibold text-rose-700">내가 머무는 지역 확인</p>
    <h2 id="neighborhood-guide" className="text-2xl font-semibold leading-snug">{city} 동·읍·면별 출장마사지 방문 안내</h2>
    <p className="mt-4 leading-relaxed">굿데이 {city} 출장마사지 예약 시 아래 목록에서 머무는 동·읍·면을 확인해 주세요. {example}처럼 지역 이름을 알려주신 뒤 도로명 주소와 건물명을 전달하면 방문 위치를 구체적으로 확인할 수 있습니다.</p>
    {area.note && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-relaxed">{area.note}</p>}
    <div className="mt-5 space-y-3">{area.groups.map((group, index) => <details key={group.name} open={index === 0} className="rounded-2xl border border-rose-200 bg-rose-50">
      <summary className="min-h-12 cursor-pointer rounded-2xl px-4 py-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800">{group.name} · {group.names.length}개 지역 <span className="text-sm font-normal">목록 펼치기 / 접기</span></summary>
      <ul aria-label={`${group.name} 행정동·읍·면 목록`} className="flex flex-wrap gap-2 px-4 pb-4">{group.names.map(name => <li key={name} className="max-w-full break-words rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm leading-relaxed">{name}</li>)}</ul>
    </details>)}</div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <article className="rounded-2xl border border-rose-100 p-5"><h3 className="font-semibold">동 이름과 실제 주소를 함께 알려주세요</h3><p className="mt-3 leading-relaxed">행정동과 주소에 쓰는 법정동 이름은 다를 수 있습니다. 목록과 주소의 동 이름이 달라도 도로명 주소를 기준으로 상담하세요. 자택은 공동현관, 호텔은 방문객 출입 규정, 오피스텔은 주차와 출입 방법을 확인해 주세요.</p></article>
      <article className="rounded-2xl border border-rose-100 p-5"><h3 className="font-semibold">{rural ? '읍·면 이동 여건을 먼저 확인하세요' : '희망 시간과 코스를 함께 확인하세요'}</h3><p className="mt-3 leading-relaxed">{rural ? `${city}의 읍·면 지역은 같은 지역명 안에서도 실제 주소에 따라 이동 거리와 접근 방법이 달라집니다. 진입로와 주차 위치를 함께 안내하고 예상 방문 시간 및 추가 비용을 먼저 확인하세요.` : `${city}에서 홈타이·스웨디시 등 원하는 관리 방식과 희망 시간을 알려주세요. 같은 동 안에서도 주소와 당일 배정 상황에 따라 방문 가능 시간과 총 비용이 달라질 수 있습니다.`}</p></article>
    </div>
    <p className="mt-4 text-sm leading-relaxed text-rose-800">목록은 {count}개 행정동·읍·면의 위치 안내이며, 각 지역의 상시 배정이나 동일한 도착 시간을 보장하는 의미는 아닙니다. 방문 가능 여부는 실제 주소와 희망 시간을 기준으로 상담합니다.</p>
    <details className="mt-4 text-xs leading-relaxed text-rose-800"><summary className="min-h-11 cursor-pointer py-3">지역명 기준과 자료 출처</summary><p>2026년 7월 1일 자료 기준. 통계청 통계지리정보서비스(SGIS)의 공공누리 제1유형 행정동 경계를 vuski/admdongkor가 가공한 CC BY 4.0 자료에서 지역명만 추출했습니다. 경계·좌표는 사용하지 않았습니다.</p><p className="mt-2"><a className="underline" href="https://sgis.kostat.go.kr" target="_blank" rel="noopener noreferrer">SGIS 원자료</a> · <a className="underline" href="https://github.com/vuski/admdongkor/tree/master/ver20260701" target="_blank" rel="noopener noreferrer">행정동 자료 및 변경 이력</a></p></details>
  </section>
}
