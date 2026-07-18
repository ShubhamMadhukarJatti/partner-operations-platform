'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'

import DomainValidate from '../_components/domain-validation'

function ReferralLink() {
  const router = useRouter()

  const [showHeader, setShowHeader] = useState(true)

  return (
    <main className='flex h-full flex-col gap-4 p-4'>
      {showHeader ? (
        <div className='mb-2 flex flex-col gap-2 sm:mb-8'>
          <div className='flex flex-row items-center gap-2 text-sm text-[#475569]'>
            <div
              className='cursor-pointer hover:underline'
              onClick={() => router.push('/partner-programs')}
            >
              Partner Programs
            </div>
            <p>{'>'}</p>
            <p className='font-bold'>Referral program</p>
          </div>
          <Heading title='Create new referral program' />
        </div>
      ) : null}

      <DomainValidate showHeader={setShowHeader} />
    </main>
  )
}

export default ReferralLink
