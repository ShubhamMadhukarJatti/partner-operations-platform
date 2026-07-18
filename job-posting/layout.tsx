import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Post a Partnership Role on Sharkdom's Jobs Board",
  description:
    "Post your open partnership or channel sales role on Sharkdom. Reach professionals actively looking for alliances, co-sell, and partner management positions. Free to post.",
  keywords: [
    'post partnership job',
    'channel sales job listing',
    'alliances role posting'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/job-posting'
  }
}

export default function JobPostingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
