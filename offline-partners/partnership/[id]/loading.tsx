import React from 'react'

import { Logo } from '@/components/icons/logo'

export default function Loading() {
  return (
    <div className='flex h-screen items-center justify-center bg-white'>
      <div className='flex flex-col items-center gap-4'>
        <Logo className='h-12 w-auto animate-pulse' />
        <p className='text-sm text-gray-600'>Loading partner details...</p>
      </div>
    </div>
  )
}
