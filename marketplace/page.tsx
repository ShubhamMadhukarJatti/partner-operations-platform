import React from 'react'
import Script from 'next/script'

import FAQSection from './FAQSection'
import FreeResourceAccess from './FreeResourceAccess'
import Hero from './Hero'
import KeyCapabilitiesSection from './KeyCapabilitiesSection'

const marketplaceSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Sharkdom Partner Marketplace',
  description:
    "Browse Sharkdom's global partner marketplace to find integration co-sell and channel partners by industry geography and GTM motion. Join free and start building.",
  url: 'https://www.sharkdom.com/marketplace',
  keywords: [
    'B2B partner marketplace',
    'find co-sell partners',
    'integration partner discovery'
  ]
}

const Page = () => {
  return (
    <div className='min-h-screen w-full bg-white'>
      <Script
        id='marketplace-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceSchema) }}
      />
      <Hero />
      <KeyCapabilitiesSection />
      <FreeResourceAccess />
      <FAQSection />
    </div>
  )
}

export default Page
