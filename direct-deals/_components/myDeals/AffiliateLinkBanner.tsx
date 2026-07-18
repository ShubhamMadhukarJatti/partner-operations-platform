'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { SendMailIcon } from '@/components/icons/icons'

const AffiliateLinkBanner: React.FC<{ affiliateLink: string }> = ({
  affiliateLink
}) => {
  console.log({ affiliateLink })
  return (
    <div className='flex justify-between rounded-lg bg-[#E0FBE7] px-4 py-3'>
      <div className='flex items-center'>
        <p className='flex items-center gap-3 text-shark-sm font-bold text-text-100'>
          <SendMailIcon /> Send affiliate program link to your partner
        </p>
      </div>

      <div className='flex max-w-[430px] grow items-center gap-2'>
        <OutlinedInput
          className='h-10 bg-white px-2 py-1 text-text-100'
          placeholder='Add link here'
          name='affiliateLink'
          label='Affiliate link'
          value={affiliateLink}
          disabled
        />
        <Button variant={'default'}>Send</Button>
      </div>
    </div>
  )
}

export default AffiliateLinkBanner
