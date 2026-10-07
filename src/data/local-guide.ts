import { REGIONS } from './regions'

type LocalFact = { description: string; serviceIntro?: string; highlights?: string[]; tip: string; source?: string; sourceLabel?: string }
const LOCAL_FACTS: Record<string, LocalFact> = {
  '전남/나주': {
    description: '빛가람혁신도시의 활기찬 비즈니스 일상과 영산강을 품은 나주 원도심의 전통이 만나는 도시, 나주. 굿데이 나주 출장마사지·출장안마는 빛가람동 자택·오피스텔부터 나주역·영산포 인근 숙소까지, 고객님이 머무는 공간에서 편안한 휴식을 준비합니다.',
    serviceIntro: '업무를 마친 저녁에도, 빛가람호수공원 산책 뒤에도 원하는 시간에 상담하세요. 스웨디시·아로마·스포츠 마사지 중 선호하는 관리 방식과 압을 선택하고, 24시간 상담과 100% 후불제로 굿데이의 방문 서비스를 이용하세요. 실제 방문 일정과 코스 구성은 예약 상담에서 확인합니다.',
    highlights: ['빛가람혁신도시', '영산강', '나주 원도심', '굿데이 나주 출장마사지·출장안마', '빛가람호수공원', '스웨디시·아로마·스포츠 마사지', '24시간 상담', '100% 후불제'],
    tip: '빛가람동 공동주택·오피스텔은 방문객 출입 절차를, 나주역·영산포 인근 숙소는 체크인 시간과 주차 안내를 먼저 확인하세요. 신규 회원님은 예약하기로 문의해 주세요.',
    source: 'https://naju.go.kr/tour', sourceLabel: '나주시 공식 문화관광 안내',
  },
  '서울/강남구': {
    description: '강남구에는 테헤란로와 코엑스 일대가 있습니다. 업무나 전시 일정을 마친 뒤 출장마사지를 계획한다면, 머무는 호텔·오피스텔의 주소와 실제 귀가 시간을 기준으로 상담하세요.',
    tip: '업무·전시 일정이 길어질 수 있다면 종료 예정 시간과 예약 가능한 시간 범위를 함께 전달하세요. 행사장 이름만으로 방문 장소를 확정하지 마세요.',
    source: 'https://www.gangnam.go.kr/contents/manifesto_map/1/view.do', sourceLabel: '강남구 공식 지역 안내',
  },
  '경기/광주': {
    description: '이 페이지는 광주광역시가 아닌 경기도 광주시 안내입니다. 광주시에는 남한산성면과 경안동 등 여러 생활권이 있으므로, 출장마사지 상담 시 읍·면·동과 건물 주소까지 함께 알려주세요.',
    tip: '예약 메시지의 첫 줄을 “경기도 광주시 + 읍·면·동”으로 작성하면 광주광역시와 혼동하는 일을 줄일 수 있습니다.',
    source: 'https://www.gjcity.go.kr/portal/contents.do?mId=0801010000', sourceLabel: '광주시청 공식 행정 안내',
  },
  '경북/경주': {
    description: '경주는 불국사 등 역사·문화 관광지를 안내하는 도시입니다. 관광 일정을 마친 뒤 숙소에서 출장마사지를 이용하려면 관광지 이름이 아니라 머무는 숙소의 정확한 주소와 체크인 시간을 전달하세요.',
    tip: '관광 일정과 숙소 입실 시간이 겹치지 않도록 희망 상담 시간을 정하고, 호텔의 외부 방문객 출입 규정을 먼저 확인하세요.',
    source: 'https://www.gyeongju.go.kr/tour/index.do', sourceLabel: '경주시 공식 문화관광 안내',
  },
  '전북/전주': {
    description: '전주는 한옥마을 등 도보로 살펴볼 수 있는 문화·관광 공간이 있는 도시입니다. 한옥 숙소에서 출장마사지를 요청한다면 객실 위치와 관리에 사용할 공간, 출입 방법을 예약 전에 확인하세요.',
    tip: '한옥이나 소규모 숙소에서는 객실 면적과 출입 동선을 먼저 확인하세요. 관리 장소와 준비사항은 숙소 규정 및 상담 안내에 맞춰 정하세요.',
    source: 'https://hanok.jeonju.go.kr/tour/info', sourceLabel: '전주시 공식 한옥마을 안내',
  },
}

