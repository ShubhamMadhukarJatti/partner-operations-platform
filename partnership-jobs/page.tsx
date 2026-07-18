'use client'

import React from 'react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import FAQSection from './_components/FAQSection'
import FreeResourceAccess from './_components/FreeResourceAccess'
import Hero from './_components/Hero'
import { HowItWorks } from './_components/HowItWorks'
import { WhyPartnershipProfessionals } from './_components/WhyPartnershipProfessionals'

const Page = () => {
  return (
    <MaxWidthWrapper className='px-4 lg:px-0'>
      <Hero />
      <HowItWorks />
      <WhyPartnershipProfessionals />
      <FreeResourceAccess />
      <FAQSection />
    </MaxWidthWrapper>
  )
}

export default Page
