import Link from 'next/link'

export default function NotFound() {
  return <main className="max-w-2xl mx-auto px-6 py-20"><h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1><p className="my-6">주소를 확인하거나 홈에서 원하는 정보를 찾아주세요.</p><Link href="/" className="underline">홈으로 이동</Link> · <Link href="/cities" className="underline">지역 안내</Link></main>
}
