'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { unsubscribeEmail } from '@/lib/actions/unsubscribe'

const Unsubscribe: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [unsubscribeStatus, setUnsubscribeStatus] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const email = searchParams.get('email')

    if (email) {
      handleUnsubscribe(email)
    } else {
      router.push('/')
    }
  }, [searchParams, router])

  const handleUnsubscribe = async (email: string) => {
    try {
      const response = unsubscribeEmail(email)

      setUnsubscribeStatus('You have been unsubscribed.')
    } catch (error) {
      setUnsubscribeStatus('An error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
      setTimeout(() => router.push('/'), 2000) // Redirect after 2 seconds
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-screen flex-col items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <p className='mt-4'>Unsubscribing...</p>
      </div>
    )
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <h1 className='mb-4 text-2xl font-bold'>Unsubscribe</h1>
      <p>{unsubscribeStatus}</p>
      <p>Redirecting to home page...</p>
    </div>
  )
}

export default Unsubscribe
