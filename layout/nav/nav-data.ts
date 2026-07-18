/** Lucide icon keys rendered in `PlatformMenu` */
export type PlatformMegaLucideKey =
  | 'factory'
  | 'sparkles'
  | 'workflow'
  | 'settings'

export type PlatformMegaIcon =
  | { kind: 'lucide'; name: PlatformMegaLucideKey; className?: string }
  | { kind: 'img'; src: string; alt: string }

export interface PlatformMegaLink {
  id: string
  title: string
  description: string
  href: string
  /** First-row gradient + arrow (Figma) */
  featured?: boolean
  icon: PlatformMegaIcon
  /** Tailwind for 30×30 icon wrapper */
  iconWrapClassName: string
}

export interface PlatformMegaColumn {
  id: string
  heading: string
  links: PlatformMegaLink[]
}

export interface PlatformMegaPromo {
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
}

/**
 * Platform mega menu — 4 columns + promo (matches Figma Frame 2147205389).
 * Edit copy/URLs here only.
 */
export const platformMegaMenu: {
  columns: PlatformMegaColumn[]
  promo: PlatformMegaPromo
} = {
  columns: [
    {
      id: 'discover',
      heading: 'Discover and source',
      links: [
        {
          id: 'marketplace',
          title: 'Marketplace',
          description: 'Find IPPs and lookalikes with pre-partnership KPIs.',
          href: '/marketplace',
          featured: true,
          icon: { kind: 'lucide', name: 'factory', className: 'text-white' },
          iconWrapClassName: 'rounded-[4px] bg-[#AEABFF]'
        },
        {
          id: 'ecosystem-mapping',
          title: 'Ecosystem Mapping',
          description: 'See customer and partner overlap in real time.',
          href: '/partner-mapping-resource',
          icon: { kind: 'img', src: '/icons/ecosystem-mapping.svg', alt: '' },
          iconWrapClassName: 'rounded-[4px] bg-[#E6EEFF]'
        },
        {
          id: 'ai-agents',
          title: 'AI agents',
          description: 'Automate Partner Scouting and Matching',
          href: '/marketplace',
          icon: {
            kind: 'lucide',
            name: 'sparkles',
            className: 'text-[#6863FB]'
          },
          iconWrapClassName:
            'rounded-[6px] bg-gradient-to-r from-[#E5EDFF] to-[#F3E3FF]'
        }
      ]
    },
    {
      id: 'manage',
      heading: 'Manage and enable',
      links: [
        {
          id: 'co-selling-hub',
          title: 'Co-Selling Hub',
          description: 'Protect and track partner-led opportunities.',
          href: 'https://help.sharkdom.com/feature-suite/deal-registration',
          icon: { kind: 'img', src: '/icons/co-selling-hub.svg', alt: '' },
          iconWrapClassName: 'rounded-[4px] bg-[#E6EEFF]'
        },
        {
          id: 'partner-loyalty',
          title: 'Partner Loyalty Programme',
          description:
            'Reward and retain high-performing partners with structured programmes.',
          href: 'https://help.sharkdom.com/feature-suite/deal-registration/partner-loyalty-program',
          icon: {
            kind: 'img',
            src: '/icons/partner-loyalty-program.svg',
            alt: ''
          },
          iconWrapClassName: 'rounded-[4px] bg-[#E6EEFF]'
        },
        {
          id: 'partner-training',
          title: 'Partner Training',
          description: 'Train your partners without giving ownership.',
          href: '/partner-training-feature',
          icon: { kind: 'img', src: '/icons/partner-directory.svg', alt: '' },
          iconWrapClassName: 'rounded-[4px] bg-[#E6EEFF]'
        }
      ]
    },
    {
      id: 'track',
      heading: 'Track and automate',
      links: [
        {
          id: 'contract-lifecycle',
          title: 'Contract Life Cycle (CLM)',
          description: 'Maintain a track record of all partner activities.',
          href: '/contract-lifecycle-management-feature',
          icon: { kind: 'img', src: '/icons/contract-lifecycle.svg', alt: '' },
          iconWrapClassName: 'rounded-[4px] bg-[#E6EEFF]'
        },
        {
          id: 'workflow-automation',
          title: 'Workflow automation',
          description: 'AI-powered smart trigger and task flows',
          href: 'https://help.sharkdom.com',
          icon: {
            kind: 'lucide',
            name: 'workflow',
            className: 'text-[#2563EB]'
          },
          iconWrapClassName: 'rounded-[4px] bg-[#E6EEFF]'
        },
        {
          id: 'integration',
          title: 'Integration',
          description: '20+ CRM Marketing and Ops Tools',
          href: '/integration',
          icon: {
            kind: 'lucide',
            name: 'settings',
            className: 'text-[#2563EB]'
          },
          iconWrapClassName: 'rounded-[4px] bg-[#E6EEFF]'
        }
      ]
    }
  ],
  promo: {
    eyebrow: 'Get started',
    title: 'Sharkdom PRM vs other PRMs',
    description:
      'See why teams switch from legacy PRM tools to Sharkdom for modern partner ops.',
    ctaLabel: 'Compare now',
    ctaHref: '/compare/sharkdom-vs-impartner'
  }
}

