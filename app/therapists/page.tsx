import SitePage from '../../src/SitePage'
import { pageMetadata } from '../../src/metadata'

export const metadata = pageMetadata('/therapists')
export default function Page() { return <SitePage path="/therapists" /> }
