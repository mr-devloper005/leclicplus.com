import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => getEditableExcerpt(post, 180)

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block border border-[color:rgba(9,20,19,0.1)] bg-white p-5 shadow-[0_14px_40px_rgba(9,20,19,0.06)] transition hover:-translate-y-1 ${strong ? 'md:col-span-2' : ''}`}>
      <div className={`grid gap-6 ${strong ? 'lg:grid-cols-[320px_minmax(0,1fr)]' : ''}`}>
        <div className="bg-[#303030] p-4">
          <div className="bg-white p-5 shadow-[inset_0_0_22px_rgba(9,20,19,0.12)]">
            <div className={`${strong ? 'aspect-[16/10]' : 'aspect-[4/3]'} overflow-hidden bg-[var(--slot4-media-bg)]`}>
              <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
          </div>
        </div>
        <div className="self-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{taskLabel} / {getEditableCategory(post)}</p>
          <h2 className="mt-3 line-clamp-3 text-3xl font-semibold leading-tight tracking-[-0.06em]">{post.title}</h2>
          {summaryOf(post) ? <p className="mt-4 line-clamp-3 text-sm leading-8 text-[var(--slot4-muted-text)]">{summaryOf(post)}</p> : null}
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Open result <ArrowRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border border-[color:rgba(9,20,19,0.1)] bg-white p-8 shadow-[0_18px_50px_rgba(9,20,19,0.06)] lg:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.08em] sm:text-7xl">{pagesContent.search.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="border border-[color:rgba(9,20,19,0.1)] bg-[var(--slot4-cream)] p-5 shadow-[0_18px_50px_rgba(9,20,19,0.05)] sm:p-6">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 border border-[color:rgba(9,20,19,0.12)] bg-white px-4 py-3">
                <Search className="h-5 w-5 opacity-45" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-current/35" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 border border-[color:rgba(9,20,19,0.12)] bg-white px-4 py-3">
                  <Filter className="h-4 w-4 opacity-45" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-current/35" />
                </label>
                <select name="task" defaultValue={task} className="border border-[color:rgba(9,20,19,0.12)] bg-white px-4 py-3 text-sm font-medium outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center border border-[var(--slot4-page-text)] px-6 text-sm font-semibold transition hover:bg-[var(--slot4-page-text)] hover:text-white" type="submit">Search</button>
            </form>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">{results.length} results</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/sbm" className="inline-flex items-center gap-2 border border-[color:rgba(9,20,19,0.12)] bg-white px-5 py-3 text-sm font-semibold">Browse collection <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 border border-dashed border-[color:rgba(9,20,19,0.18)] bg-white p-10 text-center">
              <p className="text-2xl font-semibold tracking-[-0.04em]">No matching posts found.</p>
              <p className="mt-3 text-sm leading-8 text-[var(--slot4-muted-text)]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
