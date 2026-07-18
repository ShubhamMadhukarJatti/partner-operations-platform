import { MetadataRoute } from 'next'

import { getAllBlogs, getAllCaseStudies } from '@/lib/db/sanity-cms'

import { ROUTE } from './routeConstants'

export default async function postSitemap(): Promise<MetadataRoute.Sitemap> {
  // Don't index development environment
  const isDevelopment =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'

  if (isDevelopment) {
    return []
  }

  const allPosts = await getAllBlogs()
  const allCaseStudies = await getAllCaseStudies()

  // Blog main page with high priority
  const blogPage = {
    url: `https://www.sharkdom.com${ROUTE.BLOG}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0
  }

  // Dynamic blog posts
  const blogs = allPosts.map((post) => ({
    url: `https://www.sharkdom.com/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt || post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  // Case studies
  const caseStudies = allCaseStudies.map((study) => ({
    url: `https://www.sharkdom.com/case-studies/${study.slug}`,
    lastModified: new Date(study._updatedAt || study.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  // Comparison pages with specific mentions
  const comparisonPages = [
    {
      url: `https://www.sharkdom.com${ROUTE.COMPARE_SHARKDOM_PARTNERSTACK}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.COMPARE_SHARKDOM_CROSSBEAM}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    },
    {
      url: `https://www.sharkdom.com${ROUTE.COMPARE_SHARKDOM_IMPARTNER}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }
  ]

  // Featured blog posts with specific URLs mentioned in requirements
  const featuredBlogPosts = [
    {
      url: 'https://www.sharkdom.com/blog/what-is-partner-marketing',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: 'https://www.sharkdom.com/blog/channel-partner-marketing',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    }
  ]

  return [
    blogPage,
    ...blogs,
    ...caseStudies,
    ...comparisonPages,
    ...featuredBlogPosts
  ]
}
