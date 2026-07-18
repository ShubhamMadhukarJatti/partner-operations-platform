import React from 'react'
import { Metadata } from 'next'
import { headers } from 'next/headers'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get('host') || 'www.sharkdom.com'
  const protocol = headersList.get('x-forwarded-proto') || 'https'
  const baseUrl = `${protocol}://${host}`

  const imageUrl = `${baseUrl}/og-img-partner-ecosystem.jpeg`

  return {
    title: 'Build a High-Performing Partner Ecosystem | Sharkdom',
    description:
      'The frameworks and activation strategies behind high-performing partner ecosystems. Practical insight for teams building programs that drive real attributable partner revenue.',
    keywords: [
      'high-performing partner ecosystem',
      'partner program frameworks',
      'ecosystem activation strategy'
    ],
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: 'https://www.sharkdom.com/high-performing-partner-ecosystem'
    },
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: 'Building a High-Performing Partner Ecosystem | Sharkdom Event with Kaushik & Alex Richards'
        }
      ]
    },
  }
}

export default function HighPerformingPartnerEcosystemLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
