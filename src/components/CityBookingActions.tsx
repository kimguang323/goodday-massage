'use client'
import { openCrispChat, prepareCrispChat } from '../crisp'
export default function CityBookingActions({ regionName, city }: { regionName: string; city: string }) {
  return (
    <aside aria-label={`${regionName} ${city} 고정 예약 상담`} className="fixed inset-x-0 bottom-0 z-50 border-t border-rose-100 bg-white px-4 pt-3" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3">
      <button type="button" onPointerEnter={prepareCrispChat} onFocus={prepareCrispChat} onPointerDown={prepareCrispChat} onClick={openCrispChat} className="booking-shimmer min-h-16 w-full rounded-full bg-rose-800 px-3 py-3 text-sm font-semibold text-white sm:text-base">{regionName} {city}<br />방문 상담하기</button>
      <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer" className="booking-shimmer inline-flex min-h-16 w-full items-center justify-center gap-2 rounded-full bg-[#087eaf] px-3 py-3 text-sm font-semibold text-white hover:opacity-90 sm:text-base">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M21.7 3.3a1 1 0 0 0-1.1-.2L2.7 10a1 1 0 0 0 .1 1.9l4.6 1.4 1.8 5.5a1 1 0 0 0 1.7.4l2.6-2.7 4.6 3.4a1 1 0 0 0 1.6-.6l2.3-15a1 1 0 0 0-.3-1ZM9.1 12.7l9-6.1-6.9 7.6-.9 2.9-1.2-4.4Z" /></svg>
        텔레그램 상담하기
      </a>
      </div>
    </aside>
  )
}
