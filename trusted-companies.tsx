import React from 'react'
import Image from 'next/image'

const TRUSTED_COMPANIES = [
  {
    thumbnailUrl: '/icons/credit-samadhaan-logo.svg',
    altText: 'credit-samadhaan'
  },
  {
    thumbnailUrl: '/icons/relokart-logo.svg',
    altText: 'relokart'
  },
  {
    thumbnailUrl: '/icons/whalesbook-logo.svg',
    altText: 'whalesbook'
  },
  {
    thumbnailUrl: '/icons/verifast-logo.svg',
    altText: 'verifast'
  },
  {
    thumbnailUrl: '/icons/aisensy-logo.svg',
    altText: 'aisensy'
  },
  {
    thumbnailUrl: '/icons/vipas-ai-logo.svg',
    altText: 'vipas-ai'
  },
  {
    thumbnailUrl: '/icons/chums-ai-logo.svg',
    altText: 'chums-ai'
  }
]

function TrustedCompanies() {
  return (
    <section className='flex w-full flex-col items-center justify-center gap-8 bg-primary-dark-blue py-20'>
      <p className='text-center text-shark-xl text-white'>
        Trusted by <span className='font-semibold'>1,342</span> companies for
        discovering and enabling impactful partnerships.
      </p>
      <div className='flex max-w-screen-lg flex-wrap items-center justify-center gap-x-14'>
        {TRUSTED_COMPANIES &&
          TRUSTED_COMPANIES.map((company) => (
            <Image
              key={company.altText}
              src={company.thumbnailUrl}
              alt={company.altText}
              width={200}
              height={100}
              className='aspect-video w-36 lg:w-48'
            />
          ))}
      </div>
    </section>
  )
}

export default TrustedCompanies
