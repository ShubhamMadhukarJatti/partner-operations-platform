import { Metadata } from 'next'

export const metadata: Metadata = {
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
