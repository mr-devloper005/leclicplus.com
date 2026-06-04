import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || '',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Curated discovery for modern collections',
    primaryLinks: [
      { label: 'Latest', href: '/' },
      { label: 'Collections', href: '/sbm' },
      { label: 'Journal', href: '/articles' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse collection', href: '/sbm' },
      secondary: { label: 'Contact', href: '/contact' },
    },
  },
  footer: {
    tagline: 'quiet curation, refined browsing',
    description: 'A polished surface for saved resources, editorial picks, image-led discoveries, and supporting pages that deserve a calmer presentation.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Collections', href: '/sbm' },
          { label: 'Articles', href: '/articles' },
          { label: 'Visuals', href: '/images' },
          { label: 'Profiles', href: '/profiles' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Designed for elegant reading and practical discovery.',
  },
  commonLabels: {
    readMore: 'Open page',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
