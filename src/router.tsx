'use client'

import NextLink from 'next/link'
import { useParams as useNextParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, type ComponentProps } from 'react'

export function Link({ to, ...props }: Omit<ComponentProps<typeof NextLink>, 'href'> & { to: string }) {
  // Large directories should not prefetch every regional page on mobile.
  return <NextLink href={to} prefetch={false} {...props} />
}
export function useNavigate() {
  const router = useRouter()
  return useCallback((to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') { router.back(); return }
    if (options?.replace) router.replace(to)
    else router.push(to)
  }, [router])
}
export function useParams<T extends Record<string, string | undefined> = Record<string, string>>() {
  const params = useNextParams()
  return Object.fromEntries(Object.entries(params).map(([key, value]) => [key,
    typeof value === 'string' ? decodeURIComponent(value) : Array.isArray(value) ? value.map(segment => decodeURIComponent(segment)) : value,
  ])) as T
}
export function useLocation() {
  const pathname = usePathname() || '/'
  const [hash, setHash] = useState('')
  useEffect(() => {
    const update = () => setHash(window.location.hash)
    update()
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [pathname])
  return { pathname, hash }
}
