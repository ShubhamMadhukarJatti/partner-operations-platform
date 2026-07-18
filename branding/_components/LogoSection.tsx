import React from 'react'

import { FullLogo2 } from '@/components/icons/logo'

const LogoSection = () => {
  return (
    <div className='flex flex-col gap-9 '>
      <h3 className='text-[48px] font-bold'>Logo</h3>
      <div className='flex w-full flex-col gap-6'>
        <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-white'>
          <FullLogo2 className='h-[60px] w-[317px]' />
        </div>
        <p className='text-base font-normal text-[#4E4E4E]'>
          This horizontal lockup is our primary logo and should be used for most
          communications. It is the preferred version for use on light
          backgrounds
        </p>
      </div>
    </div>
  )
}

export default LogoSection
