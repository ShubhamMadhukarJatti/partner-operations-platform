import React from 'react'
import Image from 'next/image'

const TRUSTED_COMPANIES = [
  {
    thumbnailUrl: '/icons/relokart-grey.svg',
    altText: 'relokart'
  },
  {
    thumbnailUrl: '/icons/whalesbook-grey.svg',
    altText: 'whalesbook'
  },
  {
    thumbnailUrl: '/icons/vipas-ai-grey.svg',
    altText: 'vipas-ai'
  },
  {
    thumbnailUrl: '/icons/chums-ai-grey.svg',
    altText: 'chums-ai'
  }
]

function PartnerCompanies() {
  return (
    <section className='m-auto max-w-7xl py-10 lg:py-20'>
      <p className='mb-8 text-center text-sm uppercase text-[#474747] lg:mb-4'>
        Loved by Teams at
      </p>
      <div className='flex flex-wrap items-center justify-center gap-x-14'>
        {TRUSTED_COMPANIES &&
          TRUSTED_COMPANIES.map((company) => (
            <Image
              key={company.altText}
              src={company.thumbnailUrl}
              alt={company.altText}
              width={300}
              height={200}
              className='aspect-video w-48 lg:w-60'
            />
          ))}
      </div>
    </section>
  )
}

export default PartnerCompanies
