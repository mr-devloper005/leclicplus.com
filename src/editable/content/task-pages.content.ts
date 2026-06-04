import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Journal selection',
    headline: 'Long-form reading arranged with a cleaner editorial pace.',
    description: 'Articles should feel collected and readable, with strong hierarchy and generous room for headlines, images, and excerpts.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Use this page for slower reading, not noisy feed behavior.',
    chips: ['Editorial grid', 'Reading-first', 'Refined layout'],
  },
  classified: {
    eyebrow: 'Open offers',
    headline: 'Listings and offers presented with quick scan cues and clear detail.',
    description: 'Classified entries should keep action close at hand while still feeling polished and premium.',
    filterLabel: 'Filter offer type',
    secondaryNote: 'Keep urgency visible, but avoid clutter.',
    chips: ['Offer cards', 'Clear action', 'Fast scan'],
  },
  sbm: {
    eyebrow: 'Saved collection',
    headline: 'Social bookmarks presented like a curated gallery of useful finds.',
    description: 'Resource pages, references, and saved destinations should feel selected and browsable rather than dumped into one repeating list.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Collections need a clean rhythm, readable notes, and confident framing.',
    chips: ['Curated links', 'Reference flow', 'Quiet luxury'],
  },
  profile: {
    eyebrow: 'People and names',
    headline: 'Profiles with identity, context, and a more trustworthy first impression.',
    description: 'People and brand pages need direct visual cues, quick summaries, and supporting details that stay easy to scan.',
    filterLabel: 'Filter profile type',
    secondaryNote: 'Trust grows when identity is obvious at a glance.',
    chips: ['Identity first', 'Quick context', 'Profile cards'],
  },
  pdf: {
    eyebrow: 'Document room',
    headline: 'PDFs and downloads arranged like a clean private library.',
    description: 'Document browsing should feel archived, legible, and ready for direct action without becoming sterile.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Give files more context than a plain filename grid.',
    chips: ['Library feel', 'Download-ready', 'Archive layout'],
  },
  listing: {
    eyebrow: 'Business collection',
    headline: 'Listings presented with stronger trust signals and more useful structure.',
    description: 'Directory pages should surface location, contact points, and a clear sense of identity before long descriptions take over.',
    filterLabel: 'Filter business category',
    secondaryNote: 'Make practical details visible early.',
    chips: ['Structured data', 'Identity cues', 'Comparison-ready'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Image posts shown with more scale, framing, and breathing room.',
    description: 'Visual content should carry the page with larger media moments, restrained captions, and a premium gallery rhythm.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let imagery lead, then support it with clean text.',
    chips: ['Large media', 'Framed cards', 'Gallery pacing'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
