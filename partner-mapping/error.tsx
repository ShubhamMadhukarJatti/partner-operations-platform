'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error
    console.error('Partner Mapping Error:', error)

    // Automatically redirect to start page after a short delay
    const timer = setTimeout(() => {
      router.replace('/partner-mapping/start')
    }, 1000)

    return () => clearTimeout(timer)
  }, [error, router])

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-xl font-semibold text-gray-900'>
          Something went wrong
        </h2>
        <p className='mt-2 text-gray-600'>Redirecting to setup page...</p>
        <div className='mt-4'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900'></div>
        </div>
      </div>
    </div>
  )
}
