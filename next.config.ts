import type { NextConfig } from 'next'
import { REGIONS, LEGACY_REGION_REDIRECTS } from './src/data/regions'

const firstRegions = new Map<string, string>()
for (const region of REGIONS) for (const city of region.cities) {
  if (!firstRegions.has(city)) firstRegions.set(city, region.name)
}
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [...LEGACY_REGION_REDIRECTS.flatMap(({ source, destination }) => [...new Set([source, encodeURI(source)])].map(source => ({ source, destination: encodeURI(destination), permanent: true }))), ...[...firstRegions].flatMap(([city, region]) => {
      const destination = `/cities/${encodeURIComponent(region)}/${encodeURIComponent(city)}`
      return [...new Set([`/cities/${city}`, `/cities/${encodeURIComponent(city)}`])].map(source => ({ source, destination, permanent: true }))
    })]
  },
}
export default config
