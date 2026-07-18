/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { Metadata } from 'next'

// import FAQAccordion from '../_components/home-v2/FAQAccordian'
import EventScheduleSection from './EventScheduleSection'
import Hero from './Hero'

export const metadata: Metadata = {
  title: 'Partnership Events Webinars and Roundtables | Sharkdom',
  description:
    "Join Sharkdom's live partnership events webinars and expert roundtables. Learn from GTM leaders and practitioners on building programs that drive attributable revenue.",
  keywords: [
    'partnership events 2026',
    'partner management webinar',
    'GTM partnerships event'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/events'
  }
}

function EventsPage() {
  return (
    <div className='min-h-screen w-full'>
      <Hero />
      <EventScheduleSection />
      {/* <FAQAccordion /> */}
    </div>
  )
}

export default EventsPage
