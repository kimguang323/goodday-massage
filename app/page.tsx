import SitePage from '../src/SitePage'
import { pageMetadata } from '../src/metadata'

export const metadata = pageMetadata('/')
export default function Page() { return <SitePage path="/" /> }
