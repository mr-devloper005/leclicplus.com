import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Curated collections, visual browsing, and thoughtful discovery',
      description: 'Explore refined collections of links, articles, visuals, and supporting pages through a premium gallery-style experience.',
      openGraphTitle: 'Curated collections, visual browsing, and thoughtful discovery',
      openGraphDescription: 'A premium front door for collections, visual highlights, and editorial browsing.',
      keywords: ['curated collections', 'discovery site', 'resource gallery', 'bookmark archive'],
    },
    hero: {
      badge: 'Curated premium collection',
      title: ['Your next saved find', 'deserves a better frame.'],
      description: 'Browse collections, editor picks, and discovery pages through a gallery-inspired interface that gives every useful post more presence.',
      primaryCta: { label: 'Browse the collection', href: '/sbm' },
      secondaryCta: { label: 'Search everything', href: '/search' },
      searchPlaceholder: 'Search collections, references, and featured pages',
      focusLabel: 'Featured',
      featureCardBadge: 'highlight selection',
      featureCardTitle: 'Fresh discoveries, arranged with more space and clarity.',
      featureCardDescription: 'The homepage now treats dynamic content like a curated collection instead of a generic feed.',
    },
    intro: {
      badge: 'Inside the collection',
      title: 'A calmer rhythm for resources, stories, and discovery pages.',
      paragraphs: [
        'The interface is organized like a modern gallery so each post can breathe without losing quick scanning.',
        'Collections, image-led entries, supporting profiles, and long-form pages all stay connected through the same premium visual language.',
        'Visitors can jump from a single highlight to a category lane, a focused archive, or a detailed reading page without friction.',
      ],
      sideBadge: 'Highlights',
      sidePoints: [
        'Large framed cards for visual focus.',
        'Category blocks that keep browsing direct.',
        'Editorial spacing that avoids clutter.',
        'Mobile layouts that stay polished and readable.',
      ],
      primaryLink: { label: 'Browse articles', href: '/article' },
      secondaryLink: { label: 'Open visuals', href: '/image' },
    },
    cta: {
      badge: 'Keep exploring',
      title: 'Move from one well-chosen page to the next without losing the thread.',
      description: 'Browse curated sections, revisit saved references, and keep discovery feeling deliberate from the first click to the last.',
      primaryCta: { label: 'Explore collections', href: '/sbm' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Freshly published entries in this section.',
    },
  },
  about: {
    badge: 'About the collection',
    title: 'A refined front end for pages worth revisiting.',
    description: `${slot4BrandConfig.siteName} brings useful pages, collections, and visual discovery into one polished browsing surface.`,
    paragraphs: [
      'The design favors quiet confidence over noise, giving each page enough room to feel selected rather than dumped into a feed.',
      'Whether a visitor begins with a collection, article, visual post, or profile, the site keeps every next step easy to understand.',
    ],
    values: [
      {
        title: 'Curated presentation',
        description: 'Posts are framed with stronger hierarchy, cleaner spacing, and a more deliberate sense of placement.',
      },
      {
        title: 'Cross-section discovery',
        description: 'Collections, visuals, articles, and utility pages remain connected instead of feeling like separate products.',
      },
      {
        title: 'Practical clarity',
        description: 'The interface stays simple enough for fast scanning while still feeling elevated and distinctive.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A direct line for questions, collaboration, and publishing support.',
    description: 'Use the contact page for submissions, partnerships, product questions, or general help. Every request should feel easy to send and easy to understand.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search every visible section of the site.',
    },
    hero: {
      badge: 'Search the catalogue',
      title: 'Find the right page without digging through the whole archive.',
      description: 'Search by phrase, category, or content type to move quickly between collections, article pages, image posts, and more.',
      placeholder: 'Search by title, keyword, tag, or category',
    },
    resultsTitle: 'Current discovery results',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and save new content for this site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to open the publishing workspace.',
      description: 'Accounts can prepare new entries with titles, images, links, summaries, and full body content while the rest of the site keeps its current behavior.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Prepare a new entry with the same clean structure used across the site.',
      description: 'Select the section, add the page details, and save a polished draft for the collection.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Save draft',
    successTitle: 'Draft saved successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Return to your saved publishing space.',
      description: 'Login to continue browsing, publishing, and organizing content through your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Create account',
      title: 'Open a personal account and start building your collection.',
      description: 'Create an account to save your place, access the publishing workspace, and manage content from one refined interface.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
