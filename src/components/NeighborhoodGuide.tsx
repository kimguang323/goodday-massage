import neighborhoods from '../data/neighborhoods.json'

type Area = { groups: { name: string; names: string[] }[]; note?: string }
const areas: Record<string, Area> = neighborhoods

export default function NeighborhoodGuide({ region, city }: { region: string; city: string }) {
  const area = areas[`${region}/${city}`]
  if (!area) return null
  const example = area.groups[0].names[0]
  return <section className="mx-auto max-w-5xl px-6 py-10" aria-labelledby="neighborhood-guide">
    <p className="mb-2 text-sm font-semibold text-rose-700">내가 머무는 지역 확인</p>
    <h2 id="neighborhood-guide" className="text-2xl font-semibold leading-snug">{city} 동·읍·면별 출장마사지 방문 안내</h2>
    <p className="mt-4 leading-relaxed">굿데이 {city} 출장마사지 예약 시 아래 목록에서 머무는 동·읍·면을 확인해 주세요. {example}처럼 지역 이름을 알려주신 뒤 도로명 주소와 건물명을 전달하면 방문 위치를 구체적으로 확인할 수 있습니다.</p>
    {area.note && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-relaxed">{area.note}</p>}
    <div className="mt-5 space-y-3">{area.groups.map((group, index) => <details key={group.name} open={index === 0} className="rounded-2xl border border-rose-200 bg-rose-50">
      <summary className="min-h-12 cursor-pointer rounded-2xl px-4 py-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800">{group.name} · {group.names.length}개 지역 <span className="text-sm font-normal">목록 펼치기 / 접기</span></summary>
      <ul aria-label={`${group.name} 행정동·읍·면 목록`} className="flex flex-wrap gap-2 px-4 pb-4">{group.names.map(name => <li key={name} className="max-w-full break-words rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm leading-relaxed">{name}</li>)}</ul>
    </details>)}</div>
  </section>
}
