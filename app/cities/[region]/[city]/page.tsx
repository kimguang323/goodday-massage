import { notFound } from 'next/navigation'
import SitePage from '../../../../src/SitePage'
import { pageMetadata } from '../../../../src/metadata'
import { cityEntries } from '../../../../src/data/site'

export const dynamicParams = false
export function generateStaticParams() { return cityEntries.map(({ region, city }) => ({ region, city })) }
type Props = { params: Promise<{ region: string; city: string }> }
async function getEntry(params: Props['params']) {
  const values = await params
  const region = decodeURIComponent(values.region)
  const city = decodeURIComponent(values.city)
  const entry = cityEntries.find(entry => entry.region === region && entry.city === city)
  if (!entry) notFound()
  return entry
}
export async function generateMetadata({ params }: Props) { return pageMetadata((await getEntry(params)).path) }
export default async function CityPage({ params }: Props) { return <SitePage path={(await getEntry(params)).path} city /> }
