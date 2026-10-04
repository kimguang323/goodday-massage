import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'

declare global {
  interface Window {
    $crisp?: unknown[]
  }
}

const CRISP_CHAT_URL = 'https://go.crisp.chat/chat/embed/?website_id=8228327c-a1a7-4ba2-b41e-657b36b5105f'

function openCrispChat() {
  if (window.$crisp) {
    window.$crisp.push(['do', 'chat:show'])
    window.$crisp.push(['do', 'chat:open'])
    return
  }

  window.open(CRISP_CHAT_URL, '_blank', 'noopener,noreferrer')
}

const NAV_ITEMS = [
  { label: '홈', href: '#home' },
  { label: '1:1 문의', href: '#contact' },
  { label: '코스보기', href: '#services' },
  { label: '테라피스트 보기', href: '#therapists' },
  { label: '지역선택', href: '#regions' },
  { label: '블로그', href: '#blog' },
  { label: 'FAQ', href: '#faq' },
  { label: '고객후기', href: '#reviews' },
]

const SERVICES = [
  {
    name: '스웨디시',
    tag: '전신 순환 · 숙면',
    desc: '전신 혈액순환 촉진 및 깊은 수면 유도에 특화된 클래식 마사지. 장거리 이동 후 피로 회복에 최적입니다.',
    time: '60 · 90 · 120분',
    recommend: '장거리 이동 후',
    icon: '🌸',
  },
  {
    name: '아로마',
    tag: '신경 과각성 완화',
    desc: '천연 에센셜 오일로 과민해진 신경계를 진정시키는 감각 테라피. 야간 릴랙스에 특화되어 있습니다.',
    time: '60 · 90 · 120분',
    recommend: '야간 릴랙스',
    icon: '🌿',
  },
  {
    name: '림프순환',
    tag: '부종 · 피로 관리',
    desc: '정밀한 드레나지 기법으로 부종과 피로를 동시에 해소합니다. 도보 또는 장거리 운전 후 권장합니다.',
    time: '60 · 90 · 120분',
    recommend: '도보 · 장거리 운전 후',
    icon: '💧',
  },
  {
    name: '스포츠 · 근막',
    tag: '근육 이동성 회복',
    desc: '뭉친 근막과 딥티슈를 집중 이완하는 전문 테라피. 운동 후 또는 현장 노동 직후 효과적입니다.',
    time: '60 · 90 · 120분',
    recommend: '운동 · 현장 노동 후',
    icon: '✦',
  },
]

const THERAPISTS = [
  { name: '가인', stars: 4.9, desc: '밝고 섬세한 응대, 밸런스 케어', status: '실시간 상담 가능', img: '/therapist-ga-in.png' },
  { name: '나연', stars: 5.0, desc: '부드러운 리듬감, 꼼꼼한 컨디션 체크', status: '상담중', img: '/therapist-na-yeon.png' },
  { name: '미영', stars: 4.9, desc: '활기찬 에너지, 압 조절, 피로 포인트 집중', status: '실시간 상담 가능', img: '/therapist-mi-young.png' },
  { name: '미유', stars: 4.9, desc: '차분한 분위기, 릴랙싱 중심', status: '실시간 상담 가능', img: '/therapist-mi-yu.png' },
  { name: '민영', stars: 4.9, desc: '부드러운 리듬, 스트레스 완화', status: '상담중', img: '/therapist-min-young.png' },
  { name: '소연', stars: 5.0, desc: '정돈된 진행, 집중도 높은 케어', status: '실시간 상담 가능', img: '/therapist-so-yeon.png' },
  { name: '수연', stars: 4.9, desc: '편안한 대화, 꼼꼼한 진행', status: '실시간 상담 가능', img: '/therapist-su-yeon.png' },
  { name: '은별', stars: 4.9, desc: '경쾌한 분위기, 또렷한 리듬', status: '실시간 상담 가능', img: '/therapist-eun-byeol.png' },
  { name: '은영', stars: 4.9, desc: '차분한 릴랙싱, 안정적 흐름', status: '실시간 상담 가능', img: '/therapist-eun-young.png' },
  { name: '재인', stars: 5.0, desc: '안정적 압 조절, 완성도 높은 루틴', status: '상담중', img: '/therapist-jae-in.png' },
  { name: '지은', stars: 4.9, desc: '밝은 분위기, 부드러운 진행', status: '실시간 상담 가능', img: '/therapist-ji-eun.png' },
  { name: '하린', stars: 5.0, desc: '섬세하고 가벼운 리듬, 긴장 완화', status: '실시간 상담 가능', img: '/therapist-ha-rin.png' },
  { name: '하은', stars: 4.9, desc: '균형 잡힌 템포, 전신 케어', status: '상담중', img: '/therapist-ha-eun.png' },
]

const REVIEWS = [
  {
    name: '서울 — 강남구',
    date: '2026.02.14',
    service: '아로마 90분',
    stars: 5,
    title: '정말 최고의 서비스였어요',
    text: '출장이 잦아 몸이 많이 지쳐있었는데 방문 후 정말 개운하게 풀렸어요. 테라피스트분이 세심하게 케어해주셔서 너무 만족스러웠습니다. 다음에도 꼭 이용할게요.',
  },
  {
    name: '부산 — 해운대구',
    date: '2026.01.28',
    service: '스웨디시 60분',
    stars: 5,
    title: '호텔에서 스파 느낌 그대로',
    text: '호텔 방문 서비스인데 완전히 스파에 온 느낌이었어요. 위생 관리가 철저하고 예약도 간편해서 좋았습니다. 비즈니스 출장 때마다 이용하고 싶은 서비스예요.',
  },
  {
    name: '제주 — 서귀포시',
    date: '2026.01.11',
    service: '림프순환 120분',
    stars: 5,
    title: '제주 여행 중 최고의 선택',
    text: '제주 여행 중 이용했는데 정말 힐링이었어요. 담당 선생님이 친절하시고 프로페셔널하셨어요. 부기가 확실히 빠지는 게 느껴졌고 여행 내내 컨디션이 좋았습니다.',
  },
]

const FAQS = [
  { q: '서비스 철학이 궁금합니다.', a: '저희는 단순한 마사지를 넘어 고객의 몸과 마음을 진정으로 케어하는 프리미엄 테라피를 제공합니다. 상위 1% 고객을 위한 맞춤형 서비스로, 모든 예약에는 검증된 테라피스트만 배정됩니다.' },
  { q: '프리미엄 서비스란 무엇인가요?', a: '일회용 비품 사용, 사전·사후 위생 관리, 100% 예약제 안심 예약, 개인정보 즉시 삭제를 포함한 완전한 프라이버시 보호가 포함된 서비스입니다.' },
  { q: '일반 마사지와 어떻게 다른가요?', a: '국가 공인 자격을 보유한 테라피스트만 선발하며, 매 회 고객 맞춤 케어 플랜을 수립합니다. 고급 오일과 의료 등급 소모품을 사용하여 최상의 환경을 제공합니다.' },
  { q: '어느 지역까지 방문 가능한가요?', a: '서울 전 지역, 경기도 27개 시, 6대 광역시, 충청·전라·경상·강원·제주까지 전국 어디든 방문합니다. 평균 20~40분 이내 도착을 목표로 합니다.' },
  { q: '테라피스트 신원은 어떻게 확인하나요?', a: '모든 테라피스트는 입사 전 신원조회, 자격증 검증, 위생 교육을 완료합니다. 고객 방문 시 고유 인증 코드가 발급되며, 개인정보는 서비스 완료 즉시 삭제됩니다.' },
]