export function getLocalGuide(region: string, city: string): LocalFact {
  const known = LOCAL_FACTS[`${region}/${city}`]
  if (known) return known
  const sameNames = REGIONS.filter(item => item.name !== region && item.cities.includes(city)).map(item => item.name)
  if (sameNames.length) return {
    description: `${city}라는 지역명은 ${sameNames.join('·')}의 안내 목록에도 있습니다. 이 페이지는 ${region} ${city} 출장마사지 안내이며, 다른 시·도의 같은 이름 지역과 구분해 예약하는 것이 중요합니다.`,
    tip: `“${region} ${city}”를 먼저 적고 동·도로명 주소와 건물명을 덧붙여 주세요. 같은 지역명이어도 방문 주소가 다르면 배정과 이동 조건이 달라집니다.`,
  }
  if (city.endsWith('군') || city === '군위') return {
    description: `${region} ${city} 출장마사지 예약은 군 이름에 더해 실제 방문할 읍·면과 도로명 주소를 확인하는 것이 출발점입니다. 같은 군 안에서도 방문 지점이 다르므로 이동 시간과 비용은 주소를 기준으로 상담하세요.`,
    tip: '읍·면, 숙소나 건물명, 차량 진입 방법을 함께 전달하세요. 지역 중심지와 떨어진 주소라면 이동 조건과 최종 비용을 예약 전에 확인하세요.',
  }
  if (city.endsWith('구')) return {
    description: `${region} ${city}는 구 단위로 안내하는 지역입니다. 출장마사지 방문 위치를 구 이름이나 가까운 역만으로 정하기보다 동·도로명 주소와 건물명으로 구체화하면 상담 내용을 명확히 전달할 수 있습니다.`,
    tip: '공동현관·엘리베이터·방문객 출입 절차와 주차 안내를 준비하세요. 외부 방문객 등록이 필요한 건물은 관리실이나 숙소에 먼저 확인하세요.',
  }
  return {
    description: `${region} ${city} 출장마사지 이용을 준비할 때는 시·도와 지역명에 실제 머무는 동·읍·면 또는 도로명 주소를 더해 안내하세요. 지역명은 같아도 자택·호텔·오피스텔의 위치와 출입 조건에 따라 준비할 사항이 달라집니다.`,
    tip: `이동 일정이 있다면 방문 시점에 실제로 머무는 ${city}의 주소를 알려주세요. 체크인·귀가 이후 이용할 수 있는 시간과 건물 출입 방법을 함께 확인하세요.`,
  }
}

export const COURSE_COMBINATIONS = [
  { title: '부드러운 오일 관리', courses: '스웨디시 + 아로마 상담', description: '부드러운 압과 오일 사용을 선호할 때 참고할 조합입니다. 향에 대한 선호와 민감 여부, 집중 관리 부위를 함께 알려주세요.' },
  { title: '압의 강도를 비교하고 싶을 때', courses: '스포츠 마사지 · 스웨디시 비교', description: '원하는 압의 강도를 기준으로 두 관리 방식을 비교해 보세요. 강한 압을 기본으로 정하기보다 편안하게 받을 수 있는 강도를 상담하세요.' },
  { title: '머무는 장소에서 편하게', courses: '홈타이 방문 + 원하는 관리 방식', description: '홈타이 방문 상담에서 장소를 정하고, 스웨디시·아로마·스포츠 등 원하는 관리 방식을 선택하는 예시입니다.' },
  { title: '구성과 시간을 자세히 확인', courses: 'VIP · 림프순환 코스 상담', description: 'VIP 구성이나 림프순환 관리가 궁금하다면 코스별 진행 방식과 시간을 먼저 확인하세요. 제공 가능한 구성과 총 금액은 예약 전에 확정하세요.' },
]
