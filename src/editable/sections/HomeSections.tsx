import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function sectionPosts(posts: SitePost[], timeSections: HomeTimeSection[]) {
  const timed = timeSections.flatMap((section) => section.posts)
  return timed.length ? timed : posts
}

function FrameCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className={`group block ${dc.motion.fade}`}>
      <article className="text-center">
        <div className="bg-[#303030] p-4 shadow-[0_14px_40px_rgba(9,20,19,0.15)] sm:p-5">
          <div className="bg-white p-6 shadow-[inset_0_0_24px_rgba(9,20,19,0.14)] sm:p-7">
            <div className={`mx-auto overflow-hidden bg-[var(--slot4-media-bg)] ${index % 4 === 3 ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
              <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
          </div>
        </div>
        <h3 className="mt-5 line-clamp-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-2 text-lg text-[var(--slot4-soft-muted-text)]">{getEditableCategory(post)}</p>
      </article>
    </Link>
  )
}

function EditorialListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid gap-5 border-b border-[color:rgba(9,20,19,0.1)] py-5 sm:grid-cols-[90px_minmax(0,1fr)]">
      <div className="text-[var(--slot4-soft-muted-text)]">
        <p className="text-[11px] uppercase tracking-[0.26em]">No.</p>
        <p className="mt-1 text-3xl font-semibold tracking-[-0.06em]">{String(index + 1).padStart(2, '0')}</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 150) || 'A clean summary appears here when available.'}</p>
      </div>
    </Link>
  )
}

function CompactTopicCard({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="flex min-h-[92px] items-center justify-center border border-[color:rgba(9,20,19,0.18)] bg-white px-6 text-center text-xl font-medium tracking-[-0.03em] transition duration-300 hover:border-[var(--slot4-accent-fill)] hover:text-[var(--slot4-accent)]">
      {label}
    </Link>
  )
}

function WideFeatureCard({ post, href, title, align = 'left' }: { post?: SitePost; href: string; title: string; align?: 'left' | 'right' }) {
  const image = getEditablePostImage(post)
  const summary = getEditableExcerpt(post, 120)
  return (
    <Link href={href} className={`group relative min-h-[310px] overflow-hidden ${dc.surface.soft}`}>
      <img src={image} alt={post?.title || title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className={`absolute inset-0 ${align === 'left' ? 'bg-[linear-gradient(90deg,rgba(9,20,19,0.62),rgba(9,20,19,0.14),transparent)]' : 'bg-[linear-gradient(270deg,rgba(245,237,227,0.9),rgba(245,237,227,0.4),transparent)]'}`} />
      <div className={`relative z-10 flex min-h-[310px] max-w-[340px] flex-col justify-center p-10 ${align === 'right' ? 'ml-auto text-[var(--slot4-page-text)]' : 'text-white'}`}>
        <h3 className="text-[2.2rem] font-light leading-[1.15] tracking-[-0.06em] sm:text-[3rem]">{title}</h3>
        <p className={`mt-5 text-sm leading-8 ${align === 'right' ? 'text-[var(--slot4-muted-text)]' : 'text-white/78'}`}>{summary || 'Browse curated pages through a layout designed to feel calm, clear, and premium.'}</p>
      </div>
    </Link>
  )
}

function GalleryCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block">
      <div className="bg-[#303030] p-4 shadow-[0_14px_40px_rgba(9,20,19,0.15)]">
        <div className="bg-white p-5 shadow-[inset_0_0_22px_rgba(9,20,19,0.12)]">
          <div className="aspect-[3/4] overflow-hidden bg-[var(--slot4-media-bg)]">
            <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
        </div>
      </div>
      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.05em]">{post.title}</h3>
      <p className="mt-2 text-lg text-[var(--slot4-soft-muted-text)]">{getEditableCategory(post)}</p>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts[0]
  const secondary = posts[1]
  const tertiary = posts[2]
  const heroTitle = pagesContent.home.hero.title.join(' ')

  return (
    <section className="border-b border-[color:rgba(9,20,19,0.08)] bg-white">
      <div className={`${dc.shell.section} py-4 text-center text-[10px] font-medium tracking-[0.24em] text-[var(--slot4-soft-muted-text)]`}>
        curated space for {taskLabel(primaryTask).toLowerCase()} and discovery
      </div>
      <div className={`${dc.shell.section} pb-10 pt-6 sm:pb-12 lg:pb-14`}>
        <div className="grid gap-6 border-t border-[color:rgba(9,20,19,0.08)] pt-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div className="bg-[var(--slot4-cream)] px-8 py-10 sm:px-12 sm:py-14 lg:min-h-[640px] lg:py-16">
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{pagesContent.home.hero.badge}</p>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.92] tracking-[-0.08em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[5rem]">
              {heroTitle}
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.home.hero.description}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={primaryRoute} className={dc.button.primary}>Explore collection</Link>
              <Link href="/search" className={dc.button.secondary}>Search pages</Link>
            </div>
          </div>

          <div className="grid min-h-[420px] gap-4 sm:grid-cols-[1.05fr_0.95fr] lg:min-h-[640px]">
            <Link href={featured ? postHref(primaryTask, featured, primaryRoute) : primaryRoute} className="group relative min-h-[380px] overflow-hidden bg-[var(--slot4-media-bg)]">
              <img src={getEditablePostImage(featured)} alt={featured?.title || taskLabel(primaryTask)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,237,227,0.86),rgba(245,237,227,0.45),transparent)]" />
              <div className="relative z-10 flex min-h-[380px] max-w-[360px] flex-col justify-center p-8 sm:p-12">
                <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.07em] text-[var(--slot4-page-text)] sm:text-6xl">
                  {featured?.title || `Selected ${taskLabel(primaryTask).toLowerCase()}`}
                </h2>
                <p className="mt-6 text-base leading-8 text-[var(--slot4-muted-text)]">
                  {getEditableExcerpt(featured, 150) || 'Find well-framed pages, useful references, and clean reading surfaces without losing the original content flow.'}
                </p>
                <span className="mt-8 inline-flex h-14 w-fit items-center justify-center border border-[var(--slot4-page-text)] px-8 text-sm font-semibold transition group-hover:bg-[var(--slot4-page-text)] group-hover:text-white">
                  Open selection
                </span>
              </div>
            </Link>

            <div className="grid gap-4">
              {[secondary, tertiary].map((post, index) => (
                <Link key={post?.id || index} href={post ? postHref(primaryTask, post, primaryRoute) : primaryRoute} className="group relative min-h-[188px] overflow-hidden bg-[var(--slot4-media-bg)]">
                  <img src={getEditablePostImage(post)} alt={post?.title || 'Feature'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,20,19,0.08),rgba(9,20,19,0.62))]" />
                  <div className="relative z-10 flex min-h-[188px] flex-col justify-end p-6 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/72">{index === 0 ? 'Featured lane' : 'New arrival'}</p>
                    <h3 className="mt-3 line-clamp-2 text-2xl font-semibold leading-tight tracking-[-0.05em]">{post?.title || 'Selected page'}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const framed = posts.slice(0, 8)
  if (!framed.length) return null

  return (
    <section className={`${dc.shell.section} py-16 sm:py-20`}>
      <h2 className="text-center text-4xl font-semibold tracking-[-0.07em] sm:text-6xl">Latest Collection</h2>
      <div className="mt-12 grid gap-12 sm:grid-cols-2 xl:grid-cols-4">
        {framed.map((post, index) => (
          <FrameCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
        ))}
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const source = sectionPosts(posts, timeSections)
  const labels = Array.from(new Set(source.map((post) => getEditableCategory(post)).filter(Boolean))).slice(0, 8)
  const featureLeft = source[0]
  const featureRight = source[1] || posts[1]

  return (
    <>
      <section className="bg-[var(--slot4-gray)] py-16 sm:py-20">
        <div className={dc.shell.section}>
          <h2 className="text-center text-4xl font-semibold tracking-[-0.07em] sm:text-6xl">Explore</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {(labels.length ? labels : ['Latest', 'Highlights', 'Collections', 'Editorial', 'Visuals', 'Profiles', 'Documents', 'Popular']).map((label, index) => (
              <CompactTopicCard key={`${label}-${index}`} label={label} href={primaryRoute} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${dc.shell.section} py-12 sm:py-16`}>
        <div className="grid gap-8 lg:grid-cols-2">
          <WideFeatureCard post={featureLeft} href={featureLeft ? postHref(primaryTask, featureLeft, primaryRoute) : primaryRoute} title="Keep your favorite discoveries within reach" align="left" />
          <WideFeatureCard post={featureRight} href={featureRight ? postHref(primaryTask, featureRight, primaryRoute) : primaryRoute} title="Decorate your browsing flow with cleaner structure" align="right" />
        </div>
      </section>
    </>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const source = sectionPosts(posts, timeSections)
  const galleryPosts = source.slice(0, 4)
  const listPosts = source.slice(4, 8)

  return (
    <section className="pb-16 sm:pb-20">
      <div className={dc.shell.section}>
        <h2 className="text-center text-4xl font-semibold tracking-[-0.07em] sm:text-6xl">Preferred Gallery</h2>
        <div className="mt-10 grid gap-12 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-4">
            {galleryPosts.map((post, index) => (
              <GalleryCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
          <div className="border border-[color:rgba(9,20,19,0.12)] bg-white px-6 py-5 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-muted-text)]">Editorial picks</p>
            <div className="mt-3">
              {listPosts.map((post, index) => (
                <EditorialListCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
            <form action="/search" className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="h-12 border border-[color:rgba(9,20,19,0.12)] px-4 text-sm outline-none" />
              <button className="inline-flex h-12 items-center justify-center border border-[var(--slot4-page-text)] px-5 text-sm font-semibold transition hover:bg-[var(--slot4-page-text)] hover:text-white">
                <Search className="mr-2 h-4 w-4" /> Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="border-t border-[color:rgba(9,20,19,0.08)] bg-white">
      <div className={`${dc.shell.section} py-16 text-center sm:py-20`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-muted-text)]">{pagesContent.home.cta.badge}</p>
        <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.07em] sm:text-6xl">{pagesContent.home.cta.title}</h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.home.cta.description}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href={pagesContent.home.cta.primaryCta.href} className={dc.button.primary}>
            {pagesContent.home.cta.primaryCta.label} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href={pagesContent.home.cta.secondaryCta.href} className={dc.button.secondary}>
            {pagesContent.home.cta.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
