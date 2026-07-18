import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preview Your Partnership Role Before Publishing | Sharkdom',
  description:
    'Review how your partnership or channel sales listing will appear before you publish. Edit, confirm, and go live with your job posting in one step.',
  keywords: ['preview job posting', 'partnership job listing preview'],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/job-preview'
  }
}

export default function JobPreviewLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
