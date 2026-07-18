/**
 * Mobile marketing drawer sections — derived from the same mega-menu objects
 * as the desktop nav (`nav-data.ts`). Edit structure in nav-data only.
 */

import {
  customerStoriesMenuLinks,
  platformMegaMenu,
  resourcesMegaMenu,
  whySharkdomMegaMenu,
  type PlatformMegaIcon,
  type PlatformMegaLink,
  type ResourcesEventLucideKey,
  type ResourcesLearnLucideKey,
  type WhySharkdomForLucideKey
} from './nav-data'

/** Serialized mega-menu visuals for drawer rows (icons match desktop mega menus). */
export type MegaMenuRowVisual =
  | {
      variant: 'platform'
      icon: PlatformMegaIcon
      iconWrapClassName: string
      featured?: boolean
    }
  | {
      variant: 'why-for'
      featured?: boolean
      featuredIconSrc?: string
      lucide?: WhySharkdomForLucideKey
    }
  | { variant: 'integration'; iconSrc: string }
  /** Learn column style (blue tile + lucide) */
  | { variant: 'resource-learn'; lucide: ResourcesLearnLucideKey }
  /** Events column style */
  | { variant: 'resource-event'; lucide: ResourcesEventLucideKey }
  /** Playbook / drive PDF rows in Resources */
  | { variant: 'playbook' }
  /** “See all integrations” — no asset in data; same affordance as desktop */
  | { variant: 'see-all-integrations' }

export type MarketingMobileNavLink = {
  id: string
  label: string
  href: string
  description?: string
  /** Gradient / featured row (platform + why “Sharkdom for” hero row) */
  featured?: boolean
  megaVisual?: MegaMenuRowVisual
}

export type MarketingMobileNavGroup = {
  id: string
  heading: string
  links: MarketingMobileNavLink[]
}

export type MarketingMobileNavSection = {
  key: string
  label: string
  /** Column-style blocks (e.g. Platform mega menu) */
  groups: MarketingMobileNavGroup[]
}

function linkFromPlatform(link: PlatformMegaLink): MarketingMobileNavLink {
  return {
    id: link.id,
    label: link.title,
    href: link.href,
    description: link.description,
    featured: link.featured,
    megaVisual: {
      variant: 'platform',
      featured: link.featured,
      icon: link.icon,
      iconWrapClassName: link.iconWrapClassName
    }
  }
}

function linkFromWhyFor(
  link: (typeof whySharkdomMegaMenu.sharkdomFor)[0]
): MarketingMobileNavLink {
  const megaVisual: MegaMenuRowVisual | undefined =
    link.featured && link.featuredIconSrc
      ? {
          variant: 'why-for',
          featured: true,
          featuredIconSrc: link.featuredIconSrc
        }
      : link.icon
        ? { variant: 'why-for', lucide: link.icon }
        : undefined

  return {
    id: link.id,
    label: link.title,
    href: link.href,
    description: link.description,
    featured: link.featured,
    megaVisual
  }
}

function linkFromWhyIntegration(
  link: (typeof whySharkdomMegaMenu.integrations)[0]
): MarketingMobileNavLink {
  return {
    id: link.id,
    label: link.title,
    href: link.href,
    description: link.description,
    megaVisual: { variant: 'integration', iconSrc: link.iconSrc }
  }
}

function linkFromPlaybook(
  link: (typeof resourcesMegaMenu.playbooks.items)[0]
): MarketingMobileNavLink {
  return {
    id: link.id,
    label: link.title,
    href: link.href,
    description: link.description,
    megaVisual: { variant: 'playbook' }
  }
}

function linkFromLearn(
  link: (typeof resourcesMegaMenu.learn.items)[0]
): MarketingMobileNavLink {
  return {
    id: link.id,
    label: link.title,
    href: link.href,
    description: link.description,
    megaVisual: { variant: 'resource-learn', lucide: link.icon }
  }
}

function linkFromEvent(
  link: (typeof resourcesMegaMenu.events.items)[0]
): MarketingMobileNavLink {
  return {
    id: link.id,
    label: link.title,
    href: link.href,
    description: link.meta,
    megaVisual: { variant: 'resource-event', lucide: link.icon }
  }
}

