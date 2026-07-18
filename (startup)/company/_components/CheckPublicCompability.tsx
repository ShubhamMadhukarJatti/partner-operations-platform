'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { showCustomToast } from '@/components/custom-toast'

import PartnershipDialog from './CompabilityScoreModal'
import { EmailAlert } from './EmailSent'

type Props = {}

const CheckPublicCompability = (props: Props) => {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [emailAlert, setEmailAlert] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleCheckCompatibility = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (isValidEmail) {
      setIsLoading(true)
      router.push(`/register?email=${email}`)
    } else {
      // Assuming there's a toast function to show a toast message
      setIsLoading(false)
      showCustomToast(
        'Invalid Email',
        'Please enter a valid email address.',
        'error',
        5000
      )
    }
  }

  return (
    <>
      {open && (
        <PartnershipDialog
          setOpen={setOpen}
          email={email}
          setEmailAlert={setEmailAlert}
          setEmail={setEmail}
        />
      )}
      {emailAlert && <EmailAlert />}

      {/* Overlay background */}
      <div className='fixed inset-0 z-10 bg-black bg-opacity-30' />
      {/* Bottom card */}
      <div className='fixed inset-x-0 bottom-0 z-20 w-full bg-white'>
        <div className='mx-auto w-full max-w-xl bg-white p-8'>
          <h2 className='mb-6 text-center text-2xl font-bold'>
            Learn more about Sharkdom with
            <br />a free account
          </h2>
          <div className='mb-2 text-sm font-medium text-gray-700'>
            Enter work mail <span className='text-red-500'>*</span>
          </div>
          <div className='relative mb-2'>
            <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <svg
                className='h-5 w-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1'
                ></path>
              </svg>
            </span>
            <Input
              type='email'
              className='block w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              placeholder='sales@katlyst.com'
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className='mb-4 flex items-start rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700'>
            <svg
              className='mr-2 mt-0.5 h-4 w-4 text-blue-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 102 0 1 1 0 00-2 0zm.293-7.707a1 1 0 00-1.414 1.414L10.586 9H10a1 1 0 000 2h2a1 1 0 000-2h-.586l.293-.293a1 1 0 000-1.414z'
                clipRule='evenodd'
              />
            </svg>
            <span>
              Recommended: By entering your business email you can skip the
              verification jargon
            </span>
          </div>
          <Button
            className='mb-2 h-10 w-full rounded-md bg-blue-600 text-base font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
            onClick={handleCheckCompatibility}
            disabled={!email}
            loading={isLoading}
          >
            Continue with email
          </Button>
        </div>
      </div>
    </>
  )
}

export default CheckPublicCompability
