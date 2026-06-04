import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f6f3ed',
  '--slot4-page-text': '#091413',
  '--slot4-panel-bg': '#f0ece3',
  '--slot4-surface-bg': '#fffdf8',
  '--slot4-muted-text': '#52635c',
  '--slot4-soft-muted-text': '#74857e',
  '--slot4-accent': '#285a48',
  '--slot4-accent-fill': '#408a71',
  '--slot4-accent-soft': '#b0e4cc',
  '--slot4-dark-bg': '#091413',
  '--slot4-dark-text': '#f7fbf8',
  '--slot4-media-bg': '#e4ddd2',
  '--slot4-cream': '#f3eee5',
  '--slot4-warm': '#faf7f1',
  '--slot4-lavender': '#edf6f1',
  '--slot4-gray': '#f8f8f5',
  '--slot4-line': 'rgba(9, 20, 19, 0.12)',
  '--slot4-body-gradient': 'radial-gradient(circle at top right, rgba(176, 228, 204, 0.18), transparent 28%), linear-gradient(180deg, #f8f5ef 0%, #f4f0e8 34%, #faf8f2 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-fill)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[color:var(--slot4-line)]',
  darkBorder: 'border-white/15',
  shadow: 'shadow-[0_18px_50px_rgba(9,20,19,0.08)]',
  shadowStrong: 'shadow-[0_28px_90px_rgba(9,20,19,0.14)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(9,20,19,0.05),rgba(9,20,19,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-4',
    featureGrid: 'grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[220px] shrink-0 snap-start',
  },
  type: {
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.32em]',
    heroTitle: 'text-4xl font-semibold leading-[0.95] tracking-[-0.07em] sm:text-6xl lg:text-[4.5rem]',
    sectionTitle: 'text-3xl font-semibold tracking-[-0.06em] sm:text-5xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-none border border-[var(--slot4-page-text)] bg-transparent px-8 py-4 text-sm font-semibold ${editablePalette.pageText} transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-surface-bg)]`,
    secondary: `inline-flex items-center justify-center rounded-none border ${editablePalette.border} ${editablePalette.surfaceBg} px-8 py-4 text-sm font-semibold ${editablePalette.surfaceText} transition duration-300 hover:border-[var(--slot4-accent-fill)] hover:text-[var(--slot4-accent)]`,
    accent: `inline-flex items-center justify-center rounded-none border border-[var(--slot4-accent-fill)] ${editablePalette.accentBg} px-8 py-4 text-sm font-semibold text-[var(--slot4-dark-text)] transition duration-300 hover:opacity-90`,
  },
  media: {
    frame: `relative overflow-hidden bg-[var(--slot4-media-bg)]`,
    ratio: 'aspect-[3/4]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(9,20,19,0.16)]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Keep the luxury gallery palette rooted in muted ivory, ink, and green accents from editableRootStyle.',
  'Preserve dynamic post fetching and route helpers; redesign the presentation only.',
  'Use a premium home rhythm with a large hero, framed media cards, boxed topic chips, and editorial whitespace.',
  'Mix card silhouettes so featured, compact, horizontal, and framed image cards do not look duplicated.',
  'Respect missing post fields by falling back to safe labels, placeholder art, and neutral descriptions.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
