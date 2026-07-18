'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

export default function DiscoverError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Discover page error:', error)
  }, [error])

  return (
    <MaxWidthWrapper className='max-w-6xl'>
      <div className='my-8 flex min-h-[400px] flex-col items-center justify-center'>
        <div className='space-y-4 text-center'>
          <h2 className='text-2xl font-bold text-text-100'>
            Something went wrong!
          </h2>
          <p className='max-w-md text-text-80'>
            We encountered an error while loading the discover page. This might
            be a temporary issue.
          </p>
          <div className='flex justify-center gap-4'>
            <Button onClick={reset} variant='default' className='px-6'>
              Try again
            </Button>
            <Button
              onClick={() => (window.location.href = '/discover')}
              variant='outline'
              className='px-6'
            >
              Refresh page
            </Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
