'use client'

import Image from 'next/image'

import { SuccesPalcholderIcon } from '@/components/icons/icons'

export default function MailConfirmationPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-2xl'>
        {/* Illustration */}
        <div className='mb-2'>
          <SuccesPalcholderIcon />
        </div>

        {/* Title */}
        <h2 className='mb-2 text-[28px] font-bold text-gray-800'>
          Your mailbox is linked — you’re all set
        </h2>

        {/* Subheading */}
        <p className='mb-4 text-[14px] leading-relaxed text-gray-600'>
          <span className='font-medium'>
            Up next: Configure your Sharkdom Email Box
          </span>
          <br />
          <span>
            Completing these steps improves deliverability and protects your
            domain reputation. This <br />
            helps keep messages out of spam and ensures reliable tracking.
          </span>
        </p>

        {/* List */}
        <div className='mx-auto mb-6 text-left text-[14px] leading-relaxed text-gray-700'>
          <p className='mb-1 font-medium'>Configure Email Box:</p>
          <ul className='list-inside list-disc space-y-1'>
            <li>Set Reply-To and masking preferences.</li>
            <li>Choose default tracking (opens/clicks).</li>
            <li>Run a test send.</li>
          </ul>
        </div>

        {/* Button */}
        <div>
          <button className='inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700'>
            View your email →
          </button>
        </div>
      </div>
    </div>
  )
}
