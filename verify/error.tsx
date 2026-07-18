'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Error'
}

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()

  const router = useRouter()
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/explore')
    }, 5000) // Redirect after 5 seconds

    return () => clearTimeout(redirectTimer)
  }, [router])
  const url = `mailto:support@sharkdom.com?subject=Error%20Report&body=${error.message} ${error.digest && error.digest} on ${pathname} page `
  return (
    <main className='flex h-full w-full items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-red-400 bg-red-50 p-4'>
        <h2 className='text-3xl font-semibold'>Oops! something went wrong.</h2>
        <p className='text-red-700'>
          {error.message} {error.digest && `(${error.digest})`}
        </p>

        <Button onClick={() => reset()} className='' variant='default'>
          Try again
        </Button>
        <span>
          If the error persists, please contact{' '}
          <a href={url} className='font-medium text-primary underline'>
            Support
          </a>{' '}
          please include the error message in the email.
        </span>
      </div>
    </main>
  )
}
