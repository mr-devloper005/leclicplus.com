import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getSummary = (post: SitePost) => getEditableExcerpt(post, 180) || 'Details will appear here when a summary is available.'
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; grid: string; badge: string }> = {
  article: { icon: FileText, grid: 'grid gap-8 xl:grid-cols-2', badge: 'Journal' },
  listing: { icon: Building2, grid: 'grid gap-8 xl:grid-cols-2', badge: 'Business' },
  classified: { icon: Megaphone, grid: 'grid gap-8 xl:grid-cols-2', badge: 'Offer' },
  image: { icon: Camera, grid: 'columns-1 gap-8 space-y-8 md:columns-2 xl:columns-3', badge: 'Visual' },
  sbm: { icon: Bookmark, grid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3', badge: 'Collection' },
  pdf: { icon: Download, grid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3', badge: 'Document' },
  profile: { icon: UserRound, grid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-4', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const deck = taskDeck[task]
  const Icon = deck.icon
  const page = pagination.page || 1
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const archiveVars = {
    '--archive-bg': '#f6f3ed',
    '--archive-text': '#091413',
    '--archive-surface': '#fffdf8',
    '--archive-accent': '#285a48',
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div className="border border-[color:rgba(9,20,19,0.1)] bg-white px-7 py-8 shadow-[0_18px_50px_rgba(9,20,19,0.06)] sm:px-10 sm:py-10">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--archive-accent)]">
                <Icon className="h-4 w-4" /> {voice.eyebrow}
              </div>
              <h1 className="mt-4 text-5xl font-semibold leading-[0.94] tracking-[-0.08em] sm:text-7xl">{voice.headline}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{voice.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {voice.chips.map((chip) => (
                  <span key={chip} className="border border-[color:rgba(9,20,19,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
              <form action={basePath} className="border border-[color:rgba(9,20,19,0.12)] bg-[var(--slot4-cream)] p-5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">
                  <Filter className="h-4 w-4" /> {voice.filterLabel}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <select name="category" defaultValue={category} className="h-12 border border-[color:rgba(9,20,19,0.12)] bg-white px-4 text-sm font-medium outline-none">
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <button className="h-12 border border-[var(--archive-text)] px-5 text-sm font-semibold transition hover:bg-[var(--archive-text)] hover:text-white">Apply</button>
                </div>
                <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Showing {categoryLabel}</p>
              </form>
              <Link href="/search" className="flex min-h-[156px] flex-col justify-between border border-[color:rgba(9,20,19,0.12)] bg-white p-5 transition hover:border-[var(--archive-accent)] hover:text-[var(--archive-accent)]">
                <Search className="h-5 w-5" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em]">Search</p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.04em]">Open full archive</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          {posts.length ? (
            <div className={deck.grid}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug || index} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="border border-dashed border-[color:rgba(9,20,19,0.18)] bg-white px-6 py-12 text-center">
              <h2 className="text-3xl font-semibold tracking-[-0.05em]">No posts found</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Try another category or return to the full archive.</p>
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-[color:rgba(9,20,19,0.12)] bg-white px-5 py-3 text-sm font-semibold">Previous</Link> : null}
            <span className="border border-[var(--archive-text)] bg-[var(--archive-text)] px-5 py-3 text-sm font-semibold text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-[color:rgba(9,20,19,0.12)] bg-white px-5 py-3 text-sm font-semibold">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function FramedMedia({ image, title, tall = false }: { image: string; title: string; tall?: boolean }) {
  return (
    <div className="bg-[#303030] p-4 shadow-[0_14px_40px_rgba(9,20,19,0.15)]">
      <div className="bg-white p-5 shadow-[inset_0_0_24px_rgba(9,20,19,0.14)]">
        <div className={`overflow-hidden bg-[var(--slot4-media-bg)] ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
          <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      </div>
    </div>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid gap-6 border border-[color:rgba(9,20,19,0.12)] bg-white p-5 shadow-[0_14px_40px_rgba(9,20,19,0.06)] sm:grid-cols-[260px_minmax(0,1fr)] sm:p-6">
      <FramedMedia image={getEditablePostImage(post)} title={post.title} />
      <div className="min-w-0 self-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--archive-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.06em]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-8 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Open article <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  return (
    <Link href={href} className="group border border-[color:rgba(9,20,19,0.12)] bg-white p-6 shadow-[0_14px_40px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div className="grid gap-6 sm:grid-cols-[220px_minmax(0,1fr)]">
        <FramedMedia image={getEditablePostImage(post)} title={post.title} />
        <div className="self-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--archive-accent)]">Business listing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em]">{post.title}</h2>
          <p className="mt-4 line-clamp-3 text-sm leading-8 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]">
            {location ? <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {location}</span> : null}
            {phone ? <span>{phone}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget']) || 'Open offer'
  const location = getField(post, ['location', 'address', 'city']) || getEditableCategory(post)
  return (
    <Link href={href} className="group overflow-hidden border border-[color:rgba(9,20,19,0.12)] bg-white shadow-[0_14px_40px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div className="grid sm:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-[var(--slot4-page-text)] p-6 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">Offer note</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.06em]">{price}</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">{location}</p>
        </div>
        <div className="p-6">
          <h3 className="text-3xl font-semibold tracking-[-0.06em]">{post.title}</h3>
          <p className="mt-4 line-clamp-4 text-sm leading-8 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">View offer <ArrowRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-8 block break-inside-avoid border border-[color:rgba(9,20,19,0.12)] bg-white p-5 shadow-[0_14px_40px_rgba(9,20,19,0.06)]">
      <FramedMedia image={getEditablePostImage(post)} title={post.title} tall={index % 2 === 0} />
      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-2 text-base text-[var(--slot4-soft-muted-text)]">{getEditableCategory(post)}</p>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group flex h-full flex-col justify-between border border-[color:rgba(9,20,19,0.12)] bg-white p-6 shadow-[0_14px_40px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--archive-accent)]">Collection {String(index + 1).padStart(2, '0')}</span>
          <Bookmark className="h-5 w-5" />
        </div>
        <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-[-0.06em]">{post.title}</h2>
        <p className="mt-4 line-clamp-4 text-sm leading-8 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
      </div>
      <div className="mt-6 border-t border-[color:rgba(9,20,19,0.08)] pt-4">
        <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">{website?.replace(/^https?:\/\//, '') || 'Saved page'}</p>
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group border border-[color:rgba(9,20,19,0.12)] bg-white p-6 shadow-[0_14px_40px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-16 w-16 items-center justify-center bg-[var(--slot4-page-text)] text-white">
          <FileText className="h-8 w-8" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">{getEditableCategory(post)}</span>
      </div>
      <h2 className="mt-8 text-3xl font-semibold tracking-[-0.06em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-8 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group border border-[color:rgba(9,20,19,0.12)] bg-white p-5 text-center shadow-[0_14px_40px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div className="mx-auto w-full max-w-[220px]">
        <FramedMedia image={getEditablePostImage(post)} title={post.title} tall />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.05em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}
