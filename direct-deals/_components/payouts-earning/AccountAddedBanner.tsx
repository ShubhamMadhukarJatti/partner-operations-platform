'use client'

import React from 'react'
import { Verify } from 'iconsax-react'

import { VerifyIcon } from '@/components/icons/icons'

const AccountAddedBanner: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div className='flex items-center gap-2 rounded-lg border  border-[#92D2A3] bg-[#E0F8E6] px-4 py-3'>
      <VerifyIcon />

      <div>
        <p className='text-base/5 font-bold text-text-100'>
          Account ID {id} connected!
        </p>
        <p className='text-sm/4 font-normal text-text-100'>
          You can change the account details via Settings
        </p>
      </div>
    </div>
  )
}

export default AccountAddedBanner
