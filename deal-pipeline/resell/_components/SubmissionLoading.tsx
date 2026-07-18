'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

export default function SubmissionLoading() {
  return (
    <div className='flex min-h-[calc(100vh-200px)] w-full flex-col items-center justify-center'>
      <Loader2 className='h-12 w-12 animate-spin text-primary-blue' />
      <p className='mt-4 text-base font-medium text-[#6B7280]'>
        Please wait your deal is being submitted...
      </p>
    </div>
  )
}
