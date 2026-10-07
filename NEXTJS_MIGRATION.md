# Next.js 전환

현재 작업본은 React + Vite에서 Next.js 16.4 App Router로 전환되었습니다. Next.js도 React 기반이며, 기존 컴포넌트와 디자인을 재사용합니다.

- app/의 실제 페이지와 generateStaticParams로 홈·코스·상담·지역·블로그를 미리 생성합니다.
- 제목·설명·canonical·Open Graph는 Next.js Metadata API에서 제공합니다.
- 사이트맵과 robots.txt는 Next.js 메타데이터 경로로 생성합니다.
- 기존 지역 주소는 next.config.ts의 영구 리디렉션으로 연결합니다.
- 없는 주소는 Next.js의 notFound 처리로 404 응답을 제공합니다.
- 첫 화면에는 Next.js Image 최적화를 적용하고 영상은 선택 재생으로 유지합니다.
- 가격, 예약 상담 연결, 신규 고객 선불·기존 고객 후불 기준을 유지합니다.
- 본문이 없는 98개 블로그 요약은 검색 대상에서 제외하고, 본문을 보완한 3개 글과 기본·지역 페이지를 사이트맵에 포함합니다.

개발: pnpm dev

검증: pnpm run check, pnpm run build, pnpm run test:seo

운영 모드 로컬 확인: pnpm start

Vercel은 vercel.json의 nextjs 프레임워크 설정을 사용합니다. 원래 저장소의 Figma/Vite용 작업 안내는 이전 환경의 안내이며, 새 개발에서는 이 전환 문서와 Next.js 구조를 따릅니다.

운영 사이트 배포 여부와 성능 점수는 실제 배포 검증 결과로 확인해야 합니다. Next.js로 변경하는 것만으로 검색 순위나 특정 점수가 보장되지는 않습니다.
