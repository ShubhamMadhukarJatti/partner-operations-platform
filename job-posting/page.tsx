'use client'

import React from 'react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import JobFAQSection from '../partner-training-feature/_components/JobFAQSection'
import Hero from './_components/Hero'
import PartnershipForm from './_components/PartnershipForm'

const Page = () => {
  return (
    <MaxWidthWrapper className='px-4 lg:px-0'>
      <Hero />
      <PartnershipForm />
      <JobFAQSection />
    </MaxWidthWrapper>
  )
}

export default Page
