'use client'

import React from 'react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import FAQSection from '../partner-training-feature/_components/FAQSection'
import FreeResourceAccess from './_components/FreeResourceAccess'
import Hero from './_components/Hero'

const BookDemo = () => {
  return (
    <>
      <Hero />
      <MaxWidthWrapper className='px-4 lg:px-0'>
        <FreeResourceAccess />
        <FAQSection />
      </MaxWidthWrapper>
    </>
  )
}

export default BookDemo
