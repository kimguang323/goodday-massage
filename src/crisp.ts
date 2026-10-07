declare global {
  interface Window {
    $crisp?: unknown[]
  }
}

const CRISP_CHAT_URL = 'https://go.crisp.chat/chat/embed/?website_id=8228327c-a1a7-4ba2-b41e-657b36b5105f'

let crispRequested = false

export function prepareCrispChat() {
  if (window.$crisp) return
  window.$crisp = []
  ;(window as Window & { CRISP_WEBSITE_ID?: string }).CRISP_WEBSITE_ID = '8228327c-a1a7-4ba2-b41e-657b36b5105f'
  window.$crisp.push(['do', 'chat:hide'])
  window.$crisp.push(['on', 'session:loaded', () => {
    if (crispRequested) {
      window.$crisp?.push(['do', 'chat:show'])
      window.$crisp?.push(['do', 'chat:open'])
    }
  }])
  window.$crisp.push(['on', 'chat:closed', () => window.$crisp?.push(['do', 'chat:hide'])])
  const script = document.createElement('script')
  script.src = 'https://client.crisp.chat/l.js'
  script.async = true
  script.onerror = () => {
    window.$crisp = undefined
    script.remove()
    if (crispRequested) window.open(CRISP_CHAT_URL, '_blank', 'noopener,noreferrer')
  }
  document.head.appendChild(script)
}

export function openCrispChat() {
  crispRequested = true
  prepareCrispChat()
  window.$crisp?.push(['do', 'chat:show'])
  window.$crisp?.push(['do', 'chat:open'])
}