const REGIONS = [
  { name: '서울', cities: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'] },
  { name: '경기', cities: ['수원', '성남', '고양', '용인', '부천', '안산', '화성', '남양주', '안양', '평택', '의정부', '시흥', '파주', '광명', '김포', '군포', '광주', '이천', '양주', '오산', '구리', '안성', '포천', '의왕', '하남', '여주'] },
  { name: '인천', cities: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'] },
  { name: '부산', cities: ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'] },
  { name: '대구', cities: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'] },
  { name: '광주', cities: ['동구', '서구', '남구', '북구', '광산구', '나주', '화순'] },
  { name: '대전', cities: ['동구', '중구', '서구', '유성구', '대덕구', '세종'] },
  { name: '울산', cities: ['중구', '남구', '동구', '북구', '울주군'] },
  { name: '세종', cities: ['세종시'] },
  { name: '강원', cities: ['춘천', '원주', '강릉', '동해', '태백', '속초', '삼척', '홍천'] },
  { name: '충북', cities: ['청주', '충주', '제천', '보은', '옥천', '영동', '증평', '진천'] },
  { name: '충남', cities: ['천안', '공주', '보령', '아산', '서산', '논산', '계룡', '당진', '금산', '부여', '서천'] },
  { name: '전북', cities: ['전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수', '임실'] },
  { name: '전남', cities: ['목포', '여수', '순천', '나주', '광양', '담양', '곡성'] },
  { name: '경북', cities: ['포항', '경주', '김천', '안동', '구미', '영주', '영천', '상주', '문경', '경산', '군위', '의성'] },
  { name: '경남', cities: ['창원', '진주', '통영', '사천', '김해', '밀양', '거제', '양산', '의령', '함안', '창녕', '고성', '하동'] },
  { name: '제주', cities: ['제주시', '서귀포시'] },
]

const BLOG_IMG = [
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1601134467661-3d775b999c18?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1532592068623-db1978e40df5?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1535424781509-66b572984e46?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1643122966676-29e8597257f7?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop&auto=format',
]
function bi(i: number) { return BLOG_IMG[i % BLOG_IMG.length] }

const BLOG_POSTS = [
  { cat: '수원', title: '수원 출장스웨디시: 하이엔드 비즈니스 리더를 위한 프라이빗 홈케어', desc: '비즈니스 라운딩 후 누적된 근막 피로를 이동 없이 회복하는 방법. 스웨디시 테라피가 림프를 지배하여 뇌를 쉬게 하는 원리를 알아봅니다.', date: '2026.05.12', read: '5분', img: bi(0), slug: 'suwon-premium-swedish-massage' },
  { cat: '수원', title: '스타필드·행궁동 데이트 후 완벽한 커플 홈스파', desc: '수원의 핫플레이스를 즐긴 후 자택이나 호텔에서 받는 커플 마사지로 하루를 완벽하게 마무리하는 방법을 안내합니다.', date: '2026.04.28', read: '4분', img: bi(1), slug: 'suwon-date-course-massage' },
  { cat: '수원', title: '수원 출장마사지: 광교·영통·인계동 30분 내 24시 방문 홈케어', desc: '광교신도시, 영통, 인계동 전 지역 30분 이내 배정. 심야·새벽에도 동일한 퀄리티로 방문하는 24시 홈케어 서비스를 안내합니다.', date: '2026.04.10', read: '4분', img: bi(2), slug: 'suwon-premium-home-massage' },
  { cat: '강릉', title: '강릉 출장안마: 경포대 호텔 & 펜션으로 찾아가는 오션뷰 힐링', desc: '강릉 경포대 호텔과 펜션에서 오션뷰를 바라보며 받는 프리미엄 출장 마사지. 여행 피로를 완벽하게 회복하는 방법을 소개합니다.', date: '2026.03.22', read: '5분', img: bi(3), slug: 'gangneung-ocean-view-massage-service' },
  { cat: '강릉', title: '강릉 출장마사지: 경포대 호텔 & 펜션으로 찾아가는 오션뷰 힐링', desc: '강릉 여행 중 호텔·펜션에서 바로 받는 출장 마사지. 이동 없이 오션뷰 힐링을 완성하는 방법을 상세히 안내합니다.', date: '2026.03.15', read: '4분', img: bi(4), slug: 'gangneung-ocean-view-home-massage' },
  { cat: '서울', title: '서울 출장마사지: 강남, 호텔, 자택 어디든 30분 컷 홈케어', desc: '서울 전 25개 구 30분 이내 배정. 강남·여의도·홍대·성수 지역별 맞춤 솔루션과 24시간 즉시 배정 시스템을 소개합니다.', date: '2026.03.05', read: '5분', img: bi(5), slug: 'seoul-premium-home-massage' },
  { cat: '김포·경기', title: '김포 출장마사지: 골드라인 & 공항 피로를 푸는 24시 홈케어', desc: '김포 골드라인 이용객과 공항 출도착객을 위한 빠른 배정 시스템. 이동 직후 즉시 케어가 가능합니다.', date: '2026.02.28', read: '4분', img: bi(6), slug: 'gimpo-goldline-airport-massage' },
  { cat: '지역 가이드', title: '김천 출장마사지: 혁신도시 & KTX 출장객을 위한 24시 홈케어', desc: '김천 혁신도시 비즈니스 출장객과 KTX 이용객을 위한 전문 홈케어 서비스 안내입니다.', date: '2026.02.20', read: '4분', img: bi(7), slug: 'gimcheon-innovation-city-business-massage' },
  { cat: '지역 가이드', title: '춘천 출장마사지: 라이딩 & 글램핑 후 펜션에서 즐기는 힐링', desc: '춘천 자전거 라이딩과 글램핑 후 펜션에서 받는 힐링 마사지. 여행 피로를 완벽히 해소하는 방법입니다.', date: '2026.02.14', read: '4분', img: bi(8), slug: 'chuncheon-business-trip-massage-camping' },
  { cat: '이용 가이드', title: '출장안마: 뇌과학이 밝힌 방문 홈케어의 놀라운 회복 효과', desc: '이동 없이 받는 홈케어가 왜 더 효과적인지 뇌과학 관점에서 분석합니다. 코르티솔 감소와 부교감 신경 활성화의 원리를 알아보세요.', date: '2026.02.10', read: '6분', img: bi(9), slug: 'science-of-home-massage-therapy' },
  { cat: '이용 가이드', title: '출장마사지 예약: 내 주변 24시간 안전한 홈케어 힐링', desc: '안전하게 첫 출장마사지를 예약하는 방법부터 이용 팁까지. 처음 이용하시는 분들을 위한 완벽 가이드입니다.', date: '2026.02.05', read: '5분', img: bi(0), slug: 'business-trip-massage-booking-guide' },
  { cat: '이용 가이드', title: '출장마사지: 집과 호텔에서 즐기는 상위 1% 프리미엄 홈케어', desc: '일반 마사지샵과 다른 프리미엄 홈케어의 차이점. 상위 1% 서비스 퀄리티를 자택·호텔에서 경험하는 방법입니다.', date: '2026.01.30', read: '5분', img: bi(1), slug: 'premium-business-trip-massage-guide' },
  { cat: '제주·서귀포', title: '서귀포출장마사지: 가족 여행 육아 피로 & 비 오는 날 힐링 팁', desc: '서귀포 가족 여행 중 육아 피로를 빠르게 해소하는 방법. 비 오는 날 실내에서 즐기는 힐링 마사지 가이드입니다.', date: '2026.01.25', read: '4분', img: bi(2), slug: 'seogwipo-massage-family-travel-rainy-day' },
  { cat: '제주·서귀포', title: '서귀포출장홈타이: 한라산 등반 후 가성비 최고의 스트레칭 힐링', desc: '한라산 등반으로 지친 근육을 홈타이 스트레칭으로 회복하는 방법. 서귀포 전 숙소 방문 가능합니다.', date: '2026.01.20', read: '4분', img: bi(3), slug: 'seogwipo-home-thai-massage-stretching' },
  { cat: '제주·서귀포', title: '서귀포출장스웨디시: 중문 호캉스 & 커플 여행 감성 힐링 가이드', desc: '중문 호캉스를 더욱 특별하게 만들어주는 커플 스웨디시 마사지. 서귀포 최고급 호텔 전담 배정 서비스입니다.', date: '2026.01.15', read: '5분', img: bi(4), slug: 'seogwipo-swedish-massage-healing' },
  { cat: '제주·서귀포', title: '서귀포출장안마: 골프 라운딩 & 운전 피로 푸는 5성급 홈케어', desc: '골프 라운딩 후 쌓인 편측 근육 피로와 장거리 운전 피로를 5성급 수준의 홈케어로 해소합니다.', date: '2026.01.10', read: '4분', img: bi(5), slug: 'seogwipo-anma-golf-driving-recovery' },
  { cat: '제주·서귀포', title: '서귀포출장마사지: 중문 호캉스 & 올레길 7코스 피로 회복 가이드', desc: '올레길 7코스 완주 후 붓기와 근육통을 즉시 케어받는 방법. 중문 일대 전 숙소 30분 내 배정입니다.', date: '2025.12.30', read: '4분', img: bi(6), slug: 'seogwipo-massage-jungmun-olle' },
  { cat: '제주', title: '제주도출장마사지: 한라산 등반 & 올레길 트레킹 피로 회복 가이드', desc: '제주 여행 필수 코스인 한라산·올레길 후 피로 회복을 위한 출장 마사지 완벽 가이드입니다.', date: '2025.12.25', read: '5분', img: bi(7), slug: 'jeju-massage-hiking-recovery' },
  { cat: '광주·전남', title: '광주출장마사지: 무등산 등산 & 상무지구 비즈니스 피로 회복', desc: '무등산 등반 후 하체 피로와 상무지구 비즈니스 출장 피로를 동시에 해소하는 맞춤 케어 안내입니다.', date: '2025.12.20', read: '4분', img: bi(8), slug: 'gwangju-massage-hiking-business' },
  { cat: '광주·전남', title: '목포출장마사지: 유달산 산행 & 케이블카 여행 피로 싹 푸는 법', desc: '목포 유달산 산행과 케이블카 체험 후 쌓인 피로를 호텔·자택에서 바로 해소하는 방법입니다.', date: '2025.12.15', read: '4분', img: bi(9), slug: 'mokpo-massage-hiking-recovery' },
  { cat: '전북', title: '군산출장마사지: 맛집 웨이팅 & 뚜벅이 여행 피로 싹 푸는 법', desc: '군산 맛집 투어와 도보 여행 후 붓기를 빠르게 빼는 림프 마사지. 군산 전 숙소 방문 가능합니다.', date: '2025.12.10', read: '4분', img: bi(0), slug: 'gunsan-massage-travel-fatigue' },
  { cat: '전남', title: '여수출장마사지: 밤바다 산책 & 낭만포차 후 붓기 빼는 꿀팁', desc: '여수 밤바다 산책과 낭만포차 투어 후 하체 붓기를 즉시 케어받는 방법. 여수 호텔·펜션 전 구역 배정합니다.', date: '2025.12.05', read: '4분', img: bi(1), slug: 'yeosu-massage-night-sea-healing' },
  { cat: '강원', title: '속초출장마사지: 설악산 등산 & 먹방 후 붓기 싹 빼는 법', desc: '설악산 등반과 속초 먹방 투어 후 하체 붓기와 근육통을 빠르게 케어받는 방법을 안내합니다.', date: '2025.12.01', read: '4분', img: bi(2), slug: 'sokcho-massage-hiking-recovery' },
  { cat: '강릉', title: '강릉출장마사지: 겨울철 근육통 녹이는 마사지 루틴 & 관리 팁', desc: '겨울철 강릉 여행에서 쌓인 근육 경직을 해소하는 스페셜 마사지 루틴. 추운 날씨에 더 효과적인 케어 팁을 소개합니다.', date: '2025.11.25', read: '5분', img: bi(3), slug: 'gangneung-massage-winter-tips' },
  { cat: '충남', title: '당진 출장마사지 | 야간 회복 루틴으로 컨디션 관리하는 방법', desc: '당진 야간 근무 후 효과적인 회복 루틴. 수면 품질을 높이는 아로마 마사지 코스를 추천합니다.', date: '2025.11.20', read: '3분', img: bi(4), slug: 'dangjin-outcall-massage-night-routine' },
  { cat: '전남', title: '순천 출장마사지 | 밤에도 깔끔하게 리셋되는 홈타이 루틴', desc: '순천 야간에도 신속 배정. 홈타이 스트레칭으로 하루를 깔끔하게 리셋하는 방법을 안내합니다.', date: '2025.11.15', read: '3분', img: bi(5), slug: 'suncheon-massage-blog-24h-reset' },
  { cat: '강원', title: '동해 출장마사지', desc: '동해 바다 여행 후 피로 회복을 위한 출장 마사지. 동해 전 숙소 방문하여 완벽한 힐링을 제공합니다.', date: '2025.11.10', read: '3분', img: bi(6), slug: 'donghae-outcall-massage-night-routine' },
  { cat: '지역 가이드', title: '안동 출장마사지', desc: '안동 하회마을 관광 후 피로 회복을 위한 출장 마사지. 전통 도시에서 즐기는 현대적 홈케어 서비스입니다.', date: '2025.11.05', read: '3분', img: bi(7), slug: 'andong-outcall-massage-recovery-guide' },
  { cat: '충북', title: '충주 출장마사지 — 장거리 이동·야근 후 회복 루틴', desc: '충주 장거리 이동과 야근 후 빠른 회복을 위한 마사지 루틴. 충주 전 지역 30분 내 배정합니다.', date: '2025.11.01', read: '3분', img: bi(8), slug: 'chungju-outcall-massage-recovery-routine' },
  { cat: '전북', title: '군산 출장마사지', desc: '군산 근대 역사 도시 여행 피로를 빠르게 해소하는 홈케어. 자택·호텔·게스트하우스 전 구역 방문합니다.', date: '2025.10.28', read: '3분', img: bi(9), slug: 'gunsan-massage-tips' },
  { cat: '서울', title: '서울 출장마사지 | 강남·서초 야근 후 회복 루틴과 릴랙스 관리', desc: '강남·서초 야근 직장인을 위한 맞춤 회복 루틴. 퇴근 후 30분 이내 배정으로 빠르게 릴랙스합니다.', date: '2025.10.20', read: '4분', img: bi(0), slug: 'seoul-night-recovery-routine-massage' },
  { cat: '이용 가이드', title: '전국 어디서나 즐기는 24시간 출장마사지 이용 팁', desc: '전국 어느 지역에서든 안전하고 편리하게 출장마사지를 이용하는 핵심 팁을 총정리했습니다.', date: '2025.10.15', read: '5분', img: bi(1), slug: 'nationwide-24h-massage-tips' },
  { cat: '이용 가이드', title: '스웨디시 vs 아로마, 어떤 코스가 나에게 맞을까?', desc: '스웨디시와 아로마 마사지의 효과와 차이점을 비교 분석. 나에게 맞는 코스를 선택하는 방법을 안내합니다.', date: '2025.10.10', read: '5분', img: bi(2), slug: 'swedish-vs-aromamassage' },
  { cat: '이용 가이드', title: '처음 이용하시는 분들을 위한 출장마사지 가이드', desc: '출장마사지 첫 이용자를 위한 A to Z 가이드. 예약 방법부터 당일 절차, 팁까지 모두 담았습니다.', date: '2025.10.05', read: '6분', img: bi(3), slug: 'first-time-massage-guide' },
  { cat: '서울 강동', title: '둔촌·고덕 출장마사지 — 신도시 생활 하체 림프 & 균형 루틴', desc: '둔촌·고덕 신도시 생활에서 쌓이는 하체 피로를 림프 드레나쥐로 해소하는 맞춤 루틴입니다.', date: '2025.09.28', read: '3분', img: bi(4), slug: 'dunchon-godeok-lower-body-balance' },
  { cat: '서울 강동', title: '암사·광나루 출장안마 — 한강 러닝 후 종아리 펌핑 & 족저 케어', desc: '한강 러닝 후 펌핑된 종아리와 족저근막을 전문적으로 케어받는 방법을 안내합니다.', date: '2025.09.22', read: '3분', img: bi(5), slug: 'amsa-gwangnaru-calf-pumping' },
  { cat: '서울 강동', title: '천호·길동 출장마사지 — 장시간 좌식 뒤 흉곽 열기 & 경추 릴리즈', desc: '장시간 좌식 근무 후 닫힌 흉곽과 굳은 경추를 전문 테라피스트가 릴리즈해드립니다.', date: '2025.09.15', read: '3분', img: bi(6), slug: 'cheonho-gildong-thoracic-release' },
  { cat: '서울 서초', title: '방배·양재 출장마사지 — 언덕 많은 동네 하체 림프 & 균형 루틴', desc: '방배·양재 언덕길 보행으로 누적된 하체 피로를 림프 마사지와 균형 루틴으로 해소합니다.', date: '2025.09.10', read: '3분', img: bi(7), slug: 'bangbae-yangjae-lower-limb-balance' },
  { cat: '서울 서초', title: '반포·잠원 출장안마 — 한강 러닝 후 종아리 펌핑 & 족저 케어', desc: '반포 한강공원 러닝 후 펌핑된 종아리와 족저근막을 즉시 케어받는 방법입니다.', date: '2025.09.05', read: '3분', img: bi(8), slug: 'banpo-jamwon-running-recovery' },
  { cat: '서울 서초', title: '교대·서초 출장마사지 — 장시간 좌식 뒤 흉곽 열기 & 경추 릴리즈', desc: '법조·비즈니스 특구 교대·서초 직장인을 위한 좌식 피로 전문 케어 루틴입니다.', date: '2025.09.01', read: '3분', img: bi(9), slug: 'seochogyo-thoracic-release' },
  { cat: '서울 관악', title: '낙성대 출장마사지 — 관악산 하이킹 뒤 종아리 펌핑 & 족저 케어', desc: '관악산 하이킹 후 쌓인 종아리 피로와 족저근막 통증을 전문 케어로 빠르게 해소합니다.', date: '2025.08.25', read: '3분', img: bi(0), slug: 'nakseongdae-calf-care' },
  { cat: '서울 관악', title: '봉천 출장안마 — 계단 많은 동네, 무릎·발목 안정화 루틴', desc: '봉천동 계단길 보행으로 누적된 무릎·발목 피로를 안정화 루틴으로 케어받는 방법입니다.', date: '2025.08.20', read: '3분', img: bi(1), slug: 'bongcheon-joint-balance' },
  { cat: '서울 관악', title: '신림 출장마사지 — 2호선 장거리 통근 후 허리·골반 리셋', desc: '신림 2호선 장거리 통근으로 굳은 허리와 골반을 전문 테라피스트가 리셋해드립니다.', date: '2025.08.15', read: '3분', img: bi(2), slug: 'sillim-pelvic-reset' },
  { cat: '서울 동작', title: '상도 출장마사지 — 늦은 귀가 후 릴랙스 아로마 루틴', desc: '상도동 늦은 귀가 후 아로마 오일로 긴장을 풀고 숙면을 유도하는 야간 릴랙스 루틴입니다.', date: '2025.08.10', read: '3분', img: bi(3), slug: 'sangdo-relax-aroma' },
  { cat: '서울 동작', title: '흑석 출장안마 — 캠퍼스 이동 많은 날 종아리 릴리스', desc: '중앙대 캠퍼스 이동으로 누적된 종아리 피로를 빠르게 릴리스하는 전문 케어입니다.', date: '2025.08.05', read: '3분', img: bi(4), slug: 'heukseok-calf-release' },
  { cat: '서울 동작', title: '노량진 출장마사지 — 장시간 공부 뒤 어깨 긴장 완화 루틴', desc: '노량진 수험생·직장인을 위한 어깨·목 긴장 완화 전문 케어. 집중력 회복을 위한 릴랙스 루틴입니다.', date: '2025.08.01', read: '3분', img: bi(5), slug: 'noryangjin-shoulder-relax' },
  { cat: '서울 영등포', title: '당산 출장마사지 — 야간 스케줄 다운시프트', desc: '당산 야간 스케줄 후 몸과 마음을 다운시프트하는 전문 마사지. 숙면 유도에 특화된 코스입니다.', date: '2025.07.25', read: '3분', img: bi(6), slug: 'dangsan-night-recovery' },
  { cat: '서울 영등포', title: '문래 출장안마 — 보행 많은 날 하체 가볍게', desc: '문래동 보행이 많은 날 하체를 가볍게 만들어주는 림프 드레나쥐 케어입니다.', date: '2025.07.20', read: '3분', img: bi(7), slug: 'mullaewalk-recovery' },
  { cat: '서울 영등포', title: '여의도 출장마사지 — 퇴근 후 7분 상체 리셋', desc: '여의도 금융·증권 직장인을 위한 퇴근 후 7분 상체 리셋 루틴. IFC·파크원 호텔 전담 배정입니다.', date: '2025.07.15', read: '3분', img: bi(8), slug: 'yeouido-upper-body-reset' },
  { cat: '서울 금천', title: '시흥동 출장마사지 — 야간 스케줄 다운시프트', desc: '시흥동 야간 근무 후 몸을 이완시키는 다운시프트 마사지. 심야 배정도 신속하게 진행됩니다.', date: '2025.07.10', read: '3분', img: bi(9), slug: 'siheung-downshift' },
  { cat: '서울 금천', title: '독산 출장안마 — 보행 많은 날 하체 가볍게', desc: '독산동 보행이 많은 날 하체 림프를 가볍게 만들어주는 전문 케어 서비스입니다.', date: '2025.07.05', read: '3분', img: bi(0), slug: 'doksan-light' },
  { cat: '서울 금천', title: '가산 출장마사지 — 7분 상체 리셋 & 60분 릴랙스', desc: '가산 디지털단지 IT 직장인을 위한 7분 상체 리셋과 60분 딥 릴랙스 패키지 케어입니다.', date: '2025.07.01', read: '3분', img: bi(1), slug: 'gasan-reset' },
  { cat: '서울 구로', title: '고척 출장마사지 — 행사 밤 스케줄 다운시프트', desc: '고척스카이돔 행사 후 야간 피로를 다운시프트하는 전문 마사지. 신속 배정으로 빠른 회복을 도와드립니다.', date: '2025.06.25', read: '3분', img: bi(2), slug: 'gocheok-downshift' },
  { cat: '서울 구로', title: '신도림 출장안마 — 환승 뒤 하체 가볍게', desc: '신도림역 환승 피로로 누적된 하체 부담을 가볍게 만들어주는 림프 케어입니다.', date: '2025.06.20', read: '3분', img: bi(3), slug: 'shindorim-light' },
  { cat: '서울 구로', title: '구디 출장마사지 — 장시간 근무 뒤 7분 상체 리셋', desc: '구로디지털단지 장시간 근무 후 굳은 상체를 7분 안에 리셋하는 집중 케어입니다.', date: '2025.06.15', read: '3분', img: bi(4), slug: 'gudi-reset' },
  { cat: '서울 강서', title: '염창 출장마사지 — 야간 스케줄 다운시프트', desc: '염창동 야간 이후 몸과 마음을 이완하는 다운시프트 마사지. 심야 즉시 배정이 가능합니다.', date: '2025.06.10', read: '3분', img: bi(5), slug: 'yeomchang-massage' },
  { cat: '서울 강서', title: '발산 출장안마 — 보행 많은 날 하체 가볍게', desc: '발산동 보행이 많은 날 하체를 가볍게 만들어주는 림프 마사지. 전문 테라피스트가 방문합니다.', date: '2025.06.05', read: '3분', img: bi(6), slug: 'balsan-massage' },
  { cat: '서울 강서', title: '마곡 출장마사지 — 7분 상체 리셋 & 60분 릴랙스', desc: '마곡 LG·이케아·코오롱 등 대형 단지 직장인을 위한 맞춤 상체 리셋 & 릴랙스 케어입니다.', date: '2025.06.01', read: '3분', img: bi(7), slug: 'magok-anma' },
  { cat: '서울 강서', title: '신월 출장마사지 — 야간 스케줄 다운시프트', desc: '신월동 야간 근무자를 위한 다운시프트 마사지. 피로를 빠르게 해소하고 숙면을 유도합니다.', date: '2025.05.25', read: '3분', img: bi(8), slug: 'sinwol-massage' },
  { cat: '서울 강서', title: '신정 출장안마 — 보행 많은 날 릴리즈 포인트', desc: '신정동 보행 후 쌓인 릴리즈 포인트를 정확하게 케어하는 전문 서비스입니다.', date: '2025.05.20', read: '3분', img: bi(9), slug: 'sinjeong-massage' },
  { cat: '서울 양천', title: '목동 출장마사지 — 러닝 후 하체 가볍게', desc: '목동 러닝 후 누적된 하체 피로를 가볍게 만들어주는 림프 마사지. 목동 전 지역 배정합니다.', date: '2025.05.15', read: '3분', img: bi(0), slug: 'mokdong-anma' },
  { cat: '서울 서대문', title: '홍제 출장마사지 — 야간 스케줄 다운시프트', desc: '홍제동 야간 이후 몸을 이완하는 다운시프트 마사지. 심야 배정도 빠르게 진행됩니다.', date: '2025.05.10', read: '3분', img: bi(1), slug: 'hongje-massage' },
  { cat: '서울 서대문', title: '연희 출장안마 — 보행 많은 날 하체 가볍게', desc: '연희동 카페골목 보행으로 쌓인 하체 피로를 빠르게 해소하는 림프 드레나쥐입니다.', date: '2025.05.05', read: '3분', img: bi(2), slug: 'yeonhui-massage' },
  { cat: '서울 서대문', title: '신촌 출장마사지 — 7분 상체 리셋 & 60분 릴랙스', desc: '신촌 대학가 주변 직장인·학생을 위한 7분 상체 리셋과 60분 릴랙스 패키지입니다.', date: '2025.05.01', read: '3분', img: bi(3), slug: 'shinchon-anma' },
  { cat: '서울 은평', title: '연신내 출장마사지 — 야간 스케줄 다운시프트', desc: '연신내 야간 스케줄 후 빠른 회복을 위한 다운시프트 마사지. 은평구 전 지역 방문합니다.', date: '2025.04.25', read: '3분', img: bi(4), slug: 'yeonsinnae-massage' },
  { cat: '서울 은평', title: '응암 출장안마 — 보행 많은 날 릴리즈 포인트', desc: '응암동 보행이 많은 날 릴리즈 포인트를 정확하게 케어하는 전문 출장 마사지입니다.', date: '2025.04.20', read: '3분', img: bi(5), slug: 'eungam-massage' },
  { cat: '서울 은평', title: '불광 출장마사지 — 러닝 후 하체 가볍게', desc: '불광동 러닝 후 하체를 가볍게 만들어주는 림프 마사지. 북한산 인근 숙소도 방문 가능합니다.', date: '2025.04.15', read: '3분', img: bi(6), slug: 'bulgwang-massage' },
  { cat: '서울 도봉', title: '쌍문동 출장마사지 — 야간 스케줄 다운시프트', desc: '쌍문동 야간 스케줄 후 몸을 다운시프트하는 전문 마사지. 도봉구 전 지역 배정합니다.', date: '2025.04.10', read: '3분', img: bi(7), slug: 'ssangmun-massage' },
  { cat: '서울 도봉', title: '방학동 출장안마 — 보행/등산 다음 날 하체 가볍게', desc: '방학동 도봉산 등산 다음 날 하체 피로를 가볍게 만들어주는 림프 & 스트레칭 케어입니다.', date: '2025.04.05', read: '3분', img: bi(8), slug: 'banghakdong-massage' },
  { cat: '서울 도봉', title: '창동 출장마사지 — 환승일 7분 리셋 루틴', desc: '창동 환승 피로를 7분 안에 리셋하는 집중 케어. 도봉·노원 전 지역 30분 내 배정합니다.', date: '2025.04.01', read: '3분', img: bi(9), slug: 'changdong-massage' },
  { cat: '서울 도봉', title: '번동 출장마사지 — 무향 오일로 과각성 완화', desc: '번동 과각성 상태를 무향 오일로 부드럽게 완화하는 아로마테라피 케어입니다.', date: '2025.03.25', read: '3분', img: bi(0), slug: 'beondong-massage' },
  { cat: '서울 강북', title: '수유 출장안마 — 시장·보행 많은 날 림프 드레인', desc: '수유 전통시장 보행 후 하체 림프를 빠르게 드레인하는 전문 케어입니다.', date: '2025.03.20', read: '3분', img: bi(1), slug: 'suyu-massage' },
  { cat: '서울 성동', title: '건대입구 출장마사지 — 집중 근무 후 어깨 릴리스 케어', desc: '건대입구 집중 근무 후 굳은 어깨를 전문적으로 릴리스하는 케어. 성동구 전 지역 배정합니다.', date: '2025.03.15', read: '3분', img: bi(2), slug: 'konkuk-massage-kara' },
  { cat: '서울 성동', title: '서울숲 — 보행 다음 날 회복 루틴', desc: '서울숲 산책과 보행 다음 날 하체를 완벽하게 회복하는 림프 마사지 루틴입니다.', date: '2025.03.10', read: '3분', img: bi(3), slug: 'seoulsup-massage' },
  { cat: '서울 성동', title: '성수동 출장안마 — 야간 이동 후 릴랙스 케어', desc: '성수동 야간 이동 후 몸을 빠르게 이완하는 릴랙스 케어. 성수 핫플 숙소 전 구역 방문합니다.', date: '2025.03.05', read: '3분', img: bi(4), slug: 'seongsu-anma' },
  { cat: '서울 성동', title: '왕십리 출장마사지 — 출퇴근 피로 해소 루틴', desc: '왕십리 출퇴근 피로를 해소하는 전문 루틴. 왕십리 역세권 전 숙소 방문 가능합니다.', date: '2025.03.01', read: '3분', img: bi(5), slug: 'wangsimni-massage' },
  { cat: '서울 중구', title: '명동 출장마사지 — 보행 다음 날 회복 루틴', desc: '명동 쇼핑 후 하체 피로와 발 붓기를 빠르게 회복하는 전문 마사지 루틴입니다.', date: '2025.02.25', read: '3분', img: bi(6), slug: 'myeongdong-massage' },
  { cat: '서울 중구', title: '을지로 출장안마 — 야간 이동 후 릴랙스 케어', desc: '을지로 야간 이동 후 피로를 빠르게 릴랙스하는 케어. 을지로 호텔·오피스텔 전 구역 방문합니다.', date: '2025.02.20', read: '3분', img: bi(7), slug: 'euljiro-massage' },
  { cat: '경북', title: '점촌 출장마사지 — 퇴근 후 15분 리셋 스트레칭', desc: '점촌 퇴근 후 15분 안에 몸을 리셋하는 스트레칭 마사지. 문경 전 지역 방문합니다.', date: '2025.02.15', read: '3분', img: bi(8), slug: 'jeomchon-massage' },
  { cat: '경북', title: '함창 출장마사지 — 도보/라이딩 후 하체 회복 루틴', desc: '함창 도보와 라이딩 후 하체를 완벽하게 회복하는 림프 마사지 루틴입니다.', date: '2025.02.10', read: '3분', img: bi(9), slug: 'hamchang-massage' },
  { cat: '경북', title: '금호 출장마사지 — 트레킹/도보 후 하체 회복 루틴', desc: '금호 트레킹과 도보 후 하체를 가볍게 만들어주는 림프 & 스트레칭 케어입니다.', date: '2025.02.05', read: '3분', img: bi(0), slug: 'geumho-massage' },
  { cat: '경기', title: '여주역 출장마사지 — 환승일 15분 리셋 루틴', desc: '여주역 환승 피로를 15분 안에 리셋하는 집중 케어. 여주 전 지역 30분 내 배정합니다.', date: '2025.02.01', read: '3분', img: bi(1), slug: 'yeoju-station-relax-guide' },
  { cat: '경기', title: '생연/송내 출장안마 회복 체크리스트 — 운전/외근 다음 날 가벼움', desc: '부천 생연·송내 운전과 외근 다음 날 몸을 가볍게 만드는 회복 체크리스트와 케어 루틴입니다.', date: '2025.01.25', read: '3분', img: bi(2), slug: 'saengyeon-songnae-massage-recovery' },
  { cat: '경남', title: '마산항 일정 후 근막 케어 — 창원', desc: '창원 마산항 일정 후 쌓인 근막 피로를 전문적으로 케어하는 출장 마사지 서비스입니다.', date: '2025.01.20', read: '3분', img: bi(3), slug: 'changwon-masan-port-fascia-care' },
  { cat: '경남', title: '용지호수 산책 후 하체 회복 — 창원', desc: '창원 용지호수 산책 후 하체를 빠르게 회복하는 림프 드레나쥐 케어 루틴입니다.', date: '2025.01.15', read: '3분', img: bi(4), slug: 'changwon-yongji-lake-recovery' },
  { cat: '경남', title: '창원산단 교대 다음 날 리셋 루틴', desc: '창원 산업단지 교대 근무 다음 날 몸을 완벽하게 리셋하는 전문 마사지 루틴입니다.', date: '2025.01.10', read: '3분', img: bi(5), slug: 'changwon-sandan-shift-reset' },
  { cat: '경북', title: '금오산 산책·등반 근막 케어 — 구미', desc: '구미 금오산 산책과 등반 후 근막 피로를 전문적으로 케어하는 출장 마사지입니다.', date: '2025.01.05', read: '3분', img: bi(6), slug: 'gumi-geumo-fascia-care' },
  { cat: '경북', title: '낙동강 수변 러닝 후 회복 — 구미', desc: '구미 낙동강 수변 러닝 후 하체를 빠르게 회복하는 림프 마사지 루틴입니다.', date: '2025.01.01', read: '3분', img: bi(7), slug: 'gumi-nakdong-river-recovery' },
  { cat: '세종', title: '청사 데스크 워커 15분 리셋', desc: '세종 정부청사 데스크 워커를 위한 15분 집중 리셋 루틴. 어깨·목·허리를 빠르게 케어합니다.', date: '2024.12.25', read: '3분', img: bi(8), slug: 'sejong-office-deskworker-15min-reset' },
  { cat: '울산', title: '울산대공원 걷기 후 하체 회복', desc: '울산대공원 걷기 후 하체를 가볍게 만들어주는 림프 마사지. 울산 전 지역 30분 내 배정합니다.', date: '2024.12.20', read: '3분', img: bi(9), slug: 'ulsandaegongwon-walking-leg-recovery' },
  { cat: '울산', title: '삼산 상권 근무자 15분 리셋 — 울산', desc: '울산 삼산 상권 근무자를 위한 15분 리셋 루틴. 퇴근 후 빠른 회복을 도와드립니다.', date: '2024.12.15', read: '3분', img: bi(0), slug: 'samsan-business-15min-reset-ulsan-namgu' },
  { cat: '울산', title: '태화강 러닝 후 하체 회복 — 울산', desc: '울산 태화강 러닝 후 하체를 완벽하게 회복하는 림프 드레나쥐 케어입니다.', date: '2024.12.10', read: '3분', img: bi(1), slug: 'taehwagang-running-leg-recovery' },
  { cat: '경기', title: '광교 출퇴근 루틴 — 15분 경흉부 스트레칭 + 45분 릴랙스', desc: '광교 출퇴근 직장인을 위한 15분 경흉부 스트레칭과 45분 딥 릴랙스 패키지 케어입니다.', date: '2024.12.05', read: '3분', img: bi(2), slug: 'gwanggyo-commute-routine' },
  { cat: '서울 노원', title: '불암산 새벽 산책 후 — 10분 하체 스트레칭 + 40분 림프 드레이닝', desc: '불암산 새벽 산책 후 하체를 10분 스트레칭과 40분 림프 드레이닝으로 완벽하게 회복합니다.', date: '2024.12.01', read: '3분', img: bi(3), slug: 'buramsan-morning-lymph-recovery' },
  { cat: '서울 노원', title: '공릉 출퇴근 루틴 — 8분 경흉부 폼릴리즈 + 35분 스웨디시', desc: '공릉동 출퇴근 피로를 8분 폼릴리즈와 35분 스웨디시로 해소하는 맞춤 케어입니다.', date: '2024.11.25', read: '3분', img: bi(4), slug: 'gongneung-commute-routine' },
  { cat: '서울 용산', title: '이촌 한강 러닝 후 회복 체크리스트', desc: '이촌 한강 러닝 후 완벽한 회복을 위한 체크리스트와 전문 마사지 케어 루틴입니다.', date: '2024.11.20', read: '3분', img: bi(5), slug: 'ichon-hangang-running-recovery' },
  { cat: '서울 용산', title: '이태원 주말 예약 타이밍 — 교통·주차·보안 출입', desc: '이태원 주말 예약 시 최적의 타이밍과 교통·주차·보안 출입 노하우를 안내합니다.', date: '2024.11.15', read: '3분', img: bi(6), slug: 'itaewon-weekend-reservation' },
  { cat: '이용 가이드', title: '스웨디시 vs 스포츠 마사지', desc: '스웨디시와 스포츠 마사지의 차이점과 효과를 상세히 비교. 나에게 맞는 코스를 선택하는 가이드입니다.', date: '2024.11.10', read: '5분', img: bi(7), slug: 'swedish-vs-sports-massage' },
  { cat: '서울', title: '서울 24시간 출장마사지', desc: '서울 전 지역 24시간 즉시 배정. 새벽·심야에도 동일한 퀄리티의 프리미엄 출장 마사지 서비스입니다.', date: '2024.11.05', read: '4분', img: bi(8), slug: 'seoul-24h-massage-night-tips' },
  { cat: '서울', title: '서울 출장마사지 효과&추천 코스', desc: '서울 출장마사지의 효과와 추천 코스를 총정리. 상황별 최적 코스 선택 방법을 안내합니다.', date: '2024.11.01', read: '5분', img: bi(9), slug: 'seoul-massage-benefits-guide' },
  { cat: '이용 가이드', title: '서울출장마사지 첫 이용 가이드', desc: '서울 출장마사지 처음 이용하시는 분들을 위한 완벽 가이드. 예약부터 이용 후기까지 모두 담았습니다.', date: '2024.10.25', read: '6분', img: bi(0), slug: 'seoul-first-time-home-thai-checklist' },
]

function Stars({ count }: { count: number }) {
  return <span className="text-rose-400">{'★'.repeat(count)}</span>
}

const REGION_TABS = [
  {
    label: '강남 · 여의도 · 광화문',
    areas: ['강남구', '서초구', '송파구', '영등포구', '종로구', '중구'],
    desc: '대한민국 비즈니스 핵심 권역. 특급 호텔 및 고급 오피스텔 밀집 지역으로 평균 배정 20~30분.',
    points: ['강남역 반경 3km 즉시 배정', '여의도 IFC·파크원 호텔 전담 동선', '광화문·시청 비즈니스 투숙객 우선 배정'],
  },
  {
    label: '홍대 · 성수 · 잠실',
    areas: ['마포구', '성동구', '광진구', '송파구', '강동구'],
    desc: '트렌디한 문화·상업 복합 권역. 레지던스 호텔 및 게스트하우스 이용 고객 다수.',
    points: ['홍대·합정 레지던스 프라이빗 입실', '성수 하이엔드 오피스텔 특화 동선', '잠실 롯데호텔·시그니엘 전담 배정'],
  },
  {
    label: '서울역 · 용산역 · 공항',
    areas: ['용산구', '중구', '강서구', '은평구'],
    desc: 'KTX 역세권 및 공항 인근 권역. 이동 직후 즉시 케어가 필요한 출장 고객에 최적화.',
    points: ['서울역·용산역 도보 5분 반경 배정', '김포공항 인근 호텔 당일 예약', 'KTX 이동 직후 즉시 케어 가능'],
  },
]

function seededRandom(seed: number) {
  let x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function getTherapistsForCity(cityName: string): typeof THERAPISTS {
  const today = new Date()
  const dateKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  let hash = dateKey
  for (let i = 0; i < cityName.length; i++) hash = hash * 31 + cityName.charCodeAt(i)

  const indices = Array.from({ length: THERAPISTS.length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(hash + i) * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices.slice(0, 6).map(i => THERAPISTS[i])
}

function CityModal({ city, therapists, onClose }: {
  city: string
  therapists: typeof THERAPISTS
  onClose: () => void
}) {
  const [zoomedImg, setZoomedImg] = useState<{ src: string; name: string } | null>(null)

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(30,10,20,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <div
          className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden"
          style={{ background: 'white', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #fce8ef' }}>
            <div>
              <div className="text-xs tracking-widest mb-0.5" style={{ color: '#c0406a' }}>상담 가능 테라피스트</div>
              <h3 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: '1.4rem', color: '#3a1828', fontWeight: 400 }}>
                {city} 배정 가능
              </h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-lg"
              style={{ background: '#fff0f4', color: '#c0406a' }}>×</button>
          </div>

          {/* 테라피스트 4명 */}
          <div className="p-5 grid grid-cols-2 gap-3">
            {therapists.map(t => (
              <div key={t.name} className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
                <div
                  className="relative cursor-zoom-in"
                  style={{ paddingTop: '120%' }}
                  onClick={() => setZoomedImg({ src: t.img, name: t.name })}
                >
                  <img src={t.img} alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  {/* 확대 힌트 */}
                  <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full opacity-80"
                    style={{ background: 'rgba(0,0,0,0.45)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 px-2 py-1.5" style={{ background: 'linear-gradient(to top, rgba(58,24,40,0.85), transparent)' }}>
                    <div className="flex gap-1 mb-0.5" style={{ flexWrap: 'nowrap' }}>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap font-medium" style={{ background: 'rgba(253,164,178,0.25)', color: '#fda4b2', border: '1px solid rgba(253,164,178,0.3)' }}>한국인</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap font-medium" style={{ background: 'rgba(253,164,178,0.25)', color: '#fda4b2', border: '1px solid rgba(253,164,178,0.3)' }}>100%실사</span>
                    </div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-medium"
                    style={{ background: t.status === '실시간 상담 가능' ? '#10b981' : '#f59e0b', color: 'white' }}>
                    {t.status === '실시간 상담 가능' ? '상담가능' : '상담중'}
                  </div>
                </div>
                <div className="px-2.5 py-2">
                  <div className="text-[10px]" style={{ color: '#fda4b2' }}>{'★'.repeat(Math.round(t.stars))} {t.stars}</div>
                  <p className="text-[10px] leading-snug mt-0.5" style={{ color: '#7a4055' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 예약 버튼 */}
          <div className="px-5 pb-6 flex flex-col gap-2">
            <button type="button" onClick={openCrispChat}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-medium text-sm transition-all hover:opacity-90"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
              카카오톡으로 바로 예약
            </button>
            <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-medium text-sm text-white transition-all hover:opacity-90"
              style={{ background: '#2AABEE' }}>
              ✈️ 텔레그램 상담
            </a>
          </div>
        </div>
      </div>

      {/* 사진 전체화면 라이트박스 */}
      {zoomedImg && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(10,0,8,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={() => setZoomedImg(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-xl font-light"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}
            onClick={() => setZoomedImg(null)}
          >×</button>
          <div className="flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            <img
              src={zoomedImg.src}
              alt={zoomedImg.name}
              className="rounded-2xl shadow-2xl"
              style={{ maxHeight: '80vh', maxWidth: '90vw', objectFit: 'contain' }}
            />
            <span className="text-sm font-medium" style={{ color: '#fda4b2', fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: '1.1rem' }}>
              {zoomedImg.name}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

const FAQ_DATA = [
  {
    cat: '예약',
    items: [
      { q: '예약은 어떻게 하나요?', a: '카카오톡 채널 또는 텔레그램으로 문의하시면 됩니다. 24시간 상담이 가능하며, 원하시는 코스·시간·장소를 말씀해주시면 빠르게 안내해드립니다.' },
      { q: '예약 후 취소나 변경이 가능한가요?', a: '테라피스트 배정 전에는 자유롭게 변경·취소가 가능합니다. 배정 이후에는 취소 정책이 적용될 수 있으니 가급적 빠르게 연락해주세요.' },
      { q: '당일 예약도 가능한가요?', a: '네, 가능합니다. 24시간 운영하며 당일 즉시 예약도 지원합니다. 다만 시간대와 지역에 따라 배정 상황이 다를 수 있습니다.' },
      { q: '예약 후 대기 시간은 얼마나 되나요?', a: '전 지역 평균 30~60분 내 배정을 목표로 합니다. 지역·시간대에 따라 다소 차이가 있을 수 있으며, 배정 즉시 안내해드립니다.' },
      { q: '장소는 어디서 받을 수 있나요?', a: '호텔, 오피스텔, 자택 등 고객님이 계신 곳으로 방문합니다. 주소를 알려주시면 됩니다.' },
    ],
  },
  {
    cat: '결제',
    items: [
      { q: '결제는 어떻게 하나요?', a: '서비스 완료 후 현장에서 현금 또는 계좌이체로 결제하시면 됩니다. 사전 결제는 진행하지 않습니다.' },
      { q: '영수증 발급이 되나요?', a: '요청하시면 계좌이체 영수증을 제공해드릴 수 있습니다. 세금계산서 발급은 별도 문의 부탁드립니다.' },
      { q: '환불 정책은 어떻게 되나요?', a: '서비스 품질에 문제가 있을 경우 사실 확인 후 교체·재배정·환불을 검토해드립니다. 단순 변심에 의한 환불은 어려울 수 있습니다.' },
    ],
  },
  {
    cat: '서비스',
    items: [
      { q: '어떤 코스가 있나요?', a: '스웨디시, 아로마, 스포츠, 림프순환, VIP 프리미엄 등 다양한 코스를 제공합니다. 코스보기 메뉴에서 상세 내용을 확인하실 수 있습니다.' },
      { q: '서비스 시간은 얼마나 되나요?', a: '코스에 따라 80분, 110분, 140분 등 다양하게 선택 가능합니다. VIP 코스는 90분부터 시작합니다.' },
      { q: '어느 지역까지 방문 가능한가요?', a: '서울 전 지역, 경기도 27개 시, 6대 광역시, 충청·전라·경상·강원·제주까지 전국 어디든 방문합니다.' },
      { q: '운영 시간이 어떻게 되나요?', a: '연중무휴 24시간 운영합니다. 지역별 배정 상황에 따라 다소 차이가 있을 수 있습니다.' },
      { q: '음주 상태에서 서비스 이용이 가능한가요?', a: '안전상의 이유로 음주 상태에서는 서비스 진행이 제한되거나 불가할 수 있습니다.' },
    ],
  },
  {
    cat: '안전·위생',
    items: [
      { q: '테라피스트 신원은 어떻게 확인하나요?', a: '모든 테라피스트는 입사 전 신원조회, 자격증 검증, 위생 교육을 완료합니다. 고객 방문 시 고유 인증 코드가 발급됩니다.' },
      { q: '위생 관리는 어떻게 하나요?', a: '모든 소모품은 1회용으로 1회 사용 후 즉시 폐기됩니다. 도착 전·서비스 완료 후 철저한 위생 관리를 수행합니다.' },
      { q: '개인정보는 어떻게 관리되나요?', a: '고객 개인정보는 최소한만 수집하며, 서비스 완료 즉시 삭제합니다. 보관기간 경과 시 완전히 파기됩니다.' },
      { q: '의료 행위도 제공하나요?', a: '아니요. 저희 서비스는 힐링·컨디셔닝 범위 내에서만 제공되며, 의료 행위는 제공하지 않습니다.' },
    ],
  },
  {
    cat: '기타',
    items: [
      { q: '성적인 서비스도 제공하나요?', a: '절대 제공하지 않습니다. 의료·성적·불법적 요청은 즉시 서비스를 중단하고 퇴장합니다.' },
      { q: '테라피스트 지명이 가능한가요?', a: '특정 테라피스트 지명은 어려우나, 선호하는 스타일이나 특이사항을 말씀해주시면 최대한 반영해드립니다.' },
      { q: '서비스 중 불편사항이 생기면 어떻게 하나요?', a: '즉시 담당자에게 연락해주세요. 사실 확인 후 교체·재배정 등 신속히 처리해드립니다.' },
    ],
  },
]

function ContactFaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: '#fce8ef' }}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-rose-50/40 transition-colors">
        <span className="text-sm font-medium" style={{ color: '#3a1828' }}>Q. {faq.q}</span>
        <span style={{ color: '#c0406a', flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none', display: 'inline-block', fontSize: '1.1rem' }}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-sm leading-relaxed border-t" style={{ color: '#7a4055', borderColor: '#fce8ef', background: '#fff8fa' }}>
          <span className="font-medium" style={{ color: '#c0406a' }}>A. </span>{faq.a}
        </div>
      )}
    </div>
  )
}

const REVIEW_REGIONS = [
  { region: '서울특별시', cases: [
    { area: '강남', course: '스웨디시', badges: ['Verified', '고객방문형', '후불제', '야간'], text: '압 조절이 정확하고 마무리 스트레칭까지 꼼꼼하게 해주셨어요. 최고였습니다.' },
    { area: '마포', course: '아로마', badges: ['Verified', '호텔', '심야'], text: '향이 은은하고 림프 케어가 섬세해요. 심야인데도 빠른 배정 감사합니다.' },
    { area: '용산', course: '딥티슈', badges: ['자택'], text: '뭉친 어깨가 단번에 풀렸습니다. 딥티슈가 이렇게 시원한지 몰랐어요.' },
  ]},
  { region: '경기도', cases: [
    { area: '수원', course: '스포츠', badges: ['Verified', '자택', '후불제'], text: '딥티슈가 시원하고 회복이 빨랐어요. 다음에도 꼭 이용하겠습니다.' },
    { area: '성남', course: '림프', badges: ['Verified', '호텔'], text: '부종이 가볍게 빠졌습니다. 다리가 눈에 띄게 가벼워졌어요.' },
    { area: '부천', course: '스웨디시', badges: ['야간'], text: '편안해서 금방 잠들었어요. 야간 배정도 빠르고 친절했습니다.' },
  ]},
  { region: '인천광역시', cases: [
    { area: '송도', course: '아로마', badges: ['Verified', '호텔'], text: '향과 터치가 완벽했습니다. 호텔에서 받으니 더욱 특별했어요.' },
    { area: '부평', course: '림프', badges: ['후불제', '자택'], text: '부종이 바로 가벼워졌어요. 후불제라 믿고 이용할 수 있었습니다.' },
    { area: '계양', course: '스포츠', badges: ['Verified'], text: '핵심만 정확히 풀어줍니다. 운동 후 피로 회복에 딱이었어요.' },
  ]},
  { region: '부산광역시', cases: [
    { area: '해운대', course: '림프', badges: ['Verified', '호텔'], text: '여행 피로가 싹 풀렸어요. 해운대 호텔에서 받은 최고의 서비스였습니다.' },
    { area: '서면', course: '스포츠', badges: ['Verified', '퇴근 후'], text: '강약 조절이 좋고 스트레칭이 시원했습니다. 퇴근 후 최고의 선택이에요.' },
    { area: '광안리', course: '스웨디시', badges: ['야간'], text: '편안하게 잠들었고 다음날까지 개운해요. 야간 서비스 추천합니다.' },
  ]},
  { region: '대구광역시', cases: [
    { area: '수성', course: '딥티슈', badges: ['Verified', '자택'], text: '핵심을 정확히 눌러줘요. 자택 방문이라 이동 없이 편하게 받았습니다.' },
    { area: '동성로', course: '아로마', badges: ['Verified', '후불제'], text: '은은한 향과 섬세한 케어가 인상적. 후불제라 신뢰가 갔어요.' },
    { area: '달서', course: '스포츠', badges: ['야간'], text: '뭉친 부위만 시원하게 공략합니다. 심야 배정도 빠르게 해주셨어요.' },
  ]},
  { region: '광주광역시', cases: [
    { area: '상무지구', course: '스포츠', badges: ['Verified', '호텔'], text: '강약 조절이 완벽합니다. 호텔에서 프로 케어를 받은 느낌이었어요.' },
    { area: '첨단', course: '림프', badges: ['Verified', '후불제'], text: '부종 관리에 효과적이었어요. 다음날 몸이 확실히 달랐습니다.' },
    { area: '동구', course: '스웨디시', badges: ['자택'], text: '편안해서 푹 잤습니다. 자택 방문이라 더 편안하게 받을 수 있었어요.' },
  ]},
  { region: '대전광역시', cases: [
    { area: '유성', course: '스웨디시', badges: ['Verified', '자택'], text: '호흡 맞춤 힐링이 좋았어요. 편안하게 릴랙스할 수 있었습니다.' },
    { area: '둔산', course: '스포츠', badges: ['Verified', '후불제'], text: '뭉친 부위만 시원하게 공략. 전문적인 케어에 만족했습니다.' },
    { area: '정부청사', course: '림프', badges: ['오피스텔'], text: '붓기 감소 체감했어요. 오피스텔에서도 완벽한 서비스였습니다.' },
  ]},
  { region: '울산광역시', cases: [
    { area: '남구', course: '스포츠', badges: ['Verified', '자택'], text: '등·어깨가 가벼워졌습니다. 정확한 포인트 케어가 인상적이었어요.' },
    { area: '중구', course: '림프', badges: ['Verified', '후불제'], text: '붓기가 눈에 띄게 줄었어요. 전문적인 림프 드레나쥐였습니다.' },
    { area: '동구', course: '스웨디시', badges: ['야간'], text: '편안해서 금방 잠들었어요. 야간 서비스도 퀄리티가 동일해요.' },
  ]},
  { region: '세종특별자치시', cases: [
    { area: '행정중심', course: '스웨디시', badges: ['Verified', '오피스텔'], text: '업무 피로가 싹 풀렸습니다. 오피스텔에서도 완벽한 준비물이었어요.' },
    { area: '정부세종', course: '아로마', badges: ['Verified', '후불제'], text: '향이 은은해 숙면했어요. 다음날 컨디션이 완전히 달랐습니다.' },
    { area: '새롬동', course: '림프', badges: ['자택'], text: '붓기 완화가 확실했어요. 자택 방문으로 편하게 받았습니다.' },
  ]},
  { region: '강원특별자치도', cases: [
    { area: '강릉', course: '림프', badges: ['Verified', '호텔'], text: '여행 피로 회복에 최고예요. 강릉 여행에 가장 잘한 선택이었습니다.' },
    { area: '원주', course: '스포츠', badges: ['Verified', '자택'], text: '허리·하체가 눈에 띄게 가벼워졌어요. 전문 케어가 확실히 달랐습니다.' },
    { area: '속초', course: '스웨디시', badges: ['호텔'], text: '편안한 숙면을 도와줍니다. 여행 피로가 다음날 완전히 풀렸어요.' },
  ]},
  { region: '충청북도', cases: [
    { area: '청주', course: '스웨디시', badges: ['Verified', '오피스텔'], text: '부드럽고 촘촘한 케어가 좋았어요. 숙면 유도 효과가 확실했습니다.' },
    { area: '충주', course: '스포츠', badges: ['Verified', '후불제'], text: '핵심만 정확히 풀어줍니다. 후불제라 더 믿음이 갔어요.' },
    { area: '제천', course: '림프', badges: ['자택'], text: '붓기 관리에 효과적이었습니다. 다음날 다리가 확실히 달랐어요.' },
  ]},
  { region: '충청남도', cases: [
    { area: '천안', course: '림프', badges: ['Verified', '자택'], text: '부종이 빠르게 가벼워졌어요. 전문적인 케어에 만족했습니다.' },
    { area: '아산', course: '스포츠', badges: ['Verified', '후불제'], text: '등·어깨 집중 케어가 만족스러워요. 재방문 의사 100%입니다.' },
    { area: '당진', course: '스웨디시', badges: ['자택'], text: '편안해서 깊게 잤습니다. 자택 방문 서비스 강력 추천해요.' },
  ]},
  { region: '전라북도', cases: [
    { area: '전주', course: '아로마', badges: ['Verified', '호텔'], text: '향과 터치가 조화롭습니다. 한옥마을 여행 후 완벽한 마무리였어요.' },
    { area: '익산', course: '스포츠', badges: ['Verified', '자택'], text: '강약 조절이 좋아요. 허리 통증이 바로 완화됐습니다.' },
    { area: '군산', course: '스웨디시', badges: ['호텔'], text: '피로가 싹 풀렸어요. 다음날 아침 컨디션이 최상이었습니다.' },
  ]},
  { region: '전라남도', cases: [
    { area: '여수', course: '림프', badges: ['Verified', '호텔'], text: '여행 피로가 빠르게 풀렸습니다. 여수 야경과 함께 최고의 힐링이었어요.' },
    { area: '순천', course: '스웨디시', badges: ['Verified', '후불제'], text: '편안해서 금방 잠들었어요. 후불제로 부담 없이 이용했습니다.' },
    { area: '목포', course: '스포츠', badges: ['자택'], text: '딥티슈가 제대로 들어갑니다. 자택 방문이라 더 편안했어요.' },
  ]},
  { region: '경상북도', cases: [
    { area: '포항', course: '스포츠', badges: ['Verified', '자택'], text: '딥티슈가 시원합니다. 운동 후 회복이 확실히 빨랐어요.' },
    { area: '경주', course: '스웨디시', badges: ['Verified', '호텔'], text: '편안한 수면을 도와줬어요. 경주 여행의 완벽한 마무리였습니다.' },
    { area: '구미', course: '림프', badges: ['후불제'], text: '붓기 완화가 확실해요. 후불제 덕분에 믿고 첫 이용 했습니다.' },
  ]},
  { region: '경상남도', cases: [
    { area: '창원', course: '림프', badges: ['Verified', '자택'], text: '붓기 관리에 큰 도움이 됐어요. 전문 케어 퀄리티가 놀라웠습니다.' },
    { area: '김해', course: '스포츠', badges: ['Verified', '후불제'], text: '핵심 근육을 정확히 풀어줍니다. 재이용 의사 100%입니다.' },
    { area: '통영', course: '스웨디시', badges: ['호텔'], text: '편안하고 개운합니다. 통영 여행의 완벽한 힐링이었어요.' },
  ]},
  { region: '제주특별자치도', cases: [
    { area: '제주시', course: '스웨디시', badges: ['Verified', '호텔'], text: '여행 피로가 싹 풀리고 개운해요. 제주 여행 필수 코스로 추천합니다.' },
    { area: '서귀포', course: '아로마', badges: ['Verified', '후불제'], text: '향과 터치가 편안해 금방 잠들었어요. 풀빌라에서 받으니 완벽했습니다.' },
    { area: '애월', course: '림프', badges: ['호텔'], text: '부종 케어 효과가 확실했습니다. 애월 감성에 최고의 힐링이었어요.' },
  ]},
]

function ReviewPage({ onBook }: { onBook: () => void }) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const displayed = activeRegion
    ? REVIEW_REGIONS.filter(r => r.region === activeRegion)
    : REVIEW_REGIONS

  return (
    <section id="reviews" className="pb-24 min-h-screen" style={{ background: '#fff8fa' }}>
      {/* 메인 배너 */}
      <div className="w-full pt-14">
        <img src="/reviews-banner.png" alt="굿데이마사지 고객후기" className="w-full" style={{ display: 'block' }} />
      </div>
      {/* 히어로 */}
      <div className="py-10 text-center" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#fda4b2' }}>Reviews</div>
        <h2 style={{ color: 'white', fontWeight: 400, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>고객 후기</h2>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,210,225,0.8)' }}>실제 이용 고객님들의 생생한 관리 사례입니다</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 divide-x border-b" style={{ background: '#2a1020', borderColor: '#4a2038' }}>
        {[['1,284건', '최근 30일 관리 사례', '+12% 증가'], ['97%', '재이용 의사', '신뢰도'], ['98%', '배정 만족도', '신속 배정']].map(([val, label, sub]) => (
          <div key={label} className="py-5 text-center">
            <div className="font-bold text-xl" style={{ color: '#fda4b2' }}>{val}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,210,225,0.7)' }}>{label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,210,225,0.4)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* 지역 필터 탭 */}
      <div className="sticky top-16 z-10 border-b overflow-x-auto" style={{ background: 'white', borderColor: '#fce8ef' }}>
        <div className="flex gap-0 min-w-max px-4">
          <button onClick={() => setActiveRegion(null)}
            className="px-4 py-3 text-xs whitespace-nowrap border-b-2 transition-all"
            style={{ borderColor: activeRegion === null ? '#c0406a' : 'transparent', color: activeRegion === null ? '#c0406a' : '#9a7080', fontWeight: activeRegion === null ? 600 : 400 }}>
            전체
          </button>
          {REVIEW_REGIONS.map(r => (
            <button key={r.region} onClick={() => setActiveRegion(r.region === activeRegion ? null : r.region)}
              className="px-4 py-3 text-xs whitespace-nowrap border-b-2 transition-all"
              style={{ borderColor: activeRegion === r.region ? '#c0406a' : 'transparent', color: activeRegion === r.region ? '#c0406a' : '#9a7080', fontWeight: activeRegion === r.region ? 600 : 400 }}>
              {r.region.replace('특별시', '').replace('광역시', '').replace('특별자치시', '').replace('특별자치도', '').replace('특별자치도', '')}
            </button>
          ))}
        </div>
      </div>

      {/* 지역별 후기 */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {displayed.map(({ region, cases }) => (
          <div key={region} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h3 className="font-semibold text-sm" style={{ color: '#3a1828' }}>{region}</h3>
              <div className="flex-1 h-px" style={{ background: '#fce8ef' }} />
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#fce8ef', color: '#c0406a' }}>{cases.length}건</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {cases.map((c, i) => (
                <div key={i} className="rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-medium text-sm" style={{ color: '#3a1828' }}>{c.area}</span>
                      <span className="mx-1.5 text-xs" style={{ color: '#fda4b2' }}>·</span>
                      <span className="text-xs" style={{ color: '#c0406a' }}>{c.course}</span>
                    </div>
                    <div className="text-yellow-400 text-xs tracking-tight">★★★★★</div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {c.badges.map(b => (
                      <span key={b} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: b === 'Verified' ? '#fce8ef' : '#f5f5f5', color: b === 'Verified' ? '#c0406a' : '#7a4055' }}>
                        {b === 'Verified' ? '✓ Verified' : b}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#5a3040' }}>"{c.text}"</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="rounded-2xl p-8 text-center mt-4" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
          <p className="text-sm mb-1 font-medium" style={{ color: 'white' }}>나도 후기의 주인공이 되어보세요</p>
          <p className="text-xs mb-5" style={{ color: 'rgba(255,210,225,0.7)' }}>지금 바로 예약하고 특별한 힐링을 경험하세요</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onBook}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-medium hover:opacity-90"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
              카카오톡 예약
            </button>
            <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white hover:opacity-90"
              style={{ background: '#2AABEE' }}>
              ✈️ 텔레그램 예약
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function BlogPage() {
  const [selected, setSelected] = useState<typeof BLOG_POSTS[0] | null>(null)
  const [activeCat, setActiveCat] = useState<string>('전체')
  const cats = ['전체', ...Array.from(new Set(BLOG_POSTS.map(p => p.cat)))]
  const filtered = activeCat === '전체' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.cat === activeCat)

  if (selected) {
    return (
      <article className="min-h-screen pb-24" style={{ background: 'white' }}>
        <div className="pt-20 pb-10" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-xs mb-6 hover:opacity-80" style={{ color: '#fda4b2' }}>
              ← 블로그 목록
            </button>
            <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'rgba(255,164,178,0.2)', color: '#fda4b2' }}>{selected.cat}</span>
            <h1 className="mt-3 leading-snug font-medium" style={{ color: 'white', fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>{selected.title}</h1>
            <div className="flex items-center gap-3 mt-4 text-xs" style={{ color: 'rgba(255,210,225,0.6)' }}>
              <span>{selected.date}</span>
              <span>·</span>
              <span>읽기 {selected.read}</span>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#5a3040' }}>{selected.desc}</p>
          {(selected.body ?? []).map((sec, i) => (
            <div key={i} className="mb-8">
              <h2 className="font-semibold mb-3" style={{ color: '#3a1828', fontSize: '1.05rem' }}>{sec.h}</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#5a3040' }}>{sec.p}</p>
            </div>
          ))}
          <div className="mt-12 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
            <p className="text-sm font-medium mb-4" style={{ color: 'white' }}>지금 바로 예약하고 경험하세요</p>
            <button type="button" onClick={openCrispChat}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:opacity-90"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              카카오톡으로 예약하기
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <section id="blog" className="min-h-screen pb-24" style={{ background: '#fff8fa' }}>
      {/* 메인 배너 */}
      <div className="w-full pt-14">
        <img src="/blog-banner.png" alt="굿데이마사지 블로그" className="w-full" style={{ display: 'block' }} />
      </div>

      {/* 히어로 */}
      <div className="py-8 text-center" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#fda4b2' }}>Blog</div>
        <h2 style={{ color: 'white', fontWeight: 400, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>케어 블로그</h2>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,210,225,0.7)' }}>출장마사지 이용 가이드 · 건강 정보 · 지역별 안내</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="sticky top-16 z-10 border-b overflow-x-auto" style={{ background: 'white', borderColor: '#fce8ef' }}>
        <div className="flex min-w-max px-4">
          {cats.map(c => (
            <button key={c} onClick={() => setActiveCat(c)}
              className="px-4 py-3 text-xs whitespace-nowrap border-b-2 transition-all"
              style={{ borderColor: activeCat === c ? '#c0406a' : 'transparent', color: activeCat === c ? '#c0406a' : '#9a7080', fontWeight: activeCat === c ? 600 : 400 }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 포스트 그리드 */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <article key={i} className="group cursor-pointer bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow"
              style={{ borderColor: '#fce8ef' }}
              onClick={() => setSelected(post)}>
              <div className="p-5">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full" style={{ background: '#fce8ef', color: '#c0406a' }}>{post.cat}</span>
                <h3 className="mt-3 text-sm font-medium leading-snug mb-2" style={{ color: '#3a1828' }}>{post.title}</h3>
                <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: '#9a607a' }}>{post.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#c0a0a8' }}>{post.date}</span>
                  <span className="text-xs" style={{ color: '#c0406a' }}>읽기 {post.read} →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqPage() {
  const [activeCat, setActiveCat] = useState(0)
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const items = FAQ_DATA[activeCat].items
  return (
    <section id="faq" className="min-h-screen pb-24" style={{ background: '#fff8fa' }}>
      {/* 히어로 */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#fda4b2' }}>FAQ</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'white', fontWeight: 400 }}>자주 묻는 질문</h2>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,210,225,0.8)' }}>궁금하신 점을 빠르게 확인하세요</p>
      </div>

      {/* 상황별 가이드 */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '⚡', title: '급한 예약', desc: '카카오톡 또는 텔레그램으로 즉시 문의하시면 빠르게 안내해드립니다.' },
            { icon: '⏱️', title: '배정 지연 시', desc: '배정 상황에 따라 지연될 수 있으며, 담당자가 실시간으로 안내드립니다.' },
            { icon: '🏨', title: '장소 준비', desc: '호텔·오피스텔·자택 모두 가능합니다. 편안한 환경을 미리 준비해주세요.' },
          ].map(g => (
            <div key={g.title} className="rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
              <div className="text-2xl mb-2">{g.icon}</div>
              <div className="font-medium text-sm mb-1" style={{ color: '#3a1828' }}>{g.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: '#9a607a' }}>{g.desc}</p>
            </div>
          ))}
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FAQ_DATA.map((d, i) => (
            <button key={d.cat} onClick={() => { setActiveCat(i); setOpenIdx(null) }}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={activeCat === i
                ? { background: '#c0406a', color: 'white' }
                : { background: 'white', color: '#7a4055', border: '1px solid #fce8ef' }}>
              {d.cat}
            </button>
          ))}
        </div>

        {/* FAQ 아코디언 */}
        <div className="flex flex-col gap-2">
          {items.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: '#fce8ef' }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-rose-50/40 transition-colors">
                <span className="text-sm font-medium" style={{ color: '#3a1828' }}>Q. {faq.q}</span>
                <span style={{ color: '#c0406a', flexShrink: 0, transition: 'transform 0.2s', transform: openIdx === i ? 'rotate(45deg)' : 'none', display: 'inline-block', fontSize: '1.1rem' }}>+</span>
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 pt-1 text-sm leading-relaxed border-t" style={{ color: '#7a4055', borderColor: '#fce8ef', background: '#fff8fa' }}>
                  <span className="font-medium" style={{ color: '#c0406a' }}>A. </span>{faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 서비스 보증 */}
        <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(160deg, #fdf2f5, #fce8ef)' }}>
          <h3 className="font-medium mb-2" style={{ color: '#3a1828', fontSize: '1.1rem' }}>굿데이 출장마사지, 안심하고 이용하세요</h3>
          <p className="text-xs mb-6" style={{ color: '#7a4055' }}>100% 예약제 · 1인 1세트 위생 · 완벽한 개인정보 보호</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🧴', title: '1회용 비품', desc: '모든 소모품은 1회 사용 후 즉시 폐기됩니다.' },
              { icon: '🔒', title: '개인정보 즉시 삭제', desc: '서비스 완료 즉시 고객 정보를 삭제합니다.' },
              { icon: '✓', title: '방문 전후 위생', desc: '도착 전·서비스 후 철저한 위생 관리를 합니다.' },
            ].map(item => (
              <div key={item.title} className="rounded-xl p-4 bg-white/70">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-medium text-xs mb-1" style={{ color: '#3a1828' }}>{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: '#9a607a' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function VipPage({ onClose, onGoTherapists }: { onClose: () => void; onGoTherapists: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto" style={{ background: '#fdf8f9', fontFamily: "'NexonLv1Gothic', sans-serif" }}>

      {/* 상단 네비 */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 bg-white/95 backdrop-blur border-b" style={{ borderColor: '#fce8ef' }}>
        <button onClick={onClose} className="flex items-center gap-1.5 text-sm" style={{ color: '#c0406a' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          코스 목록
        </button>
        <span style={{ color: '#fce8ef' }}>|</span>
        <span className="text-sm" style={{ color: '#7a4055' }}>VIP 프리미엄 힐링 코스</span>
      </div>

      {/* VIP 배너 이미지 */}
      <div className="w-full overflow-hidden" style={{ maxHeight: 340 }}>
        <img src="/vip-banner.png" alt="굿데이마사지 VIP" className="w-full object-cover object-top" style={{ maxHeight: 340 }} />
      </div>

      {/* 히어로 */}
      <div className="relative py-20 text-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, #fda4b2, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="text-xs tracking-widest uppercase mb-4" style={{ color: '#fda4b2' }}>PREMIUM · VIP</div>
          <h1 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: 'white', fontWeight: 400 }}>
            VIP 프리미엄 힐링 코스<br /><span style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontWeight: 700, letterSpacing: '-0.02em' }}>(90분~)</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,210,225,0.85)' }}>
            과로·야근·출장·여행 후 완전한 회복을 위한<br />단 1%를 위한 프리미엄 케어
          </p>
          {/* 메타 정보 */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[['★★★★★', '4.9/5.0 · 후기 128건'], ['💰', '150,000원~'], ['🚗', '방문형 · 출장마사지'], ['🕐', '연중무휴 · 24시간']].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,220,230,0.9)', border: '1px solid rgba(253,164,178,0.25)' }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button type="button" onClick={openCrispChat}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
              바로 예약하기
            </button>
            <button onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm text-white border hover:bg-white/10 transition-all"
              style={{ borderColor: 'rgba(253,164,178,0.5)' }}>
              코스 보러가기
            </button>
          </div>
        </div>
      </div>

      {/* 코스 핵심 안내 배너 */}
      <div className="w-full overflow-hidden" style={{ maxHeight: 340 }}>
        <img src="/course-banner.png" alt="굿데이마사지 코스안내" className="w-full object-cover object-top" style={{ maxHeight: 340 }} />
      </div>

      {/* 코스 핵심 안내 */}
      <div className="py-14" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Core Info</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>코스 핵심 안내</h2>
          </div>
          <p className="text-sm leading-relaxed mb-8 text-center" style={{ color: '#5a3040' }}>
            단순히 "강하게만"이 아닌, 밀도와 회복을 중심으로 설계된 루틴입니다.<br />컨디션 체크 후 그날의 상태에 맞게 루틴을 조정합니다.
          </p>
          <ul className="flex flex-col gap-4">
            {[
              ['✦', '전용 루틴', '외부에 공개되지 않은 VIP 전용 관리 기법으로 진행됩니다.'],
              ['🌿', '시크릿 아로마', '컨디션에 맞춰 블렌딩한 프리미엄 아로마 오일을 사용합니다.'],
              ['🎯', '맞춤 압·리듬', '단순 강약이 아닌 정밀한 압 조절과 리듬으로 케어합니다.'],
              ['💆', '집중 케어', '어깨·등·허리·하체 등 집중이 필요한 부위를 타겟 케어합니다.'],
              ['🏠', '편의성', '자택·숙소·오피스텔 등 고객님이 계신 곳으로 방문합니다.'],
            ].map(([icon, title, desc]) => (
              <li key={title as string} className="flex items-start gap-4 rounded-xl p-5 border" style={{ background: '#fff8fa', borderColor: '#fce8ef' }}>
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: '#3a1828' }}>{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#7a4055' }}>{desc}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-center" style={{ color: '#9a607a' }}>
            VIP 코스는 심야 시간대를 포함한 피크 시간에도 동일한 매뉴얼로 운영됩니다.
          </p>
        </div>
      </div>

      {/* 시간 & 가격 구성 */}
      <div className="py-14" style={{ background: '#fff8fa' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Pricing</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>시간 & 가격 구성</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: '👍', time: '80분', price: '150,000원', desc: '짧게 컨디션 리셋' },
              { icon: '✌️', time: '120분', price: '200,000원', desc: '어깨·허리·하체 집중' },
              { icon: '🔥', time: '240분', price: '300,000원', desc: '장시간 회복 / 숙면' },
            ].map(t => (
              <div key={t.time} className="rounded-2xl p-6 text-center border bg-white" style={{ borderColor: '#fce8ef' }}>
                <div className="text-3xl mb-3">{t.icon}</div>
                <div className="text-lg font-medium mb-1" style={{ fontFamily: "'NexonLv1Gothic', sans-serif", color: '#3a1828' }}>{t.time}</div>
                <div className="text-xl font-semibold mb-2" style={{ color: '#c0406a' }}>{t.price}</div>
                <div className="text-xs" style={{ color: '#9a607a' }}>{t.desc}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl px-5 py-4 text-sm text-center" style={{ background: '#fff0f4', border: '1px solid #fce8ef', color: '#7a4055' }}>
            💡 시간 선택은 단순히 "길수록 좋다"가 아니라, 신체 컨디션과 피로 유형에 맞게 결정하세요.
          </div>
          <div className="text-center mt-6">
            <button onClick={onGoTherapists}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
              테라피스트 더보기 →
            </button>
          </div>
        </div>
      </div>

      {/* 실제 이용 후기 */}
      <div className="py-14" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Reviews</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>VIP 코스 실제 이용 후기</h2>
            <p className="mt-2 text-sm" style={{ color: '#fda4b2' }}>★★★★★ 4.9/5.0 · 인증 후기 포함</p>
          </div>
          <p className="text-xs leading-relaxed mb-6 text-center" style={{ color: '#7a4055' }}>
            모든 후기는 실제 이용 고객의 경험을 바탕으로 작성되었습니다.<br />
            전국 모든 지역, 모든 시간대에서 동일한 품질을 보장합니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { area: '강남', time: '방금 전', text: '야근 후 예약했는데 정말 개운하게 풀렸어요. VIP만의 루틴이 확실히 다릅니다. 압 조절이 너무 세심해요.' },
              { area: '여의도', time: '어젯밤', text: '출장 중에 이용했는데 호텔 입실도 자연스럽고 서비스 퀄리티가 일반 코스와 확연히 달랐습니다.' },
              { area: '잠실', time: '2일 전', text: '240분 코스 이용했는데 진짜 숙면 유도가 됩니다. 다음날 컨디션이 완전히 달랐어요. 강추합니다.' },
              { area: '마포', time: '3일 전', text: '시크릿 아로마가 특히 좋았어요. 향이 은은하고 릴랙싱이 잘 됩니다. 재방문 결정했습니다.' },
            ].map((r, i) => (
              <div key={i} className="rounded-2xl p-5 border" style={{ background: '#fff8fa', borderColor: '#fce8ef' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: '#fce8ef', color: '#c0406a' }}>{r.area}</span>
                  <span className="text-xs" style={{ color: '#c0a0a8' }}>{r.time}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: '#fda4b2' }}>★★★★★</div>
                <p className="text-xs leading-relaxed" style={{ color: '#5a3040' }}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-14" style={{ background: '#fff8fa' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>FAQ</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>자주 묻는 질문</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
            {[
              { q: 'VIP 코스는 어떤 분께 적합한가요?', a: '과로·회식·출장·여행 후 정밀한 회복이 필요하신 분, 정확한 압 조절을 원하시는 분께 적합합니다.' },
              { q: '준비물이 있나요?', a: '기본 소모품은 제공됩니다. 편안한 복장과 쉬실 수 있는 공간만 준비해 주시면 됩니다.' },
              { q: '지역마다 품질이 동일한가요?', a: '모든 테라피스트는 동일한 VIP 매뉴얼로 교육받습니다. 전국 어디서든 균일한 서비스를 보장합니다.' },
              { q: '아로마·스웨디시와 어떻게 다른가요?', a: 'VIP 코스는 관리 밀도와 맞춤 설계에 초점을 맞춘 프리미엄 티어입니다. 단순 이완을 넘어 정밀한 회복을 목표로 합니다.' },
            ].map((faq, i, arr) => (
              <div key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid #fce8ef' : 'none' }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
                  style={{ background: openFaq === i ? '#fff0f4' : 'white', color: '#3a1828' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span style={{ color: '#c0406a', fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-xs leading-relaxed" style={{ color: '#7a4055', background: '#fff0f4' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="py-14 text-center px-6" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'white', fontWeight: 400, marginBottom: '1rem' }}>
          지금 VIP 코스를 예약하세요
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,210,225,0.8)' }}>24시간 연중무휴 · 전국 방문</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={openCrispChat}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
            style={{ background: '#FEE500', color: '#3a1828' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
            카카오톡 상담
          </button>
          <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-white hover:opacity-90 transition-opacity"
            style={{ background: '#2AABEE' }}>
            ✈️ 텔레그램 상담
          </a>
        </div>
      </div>
    </div>
  )
}

function CityPage({ city, regionName, onClose }: { city: string; regionName: string; onClose: () => void }) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null)

  const cityBlogs = BLOG_POSTS.filter(p => p.cat.includes(city) || p.title.includes(city) || p.desc.includes(city)).slice(0, 3)
  const fallbackBlogs = BLOG_POSTS.slice(0, 3)
  const displayBlogs = cityBlogs.length >= 2 ? cityBlogs : fallbackBlogs

  const routineItems = [
    {
      icon: '🏙️',
      title: `${city} 중심부 비즈니스 & 이동 축`,
      items: [
        `장거리 이동·교통이 겹치는 날에는 경추·견갑 중심 스웨디시 60~90분 코스를 추천합니다.`,
        `도착 시간에 맞춰 객실에서 바로 받을 수 있도록 일정 조율이 가능합니다.`,
        `도로 정체·공사 등 변수를 고려해 10~15분 여유 있는 예약 시간을 권장합니다.`,
      ],
    },
    {
      icon: '🏢',
      title: `${city} 오피스 & 주거 권역`,
      items: [
        `퇴근 후 집·레지던스에서 바로 받는 하체 림프+허리 케어 루틴을 권장합니다.`,
        `장시간 좌식 업무 후 골반·요추 주변 근막 이완을 함께 진행하는 것을 추천합니다.`,
        `야간·심야에도 24시간 출장마사지로 이동 없이 회복하세요.`,
      ],
    },
    {
      icon: '🌙',
      title: '심야 & 장기 체류 고객',
      items: [
        `짧은 휴식 구간에도 집중 관리 가능하도록 코스를 구성합니다.`,
        `허리·어깨·골반에 집중된 피로를 스포츠·근막 이완 루틴으로 정리합니다.`,
        `장기 체류 고객의 프라이버시를 위해 객실 동선과 소음 관리에 철저히 주의합니다.`,
      ],
    },
  ]

  const timeRows = [
    { zone: `${city} 중심부`, day: '20–30분', night: '20–30분', late: '25–35분' },
    { zone: `${city} 외곽·인접 구역`, day: '25–35분', night: '25–40분', late: '30–40분' },
    { zone: '인근 광역 권역', day: '30–40분', night: '30–45분', late: '35–50분' },
  ]

  const cityReviews = [
    {
      stars: 5,
      title: `${city} 비즈니스 호텔 도착 직후 상체 집중 관리가 탁월했습니다`,
      content: `장거리 이동 후 ${city} 호텔에서 스웨디시 90분을 받았으며, 경추·견갑 위주 관리로 다음 날 일정을 수월하게 마쳤습니다.`,
      info: `${city} 스웨디시 90분 / 2026년 2월`,
    },
    {
      stars: 5,
      title: `${city} 오피스 일정 후 다리 피로가 완벽히 정리되었습니다`,
      content: `종일 현장 일정으로 다리가 무거웠으나 림프 순환 60분 후 부종이 눈에 띄게 줄었고, 객실에서 바로 받을 수 있어 편리했습니다.`,
      info: `${city} 림프 60분 / 2026년 1월`,
    },
    {
      stars: 5,
      title: `${city} 장기 체류 중 정기 루틴으로 정착했습니다`,
      content: `${city} 레지던스에 체류하며 주 2회 스포츠·근막 이완을 이용 중입니다. 허리·골반 피로 해소와 심야 매너 모두 만족스럽습니다.`,
      info: `${city} 스포츠 90분 / 2025년 12월`,
    },
  ]

  const faqs = [
    { q: `${city} 출장마사지란 무엇인가요?`, a: `고객님이 머무는 자택·호텔·오피스텔 등으로 전문 테라피스트가 방문해 케어를 제공하는 프리미엄 출장 서비스입니다.` },
    { q: `${city} 출장안마와 스웨디시의 차이점은?`, a: `일반 케어가 강한 압으로 근육을 풀어주는 데 집중한다면, 스웨디시는 고급 오일을 활용해 림프 순환을 돕고 깊은 이완·숙면을 유도하는 코스입니다.` },
    { q: `${city} 전 지역 방문 가능한가요?`, a: `${city} 전역 방문이 가능하며, 평균 20~30분 내 테라피스트가 배정됩니다. 심야·주말 동일하게 운영합니다.` },
    { q: `방문하는 테라피스트 사진은 100% 실사인가요?`, a: `과도한 보정 없는 실제 테라피스트의 실사 사진만을 제공합니다. 배정 전 프로필을 확인하실 수 있습니다.` },
    { q: `영업시간은 어떻게 되나요?`, a: `365일 24시간 연중무휴로 운영됩니다. 새벽·이른 아침·심야에도 문의 가능합니다.` },
  ]

  useEffect(() => {
    const prev = document.title
    document.title = `${city} 출장마사지 | 굿데이출장마사지`

    let metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? ''
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', `${city} 전 지역 24시간 출장마사지·출장안마·스웨디시. 호텔·오피스텔·자택 방문. 100% 실사 테라피스트 즉시 배정. 365일 연중무휴.`)

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    const prevCanonical = canonical?.href ?? ''
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${window.location.origin}/cities/${encodeURIComponent(city)}`

    // ① LocalBusiness JSON-LD
    const pageUrl = `${window.location.origin}/cities/${encodeURIComponent(city)}`
    const localBusiness = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${pageUrl}#business`,
      name: `굿데이출장마사지 ${city}`,
      description: `${city} 전 지역 24시간 출장마사지·출장안마·스웨디시 서비스`,
      url: pageUrl,
      openingHours: 'Mo-Su 00:00-24:00',
      areaServed: { '@type': 'City', name: city },
      serviceType: ['출장마사지', '출장안마', '스웨디시', '홈케어'],
      priceRange: '₩₩',
      inLanguage: 'ko-KR',
    }

    // ② FAQ 리치스니펫 JSON-LD
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }

    // ③ BreadcrumbList JSON-LD
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: window.location.origin },
        { '@type': 'ListItem', position: 2, name: '지역 선택', item: `${window.location.origin}/#regions` },
        { '@type': 'ListItem', position: 3, name: `${regionName}`, item: `${window.location.origin}/#regions` },
        { '@type': 'ListItem', position: 4, name: `${city} 출장마사지`, item: pageUrl },
      ],
    }

    const addJsonLd = (id: string, data: object) => {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = id
      s.textContent = JSON.stringify(data)
      document.head.appendChild(s)
    }
    addJsonLd('city-jsonld-business', localBusiness)
    addJsonLd('city-jsonld-faq', faqSchema)
    addJsonLd('city-jsonld-breadcrumb', breadcrumb)

    // ③ OpenGraph 태그
    const ogTags: Record<string, string> = {
      'og:type': 'website',
      'og:url': pageUrl,
      'og:title': `${city} 출장마사지 | 굿데이출장마사지`,
      'og:description': `${city} 전 지역 24시간 출장마사지·출장안마·스웨디시. 호텔·오피스텔·자택 방문. 365일 연중무휴.`,
      'og:locale': 'ko_KR',
      'og:site_name': '굿데이출장마사지',
      'twitter:card': 'summary_large_image',
      'twitter:title': `${city} 출장마사지 | 굿데이출장마사지`,
      'twitter:description': `${city} 전 지역 24시간 출장마사지·출장안마·스웨디시. 365일 연중무휴.`,
    }
    const prevOg: Record<string, string> = {}
    Object.entries(ogTags).forEach(([prop, content]) => {
      const attr = prop.startsWith('twitter:') ? 'name' : 'property'
      let el = document.querySelector(`meta[${attr}="${prop}"]`) as HTMLMetaElement | null
      prevOg[prop] = el?.content ?? ''
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, prop)
        el.dataset.cityOg = '1'
        document.head.appendChild(el)
      }
      el.content = content
    })

    return () => {
      document.title = prev
      document.querySelector('meta[name="description"]')?.setAttribute('content', prevDesc)
      if (prevCanonical) {
        (document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null)?.setAttribute('href', prevCanonical)
      }
      document.getElementById('city-jsonld-business')?.remove()
      document.getElementById('city-jsonld-faq')?.remove()
      document.getElementById('city-jsonld-breadcrumb')?.remove()
      Object.entries(ogTags).forEach(([prop]) => {
        const attr = prop.startsWith('twitter:') ? 'name' : 'property'
        const el = document.querySelector(`meta[${attr}="${prop}"]`) as HTMLMetaElement | null
        if (el?.dataset.cityOg) el.remove()
        else if (el) el.content = prevOg[prop] ?? ''
      })
    }
  }, [city, regionName])

  return (
    <div
      className="fixed inset-0 z-[150] overflow-y-auto"
      style={{ background: '#fdf8f9', fontFamily: "'NexonLv1Gothic', sans-serif" }}
    >
      {/* 상단 네비 */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 bg-white/95 backdrop-blur border-b" style={{ borderColor: '#fce8ef' }}>
        <button onClick={onClose} className="flex items-center gap-1.5 text-sm" style={{ color: '#c0406a' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          지역 목록
        </button>
        <span style={{ color: '#fce8ef' }}>|</span>
        <span className="text-sm" style={{ color: '#7a4055' }}>{regionName} · {city}</span>
      </div>

      {/* 브랜드 배너 이미지 */}
      <div className="w-full" style={{ background: 'white' }}>
        <img src="/city-banner.png" alt="굿데이마사지 브랜드 배너" className="w-full object-cover" style={{ maxHeight: '340px', objectPosition: 'center' }} />
      </div>

      {/* ① 히어로 */}
      <div className="relative py-14 overflow-hidden" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 40%, #fda4b2, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="text-xs tracking-widest uppercase mb-4" style={{ color: '#fda4b2' }}>출장마사지 · 홈케어</div>
          <h1 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2.6rem)', color: 'white', fontWeight: 400, lineHeight: 1.3 }}>
            {city} 출장마사지 | 그대에게로<br />찾아가는 프리미엄 홈케어
          </h1>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: 'rgba(255,210,225,0.85)' }}>
            {city} 전 지역 자택·호텔·오피스텔로 전문 테라피스트가 직접 방문합니다.<br />
            배정부터 케어 마무리까지 100% 1:1 전담 밀착 케어 시스템으로 운영됩니다.
          </p>

          {/* 서비스 키워드 포인트 */}
          <div className="mt-7 grid grid-cols-1 gap-3">
            {[
              {
                kw: '출장마사지',
                desc: `${city} 어디서든 전문 테라피스트가 직접 찾아가는 1:1 맞춤형 방문 마사지 서비스입니다.`,
              },
              {
                kw: '출장안마',
                desc: '강한 압으로 뭉친 근육을 깊이 풀어주는 전통 안마 스타일 출장 케어입니다.',
              },
              {
                kw: '스웨디시',
                desc: '고급 오일을 활용한 림프 순환·근막 이완으로 깊은 이완과 숙면을 유도합니다.',
              },
            ].map(({ kw, desc }) => (
              <div key={kw} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,164,178,0.08)', border: '1px solid rgba(255,164,178,0.18)' }}>
                <span className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5" style={{ background: 'rgba(253,164,178,0.25)', color: '#fda4b2', border: '1px solid rgba(253,164,178,0.4)', whiteSpace: 'nowrap' }}>
                  #{kw}
                </span>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,210,225,0.8)' }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {['365일 24시간', '100% 실사 프로필', '후불 결제', '번호 공개 없음'].map(b => (
              <span key={b} className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(255,164,178,0.15)', color: '#fda4b2', border: '1px solid rgba(255,164,178,0.25)' }}>✓ {b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ③ 권역별 예상 배정 시간 테이블 */}
      <div className="py-12" style={{ background: '#fff8fa' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Response Time</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#3a1828', fontWeight: 400 }}>
              {city} 권역별 예상 배정 시간
            </h2>
          </div>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
            <div className="grid grid-cols-4 text-xs font-medium py-3 px-4" style={{ background: 'linear-gradient(135deg, #3a1828, #6b2040)', color: 'white' }}>
              <div>권역</div>
              <div className="text-center">☀️ 주간<br /><span style={{ fontWeight: 400, opacity: 0.8 }}>12–20시</span></div>
              <div className="text-center">🌙 야간<br /><span style={{ fontWeight: 400, opacity: 0.8 }}>20–24시</span></div>
              <div className="text-center">⭐ 심야<br /><span style={{ fontWeight: 400, opacity: 0.8 }}>00–06시</span></div>
            </div>
            {timeRows.map((row, i) => (
              <div key={i} className="grid grid-cols-4 text-xs py-4 px-4 border-t" style={{ borderColor: '#fce8ef', background: i % 2 === 0 ? 'white' : '#fff8fa' }}>
                <div className="font-medium" style={{ color: '#3a1828' }}>{row.zone}</div>
                <div className="text-center font-bold" style={{ color: '#c0406a' }}>{row.day}</div>
                <div className="text-center font-bold" style={{ color: '#c0406a' }}>{row.night}</div>
                <div className="text-center font-bold" style={{ color: '#c0406a' }}>{row.late}</div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3 text-center" style={{ color: '#c0a0a8' }}>※ 도로 상황·기상·행사 일정에 따라 배정 시간은 변동될 수 있습니다.</p>
        </div>
      </div>

      {/* 지도 */}
      <div className="py-10" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-5">
            <div className="text-xs tracking-widest uppercase mb-1" style={{ color: '#c0406a' }}>Service Area</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', color: '#3a1828', fontWeight: 400 }}>
              {city} 서비스 권역
            </h2>
          </div>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
            <iframe
              title={`${city} 지도`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(city)}&output=embed&z=12&hl=ko`}
              width="100%"
              height="360"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-xs mt-3" style={{ color: '#c0a0a8' }}>※ 지하 주차장 입구와 호실 번호만 공유하시면 프런트 노출 없이 조용하게 방문합니다.</p>
        </div>
      </div>

      {/* ② 동선 & 회복 루틴 */}
      <div className="py-14" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-10">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Recovery Routine</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#3a1828', fontWeight: 400 }}>
              {city} 동선 & 회복 루틴
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#9a607a' }}>
              {city} 이동·업무·생활 패턴에 맞춘 회복 루틴을 제안합니다.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {routineItems.map((r, i) => (
              <div key={i} className="rounded-2xl border p-6" style={{ borderColor: '#fce8ef', background: '#fff8fa' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{r.icon}</span>
                  <h3 className="font-medium text-sm" style={{ color: '#3a1828' }}>{r.title}</h3>
                </div>
                <ul className="flex flex-col gap-2">
                  {r.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: '#5a3040' }}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: '#c0406a' }}>✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑤ 블로그 미리보기 */}
      <div className="py-12" style={{ background: '#fff8fa' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Blog</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#3a1828', fontWeight: 400 }}>
              {city} 출장마사지 블로그
            </h2>
            <p className="text-xs mt-2" style={{ color: '#9a607a' }}>{city} 동선에 맞춘 회복 인사이트</p>
          </div>
          <div className="flex flex-col gap-4">
            {displayBlogs.map((post, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border bg-white p-4" style={{ borderColor: '#fce8ef' }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-medium leading-snug mb-1" style={{ color: '#3a1828' }}>{post.title}</h3>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#9a607a' }}>{post.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#fce8ef', color: '#c0406a' }}>{post.cat}</span>
                    <span className="text-[10px]" style={{ color: '#c0a0a8' }}>{post.date} · {post.read}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑥ 고객 후기 */}
      <div className="py-12" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>Reviews</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#3a1828', fontWeight: 400 }}>
              {city} 출장마사지 고객 후기
            </h2>
            <p className="text-xs mt-2" style={{ color: '#9a607a' }}>{city} 일대 실제 이용 사례</p>
          </div>
          <div className="flex flex-col gap-5">
            {cityReviews.map((r, i) => (
              <div key={i} className="rounded-2xl border p-6" style={{ borderColor: '#fce8ef', background: '#fff8fa' }}>
                <div className="flex items-center gap-1 mb-3">
                  {'★★★★★'.split('').map((s, j) => (
                    <span key={j} style={{ color: '#f5a623', fontSize: 14 }}>{s}</span>
                  ))}
                </div>
                <h3 className="text-sm font-medium mb-2" style={{ color: '#3a1828' }}>{r.title}</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#7a4055' }}>{r.content}</p>
                <div className="text-[10px] px-3 py-1 rounded-full inline-block" style={{ background: '#fce8ef', color: '#c0406a' }}>{r.info}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑦ FAQ */}
      <div className="py-12" style={{ background: '#fff8fa' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c0406a' }}>FAQ</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#3a1828', fontWeight: 400 }}>
              {city} FAQ / 자주 묻는 질문
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: '#fce8ef' }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
                  style={{ background: openFaqIdx === i ? '#fff0f4' : 'white', color: '#3a1828' }}
                  onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                >
                  Q. {faq.q}
                  <span style={{ color: '#c0406a', fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>{openFaqIdx === i ? '−' : '+'}</span>
                </button>
                {openFaqIdx === i && (
                  <div className="px-5 pb-4 pt-1 text-xs leading-relaxed" style={{ color: '#7a4055', background: '#fff0f4' }}>
                    <span className="font-medium" style={{ color: '#c0406a' }}>A. </span>{faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⑧ 하단 마무리 */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm leading-relaxed" style={{ color: '#5a3040' }}>
          굿데이출장마사지는 <strong>{city}</strong> 권역의 주요 동선을 파악하여, 지하 주차장 진입로와 호수만 공유하면 프런트와 타인의 시선 없이 신속하게 방문합니다.
          오늘의 피로를 완전히 해소하는 것이 내일의 성공으로 이어집니다. 이동 없이 회복하세요.
        </p>
      </div>

      {/* ⑨ 하단 CTA */}
      <div className="py-14 text-center px-6" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'white', fontWeight: 400, marginBottom: '1rem' }}>
          지금 바로 예약하세요
        </h2>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,210,225,0.8)' }}>24시간 연중무휴 · {city} 전 지역 방문</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={openCrispChat}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
            style={{ background: '#FEE500', color: '#3a1828' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
            카카오톡 상담
          </button>
          <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-white hover:opacity-90 transition-opacity"
            style={{ background: '#2AABEE' }}>
            ✈️ 텔레그램 상담
          </a>
        </div>
      </div>

      {/* 예약하기 / 테라피스트 보기 / 코스안내 탭 - 하단 고정 */}
      <div className="fixed bottom-0 inset-x-0 z-50 flex" style={{ borderTop: '1px solid #fce8ef', boxShadow: '0 -4px 20px rgba(200,70,110,0.1)' }}>
        <button
          onClick={openCrispChat}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium"
          style={{ background: '#FEE500', color: '#3a1828' }}
        >
          <span>📞</span>
          <span>예약하기</span>
        </button>
        <button
          onClick={onClose}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium border-l border-r"
          style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)', color: 'white', borderColor: '#fce8ef' }}
        >
          <span>🔥</span>
          <span>테라피스트 보기</span>
        </button>
        <button
          onClick={onClose}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium"
          style={{ background: 'white', color: '#c0406a' }}
        >
          <span>📋</span>
          <span>코스안내</span>
        </button>
      </div>

    </div>
  )
}

function ServiceFaqItem({ faq, last }: { faq: { q: string; a: string }; last: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid #fce8ef' }}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
        style={{ background: open ? '#fff0f4' : 'white', color: '#3a1828' }}
        onClick={() => setOpen(o => !o)}
      >
        {faq.q}
        <span style={{ color: '#c0406a', fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs leading-relaxed" style={{ color: '#7a4055', background: '#fff0f4' }}>
          {faq.a}
        </div>
      )}
    </div>
  )
}

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#fce8ef' }}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium"
        style={{ background: open ? '#fff0f4' : 'white', color: '#3a1828' }}
        onClick={() => setOpen(o => !o)}
      >
        {faq.q}
        <span style={{ color: '#c0406a', fontSize: '1.2rem', lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs leading-relaxed" style={{ color: '#7a4055', background: '#fff0f4' }}>
          {faq.a}
        </div>
      )}
    </div>
  )
}

function CitiesDirectory() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const openCrispChat = () => {
    try { (window as any).$crisp?.push(['do', 'chat:open']) } catch {}
  }
  const q = query.trim().toLowerCase()
  const filtered = q
    ? REGIONS.map(r => ({
        ...r,
        cities: r.cities.filter(c => c.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)),
      })).filter(r => r.cities.length > 0)
    : REGIONS

  return (
    <div style={{ background: '#fff8fa' }}>
      {/* 검색 바 */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0406a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="지역명으로 검색 (예: 강남, 수원, 해운대)"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'white', border: '1.5px solid #fce8ef', color: '#3a1828' }}
          />
        </div>
      </div>

      {/* 지역 목록 */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-sm" style={{ color: '#c0a0a8' }}>검색 결과가 없습니다.</div>
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: '#fce8ef' }}>
            {filtered.map(region => (
              <div key={region.name} className="flex flex-col sm:flex-row gap-4 sm:gap-8 py-6">
                <div className="flex-shrink-0 sm:w-20 pt-0.5">
                  <span className="text-sm font-medium" style={{ color: '#c0406a' }}>{region.name} 출장마사지</span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {region.cities.map(city => (
                    <button
                      key={city}
                      onClick={() => navigate(`/cities/${encodeURIComponent(city)}`)}
                      className="text-sm transition-colors text-left hover:underline"
                      style={{ color: '#5a3040' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#c0406a')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#5a3040')}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

function CitiesPage() {
  const [query, setQuery] = useState('')
  const filtered = query.trim()
    ? REGIONS.map(r => ({ ...r, cities: r.cities.filter(c => c.includes(query.trim())) })).filter(r => r.cities.length > 0)
    : REGIONS
  return (
    <div style={{ background: 'white' }}>
      {/* 히어로 */}
      <div className="relative py-20 text-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #fda4b2, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="text-xs tracking-widest uppercase mb-4" style={{ color: '#fda4b2' }}>지역 선택 · Coverage</div>
          <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', fontWeight: 400 }}>
            굿데이 마사지 서비스 지역
          </h2>
          <p className="mt-3 mb-8 text-sm" style={{ color: 'rgba(255,220,230,0.8)' }}>
            원하시는 지역명을 검색하거나 시·도를 선택하세요
          </p>
          {/* 검색창 */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="지역명을 입력하세요 (예: 강남, 해운대, 제주)"
              className="w-full px-5 py-3.5 rounded-full text-sm outline-none"
              style={{ background: 'white', color: '#3a1828', paddingRight: '3rem' }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-300 text-lg">🔍</span>
          </div>
          {query && filtered.length === 0 && (
            <p className="mt-4 text-sm" style={{ color: 'rgba(255,200,220,0.8)' }}>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
      {/* 도시 목록 */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-10">
            {filtered.map(r => (
              <div key={r.name}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-medium" style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: '1.4rem', color: '#3a1828' }}>{r.name} 출장마사지</h3>
                  <div className="flex-1 h-px" style={{ background: '#fce8ef' }} />
                  <span className="text-xs" style={{ color: '#c0a0a8' }}>{r.cities.length}개 지역</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.cities.map(city => (
                    <a key={city} href="#contact"
                      onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                      className="group flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ borderColor: '#fce8ef', color: '#5a3040', background: '#fff8fa' }}>
                      <span style={{ color: '#fda4b2', fontSize: '0.6rem' }}>●</span>
                      {city}
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#c0406a' }}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #fff0f4, #fce8ef)' }}>
          <p className="text-sm mb-4" style={{ color: '#7a4055' }}>원하시는 지역이 목록에 없으신가요?<br />1:1 문의로 확인해 드립니다.</p>
          <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
            지역 문의하기 →
          </a>
        </div>
      </div>
      {/* 지도 */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202391.14!2d126.7784!3d37.5665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca2012d5c39cf%3A0x7e11eca1405bf29b!2z7ISc7Jq4!5e0!3m2!1sko!2skr!4v1"
        width="100%" height="300"
        style={{ border: 0, display: 'block' }}
        allowFullScreen loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="전국 서비스 지역 지도"
      />
    </div>
  )
}

function RegionTabs() {
  const [active, setActive] = useState(0)
  const tab = REGION_TABS[active]
  return (
    <div className="py-16" style={{ background: 'white' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Area Guide</div>
          <h3 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#3a1828', fontWeight: 400 }}>권역별 케어 가이드</h3>
        </div>
        {/* Tab buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          {REGION_TABS.map((t, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active === i ? 'linear-gradient(135deg, #f9a8b8, #e05080)' : '#fff8fa',
                color: active === i ? 'white' : '#7a4055',
                border: `1px solid ${active === i ? 'transparent' : '#fce8ef'}`,
              }}>
              <span style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: '1.1rem', fontWeight: 600 }}>{i + 1}</span>
              <span className="text-xs text-left leading-tight">{t.label}</span>
            </button>
          ))}
        </div>
        {/* Tab content */}
        <div className="rounded-2xl p-7 border" style={{ borderColor: '#fce8ef', background: '#fff8fa' }}>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#7a4055' }}>{tab.desc}</p>
          <ul className="flex flex-col gap-2 mb-6">
            {tab.points.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#5a3040' }}>
                <span style={{ color: '#c0406a', flexShrink: 0 }}>✦</span>
                {pt}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {tab.areas.map(a => (
              <span key={a} className="text-xs px-3 py-1 rounded-full" style={{ background: '#fce8ef', color: '#c0406a' }}>{a}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PullToRefresh({ children }: { children: ReactNode }) {
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const distanceRef = useRef(0)
  const pulling = useRef(false)

  useEffect(() => {
    const updateDistance = (distance: number) => {
      distanceRef.current = distance
      setPullDistance(distance)
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (window.scrollY !== 0 || event.touches.length !== 1 || refreshing) return
      startY.current = event.touches[0].clientY
      pulling.current = true
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!pulling.current || window.scrollY !== 0 || event.touches.length !== 1) return

      const movement = event.touches[0].clientY - startY.current
      if (movement <= 0) {
        updateDistance(0)
        return
      }

      event.preventDefault()
      updateDistance(Math.min(112, movement * 0.48))
    }

    const handleTouchEnd = () => {
      if (!pulling.current) return
      pulling.current = false

      if (distanceRef.current >= 72) {
        setRefreshing(true)
        updateDistance(56)
        window.setTimeout(() => window.location.reload(), 250)
        return
      }

      updateDistance(0)
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [refreshing])

  const ready = pullDistance >= 72

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full border bg-white/95 px-4 py-2 text-xs shadow-lg backdrop-blur-md transition-[transform,opacity] duration-150"
        style={{
          top: 'max(10px, env(safe-area-inset-top))',
          borderColor: '#fce8ef',
          color: '#7a4055',
          opacity: pullDistance > 4 ? 1 : 0,
          transform: `translate(-50%, ${Math.max(-48, pullDistance - 48)}px)`,
        }}
      >
        <span
          className={`block h-4 w-4 rounded-full border-2 border-rose-200 border-t-rose-500 ${refreshing ? 'animate-spin' : ''}`}
          style={!refreshing ? { transform: `rotate(${pullDistance * 3}deg)` } : undefined}
        />
        <span>{refreshing ? '새로고침 중' : ready ? '놓아서 새로고침' : '아래로 당겨 새로고침'}</span>
      </div>
      {children}
    </>
  )
}

export default function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightboxImg, setLightboxImg] = useState<{ src: string; name: string } | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [showVip, setShowVip] = useState(false)
  const [currentPage, setCurrentPage] = useState(() => {
    const pageFromHash = window.location.hash.replace('#', '')
    return NAV_ITEMS.some(item => item.href === `#${pageFromHash}`) ? pageFromHash : 'home'
  })

  const navigateTo = useCallback((href: string) => {
    setTransitioning(true)
    setMenuOpen(false)
    setTimeout(() => {
      const id = href.replace('#', '')
      setCurrentPage(id)
      const nextUrl = id === 'home'
        ? `${window.location.pathname}${window.location.search}`
        : href
      window.history.replaceState(null, '', nextUrl)
      setTransitioning(false)
      window.scrollTo(0, 0)
    }, 350)
  }, [])

  return (
    <PullToRefresh>
      <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'NexonLv1Gothic', sans-serif", background: '#fdf8f9' }}>

      {showVip && <VipPage onClose={() => setShowVip(false)} onGoTherapists={() => { setShowVip(false); navigateTo('#therapists') }} />}

      {/* ── TOP NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigateTo('#home')} className="flex flex-col leading-none">
            <span style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: '1.4rem', fontWeight: 600, color: '#c0406a', letterSpacing: '0.05em' }}>굿데이</span>
            <span style={{ fontSize: '0.65rem', color: '#000000', letterSpacing: '0.15em', fontWeight: 700 }}>출장마사지</span>
          </button>
          {/* Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map(item => {
              const pageId = item.href.replace('#', '')
              const active = currentPage === pageId
              return (
                <button key={item.label} onClick={() => navigateTo(item.href)}
                  className="text-xs transition-colors tracking-wide whitespace-nowrap relative"
                  style={{ color: active ? '#c0406a' : undefined }}
                  >
                  <span className={active ? 'text-rose-500 font-medium' : 'text-rose-900/70 hover:text-rose-500'}>
                    {item.label}
                  </span>
                  {active && <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ background: '#c0406a' }} />}
                </button>
              )
            })}
          </nav>
          <button type="button" onClick={openCrispChat}
            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
            📞 1:1 예약 문의
          </button>
          {/* Mobile hamburger */}
          <button className="lg:hidden flex items-center gap-1.5 p-1" onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#c0406a' }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
            </svg>
            {!menuOpen && <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 700 }}>더보기</span>}
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-rose-50 px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(item => (
              <button key={item.label} onClick={() => navigateTo(item.href)}
                className="text-sm text-rose-900/70 hover:text-rose-500 py-2 text-left border-b border-rose-50 last:border-0">
                {item.label}
              </button>
            ))}
            <button type="button" onClick={openCrispChat}
              className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
              📞 1:1 예약 문의
            </button>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      {currentPage === 'home' && <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-36">
        {/* Background */}
        <div className="absolute inset-0">
          <video src="/hero-video.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(58,10,30,0.05)' }} />
        </div>
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center z-10 animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,200,220,0.6)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round"/></svg>
        </div>
      </section>}

      {/* ── SERVICES ── */}
      {currentPage === 'services' && <section id="services" className="py-0 min-h-screen" style={{ background: 'white' }}>

        {/* 코스 상세 안내 */}
        <div className="py-16" style={{ background: '#fff8fa' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Course Details</div>
              <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#3a1828', fontWeight: 400 }}>코스 상세 안내</h2>
            </div>
            <div className="flex flex-col gap-6">

              {/* VIP */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #2a1020, #5a1838)', boxShadow: '0 8px 40px rgba(90,24,56,0.35)' }}>
                {/* VIP 헤더 */}
                <div className="px-6 pt-7 pb-4 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fda4b2, transparent 55%)' }} />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                      style={{ background: 'rgba(253,164,178,0.15)', border: '1px solid rgba(253,164,178,0.4)' }}>
                      <span className="text-[10px] tracking-widest font-semibold" style={{ color: '#fda4b2' }}>❤️ PREMIUM · VIP ONLY</span>
                    </div>
                    <h3 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'white', fontWeight: 400 }}>
                      VIP 남성 전용
                    </h3>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,210,225,0.7)' }}>오직 당신만을 위한, 단 1%의 특권</p>
                  </div>
                </div>

                {/* 가격 카드 3개 나란히 */}
                <div className="px-5 pb-5 grid grid-cols-3 gap-3">
                  {[
                    { icon: '👍', time: '80분', price: '150,000원', desc: '컨디션 리셋' },
                    { icon: '✌️', time: '120분', price: '200,000원', desc: '집중 케어' },
                    { icon: '🔥', time: '240분', price: '300,000원', desc: '완전 회복' },
                  ].map((t, i) => (
                    <div key={t.time} className="rounded-xl py-5 px-3 text-center flex flex-col items-center gap-1.5"
                      style={{
                        background: i === 1 ? 'rgba(253,164,178,0.18)' : 'rgba(255,255,255,0.07)',
                        border: i === 1 ? '1px solid rgba(253,164,178,0.45)' : '1px solid rgba(255,255,255,0.1)',
                      }}>
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-sm font-medium" style={{ color: 'white' }}>{t.time}</span>
                      <span className="text-base font-bold" style={{ color: '#fda4b2' }}>{t.price}</span>
                      <span className="text-[10px]" style={{ color: 'rgba(255,210,225,0.6)' }}>{t.desc}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-5 pb-6 flex justify-center">
                  <button
                    onClick={() => setShowVip(true)}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)', color: 'white', boxShadow: '0 6px 20px rgba(224,80,128,0.5)' }}>
                    ✦ VIP 자세히 보기
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>

              {/* 일반 코스 4개 */}
              {[
                {
                  name: '스포츠 마사지', icon: '💪', tag: '근막 이완 · 피로회복 · 가동범위 개선',
                  desc: '강한 압으로 뭉친 근육과 근막을 집중 이완합니다. 운동 후 또는 육체 노동 직후에 효과적입니다.',
                  prices: [['80분', '100,000원'], ['110분', '130,000원'], ['140분', '190,000원']],
                },
                {
                  name: '아로마 테라피', icon: '🌿', tag: '심신 이완 · 숙면 · 전신 순환 촉진',
                  desc: '천연 에센셜 오일 블렌딩으로 감각을 깨우고 정서적 안정을 유도합니다. 야간 릴랙스에 특화됩니다.',
                  prices: [['80분', '120,000원'], ['110분', '150,000원'], ['140분', '210,000원']],
                },
                {
                  name: '스웨디시', icon: '🌸', tag: '정서 안정 · 피부 보습 · 컨디션 회복',
                  desc: '오일을 활용한 부드럽고 리드미컬한 전신 테크닉. 심신 안정과 깊은 숙면 유도에 탁월합니다.',
                  prices: [['80분', '150,000원'], ['110분', '180,000원'], ['140분', '240,000원']],
                },
                {
                  name: '림프순환', icon: '💧', tag: '부종 완화 · 노폐물 배출 · 회복 촉진',
                  desc: '정밀한 드레나지 기법으로 부종과 피로를 동시에 해소합니다. 좌식·입식 직군에 강력 추천합니다.',
                  prices: [['80분', '200,000원'], ['110분', '230,000원'], ['140분', '290,000원']],
                },
              ].map(svc => (
                <div key={svc.name} className="rounded-2xl border overflow-hidden" style={{ borderColor: '#fce8ef', background: 'white' }}>
                  {/* 헤더 */}
                  <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#fff0f4', borderBottom: '1px solid #fce8ef' }}>
                    <span className="text-2xl">{svc.icon}</span>
                    <div>
                      <h3 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: '1.3rem', color: '#3a1828', fontWeight: 400 }}>{svc.name}</h3>
                      <div className="text-xs mt-0.5" style={{ color: '#c0406a' }}>{svc.tag}</div>
                    </div>
                  </div>
                  {/* 소개 */}
                  <div className="px-6 pt-5 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: '#5a3040' }}>{svc.desc}</p>
                  </div>
                  {/* 시간 / 가격 테이블 */}
                  <div className="px-6 pb-6">
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 text-xs font-medium text-center" style={{ background: '#3a1828', color: '#fda4b2' }}>시간</div>
                        <div className="px-4 py-2 text-xs font-medium text-center" style={{ background: '#3a1828', color: '#fda4b2', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>가격</div>
                      </div>
                      {svc.prices.map(([time, price], i) => (
                        <div key={time} className="grid grid-cols-2" style={{ background: i % 2 === 0 ? 'white' : '#fff8fa', borderTop: '1px solid #fce8ef' }}>
                          <div className="px-4 py-3 text-sm font-medium text-center" style={{ color: '#3a1828' }}>{time}</div>
                          <div className="px-4 py-3 text-sm font-semibold text-center" style={{ color: '#c0406a', borderLeft: '1px solid #fce8ef' }}>{price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 코스 비교표 */}
        <div className="py-16" style={{ background: 'white' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Comparison</div>
              <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>코스 비교표</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #3a1828, #6b2040)' }}>
                    {['코스명', '압 강도', '추천 대상'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#fda4b2' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['스포츠', 5, '강', '운동 후 피로'],
                    ['스웨디시', 3, '중', '정서적 휴식'],
                    ['아로마', 2, '약~중', '향 선호'],
                    ['림프순환', 3, '중', '좌·입식 직군'],
                  ].map(([name, level, label, target], i) => (
                    <tr key={name as string} style={{ background: i % 2 === 0 ? 'white' : '#fff8fa' }}>
                      <td className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: '#3a1828' }}>{name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {[1,2,3,4,5].map(n => (
                            <span key={n} className="rounded-full" style={{ width: 8, height: 8, display: 'inline-block', background: n <= (level as number) ? '#c0406a' : '#fce8ef' }} />
                          ))}
                          <span className="text-xs ml-1" style={{ color: '#c0406a' }}>{label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#7a4055' }}>{target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 이용 후기 */}
        <div className="py-16" style={{ background: '#fff8fa' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Reviews</div>
              <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>실제 이용 후기</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { area: '강남', svc: '스포츠 90분', text: '운동 직후 예약했는데 30분 만에 도착해주셨어요. 압이 세서 뭉친 근육이 확실히 풀렸습니다. 최고예요.' },
                { area: '여의도', svc: '스웨디시 120분', text: '호텔 출장 중 이용했는데 프라이빗하게 입실해주셔서 좋았어요. 릴랙싱이 확실히 됐습니다.' },
                { area: '마포', svc: '아로마 90분', text: '오일 향이 너무 좋았고, 스트레스가 확 풀리는 느낌이었어요. 심야에도 빠르게 배정해주셨습니다.' },
              ].map((r, i) => (
                <div key={i} className="rounded-2xl p-6 border bg-white" style={{ borderColor: '#fce8ef' }}>
                  <div style={{ color: '#fda4b2' }}>{'★★★★★'}</div>
                  <p className="text-xs leading-relaxed my-4" style={{ color: '#5a3040' }}>"{r.text}"</p>
                  <div className="border-t pt-3" style={{ borderColor: '#fce8ef' }}>
                    <div className="text-xs font-medium" style={{ color: '#3a1828' }}>{r.area}</div>
                    <div className="text-xs" style={{ color: '#c0406a' }}>{r.svc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 코스 선택 가이드 */}
        <div className="py-16" style={{ background: 'white' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Guide</div>
              <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>코스 선택 가이드</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { cond: '운동 후 근육 피로', rec: '스포츠 마사지', icon: '🏋️' },
                { cond: '스트레스·불면증', rec: '스웨디시 또는 아로마', icon: '🌙' },
                { cond: '향기 테라피 선호', rec: '아로마 테라피', icon: '🌿' },
                { cond: '부종·순환 문제', rec: '림프순환 마사지', icon: '💧' },
              ].map(g => (
                <div key={g.cond} className="flex items-start gap-4 rounded-xl p-5" style={{ background: '#fff8fa', border: '1px solid #fce8ef' }}>
                  <span className="text-2xl flex-shrink-0">{g.icon}</span>
                  <div>
                    <div className="text-xs mb-1" style={{ color: '#9a607a' }}>{g.cond}</div>
                    <div className="text-sm font-medium" style={{ color: '#3a1828' }}>→ {g.rec}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 관리 팁 */}
        <div className="py-16" style={{ background: '#fff8fa' }}>
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Care Tips</div>
              <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>마사지 효과 오래 유지하는 관리 팁</h2>
            </div>
            <ul className="flex flex-col gap-4">
              {[
                ['💧', '수분 보충', '시술 후 물을 충분히 마셔 노폐물 배출을 도와주세요.'],
                ['🧘', '가벼운 스트레칭', '이완된 근육을 유지하려면 무리한 운동보다 스트레칭이 효과적입니다.'],
                ['🚫', '음주 자제', '시술 당일 음주는 피하시고 24시간 이후 가볍게 즐기세요.'],
                ['😴', '충분한 수면', '근육 회복은 수면 중에 일어납니다. 충분한 수면을 취해주세요.'],
                ['🧴', '보습 관리', '아로마·스웨디시 후에는 보습 케어로 피부 상태를 유지하세요.'],
              ].map(([icon, title, desc]) => (
                <li key={title as string} className="flex items-start gap-4 rounded-xl p-4 bg-white border" style={{ borderColor: '#fce8ef' }}>
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <div>
                    <div className="text-sm font-medium mb-0.5" style={{ color: '#3a1828' }}>{title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: '#7a4055' }}>{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-16" style={{ background: 'white' }}>
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>FAQ</div>
              <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#3a1828', fontWeight: 400 }}>자주 묻는 질문</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#fce8ef' }}>
              {[
                { q: '코스는 어떻게 선택하나요?', a: '컨디션과 목적에 따라 테라피스트와 상담 후 결정하실 수 있습니다. 처음이라면 스웨디시나 아로마를 추천드립니다.' },
                { q: '가격이 변동되나요?', a: '100% 예약제로 운영되며 표시된 가격 외 추가 요금은 없습니다. 투명한 가격을 보장합니다.' },
                { q: '시술 전 준비사항이 있나요?', a: '특별한 준비는 필요 없습니다. 편안한 복장을 준비해 주시면 됩니다.' },
                { q: '심야 예약도 가능한가요?', a: '24시간 연중무휴 운영합니다. 심야에도 동일한 서비스를 제공합니다.' },
              ].map((faq, i, arr) => (
                <ServiceFaqItem key={i} faq={faq} last={i === arr.length - 1} />
              ))}
            </div>
          </div>
        </div>

      </section>}

      {/* ── THERAPISTS ── */}
      {currentPage === 'therapists' && <section id="therapists" className="py-0 min-h-screen" style={{ background: 'white' }}>
        {/* LIVE 헤더 배너 */}
        <div className="pt-20 pb-12 px-6 text-center" style={{ background: 'linear-gradient(160deg, #3a1828 0%, #6b2040 60%, #3a1828 100%)' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(253,164,178,0.15)', border: '1px solid rgba(253,164,178,0.35)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#fda4b2' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#fb7190' }} />
            </span>
            <span className="text-xs font-medium tracking-widest" style={{ color: '#fda4b2' }}>LIVE 테라피스트 프로필</span>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', color: 'white', fontWeight: 400, margin: 0 }}>
              현재 매칭 가능한
            </h2>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', color: 'white', fontWeight: 400, margin: 0 }}>
              테라피스트 확인하기
            </h2>
          </div>
          <p className="mt-3 text-sm" style={{ color: 'rgba(255,210,225,0.8)' }}>
            고객님 인근에서 상담 가능한 테라피스트 프로필을 한눈에 확인하세요.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#c0406a' }}>Our Team</div>
            <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#3a1828', fontWeight: 400 }}>
              테라피스트 소개
            </h2>
            <p className="text-xs mt-3" style={{ color: '#9a607a' }}>검증된 여성 전문 테라피스트만 배정됩니다</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {THERAPISTS.map(t => (
              <div key={t.name}
                className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                style={{ background: 'white', borderColor: '#fce8ef' }}
                onClick={() => t.img && setLightboxImg({ src: t.img, name: t.name })}>
                {/* Photo */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: 'linear-gradient(160deg, #fce8ef, #f9d0de)' }}>
                  {t.img ? (
                    <>
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'rgba(58,24,40,0.25)' }}>
                        <div className="bg-white/80 rounded-full px-3 py-1 text-xs font-medium" style={{ color: '#c0406a' }}>🔍 크게 보기</div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span style={{ fontSize: '3rem', opacity: 0.2 }}>👤</span>
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(58,24,40,0.45) 0%, transparent 55%)' }} />
                  <div className="absolute top-2 right-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: t.status === '실시간 상담 가능' ? 'rgba(34,197,94,0.85)' : 'rgba(251,191,36,0.85)', color: 'white', backdropFilter: 'blur(4px)', fontSize: '0.6rem' }}>
                      {t.status === '실시간 상담 가능' ? '● 상담가능' : '● 상담중'}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1.5" style={{ flexWrap: 'nowrap' }}>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: '#fff0f4', color: '#c0406a', border: '1px solid #fda4b2', fontSize: '0.6rem' }}>한국인</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: '#fff0f4', color: '#c0406a', border: '1px solid #fda4b2', fontSize: '0.6rem' }}>100% 실사</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: '1.15rem', color: '#3a1828', fontWeight: 500 }}>{t.name}</h3>
                    <span style={{ fontSize: '0.7rem', color: '#c0406a' }}>★ {t.stars}</span>
                  </div>
                  <p className="text-xs leading-relaxed mt-0.5" style={{ color: '#9a607a', fontSize: '0.68rem' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button type="button" onClick={openCrispChat}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)' }}>
              테라피스트 예약 문의하기
            </button>
          </div>
        </div>
      </section>}


      {/* ── REVIEWS ── */}
      {currentPage === 'reviews' && <ReviewPage onBook={openCrispChat} />}

      {/* ── BLOG ── */}
      {currentPage === 'blog' && <BlogPage />}

      {/* ── FAQ ── */}
      {currentPage === 'faq' && <FaqPage />}

      {/* ── REGIONS ── */}
      {currentPage === 'regions' && <section id="regions" className="py-0 min-h-screen" style={{ background: 'white' }}>

        {/* 히어로 */}
        {/* 메인 배너 */}
        <div className="w-full pt-14">
          <img src="/regions-banner.png" alt="굿데이마사지 지역선택" className="w-full" style={{ display: 'block' }} />
        </div>

        <div className="relative pt-12 pb-14 overflow-hidden" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #fda4b2 0%, transparent 60%)' }} />
          <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#fda4b2' }}>지역 선택 · Coverage</div>
              <h2 style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: 'white', fontWeight: 400 }}>
                굿데이 마사지 서비스 지역
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,220,230,0.85)' }}>
                서울 전 구역부터 전국 광역시·도까지<br />24시간 언제 어디서든 방문합니다
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              {[['🏙️', '서울·수도권'], ['🌆', '6대 광역시'], ['🌴', '제주·전국']].map(([icon, label]) => (
                <div key={label as string} className="text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-xs whitespace-nowrap" style={{ color: 'rgba(255,210,225,0.8)' }}>{label as string}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 검색 + 지역 디렉토리 */}
        <CitiesDirectory />

      </section>}

      {/* ── CONTACT CTA ── */}
      {currentPage === 'contact' && <section id="contact" className="pb-24 min-h-screen" style={{ background: '#fff8fa' }}>

        {/* 배너 이미지 */}
        <div className="w-full pt-14">
          <img src="/contact-new-banner.png" alt="굿데이마사지 예약문의" className="w-full" style={{ display: 'block' }} />
        </div>

        {/* 헤더 */}
        <div className="py-14 text-center px-6" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h2 style={{ color: 'white', fontWeight: 400, fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', margin: 0 }}>1:1 문의</h2>
            <span style={{ color: '#fda4b2', fontSize: 'clamp(1.2rem, 2.5vw, 2rem)' }}>|</span>
            <h2 style={{ color: 'white', fontWeight: 400, fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', margin: 0 }}>프리미엄 출장마사지</h2>
          </div>
          <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'rgba(255,210,225,0.85)' }}>
            서울 포함 전국 서비스 · 홈타이·스웨디시 등 다양한 코스<br />24시간 실시간 상담 제공
          </p>

          <button
            type="button"
            onClick={openCrispChat}
            className="mt-7 flex flex-col items-center gap-2 mx-auto"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span
              className="px-5 py-2 rounded-full text-sm font-medium tracking-wide"
              style={{
                background: 'rgba(253,164,178,0.18)',
                border: '1px solid rgba(253,164,178,0.5)',
                color: '#ffffff',
                letterSpacing: '0.08em',
                fontWeight: 700,
              }}
            >
              터치시 상담연결
            </span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="#fda4b2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 예약 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button type="button" onClick={openCrispChat}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
              번호공개❌ 익명 예약 (추천)
            </button>
            <button type="button" onClick={openCrispChat}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#FEE500', color: '#3a1828' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
              카카오톡 예약
            </button>
            <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: '#2AABEE' }}>
              ✈️ 텔레그램 예약
            </a>
          </div>
        </div>


        {/* 왜 굿데이인가 */}
        <div className="max-w-3xl mx-auto px-6 mt-10">
          <h3 className="font-medium mb-5 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>왜 굿데이일까요?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🕐', title: '24시간 운영', desc: '심야·주말 상시 상담·배정' },
              { icon: '🗺️', title: '전국 커버리지', desc: '서울·수도권·광역시 전역' },
              { icon: '👩', title: '여성 전담팀', desc: '숙련 테라피스트 매칭' },
              { icon: '🧴', title: '위생·안전', desc: '일회용·소독·프라이버시 철저' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
                <div className="text-2xl">{f.icon}</div>
                <div>
                  <div className="font-medium text-sm mb-1" style={{ color: '#3a1828' }}>{f.title}</div>
                  <p className="text-xs" style={{ color: '#9a607a' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 서비스 진행 5단계 */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <h3 className="font-medium mb-6 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>서비스 진행 과정</h3>
          <div className="flex flex-col gap-3">
            {[
              { step: '01', title: '상담', desc: '지역·코스·선호/주의 부위 확인' },
              { step: '02', title: '배정', desc: '평균 20~30분 내 테라피스트 매칭 안내' },
              { step: '03', title: '방문·진행', desc: '호텔·오피스텔·자택 방문 서비스' },
              { step: '04', title: '결제', desc: '서비스 종료 후 현장 결제' },
              { step: '05', title: '사후 안내', desc: '케어 포인트 및 재방문 추천 안내' },
            ].map((s, i, arr) => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: '#c0406a' }}>{s.step}</div>
                  {i < arr.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: '#fce8ef', minHeight: 20 }} />}
                </div>
                <div className="pb-4">
                  <div className="font-medium text-sm" style={{ color: '#3a1828' }}>{s.title}</div>
                  <p className="text-xs mt-0.5" style={{ color: '#9a607a' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 이용 후기 */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <h3 className="font-medium mb-5 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>실제 이용 후기</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { area: '강남 · 스웨디시 90분', text: '어깨·목이 확 풀렸어요. 다음 날 일정이 훨씬 가벼웠습니다.' },
              { area: '마포 · 아로마 60분', text: '심야인데 배정이 빠르고, 위생·매너 모두 만족합니다.' },
              { area: '잠실 · 림프 90분', text: '붓기가 빠졌어요. 친절한 설명 덕분에 신뢰가 갔습니다.' },
            ].map(r => (
              <div key={r.area} className="rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
                <div className="text-yellow-400 text-sm mb-2">★★★★★</div>
                <div className="text-xs font-medium mb-2" style={{ color: '#c0406a' }}>{r.area}</div>
                <p className="text-xs leading-relaxed" style={{ color: '#7a4055' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 이용 유의사항 */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <h3 className="font-medium mb-5 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>이용 유의사항</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: '예약·변경·취소', items: ['배정 확정 전 일정·코스 변경 가능', '확정 후 취소 시 콜 이동 비용 발생 가능', '지연·부재 시 진행 시간 단축 가능', '노쇼·무단취소 증가로 신규 고객은 선불 결제 적용', '기존 고객 및 지인 추천 고객은 예외', '10년 이상 한결같이 운영된 신뢰도 높은 업체'] },
              { title: '서비스 이용 안내', items: ['맘에 드시는 테라피스트 선택 및 출장여부 확인', '상담매니저와 스케줄 잡기 (이름 / 장소 / 시간)', '첫이용시 코스별 지정된 출장비 지불', '예약완료'] },
              { title: '위생·방역', items: ['일회용 시트/타월, 장비 현장 소독', '손 위생 및 위생 프로토콜 준수', '감염성 증상 시 예약 보류 권장'] },
              { title: '프라이버시', items: ['민감 정보 최소 보관', 'CCTV 각도 조정·가림 권장', '무단 촬영 금지'] },
            ].map(g => (
              <div key={g.title} className="rounded-2xl p-5 bg-white border" style={{ borderColor: '#fce8ef' }}>
                <div className="font-medium text-sm mb-3" style={{ color: '#3a1828' }}>{g.title}</div>
                <ul className="flex flex-col gap-1.5">
                  {g.items.map(item => (
                    <li key={item} className="text-xs flex items-start gap-2" style={{ color: '#7a4055' }}>
                      <span style={{ color: '#c0406a', flexShrink: 0 }}>·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <h3 className="font-medium mb-5 text-center" style={{ color: '#3a1828', fontSize: '1.1rem' }}>자주 묻는 질문</h3>
          <div className="flex flex-col gap-2">
            {[
              { q: '심야에도 가능한가요?', a: '연중무휴 24시간 운영합니다. 심야·우천·행사 시즌은 배정 소요 시간이 변동될 수 있습니다.' },
              { q: '테라피스트 지정이 가능한가요?', a: '가능 시 우선 배정해드립니다. 선호 압·스타일·이전 이용 이력을 제공하시면 매칭 정확도가 높아집니다.' },
              { q: '디파짓이란 무엇인가요?', a: '고객 정보 보호 및 안전한 서비스 환경 조성을 위한 제도입니다. 디파짓은 디파짓 명의로 입금하시며, 50만원을 예치 후 서비스 정상 완료·테라피스트 퇴실 후 즉시 전액 환불됩니다.' },
            ].map((faq, i, arr) => (
              <ContactFaqItem key={i} faq={faq} />
            ))}
          </div>
        </div>

        {/* 하단 예약 CTA */}
        <div className="max-w-3xl mx-auto px-6 mt-12 text-center">
          <div className="rounded-2xl py-10 px-6" style={{ background: 'linear-gradient(160deg, #3a1828, #6b2040)' }}>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,210,225,0.85)' }}>지금 바로 문의하고 빠른 배정 받으세요</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" onClick={openCrispChat}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm hover:opacity-90"
                style={{ background: '#FEE500', color: '#3a1828' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.8c0 3.07 1.73 5.77 4.35 7.43L5.5 22l4.13-2.17c.77.17 1.57.27 2.37.27 5.52 0 10-3.92 10-8.8S17.52 2 12 2z"/></svg>
                카카오톡 상담
              </button>
              <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm text-white hover:opacity-90"
                style={{ background: '#2AABEE' }}>
                ✈️ 텔레그램 상담
              </a>
            </div>
          </div>
        </div>

      </section>}


{/* ── FOOTER (home에서만) ── */}
      {currentPage === 'home' && <footer className="py-10 border-t" style={{ background: '#2a1020', borderColor: '#4a2038' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-6">
            <div>
              <div style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: '1.4rem', color: '#fda4b2', fontWeight: 600 }}>굿데이</div>
              <div className="text-xs tracking-widest mt-0.5" style={{ color: '#9a607a' }}>프리미엄 출장마사지</div>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: '#7a4055' }}>
                (주) 굿데이출장마사지<br />
                대표이사: 강우빈<br />
                사업자등록번호: 641-46-12023<br />
                본사 주소: 서울 서대문구 신촌로 109
              </p>
            </div>
          </div>
          <div className="border-t pt-5 text-xs" style={{ borderColor: '#4a2038', color: '#5a3040' }}>
            © 2026 굿데이 출장마사지. All rights reserved.
          </div>
        </div>
      </footer>}

      {/* ── BOTTOM STICKY BAR (krmassage.com 동일) ── */}
<div className="fixed bottom-0 inset-x-0 z-50 flex" style={{ background: 'white', borderTop: '1px solid #fce8ef', boxShadow: '0 -4px 20px rgba(200,70,110,0.1)' }}>
        <button onClick={() => navigateTo('#contact')}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium transition-opacity hover:opacity-90"
          style={{ background: '#FEE500', color: '#3a1828' }}>
          <span>📞</span>
          <span>예약하기</span>
        </button>
        <button onClick={() => navigateTo('#therapists')}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium border-l border-r transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f9a8b8, #e05080)', color: 'white', borderColor: '#fce8ef' }}>
          <span>🔥</span>
          <span>테라피스트 보기</span>
        </button>
        <button onClick={() => navigateTo('#services')}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium"
          style={{ color: '#c0406a' }}>
          <span>📋</span>
          <span>코스안내</span>
        </button>
      </div>

      {/* ── PAGE TRANSITION OVERLAY ── */}
      <div className="fixed inset-0 z-[200] pointer-events-none"
        style={{
          background: 'linear-gradient(160deg, #fce8ef, #f9a8b8)',
          opacity: transitioning ? 1 : 0,
          transition: transitioning ? 'opacity 0.25s ease-in' : 'opacity 0.25s ease-out',
        }} />

      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(30,10,20,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setLightboxImg(null)}>
          <div className="relative max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxImg(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-2xl transition-colors">✕</button>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src={lightboxImg.src} alt={lightboxImg.name} className="w-full object-contain max-h-[80vh]" />
            </div>
            <div className="text-center mt-4">
              <span style={{ fontFamily: "'NexonLv1Gothic', sans-serif", fontSize: '1.5rem', color: 'white', fontWeight: 400 }}>{lightboxImg.name}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </PullToRefresh>
  )
}

function getRegionForCity(city: string): string {
  return REGIONS.find(r => r.cities.includes(city))?.name ?? ''
}

export function CityPageRoute() {
  const { city } = useParams<{ city: string }>()
  const navigate = useNavigate()
  const decodedCity = decodeURIComponent(city ?? '')
  const regionName = getRegionForCity(decodedCity)
  return (
    <PullToRefresh>
      <CityPage
        city={decodedCity}
        regionName={regionName}
        onClose={() => navigate(-1)}
      />
    </PullToRefresh>
  )
}
