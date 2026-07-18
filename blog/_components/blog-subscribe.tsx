'use client'

import React, { FormEvent, useRef, useState } from 'react'
import Link from 'next/link'
import emailjs from '@emailjs/browser'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const BlogSubscribe = () => {
  const form = useRef<any>()

  const [submitted, setSubmitted] = useState(false)

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    emailjs
      .sendForm('service_ukdqm9w', 'template_qywm9tn', form.current, {
        publicKey: 'VU3sUJyVUNoEupb3L'
      })
      .then(
        () => {
          console.log('SUCCESS!')
          setSubmitted(true)
        },
        (error) => {
          console.log('FAILED...', error.text)
        }
      )
  }

  return (
    <div className='flex w-full flex-col gap-4 rounded-lg bg-[#EEF0FD] p-8 sm:flex-row sm:p-12'>
      <div className='space-y-8 sm:w-1/2'>
        <h6 className='text-4xl font-semibold'>
          Use Startup Ecosystem like Pro
        </h6>
        <p className='text-lg font-medium'>
          Get partnership guides, case studies and proven strategies from
          leaders in driving revenue with partnerships.
        </p>
        <p className='font-light'>
          by submitting this form you agree to Sharkdom{' '}
          <Link href='/privacy-policy' className='text-[#0062F1]'>
            privacy policy
          </Link>
        </p>
      </div>
      <div className='flex items-center justify-center sm:w-1/2'>
        {submitted ? (
          <p className='text-green-500'>Thank you for subscribing!</p>
        ) : (
          <form
            ref={form}
            onSubmit={sendEmail}
            className='flex w-full flex-col sm:w-auto sm:flex-row'
          >
            <Input
              className='h-min rounded-t-lg p-2 text-[#84858A] sm:rounded-l lg:rounded-t-none'
              type='email'
              name='user_email'
              placeholder='Enter your email'
            />
            <Button
              className='rounded-none rounded-b-lg sm:rounded-l-none sm:rounded-r-lg'
              type='submit'
              value='Send'
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