/** @deprecated Use `platformMegaMenu` — kept for any legacy imports */
export const platformMenuItems = [
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Find IPP and look alike with pre partnership KPIs',
    href: '/marketplace',
    icon: '/icons/marketplace-icon.svg',
    alt: 'marketplace'
  },
  {
    id: 'partner-loyalty',
    title: 'Partner loyalty program',
    description: 'Protect and track partner-led opportunities.',
    href: 'https://help.sharkdom.com/feature-suite/deal-registration/partner-loyalty-program',
    icon: '/icons/partner-loyalty-program.svg',
    alt: 'partner-loyalty-program'
  },
  {
    id: 'ecosystem-mapping',
    title: 'Ecosystem Mapping',
    description: 'See customer & partner overlaps in real-time.',
    href: '/partner-mapping-resource',
    icon: '/icons/ecosystem-mapping.svg',
    alt: 'ecosystem-mapping'
  },
  {
    id: 'partner-training',
    title: 'Partner Training',
    description: 'Train your partners without giving ownership',
    href: '/partner-training-feature',
    icon: '/icons/partner-directory.svg',
    alt: 'partner-directory'
  },
  {
    id: 'co-selling-hub',
    title: 'Co-selling Hub',
    description: 'Protect and track partner-led opportunities.',
    href: 'https://help.sharkdom.com/feature-suite/deal-registration',
    icon: '/icons/co-selling-hub.svg',
    alt: 'co-selling-hub'
  },
  {
    id: 'contract-lifecycle',
    title: 'Contract lifecycle(CLM)',
    description: 'Maintain track records of all your partner activities',
    href: '/contract-lifecycle-management-feature',
    icon: '/icons/contract-lifecycle.svg',
    alt: 'contract-lifecycle'
  }
]

/** Lucide keys for “Sharkdom for” rows (Why Sharkdom mega menu) */
export type WhySharkdomForLucideKey =
  | 'box'
  | 'badge-dollar'
  | 'bar-chart-3'
  | 'users'

export interface WhySharkdomForLink {
  id: string
  title: string
  description: string
  href: string
  /** First row: gradient + arrow; icon in white tile */
  featured?: boolean
  /** Featured row uses branded SVG (Figma user-star) */
  featuredIconSrc?: string
  icon?: WhySharkdomForLucideKey
}

export interface WhySharkdomIntegrationLink {
  id: string
  title: string
  description: string
  href: string
  iconSrc: string
}

export interface WhySharkdomCompareLink {
  label: string
  href: string
}

export interface WhySharkdomPromo {
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
}

/**
 * Why Prefer Sharkdom mega menu — matches Figma Frame 2147205388.
 * Edit copy and URLs here only.
 */
