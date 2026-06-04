'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Business onboarding', body: 'Add listings, update details, and coordinate coverage for location-based pages.' },
      { icon: MapPin, title: 'Regional requests', body: 'Ask for category or geography expansion with a clear publishing path.' },
      { icon: Mail, title: 'Operational support', body: 'Reach out about verification, structure, or editorial adjustments.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Share long-form ideas, feature concepts, and thoughtful story pitches.' },
      { icon: Sparkles, title: 'Partnership requests', body: 'Coordinate campaigns, issue-level sponsorships, and collaboration plans.' },
      { icon: Mail, title: 'Contributor support', body: 'Ask about formatting, publishing flow, and editorial timing.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Visual collaborations', body: 'Discuss launches, creator features, galleries, and image-led campaigns.' },
      { icon: Sparkles, title: 'Licensing questions', body: 'Reach out about use rights, asset handling, and presentation requests.' },
      { icon: Mail, title: 'Feature placement', body: 'Coordinate submissions for highlighted galleries and premium visual lanes.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, destination pages, references, and saved collections.' },
    { icon: Mail, title: 'Publishing support', body: 'Get help organizing links, drafts, and submission-ready material.' },
    { icon: Sparkles, title: 'Curator partnerships', body: 'Talk through collaboration ideas, special collections, and recurring curation.' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] px-4 py-12 text-[var(--slot4-page-text)] sm:px-6 lg:px-8 lg:py-16">
        <section className="mx-auto max-w-[1480px]">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.08em] sm:text-6xl">{pagesContent.contact.title}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
              <div className="mt-8 grid gap-4">
                {lanes.map((lane) => (
                  <div key={lane.title} className="border border-[color:rgba(9,20,19,0.1)] bg-[var(--slot4-cream)] p-6 shadow-[0_18px_50px_rgba(9,20,19,0.05)]">
                    <lane.icon className="h-5 w-5" />
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{lane.title}</h2>
                    <p className="mt-3 text-sm leading-8 text-[var(--slot4-muted-text)]">{lane.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[color:rgba(9,20,19,0.1)] bg-white p-6 shadow-[0_18px_50px_rgba(9,20,19,0.06)] sm:p-8">
              <h2 className="text-3xl font-semibold tracking-[-0.05em]">{pagesContent.contact.formTitle}</h2>
              <p className="mt-3 text-sm leading-8 text-[var(--slot4-muted-text)]">Use the form below for questions, submissions, collaboration, or general site support.</p>
              <div className="mt-6">
                <EditableContactLeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
