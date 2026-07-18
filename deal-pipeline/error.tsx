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
    // Log the error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('[Deal Pipeline Error Boundary]', error)
    }

    // Automatically redirect to start page after a short delay
    // This ensures users never see the error screen
    const timer = setTimeout(() => {
      router.replace('/deal-pipeline/start')
    }, 1000)

    return () => clearTimeout(timer)
  }, [error, router])

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-xl font-semibold text-gray-900'>
          Setting up Deal Pipeline...
        </h2>
        <p className='mt-2 text-gray-600'>Redirecting to setup page...</p>
        <div className='mt-4'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900'></div>
        </div>
      </div>
    </div>
  )
}
