'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Box, Mail } from 'lucide-react'

import { claimMailbox } from '@/lib/db/email-outreach'
import { Button } from '@/components/ui/button'

import MailboxPlacholderIcon from '../../../../../../public/MailBoxPlaceholde.svg'

type Props = {
  email?: string
  replyTo?: string
  onAccept?: () => void
  onNext?: () => void
}

export default function EmailBoxCard({
  email = '@sharkdom.com',
  replyTo = 'emailusedinsignup',
  onAccept,
  onNext
}: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async () => {
    try {
      setIsLoading(true)
      const response = await claimMailbox()

      if (response.claimed) {
        onNext?.()
      }
    } catch (error) {
      console.error('Error claiming mailbox:', error)
      // You might want to show an error toast here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#F0F2F2] md:p-4 lg:h-[82vh]'>
      <div className='w-full max-w-md rounded-xl bg-white p-6 text-center'>
        {/* Header */}
        <div className='flex items-center justify-center gap-4'>
          <Mail className='h-6 w-6 text-[#3E50F7]' strokeWidth={2} />
          <h2 className='text-[18px] font-bold md:text-[22px]'>
            Here is your email
          </h2>
        </div>
        <p className='mt-1 py-2 text-sm text-[#2A3241]'>
          Send and track unlimited emails via
        </p>

        {/* Email pill + illustration */}
        <div className='mt-4 rounded-xl border-[4px] border-[#DEE2E6] bg-[#F0F2F2] p-3'>
          <div className='mb-3 flex items-center justify-center gap-2 text-sm font-medium text-[#3E50F7]'>
            <Mail className='h-4 w-4' strokeWidth={1.8} />
            <span>{email}</span>
          </div>
          <div className='flex justify-center'>
            <Image
              src={MailboxPlacholderIcon}
              alt='img'
              height={160}
              width={160}
            />
          </div>
        </div>

        {/* Footer */}
        <p className='mt-3 pt-2 text-sm text-gray-600'>
          Replies would be redirected to
          <br />
          <span className='font-semibold'>{replyTo}</span>
        </p>

        {/* Button */}
        <Button
          variant={isLoading ? 'disable' : 'primary'}
          onClick={handleAccept}
          disabled={isLoading}
          className='my-5 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed'
        >
          {isLoading ? 'Processing...' : 'Accept the terms to proceed'}
          <ArrowRight className='h-5 w-5' strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}
