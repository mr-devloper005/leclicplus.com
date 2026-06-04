import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('border border-[color:rgba(9,20,19,0.12)] bg-white p-10 text-center shadow-[0_18px_50px_rgba(9,20,19,0.05)]', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[color:rgba(9,20,19,0.12)] bg-[var(--slot4-gray)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-[var(--slot4-muted-text)]">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 border border-[var(--slot4-page-text)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--slot4-page-text)] hover:text-white">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically when content is available.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
