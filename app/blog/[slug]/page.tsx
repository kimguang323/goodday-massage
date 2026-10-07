import { notFound } from 'next/navigation'
import SitePage from '../../../src/SitePage'
import { pageMetadata } from '../../../src/metadata'
import { BLOG_POSTS } from '../../../src/data/blog'

export const dynamicParams = false
export function generateStaticParams() { return BLOG_POSTS.map(({ slug }) => ({ slug })) }
type Props = { params: Promise<{ slug: string }> }
async function getPath(params: Props['params']) {
  const { slug } = await params
  if (!BLOG_POSTS.some(post => post.slug === slug)) notFound()
  return `/blog/${slug}`
}
export async function generateMetadata({ params }: Props) { return pageMetadata(await getPath(params)) }
export default async function BlogPost({ params }: Props) { return <SitePage path={await getPath(params)} /> }
