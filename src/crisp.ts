declare global {
  interface Window {
    $crisp?: unknown[]
  }
}

const CRISP_CHAT_URL = 'https://go.crisp.chat/chat/embed/?website_id=8228327c-a1a7-4ba2-b41e-657b36b5105f'

let crispRequested = false
let connectionNotice: HTMLDivElement | undefined

function clearConnectionNotice() {
  connectionNotice?.remove()
  connectionNotice = undefined
}

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
  window.$crisp.push(['on', 'chat:opened', clearConnectionNotice])
  const script = document.createElement('script')
  script.src = 'https://client.crisp.chat/l.js'
  script.async = true
  script.onerror = () => {
    window.$crisp = undefined
    script.remove()
    if (connectionNotice) {
      connectionNotice.textContent = '상담 연결이 지연되고 있습니다. '
      const link = document.createElement('a')
      link.href = CRISP_CHAT_URL
      link.textContent = '상담창 직접 열기'
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.style.textDecoration = 'underline'
      connectionNotice.appendChild(link)
    }
  }
  document.head.appendChild(script)
}

export function openCrispChat() {
  crispRequested = true
  if (!connectionNotice) {
    connectionNotice = document.createElement('div')
    connectionNotice.setAttribute('role', 'status')
    connectionNotice.textContent = '상담 연결 중…'
    connectionNotice.style.cssText = 'position:fixed;bottom:110px;left:50%;transform:translateX(-50%);z-index:999999;background:#4c0519;color:white;padding:12px 18px;border-radius:12px;max-width:90vw;font-size:14px;'
    document.body.appendChild(connectionNotice)
  }
  prepareCrispChat()
  window.$crisp?.push(['do', 'chat:show'])
  window.$crisp?.push(['do', 'chat:open'])
}

