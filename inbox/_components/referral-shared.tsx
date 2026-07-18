import React from 'react'

import { Button } from '@/components/ui/button'

const ReferralShared = () => {
  return (
    <div className='flex flex-col gap-2 rounded-xl border border-[#D4D4D4] p-4'>
      <h6 className='text-base font-normal'>
        StartupA has shared a referral link
      </h6>

      <Button className='mt-4 w-full'>View code for integration</Button>
    </div>
  )
}

export default ReferralShared
