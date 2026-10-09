'use client'
import { useEffect } from 'react'
import { prepareCrispChat } from '../crisp'

export default function CrispPreparation() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => { timer = setTimeout(prepareCrispChat, 1500) }
    const events = ['scroll', 'pointerdown', 'keydown'] as const
    const warmUp = () => {
      events.forEach(event => window.removeEventListener(event, warmUp))
      // Wait until the first screen has loaded; yield before loading the chat.
      if (document.readyState === 'complete') schedule()
      else window.addEventListener('load', schedule, { once: true })
    }
    events.forEach(event => window.addEventListener(event, warmUp, { passive: true }))
    return () => {
      events.forEach(event => window.removeEventListener(event, warmUp))
      if (timer) clearTimeout(timer)
      window.removeEventListener('load', schedule)
    }
  }, [])
  return null
}
