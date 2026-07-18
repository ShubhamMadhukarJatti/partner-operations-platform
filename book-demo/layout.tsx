import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Sharkdom Demo | See Partner Ops in 20 Minutes',
  description:
    'Schedule a live walkthrough of Sharkdom. See deal registration, co-sell pipeline, and AI partner matching in action. No sales pressure. Spots fill fast | Book yours now.',
  keywords: [
    'book partner management demo',
    'Sharkdom demo',
    'partner platform walkthrough'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/book-demo'
  }
}

export default function BookDemoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
