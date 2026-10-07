import SitePage from '../../src/SitePage'
import { pageMetadata } from '../../src/metadata'

export const metadata = pageMetadata('/blog')
export default function Page() { return <SitePage path="/blog" /> }