export const whySharkdomMegaMenu: {
  sharkdomFor: WhySharkdomForLink[]
  integrations: WhySharkdomIntegrationLink[]
  seeAllIntegrations: {
    title: string
    description: string
    href: string
  }
  compareVs: WhySharkdomCompareLink[]
  promo: WhySharkdomPromo
} = {
  sharkdomFor: [
    {
      id: 'partner-manager',
      title: 'Partner manager',
      description: 'Find IPPs and lookalikes with pre-partnership KPIs.',
      href: '/why-sharkdom/partner-managers',
      featured: true,
      featuredIconSrc: '/icons/user-change.svg'
    },
    {
      id: 'product-manager',
      title: 'Product manager',
      description: 'See customer and partner overlap in real time.',
      href: '/why-sharkdom/product-manager',
      icon: 'box'
    },
    {
      id: 'sales-team',
      title: 'Sales team',
      description: 'Automate Partner Scouting and Matching',
      href: '/why-sharkdom/sales-team',
      icon: 'badge-dollar'
    },
    {
      id: 'growth-team',
      title: 'Growth team',
      description: 'Automate Partner Scouting and Matching',
      href: '/why-sharkdom/growth-team',
      icon: 'bar-chart-3'
    },
    {
      id: 'founders',
      title: 'Founders',
      description: 'Automate Partner Scouting and Matching',
      href: '/why-sharkdom/founder',
      icon: 'users'
    }
  ],
  integrations: [
    {
      id: 'google-meet',
      title: 'Google Meet',
      description: 'Perfect and track partner-led opportunities.',
      href: '/integration',
      iconSrc: '/icons/google-meet-icon.svg'
    },
    {
      id: 'docusign',
      title: 'DocuSign',
      description: 'Find IPPs and lookalikes with pre-partnership KPIs.',
      href: '/integration',
      iconSrc: '/icons/docusign-icon.svg'
    },
    {
      id: 'hubspot',
      title: 'HubSpot',
      description: 'Train your partners without giving ownership.',
      href: '/integration',
      iconSrc: '/icons/hubspot-icon.svg'
    }
  ],
  seeAllIntegrations: {
    title: 'See all integrations',
    description: '20+ tools connected',
    href: '/integration'
  },
  compareVs: [
    {
      label: 'Partnerstack',
      href: '/compare/sharkdom-vs-partnerstack'
    },
    {
      label: 'Partnerinsight.co',
      href: '/compare/sharkdom-vs-partnerinsight.io'
    },
    {
      label: 'Crossbeam',
      href: '/compare/sharkdom-vs-crossbeam'
    },
    {
      label: 'Impartner',
      href: '/compare/sharkdom-vs-impartner'
    },
    {
      label: 'Kiflo',
      href: '/compare/sharkdom-vs-kiflo'
    },
    {
      label: 'Zoho',
      href: '/compare/sharkdom-vs-zoho'
    }
  ],
  promo: {
    eyebrow: 'Book a demo',
    title:
      'Explore why Sharkdom is the best alternative for managing new and old partnerships',
    description:
      'See why teams switch from legacy PRM tools to Sharkdom for modern partner ops.',
    ctaLabel: 'Try free demo',
    ctaHref: '/book-demo'
  }
}

// Resources playbook items
export const playbookItems = [
  {
    title: 'Partnership Marketing',
    description: 'Why do partnerships fail so quick?',
    href: 'https://drive.google.com/file/d/1tNds1rVJR92cZtePTW9oHjOo1XyEAoW0/view?usp=sharing'
  },
  {
    title: 'Deal Registration',
    description:
      'How deal registration at Sharkdom differs from other PRM solutions?',
    href: 'https://drive.google.com/file/d/1QbNBlMFDFYx2fX6Y1h17DlfUkuo3Xv3j/view?usp=sharing'
  },
  {
    title: 'Train your partnership AI',
    description: 'Key instructions to train your own partner manager AI model',
    href: 'https://drive.google.com/file/d/1TelwcATD1jLBYf8lzUVTTB1ByZbBZ3kK/view?usp=sharing'
  }
]

/** Lucide keys for Resources → Learn column */
export type ResourcesLearnLucideKey =
  | 'newspaper'
  | 'star'
  | 'circle-user'
  | 'book-open-check'

/** Lucide keys for Resources → Events column */
export type ResourcesEventLucideKey = 'calendar-fold' | 'factory'

export interface ResourcesMegaPlaybookLink {
  id: string
  title: string
  description: string
  href: string
}

export interface ResourcesMegaLearnLink {
  id: string
  title: string
  description: string
  href: string
  icon: ResourcesLearnLucideKey
}

export interface ResourcesMegaEventLink {
  id: string
  title: string
  meta: string
  href: string
  icon: ResourcesEventLucideKey
  tall?: boolean
}

export interface ResourcesMegaEventLibraryLink {
  title: string
  description: string
  href: string
}

export interface ResourcesMegaPromo {
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
}

