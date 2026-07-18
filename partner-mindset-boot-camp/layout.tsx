import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner Mindset Boot Camp | Sharkdom',
  description:
    'Join the exclusive 4-week live boot camp for partnership managers by Sharkdom & Partnership Mastermind. Build a partner program that actually drives revenue.',
  keywords: [
    'partner mindset boot camp',
    'partner program revenue',
    'partnership managers boot camp',
    'Sharkdom co-branded training'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/partner-mindset-boot-camp'
  }
}

export default function PartnerMindsetBootCampLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
