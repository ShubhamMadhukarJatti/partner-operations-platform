'use client'

import { FC } from 'react'
import Image from 'next/image'
import { Clock } from 'iconsax-react'
import { Check } from 'lucide-react'

import ClaimHeadClock from '../../../../../public/onBoarding-v2.1/claim-head-clock.svg'
import ClaimIllustration from '../../../../../public/onBoarding-v2.1/claim-illustration.svg'
import { SectionHeader } from '../SectionHeader'

interface Step3Props {
  name?: string
}

export const Step2: FC<Step3Props> = ({ name }) => {
  return (
    <div className='pb-2 pt-20'>
      <SectionHeader
        title='Claim Under Review'
        subtitle="Your company claim is being reviewed by our security team. We'll notify you once it's approved."
        image={ClaimHeadClock}
      />
      {/* illustration placeholder */}
      <div className='mb-3 flex flex-col items-center justify-center'>
        <Image src={ClaimIllustration} alt='img' height={160} width={160} />
        <p className='text-sm font-medium'>Review Process</p>
      </div>

      {/* status list */}
      <div className='mb-4 flex flex-col items-center justify-center space-y-3 px-3'>
        <div className='flex items-start gap-3'>
          <div className='flex h-5 w-5 items-center justify-center rounded-full bg-[#2BA84A]'>
            <Check className='h-5 w-4 text-white' strokeWidth={3} />
          </div>
          <div>
            <div className='text-sm font-medium'>Identity Verified</div>
            <div className='text-xs text-gray-500'>
              We matched the email and company records.
            </div>
            <div className='text-xs text-[#00970A]'>Completed</div>
          </div>
        </div>

        <div className='flex items-start gap-3'>
          <Clock className='h-5 w-5 text-[#ED9E00]' strokeWidth={1.3} />
          <div>
            <div className='text-sm font-medium'>Security Review</div>
            <div className='text-xs text-gray-500'>
              Our security team is reviewing documents and <br />
              authenticity.
            </div>
            <div className='text-xs text-[#ED9E00]'>In Progress</div>
          </div>
        </div>

        <div className='flex items-start gap-3'>
          <div className='flex h-5 w-5 items-center justify-center rounded bg-[#DEE2E6] leading-none'>
            ...
          </div>

          <div>
            <div className='text-sm font-medium'>Awaiting Action</div>
            <div className='text-xs text-gray-500'>
              No action required — we&apos;ll update you via email.
            </div>
            <div className='text-xs text-[#92A0B9]'>Pending</div>
          </div>
        </div>
      </div>

      {/* email notification box */}
      <div className='mx-3 rounded-lg border border-[#ADB5BD] bg-[#FBFBFB] px-6 py-4 text-xs text-gray-700'>
        <div className='mb-1 text-sm font-medium'>Email Notifications</div>

        <div className='mt-1 text-xs text-gray-500'>
          We&apos;ll send updates to{' '}
          <span className='font-medium text-black'>
            nikhil.saini@positivetechnologies.com
          </span>
        </div>
        <ul className='mt-2 list-disc space-y-2 px-4 text-xs text-gray-400'>
          <li>Instant notification when approved</li>
          <li>Progress updates if additional info needed</li>
        </ul>
      </div>
      <p className='flex items-center justify-center py-2 text-xs text-[#717182]'>
        Review typically completes within 24 hours during business days
      </p>
    </div>
  )
}
