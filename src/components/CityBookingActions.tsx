'use client'
import { openCrispChat, prepareCrispChat } from '../crisp'
export default function CityBookingActions({ regionName, city }: { regionName: string; city: string }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 px-6">
      <button type="button" onPointerEnter={prepareCrispChat} onFocus={prepareCrispChat} onPointerDown={prepareCrispChat} onClick={openCrispChat} className="booking-shimmer min-h-12 w-full rounded-full bg-rose-800 px-6 py-4 font-semibold text-white sm:w-80">{regionName} {city} 방문 상담하기</button>
      <a href="https://t.me/sy2267" target="_blank" rel="noopener noreferrer" className="booking-shimmer inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#087eaf] px-6 py-4 font-semibold text-white hover:opacity-90 sm:w-80">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M21.7 3.3a1 1 0 0 0-1.1-.2L2.7 10a1 1 0 0 0 .1 1.9l4.6 1.4 1.8 5.5a1 1 0 0 0 1.7.4l2.6-2.7 4.6 3.4a1 1 0 0 0 1.6-.6l2.3-15a1 1 0 0 0-.3-1ZM9.1 12.7l9-6.1-6.9 7.6-.9 2.9-1.2-4.4Z" /></svg>
        텔레그램 상담하기
      </a>
    </div>
  )
}
