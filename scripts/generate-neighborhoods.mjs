import fs from 'node:fs'

// Input: properties extracted from vuski/admdongkor ver20260701 GeoJSON.
// Names only; geometry is deliberately excluded from the website.
const input = process.argv[2]
if (!input) throw new Error('Pass the administrative-dong properties JSON path')
const rows = JSON.parse(fs.readFileSync(input, 'utf8'))
const regions = [...fs.readFileSync('src/data/regions.ts', 'utf8').matchAll(/name: '([^']+)', cities: \[([^\]]+)\]/g)]
const provinceNames = { 서울: '서울특별시', 경기: '경기도', 인천: '인천광역시', 부산: '부산광역시', 대구: '대구광역시', 광주: '전남광주통합특별시', 대전: '대전광역시', 울산: '울산광역시', 세종: '세종특별자치시', 강원: '강원특별자치도', 충북: '충청북도', 충남: '충청남도', 전북: '전북특별자치도', 전남: '전남광주통합특별시', 경북: '경상북도', 경남: '경상남도', 제주: '제주특별자치도' }
const result = {}
for (const match of regions) {
  const region = match[1]
  for (const city of [...match[2].matchAll(/'([^']+)'/g)].map(m => m[1])) {
    let selected = rows.filter(p => p.sidonm === provinceNames[region] && (p.sggnm === city || p.sggnm === city + '군' || p.sggnm === city + '시' || p.sggnm.startsWith(city + '시')))
    let note
    if (region === '인천' && ['중구', '동구', '서구'].includes(city)) {
      const inland = new Set(['연안동', '신포동', '신흥동', '도원동', '율목동', '동인천동', '개항동'])
      selected = rows.filter(p => p.sidonm === provinceNames[region] && (city === '중구' ? p.sggnm === '영종구' || (p.sggnm === '제물포구' && inland.has(p.adm_nm.split(' ').at(-1))) : city === '동구' ? p.sggnm === '제물포구' && !inland.has(p.adm_nm.split(' ').at(-1)) : ['서해구', '검단구'].includes(p.sggnm)))
      note = city === '중구' ? '이 페이지는 기존 중구 생활권을 안내합니다. 행정구역 개편 이후 제물포구의 내륙 지역과 영종구로 나뉘므로 현재 주소의 구 이름을 함께 알려주세요.' : city === '동구' ? '이 페이지는 기존 동구 생활권을 안내합니다. 행정구역 개편 이후 제물포구에 포함되므로 현재 주소는 제물포구와 해당 동 이름을 기준으로 확인합니다.' : '이 페이지는 기존 서구 생활권을 안내합니다. 행정구역 개편 이후 서해구와 검단구로 나뉘므로 현재 주소의 구 이름을 함께 알려주세요.'
    }
    if (!selected.length) throw new Error(`Missing neighborhoods: ${region} ${city}`)
    const groups = new Map()
    for (const p of selected) {
      const names = groups.get(p.sggnm) ?? new Set()
      names.add(p.adm_nm.split(' ').at(-1))
      groups.set(p.sggnm, names)
    }
    result[`${region}/${city}`] = { groups: [...groups].map(([name, names]) => ({ name, names: [...names].sort((a,b) => a.localeCompare(b,'ko')) })), ...(note ? { note } : {}) }
  }
}
fs.writeFileSync('src/data/neighborhoods.json', JSON.stringify(result, null, 2) + '\n')
console.log(`Generated ${Object.keys(result).length} region pages; ${Object.values(result).reduce((n,p) => n+p.groups.reduce((m,g)=>m+g.names.length,0),0)} administrative areas`)
