import { REGIONAL_PROFILE_ROWS } from './regional-profiles'

type LocalFact = { description: string; serviceIntro: string; highlights: string[]; tip: string; source: string; sourceLabel: string }
const PROFILES = new Map<string, (typeof REGIONAL_PROFILE_ROWS)[number]>(REGIONAL_PROFILE_ROWS.map(row => [row[0], row]))

function localActivity(landmark: string): string {
  if (/테헤란로|디지털단지|G밸리|동탄|평택항|여의도|송정역|서대구역|광명역/.test(landmark)) return '업무와 이동 일정을 마친 뒤'
  if (/해수욕장|해변|광안리|장호항|삼천포|호미곶|간절곶|이기대|백령도|대부도|오동도|당항포/.test(landmark)) return '바닷가 나들이를 마치고 숙소로 돌아온 뒤'
  if (/산$|산·|계곡|출렁다리|회룡사|범어사|수타사|대왕암/.test(landmark)) return '산길과 자연을 둘러본 날'
  if (/공원|호수|생태원|저수지|수목원|한강|소양강|탄금대|농다리|순천만|우포늪|반곡지|경천섬/.test(landmark)) return '물가와 공원에서 산책을 즐긴 뒤'
  if (/미술관|문화전당|만화박물관|예술의전당|아트빌리지|문화예술촌|김광석|헤이리/.test(landmark)) return '공연·전시와 문화 나들이를 즐긴 날'
  if (/한옥|성|왕릉|릉|불국사|직지사|통도사|서원|고분|고인돌|조문국|기념관|고택|광한루|벽골제/.test(landmark)) return '역사와 문화 공간을 둘러본 뒤'
  return '지역 나들이와 하루 일정을 마친 뒤'
}

