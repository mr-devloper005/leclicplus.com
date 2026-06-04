import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singles = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singles].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const sanitizeHtml = (html: string) => html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => getEditableExcerpt(post, 220)
const categoryOf = (post: SitePost, fallback: string) => getEditableCategory(post) || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const detailVars = {
    '--detail-bg': '#f6f3ed',
    '--detail-text': '#091413',
    '--detail-surface': '#fffdf8',
    '--detail-accent': '#285a48',
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail task={task} post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail task={task} post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail task={task} post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail task={task} post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail task={task} post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail task={task} post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 border border-[color:rgba(9,20,19,0.12)] bg-white px-4 py-3 text-sm font-semibold">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function DetailShell({
  task,
  post,
  related,
  children,
  sideTop,
  sideBottom,
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  children: React.ReactNode
  sideTop?: React.ReactNode
  sideBottom?: React.ReactNode
}) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BackLink task={task} />
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_360px]">
        <article className="border border-[color:rgba(9,20,19,0.1)] bg-[var(--detail-surface)] p-6 shadow-[0_18px_50px_rgba(9,20,19,0.06)] sm:p-8 lg:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--detail-accent)]">{categoryOf(post, SITE_CONFIG.name)}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.08em] sm:text-6xl lg:text-[4.4rem]">{post.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post) || 'A summary will appear here when available.'}</p>
          <div className="mt-8">{children}</div>
          <BodyContent post={post} />
          {task === 'article' ? null : <ImageStrip images={images.slice(1)} />}
        </article>
        <aside className="space-y-5">
          {sideTop}
          <AboutPanel task={task} post={post} />
          {sideBottom}
          <RelatedPanel task={task} related={related} />
        </aside>
      </div>
    </section>
  )
}

function HeroFrame({ post, tall = false }: { post: SitePost; tall?: boolean }) {
  return (
    <div className="bg-[#303030] p-4 shadow-[0_14px_40px_rgba(9,20,19,0.15)]">
      <div className="bg-white p-6 shadow-[inset_0_0_24px_rgba(9,20,19,0.14)]">
        <div className={`overflow-hidden bg-[var(--slot4-media-bg)] ${tall ? 'aspect-[3/4]' : 'aspect-[16/10]'}`}>
          <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  )
}

function ArticleDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <DetailShell task={task} post={post} related={related} sideBottom={<EditableComments slug={post.slug} comments={comments} />}>
      <HeroFrame post={post} />
    </DetailShell>
  )
}

function ListingDetail({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <DetailShell task={task} post={post} related={related} sideTop={<InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />} sideBottom={mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}>
      <HeroFrame post={post} />
      <ContactAction website={website} phone={phone} email={email} />
    </DetailShell>
  )
}

function ClassifiedDetail({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <DetailShell task={task} post={post} related={related} sideTop={<InfoGrid items={[['Price', price, Tag], ['Condition', condition, Tag], ['Location', location, MapPin]]} />} sideBottom={<ContactAction website={website} phone={phone} email={email} />}>
      <HeroFrame post={post} />
    </DetailShell>
  )
}

