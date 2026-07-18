'use client'

import React from 'react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import JobPreviewFAQSection from '../partner-training-feature/_components/JobPreviewFAQSection'
import Hero from './_components/Hero'
import PartnershipFormReview from './_components/PartnershipFormReview'

const Page = () => {
  return (
    <MaxWidthWrapper className='px-4 lg:px-0'>
      <Hero />
      <PartnershipFormReview />
      <JobPreviewFAQSection />
    </MaxWidthWrapper>
  )
}

export default Page