/**
 * Resources mega menu — Figma Frame 2147205389 (playbooks, learn, events, EVENTO).
 */
export const resourcesMegaMenu: {
  playbooks: { heading: string; items: ResourcesMegaPlaybookLink[] }
  learn: { heading: string; items: ResourcesMegaLearnLink[] }
  events: {
    heading: string
    items: ResourcesMegaEventLink[]
    libraryLink: ResourcesMegaEventLibraryLink
  }
  promo: ResourcesMegaPromo
} = {
  playbooks: {
    heading: 'More proven playbooks',
    items: [
      {
        id: 'partnership-marketing',
        title: 'Partnership marketing',
        description: 'Why do partnerships fail so quickly?',
        href: 'https://drive.google.com/file/d/1tNds1rVJR92cZtePTW9oHjOo1XyEAoW0/view?usp=sharing'
      },
      {
        id: 'deal-registration',
        title: 'Deal registration',
        description: 'See customer and partner overlap in real time.',
        href: 'https://drive.google.com/file/d/1QbNBlMFDFYx2fX6Y1h17DlfUkuo3Xv3j/view?usp=sharing'
      },
      {
        id: 'train-partnership-ai',
        title: 'Train your partnership AI.',
        description:
          'Key Instruction to Train Your Own Partner Manager AI Model',
        href: 'https://drive.google.com/file/d/1TelwcATD1jLBYf8lzUVTTB1ByZbBZ3kK/view?usp=sharing'
      }
    ]
  },
  learn: {
    heading: 'Learn',
    items: [
      {
        id: 'blog',
        title: 'Blog',
        description: 'Partnership Strategy and Ops Guides',
        href: '/blog',
        icon: 'newspaper'
      },
      {
        id: 'expert-guides',
        title: 'Expert Guides',
        description: 'Deep Dive Partner Ecosystem Playbooks',
        href: '/blog/expert-arena',
        icon: 'star'
      },
      {
        id: 'customer-stories',
        title: 'Customer Stories',
        description: 'Real partnership wins from the field.',
        href: '/blog/case-studies',
        icon: 'circle-user'
      },
      {
        id: 'documentation',
        title: 'Documentation',
        description: 'API, integration and set up guides',
        href: 'https://help.sharkdom.com',
        icon: 'book-open-check'
      }
    ]
  },
  events: {
    heading: 'Events',
    items: [
      {
        id: 'partner-ecosystem',
        title: 'Build a high-performing partner ecosystem.',
        meta: 'Live Strategy Session',
        href: '/high-performing-partner-ecosystem',
        icon: 'calendar-fold',
        tall: true
      },
      {
        id: 'channel-strategies',
        title: 'Channel strategies for integration partners',
        meta: 'Recorded Webinar',
        href: '/channel-strategies-for-intergation-partners',
        icon: 'factory',
        tall: true
      },
      {
        id: 'partner-source-revenue',
        title: 'All about Partner Source Revenue',
        meta: 'On-demand event',
        href: '/event/partner-source-revenue',
        icon: 'factory'
      }
    ],
    libraryLink: {
      title: 'Access event library',
      description: 'All past and upcoming sessions',
      href: '/events'
    }
  },
  promo: {
    eyebrow: 'Powered by Sharkdom',
    title: 'EVENTO',
    description:
      'The events platform built for partnership teams. Host, track and monetize your partner events.',
    ctaLabel: 'Access the event library',
    ctaHref: '/events'
  }
}

/**
 * Customer Stories mega menu — single source for desktop + mobile drawer.
 */
export const customerStoriesMenuLinks: {
  id: string
  title: string
  href: string
}[] = [
  {
    id: 'stacktr',
    title: 'Stacktr',
    href: 'https://www.sharkdom.com/blog/how-stacktr-saw-250-boost-in-their-partner-source-revenue-after-mirgating-their-partnership'
  },
  {
    id: 'dweepkart',
    title: 'Dweepkart',
    href: 'https://www.sharkdom.com/blog/how-dweepkart-transformed-its-partner-management-pipeline-using-sharkdom'
  }
]

// Types
export interface PlatformMenuItem {
  id: string
  title: string
  description: string
  href: string
  icon: string
  alt: string
}

export interface MenuLinkItem {
  title: string
  href: string
  icon: string
}

export interface PlaybookItem {
  title: string
  description: string
  href: string
}