function ImageDetail({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BackLink task={task} />
      <div className="mt-8 grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="border border-[color:rgba(9,20,19,0.1)] bg-white p-6 shadow-[0_18px_50px_rgba(9,20,19,0.06)] xl:sticky xl:top-24 xl:self-start">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--detail-accent)]"><Camera className="h-4 w-4" /> Visual gallery</div>
          <h1 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.08em]">{post.title}</h1>
          <p className="mt-5 text-sm leading-8 text-[var(--slot4-muted-text)]">{summaryText(post) || 'A summary will appear here when available.'}</p>
          <BodyContent post={post} compact />
          <div className="mt-6"><RelatedPanel task={task} related={related} /></div>
        </aside>
        <div className="columns-1 gap-6 space-y-6 md:columns-2">
          {(images.length ? images : [getEditablePostImage(post)]).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid border border-[color:rgba(9,20,19,0.1)] bg-white p-5 shadow-[0_18px_50px_rgba(9,20,19,0.05)]">
              <div className="bg-[#303030] p-4">
                <div className="bg-white p-5 shadow-[inset_0_0_24px_rgba(9,20,19,0.14)]">
                  <img src={image} alt="" className="w-full object-cover" />
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function BookmarkDetail({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domainLabel = website ? website.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toUpperCase() : ''
  const tags = Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === 'string' && Boolean(tag.trim())).slice(0, 4) : []
  return (
    <section className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BackLink task={task} />
      <article className="mt-8 border border-[color:rgba(9,20,19,0.1)] bg-[var(--detail-surface)] shadow-[0_18px_50px_rgba(9,20,19,0.06)]">
        <div className="border-b border-[color:rgba(9,20,19,0.08)] px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border border-[color:rgba(9,20,19,0.12)] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--detail-accent)]">
              <Bookmark className="h-4 w-4" /> Saved link
            </span>
            {getEditableCategory(post) ? (
              <span className="border border-[color:rgba(9,20,19,0.12)] bg-[var(--slot4-cream)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                {getEditableCategory(post)}
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.08em] sm:text-6xl lg:text-[4.5rem]">{post.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">
            {summaryText(post) || 'A saved destination with supporting notes, direct access, and a cleaner reading layout.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {website ? (
              <Link
                href={website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 border border-[var(--detail-text)] px-5 text-sm font-semibold transition hover:bg-[var(--detail-text)] hover:text-white"
              >
                Open saved resource <ExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
            
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {tags.length ? (
              <div className="mb-8 flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <span key={tag} className="border border-[color:rgba(9,20,19,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            <BodyContent post={post} />
          </div>

          
        </div>
      </article>
    </section>
  )
}

function PdfDetail({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <DetailShell task={task} post={post} related={related} sideTop={fileUrl ? <ContactAction website={fileUrl} /> : undefined}>
      <div className="grid gap-6 sm:grid-cols-[100px_minmax(0,1fr)]">
        <div className="flex h-24 w-24 items-center justify-center bg-[var(--detail-text)] text-white">
          <FileText className="h-12 w-12" />
        </div>
        <div className="self-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--detail-accent)]">Document preview</p>
          <p className="mt-3 text-sm leading-8 text-[var(--slot4-muted-text)]">Downloadable material stays embedded here whenever a file URL exists.</p>
        </div>
      </div>
      {fileUrl ? (
        <div className="mt-8 overflow-hidden border border-[color:rgba(9,20,19,0.1)] bg-[var(--slot4-gray)]">
          <div className="flex items-center justify-between gap-3 border-b border-[color:rgba(9,20,19,0.1)] bg-white p-4">
            <span className="text-sm font-semibold">Document preview</span>
            <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[var(--detail-text)] px-4 py-2 text-xs font-semibold transition hover:bg-[var(--detail-text)] hover:text-white">Download <Download className="h-4 w-4" /></Link>
          </div>
          <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
        </div>
      ) : null}
    </DetailShell>
  )
}

function ProfileDetail({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <DetailShell task={task} post={post} related={related} sideTop={<ContactAction website={website} email={email} />}>
      <div className="max-w-[420px]">
        <HeroFrame post={post} tall />
      </div>
    </DetailShell>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} opacity-85`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function AboutPanel({ task, post }: { task: TaskKey; post: SitePost }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="border border-[color:rgba(9,20,19,0.1)] bg-white p-5 shadow-[0_18px_50px_rgba(9,20,19,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">About this page</p>
      <div className="mt-4 grid gap-3 text-sm text-[var(--slot4-muted-text)]">
        <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> {taskConfig?.label || task}</p>
        <p className="inline-flex items-center gap-2"><Bookmark className="h-4 w-4" /> {SITE_CONFIG.name}</p>
        {post.publishedAt ? <p>Published {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
      </div>
    </div>
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="grid gap-3">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="border border-[color:rgba(9,20,19,0.1)] bg-white p-4 shadow-[0_18px_50px_rgba(9,20,19,0.05)]">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm leading-7 text-[var(--slot4-page-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images }: { images: string[] }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {images.slice(0, 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] w-full object-cover" />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden border border-[color:rgba(9,20,19,0.1)] bg-white shadow-[0_18px_50px_rgba(9,20,19,0.05)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="border border-[color:rgba(9,20,19,0.1)] bg-white p-5 shadow-[0_18px_50px_rgba(9,20,19,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 border border-[var(--detail-text)] px-4 text-sm font-semibold transition hover:bg-[var(--detail-text)] hover:text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex h-11 items-center gap-2 border border-[color:rgba(9,20,19,0.12)] px-4 text-sm font-semibold"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex h-11 items-center gap-2 border border-[color:rgba(9,20,19,0.12)] px-4 text-sm font-semibold"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  if (!related.length) return null
  return (
    <div className="border border-[color:rgba(9,20,19,0.1)] bg-white p-5 shadow-[0_18px_50px_rgba(9,20,19,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-[-0.04em]">More like this</h2>
        <Link href={taskConfig?.route || '/'} className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">View all</Link>
      </div>
      <div className="mt-5 grid gap-3">
        {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
      </div>
    </div>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 border border-[color:rgba(9,20,19,0.08)] bg-[var(--slot4-gray)] p-3 transition hover:border-[var(--detail-accent)]">
      <div className="h-20 w-20 shrink-0 overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold leading-6 tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--slot4-muted-text)]">{summaryText(post) || 'Open for more details.'}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="border border-[color:rgba(9,20,19,0.1)] bg-white p-5 shadow-[0_18px_50px_rgba(9,20,19,0.05)]">
      <div className="flex items-center gap-2 text-lg font-semibold"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="border border-[color:rgba(9,20,19,0.08)] bg-[var(--slot4-gray)] p-4">
            <p className="text-sm font-semibold">{comment.name}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
