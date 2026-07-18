// components/MailboxLinkedPage.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

import MailboxIcon from '../../../../../../public/MailBoxIcon.svg'

type Props = {
  onContinue?: () => void
  illustrationSrc?: string
}

export default function MailboxLinkedPage({
  onContinue,
  illustrationSrc = '/images/mailbox-illustration.png'
}: Props) {
  return (
    <div className='flex min-h-screen items-start justify-start bg-[#F0F2F2] md:items-center md:justify-center md:p-8 lg:h-[82vh]'>
      <div className='w-full max-w-4xl'>
        <div className='flex flex-col items-start justify-center md:ml-10'>
          <div className='my-6 flex-shrink-0'>
            <Image src={MailboxIcon} alt='img' height={120} width={120} />
          </div>

          {/* Content */}
          <div className='flex-1'>
            <h1 className='text-2xl font-extrabold leading-snug text-gray-900 md:text-3xl'>
              Your mailbox is linked — you&apos;re all set
            </h1>

            <div className='mt-8 max-w-2xl text-base text-gray-700'>
              <p className='mb-3 text-sm font-semibold text-gray-600'>
                Configure Email Box:
              </p>

              <ul className='list-disc space-y-2 pl-5 text-sm text-gray-700'>
                <li>Set Reply-To and masking preferences.</li>
                <li>Choose default tracking (opens/clicks).</li>
                <li>Run a test send.</li>
              </ul>
            </div>

            <div className='mt-6 w-full max-w-xs'>
              <Button
                variant='primary'
                onClick={onContinue}
                className='mt-6 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-semibold'
              >
                Continue to Partner Selection
                <ArrowRight className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
