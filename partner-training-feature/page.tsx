import React from 'react'

import FAQSection from './_components/FAQSection'
import FreeResourceAccess from './_components/FreeResourceAccess'
import Hero from './_components/Hero'
import KeyCapabilitiesSection from './_components/KeyCapabilitiesSection'

const Page = () => {
  return (
    <div className='min-h-screen w-full bg-white'>
      <Hero />
      <KeyCapabilitiesSection />
      <FreeResourceAccess />
      <FAQSection />
    </div>
  )
}

export default Page
