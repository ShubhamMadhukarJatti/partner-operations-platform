'use client'

import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

type Props = {
  onCreateDataSource: () => void
}

export default function AccountMappingEmptyState({
  onCreateDataSource
}: Props) {
  return (
    <div className='flex h-[70vh] w-full flex-col items-center justify-center'>
      <div className='flex items-center justify-center gap-4'>
        {/* <Image
          src='/assets/account-mapping-illustration.png'
          alt='Connect your data'
          height={157}
          width={148}
          className='object-contain'
          onError={(e) => {
            const target = e.currentTarget
            target.onerror = null
            target.src = '/nature,wildlife,adventure,outdoors,eco-friendly.svg'
          }}
        /> */}
      </div>
      <div className='items-center justify-center gap-4 pt-4'>
        <h2 className='w-full text-center text-base font-bold leading-tight tracking-normal text-gray-900'>
          Connect your data source to unlock partner insights.
        </h2>
      </div>
      <div className='flex justify-center gap-4'>
        <p className='w-[450px] py-2 text-center text-sm text-slate-500'>
          Get instant overlap analytics, compare partners, and generate reports
          tailored to your pipeline. Without a connected data source, mapping
          won&apos;t be possible.
        </p>
      </div>
      <div className='flex items-center justify-center gap-4'>
        <Button
          variant='default'
          onClick={onCreateDataSource}
          className='rounded-lg bg-[#3E50F7] px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-[#2d3bb3]'
        >
          Create Data Source
        </Button>
      </div>
    </div>
  )
}
