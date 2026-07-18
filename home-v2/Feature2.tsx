import React from 'react'
import Image from 'next/image'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

const Feature2 = () => {
  return (
    <MaxWidthWrapper className='mt-[100px] w-full  max-w-7xl px-1 xl:max-w-screen-2xl'>
      <div
        className='flex flex-col gap-6 rounded-xl px-6 py-6 lg:px-9 xl:px-[64px]'
        style={{
          background: 'radial-gradient(circle, #F94F2F1A 0%, #FFB70733 100%)'
        }}
      >
        <div className='flex flex-col-reverse items-center justify-between gap-6 lg:flex-row'>
          <div className='flex max-w-[676px] flex-col gap-[18px]'>
            <p className='text-2xl font-bold lg:text-4xl'>
              Simplified Account Mapping to find IPP based on common
              opportunities and prospects.
            </p>
            <p className='text-sm font-normal text-[#4E4E4E] lg:text-base/[18px] '>
              Share your common customers data in fully encrypted escrow
              environment with your partners via consent based data sharing with
              complete authority of what to share and to whom
            </p>
          </div>
          <Image
            src={'/assets/account-mapping-illustration.png'}
            alt=''
            width={511}
            height={464}
          />
        </div>
        <div className='flex flex-col items-center justify-between gap-4 lg:flex-row'>
          <Image
            src={'/assets/new-partnership-illustration.png'}
            alt=''
            width={511}
            height={464}
          />
          <div className='flex max-w-[676px] flex-col gap-[18px]'>
            <p className='text-2xl font-bold lg:text-4xl'>
              Launch new Partnerships within minutes
            </p>
            <p className='text-sm font-normal text-[#4E4E4E] lg:text-base/[18px] '>
              Get discover on marketplace with simple onboarding and generate
              your ICP to find Ideal Partners with higher chances of partnership
              success and start receiving partnership enquiry from get go.
            </p>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default Feature2
