import React from 'react'
import { Metadata } from 'next'

import BookDemoSection from '../_components/book-demo-section'
import IntegrationSection from '../_components/integration-section'
import ProblemHero from '../_components/problem-hero'
import RevenueOpportunity from '../_components/revenue-opportunity'
import TestimonialSection from '../_components/testimonial-section'
import SharkdomFeatures from '../../_components/home/sharkdom-features'

type Props = {}

export const metadata: Metadata = {
  title: `Sharkdom Integration | Modern day partner ops platform`,
  description:
    'Use Integration tools to execute your Partnership Strategy more faster',
  robots: {
    index: true, // Allows crawling
    follow: true // Allows following links
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/problem'
  }
}

const ProblemPage = (props: Props) => {
  return (
    <div>
      <ProblemHero />
      <BookDemoSection />
      <SharkdomFeatures />
      <RevenueOpportunity />
      <TestimonialSection />
      <IntegrationSection />

      <section className='bg-white py-16'>
        <div className='mx-auto max-w-4xl text-center'>
          <h4 className='mb-4 text-sm uppercase tracking-wide text-gray-500'>
            Get Started with Sharkdom
          </h4>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>
            Partner with Ease.
            <br />
            Grow with Speed.
          </h1>
          <p className='text-lg text-gray-700'>
            Build powerful B2B partnerships that fuel growth and drive revenue.
          </p>
        </div>
      </section>
    </div>
  )
}

export default ProblemPage
