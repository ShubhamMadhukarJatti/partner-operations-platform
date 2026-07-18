import React from 'react'

import FAQSection from './FAQSection'
import FreeResourceAccess from './FreeResourceAccess'
import Hero from './Hero'
import KeyCapabilitiesSection from './KeyCapabilitiesSection'

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
