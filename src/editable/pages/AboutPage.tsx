import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] px-4 py-12 text-[var(--slot4-page-text)] sm:px-6 lg:px-8 lg:py-16">
        <section className="mx-auto max-w-[1480px]">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="border border-[color:rgba(9,20,19,0.1)] bg-white p-8 shadow-[0_18px_50px_rgba(9,20,19,0.06)] lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] sm:text-6xl">About {SITE_CONFIG.name}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
              <div className="mt-8 space-y-4 text-sm leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
            <aside className="grid gap-4">
              {pagesContent.about.values.map((value) => (
                <div key={value.title} className="border border-[color:rgba(9,20,19,0.1)] bg-[var(--slot4-cream)] p-6 shadow-[0_18px_50px_rgba(9,20,19,0.05)]">
                  <h2 className="text-2xl font-semibold tracking-[-0.05em]">{value.title}</h2>
                  <p className="mt-3 text-sm leading-8 text-[var(--slot4-muted-text)]">{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
