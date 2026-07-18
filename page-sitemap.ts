import { MetadataRoute } from 'next'

import { ROUTE } from './routeConstants'

export default async function pageSitemap(): Promise<MetadataRoute.Sitemap> {
  // Don't index development environment
  const isDevelopment =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'

  if (isDevelopment) {
    return []
  }

  // Main pages with specific priorities
  const pages = [
    {
      url: 'https://www.sharkdom.com/',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    {
      url: `https://www.sharkdom.com${ROUTE.DISCOVER}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `https://www.sharkdom.com${ROUTE.PARTNER_MAPPING_RESOURCE}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.WHY_SHARKDOM_PARTNER_MANAGERS}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.WHY_SHARKDOM_PRODUCT_MANAGER}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.WHY_SHARKDOM_SALES_TEAM}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.WHY_SHARKDOM_GROWTH_TEAM}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.WHY_SHARKDOM_FOUNDER}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.INTEGRATION}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.PRICING}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.ABOUT_US}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    },
    {
      url: `https://www.sharkdom.com${ROUTE.EVENTS}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6
    }
  ]

  return pages
}
