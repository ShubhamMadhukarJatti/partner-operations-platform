import React from 'react'

import { FullLogo2, FullLogoWhite } from '@/components/icons/logo'

const ColorsSection = () => {
  return (
    <div className='flex flex-col gap-9 '>
      <h3 className='text-[48px] font-bold'>Color</h3>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div>
          <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-white'>
            <FullLogo2 className='h-[60px] w-[317px]' />
          </div>
          <p className='mt-6 text-base font-normal text-[#4E4E4E]'>
            This horizontal lockup is our primary logo and should be used for
            most communications. It is the preferred version for use on light
            backgrounds.
          </p>
        </div>
        <div>
          <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-[#151552]'>
            <FullLogoWhite className='h-[60px] w-[317px]' />
          </div>
          <p className='mt-6 text-base font-normal text-[#4E4E4E]'>
            The white wordmark should be used on dark backgrounds or brand
            colors, including blue, black, yellow, and orange, to ensure optimal
            visibility and brand consistency.
          </p>
        </div>
        <div>
          <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-[#242424]'>
            <FullLogoWhite className='h-[60px] w-[317px]' />
          </div>
          {/* <p className='text-base font-normal mt-6 text-[#4E4E4E]'>The white wordmark should be used on dark backgrounds or brand colors, including blue, black, yellow, and orange, to ensure optimal visibility and brand consistency.</p> */}
        </div>
        <div>
          <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-[#FFB707]'>
            <FullLogoWhite className='h-[60px] w-[317px]' />
          </div>
          {/* <p className='text-base font-normal mt-6 text-[#4E4E4E]'>The white wordmark should be used on dark backgrounds or brand colors, including blue, black, yellow, and orange, to ensure optimal visibility and brand consistency.</p> */}
        </div>
        <div className=' lg:col-span-2'>
          <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-[#F94F2F]'>
            <FullLogoWhite className='h-[60px] w-[317px]' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorsSection
