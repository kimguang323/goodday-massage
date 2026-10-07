import type { NextConfig } from 'next'
import { REGIONS } from './src/data/regions'

const firstRegions = new Map<string, string>()
for (const region of REGIONS) for (const city of region.cities) {
  if (!firstRegions.has(city)) firstRegions.set(city, region.name)
}
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [...firstRegions].flatMap(([city, region]) => {
      const destination = `/cities/${encodeURIComponent(region)}/${encodeURIComponent(city)}`
      return [...new Set([`/cities/${city}`, `/cities/${encodeURIComponent(city)}`])].map(source => ({ source, destination, permanent: true }))
    })
  },
}
export default config
