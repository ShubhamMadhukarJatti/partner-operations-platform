'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const Banner = () => {
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)

  const handleUpdateProfile = () => {
    router.push('/settings')
    setShowToast(false)
  }

  return (
    <>
      <div className='fixed bottom-12 left-1/2 z-50 -translate-x-1/2 transform sm:bottom-4'>
        <div className='z-[99] flex w-80 items-center justify-between rounded-lg border bg-card p-4 sm:w-[506px]'>
          <div className=''>
            <h2 className='text-sm sm:text-base'>Your profile is offline</h2>
            <p className='text-xs text-muted-foreground sm:text-sm'>
              Update your profile to make it online & send proposals.
            </p>
          </div>
          <button
            onClick={handleUpdateProfile}
            className='button-style cursor-pointer rounded-[81px] border-2 border-solid border-[#0062F1] px-4 py-2 text-xs text-primary sm:text-sm'
          >
            Update
          </button>
        </div>
      </div>
    </>
  )
}