export function buildMarketingMobileNavSections(): MarketingMobileNavSection[] {
  const platformGroups: MarketingMobileNavGroup[] =
    platformMegaMenu.columns.map((col) => ({
      id: col.id,
      heading: col.heading,
      links: col.links.map(linkFromPlatform)
    }))

  platformGroups.push({
    id: 'platform-promo',
    heading: platformMegaMenu.promo.eyebrow,
    links: [
      {
        id: 'platform-promo-cta',
        label: platformMegaMenu.promo.ctaLabel,
        href: platformMegaMenu.promo.ctaHref,
        description: platformMegaMenu.promo.description
      }
    ]
  })

  const whyGroups: MarketingMobileNavGroup[] = [
    {
      id: 'sharkdom-for',
      heading: 'Sharkdom for',
      links: whySharkdomMegaMenu.sharkdomFor.map(linkFromWhyFor)
    },
    {
      id: 'integrations',
      heading: 'Integrations',
      links: [
        ...whySharkdomMegaMenu.integrations.map(linkFromWhyIntegration),
        {
          id: 'see-all-integrations',
          label: whySharkdomMegaMenu.seeAllIntegrations.title,
          href: whySharkdomMegaMenu.seeAllIntegrations.href,
          description: whySharkdomMegaMenu.seeAllIntegrations.description,
          megaVisual: { variant: 'see-all-integrations' }
        }
      ]
    },
    {
      id: 'compare',
      heading: 'Compare vs',
      links: whySharkdomMegaMenu.compareVs.map((c, i) => ({
        id: `compare-${i}-${c.label.replace(/\s+/g, '-').toLowerCase()}`,
        label: c.label,
        href: c.href
      }))
    },
    {
      id: 'why-promo',
      heading: whySharkdomMegaMenu.promo.eyebrow,
      links: [
        {
          id: 'why-promo-cta',
          label: whySharkdomMegaMenu.promo.ctaLabel,
          href: whySharkdomMegaMenu.promo.ctaHref,
          description: whySharkdomMegaMenu.promo.title
        }
      ]
    }
  ]

  const customerGroups: MarketingMobileNavGroup[] = [
    {
      id: 'customer-stories',
      heading: '',
      links: customerStoriesMenuLinks.map((c) => ({
        id: c.id,
        label: c.title,
        href: c.href
      }))
    }
  ]

  const resourcesGroups: MarketingMobileNavGroup[] = [
    {
      id: 'playbooks',
      heading: resourcesMegaMenu.playbooks.heading,
      links: resourcesMegaMenu.playbooks.items.map(linkFromPlaybook)
    },
    {
      id: 'learn',
      heading: resourcesMegaMenu.learn.heading,
      links: resourcesMegaMenu.learn.items.map(linkFromLearn)
    },
    {
      id: 'events',
      heading: resourcesMegaMenu.events.heading,
      links: [
        ...resourcesMegaMenu.events.items.map(linkFromEvent),
        {
          id: 'events-library',
          label: resourcesMegaMenu.events.libraryLink.title,
          href: resourcesMegaMenu.events.libraryLink.href,
          description: resourcesMegaMenu.events.libraryLink.description,
          megaVisual: { variant: 'resource-event', lucide: 'calendar-fold' }
        }
      ]
    },
    {
      id: 'resources-promo',
      heading: resourcesMegaMenu.promo.eyebrow,
      links: [
        {
          id: 'resources-promo-cta',
          label: resourcesMegaMenu.promo.ctaLabel,
          href: resourcesMegaMenu.promo.ctaHref,
          description: resourcesMegaMenu.promo.description
        }
      ]
    }
  ]

  return [
    { key: 'platform', label: 'Platform', groups: platformGroups },
    { key: 'why', label: 'Why Prefer Sharkdom', groups: whyGroups },
    { key: 'customers', label: 'Customer Stories', groups: customerGroups },
    { key: 'resources', label: 'Resources', groups: resourcesGroups }
  ]
}

/** Memoized at module scope — data is static */
export const marketingMobileNavSections = buildMarketingMobileNavSections()

export function isExternalNavHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}
