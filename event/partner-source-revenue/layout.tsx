import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner-Sourced Revenue Event | How Partners Drive Pipeline',
  description:
    "Join Sharkdom's event on partner-sourced revenue. Hear from GTM leaders on how to measure attribute and scale revenue from your partner ecosystem. Register free.",
  keywords: [
    'partner-sourced revenue event',
    'partner pipeline event',
    'GTM partnerships webinar 2026'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/event/partner-source-revenue'
  },
  openGraph: {
    images: [
      {
        url: 'https://storage.googleapis.com/sharkdom_resources/thumbnails/Group%201321314921%20(2)%20(1).png',
        width: 1200,
        height: 630,
        alt: 'Partner Source Revenue Event'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      'https://storage.googleapis.com/sharkdom_resources/thumbnails/Group%201321314921%20(2)%20(1).png'
    ]
  }
}

export default function PartnerSourceRevenueLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
