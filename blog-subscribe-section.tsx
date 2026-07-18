'use client'

import React, { useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'

const SubscribeSection = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [businessEmail, setBusinessEmail] = useState<string>('')

  async function handleBookDemo(values: string) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/demo-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify({ businessEmail: values })
      })
      if (!response.ok) {
        throw new Error(`Failed to post data. Status: ${response.status}`)
      }
      setBusinessEmail('')
      showCustomToast('Success', 'Demo Booked', 'success', 5000)
    } catch (error: any) {
      showCustomToast('Error', error, 'error', 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-[#EEF0FD] px-4 py-16'>
      <div className='mx-auto flex max-w-5xl flex-col-reverse justify-between gap-8 md:flex-row md:gap-0'>
        <div className='w-full md:w-3/6'>
          <p className='mb-4 text-sm text-[#7C808D]'>SUBSCRIBE TO UPDATES</p>
          <p className='mb-2 text-3xl font-bold lg:text-5xl'>
            Learn how as a founder you can use the power of partnerships?
          </p>
          <p className='mb-8 text-lg font-light leading-8 lg:text-[22px]'>
            Sign up for our newsletter to enjoy premium partnerships and
            ecosystem content you can’t get anywhere else.
          </p>
          <p className='mb-3 text-xs font-light'>
            By submitting this form you agree to Sharkdom&apos;s
            <a
              href={'/privacy-policy'}
              className='ml-1 text-[#002EFD] underline'
            >
              Privacy Policy.
            </a>
          </p>
          <div className='flex h-12 w-full flex-row items-center'>
            <Input
              type='text'
              placeholder='Enter your email'
              className='h-full rounded-none rounded-l-md focus-visible:ring-0 focus-visible:ring-offset-0'
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
            />
            <Button
              className='h-full rounded-none rounded-r-md'
              type='submit'
              onClick={() => handleBookDemo(businessEmail)}
              loading={isLoading}
            >
              Subscribe
            </Button>
          </div>
        </div>
        <div className='flex w-full items-center justify-center md:w-fit'>
          <Image
            src={'/assets/free-demo-guide-cover.svg'}
            width={320}
            height={300}
            alt={'cover-img'}
          />
        </div>
      </div>
    </div>
  )
}

export default SubscribeSection