export function getLocalGuide(region: string, city: string): LocalFact {
  const key = `${region}/${city}`
  const profile = PROFILES.get(key)
  if (!profile) throw new Error(`Missing researched regional introduction: ${key}`)
  const [, landmark, character, source] = profile
  const brand = `굿데이 ${region} ${city} 출장마사지·출장안마`
  const activity = localActivity(landmark)
  const variant = REGIONAL_PROFILE_ROWS.findIndex(row => row[0] === key) % 6
  const serviceLines = [
    `${activity}, 이제 휴식은 머무는 공간에서 준비하세요. ${brand}는 자택·호텔·오피스텔 방문 상담으로 이동을 줄이고 원하는 관리 시간을 함께 정합니다.`,
    `${activity} 따로 매장을 찾지 않고 쉬고 싶다면 ${brand}를 만나보세요. 자택이나 머무는 숙소에서 선호하는 관리 방식과 시간에 맞춰 방문 서비스를 상담할 수 있습니다.`,
    `${activity} 이어지는 나만의 휴식. ${brand}는 고객님이 머무는 자택·호텔·오피스텔을 기준으로 방문 일정과 원하는 코스를 안내합니다.`,
    `${activity}, 편안한 공간에서 하루를 마무리해 보세요. ${brand}는 자택과 숙소 방문을 상담하며, 이용 장소를 옮기지 않는 휴식을 준비합니다.`,
    `${activity} 필요한 것은 분주한 이동보다 편안한 휴식 시간. ${brand}는 자택·호텔·오피스텔에서 이용할 코스와 일정을 함께 확인합니다.`,
    `${activity} 쉬고 싶은 고객님을 위한 ${brand}. 머무는 자택이나 숙소에서 원하는 마사지 종류와 압을 선택해 방문 서비스를 준비하세요.`,
  ]
  const courseLines = [
    '부드러운 오일 관리를 원한다면 스웨디시·아로마, 압의 선호를 세밀하게 상담하고 싶다면 스포츠 마사지를 비교해 보세요.',
    '스웨디시·아로마·스포츠 마사지 중 원하는 관리 방식과 압을 알려주세요. 홈타이·림프순환·VIP의 구성과 이용 시간도 코스 안내에서 비교할 수 있습니다.',
    '오일 사용 여부와 원하는 압에 따라 스웨디시·아로마·스포츠 마사지를 상담하세요. 내 취향에 맞는 코스를 고르는 것부터 휴식을 시작합니다.',
    '부드러운 스웨디시와 아로마부터 스포츠 마사지까지, 선호하는 관리 방식으로 나만의 휴식 시간을 준비하세요.',
    '관리 방식은 스웨디시·아로마·스포츠 등 코스별로 비교하고, 원하는 압과 집중 관리 부위를 상담에서 알려주세요.',
    '홈타이 방문과 스웨디시·아로마·스포츠·림프순환·VIP를 안내합니다. 이용 시간과 가격을 비교해 편안하게 받을 수 있는 코스를 선택하세요.',
  ]
  const tip = key === '인천/옹진군'
    ? '섬 지역은 선박 운항과 이동 여건에 따라 방문 가능 일정이 달라질 수 있습니다. 머무는 섬과 희망 날짜를 알려주고 실제 배정 가능 여부를 먼저 확인하세요.'
    : key === '경기/광주'
      ? '광주광역시와 구분되도록 “경기도 광주시”와 머무는 장소를 알려주세요. 숙소의 외부 방문객 출입 규정과 주차 안내도 함께 확인하세요.'
      : /군$|군위/.test(city)
        ? `${city} 안에서도 방문 지점에 따라 이동 조건이 달라질 수 있습니다. 희망 시간과 머무는 장소를 알려주고 예상 이동 시간과 총 비용을 확인하세요.`
        : `${landmark} 나들이와 방문 상담을 함께 계획한다면 귀가·체크인 이후 여유 있는 시간을 정하세요. 자택이나 숙소의 방문객 출입 규정과 주차 안내를 먼저 확인해 주세요.`
  const result: LocalFact = {
    description: `${character}. ${landmark}에서 만나는 지역의 매력에 편안한 하루의 마무리를 더해보세요. ${serviceLines[variant]}`,
    serviceIntro: `${courseLines[variant]} 굿데이는 24시간 상담과 방문 서비스, 100% 후불제로 운영합니다. 실제 방문 일정과 코스 구성은 예약 상담에서 확인하며, 신규 회원님은 예약하기로 문의해 주세요.`,
    highlights: [...new Set([landmark, ...landmark.split('·'), brand, '스웨디시', '아로마', '스포츠 마사지', '24시간 상담', '100% 후불제'])],
    tip, source, sourceLabel: `${city} 지역 특성 참고 · 공식 안내`,
  }
  if (key === '전남/나주') return {
    ...result,
    description: '빛가람혁신도시의 활기찬 비즈니스 일상과 영산강을 품은 나주 원도심의 전통이 만나는 도시, 나주. 굿데이 나주 출장마사지·출장안마는 빛가람동 자택·오피스텔부터 나주역·영산포 인근 숙소까지, 고객님이 머무는 공간에서 편안한 휴식을 준비합니다.',
    serviceIntro: '업무를 마친 저녁에도, 빛가람호수공원 산책 뒤에도 원하는 시간에 상담하세요. 스웨디시·아로마·스포츠 마사지 중 선호하는 관리 방식과 압을 선택하고, 24시간 상담과 100% 후불제로 굿데이의 방문 서비스를 이용하세요. 실제 방문 일정과 코스 구성은 예약 상담에서 확인합니다.',
    highlights: ['빛가람혁신도시', '영산강', '나주 원도심', '굿데이 나주 출장마사지·출장안마', '빛가람호수공원', '스웨디시·아로마·스포츠 마사지', '24시간 상담', '100% 후불제'],
    tip: '빛가람동 공동주택·오피스텔은 방문객 출입 절차를, 나주역·영산포 인근 숙소는 체크인 시간과 주차 안내를 먼저 확인하세요. 신규 회원님은 예약하기로 문의해 주세요.',
    source: 'https://naju.go.kr/tour', sourceLabel: '나주시 공식 문화관광 안내',
  }
  return result
}

export const COURSE_COMBINATIONS = [
  { title: '부드러운 오일 관리', courses: '스웨디시 + 아로마 상담', description: '부드러운 압과 오일 사용을 선호할 때 참고할 조합입니다. 향에 대한 선호와 민감 여부, 집중 관리 부위를 함께 알려주세요.' },
  { title: '압의 강도를 비교하고 싶을 때', courses: '스포츠 마사지 · 스웨디시 비교', description: '원하는 압의 강도를 기준으로 두 관리 방식을 비교해 보세요. 강한 압을 기본으로 정하기보다 편안하게 받을 수 있는 강도를 상담하세요.' },
  { title: '머무는 장소에서 편하게', courses: '홈타이 방문 + 원하는 관리 방식', description: '홈타이 방문 상담에서 장소를 정하고, 스웨디시·아로마·스포츠 등 원하는 관리 방식을 선택하는 예시입니다.' },
  { title: '구성과 시간을 자세히 확인', courses: 'VIP · 림프순환 코스 상담', description: 'VIP 구성이나 림프순환 관리가 궁금하다면 코스별 진행 방식과 시간을 먼저 확인하세요. 제공 가능한 구성과 총 금액은 예약 전에 확정하세요.' },
]
