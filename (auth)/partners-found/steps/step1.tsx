'use client'

import { FC } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'

import ClaimHeadIcon from '../../../../../public/onBoarding-v2.1/claim-head-icon.svg'
import { SectionHeader } from '../SectionHeader'

interface Step3Props {
  name?: string
}

export const Step1: FC<Step3Props> = ({ name }) => {
  return (
    <div className='pt-20'>
      <SectionHeader
        title='Company Found!'
        subtitle='Great news! Your company already exists on Sharkdom. You can claim this profile to get started.'
        image={ClaimHeadIcon}
      />
      <div className='mb-4 rounded-lg border border-[#22A538] bg-[#F6FDF9] p-4'>
        <div className='flex items-start justify-between gap-3'>
          {/* Left: logo + name */}
          <div className='flex items-start gap-3'>
            <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-red-600 shadow-inner'>
              <span className='font-bold text-white'>pt</span>
            </div>

            <div>
              <p className='text-sm font-medium'>
                Positive Technologies Pvt. Ltd.
              </p>
              <p className='text-xs text-[#5E7193]'>Your company on Sharkdom</p>
            </div>
          </div>

          {/* Right: UNCLAIMED pill */}
          <div className='rounded-lg bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-white'>
            UNCLAIMED
          </div>
        </div>

        {/* checklist lines */}
        <ul className='mt-3 space-y-2 text-sm'>
          <li className='flex items-start gap-2'>
            <span className='mt-0.5'>
              <CheckCircle className='h-4 w-4 text-sky-500' />
            </span>
            <div>
              <div className='text-sm font-medium'>Auto created profile</div>
              <div className='text-xs text-gray-600'>
                This profile was created when partners searched for your company
              </div>
            </div>
          </li>

          <li className='flex items-start gap-2'>
            <span className='mt-0.5'>
              <CheckCircle className='h-4 w-4 text-sky-500' />
            </span>
            <div>
              <div className='text-sm font-medium'>Ready to claim</div>
              <div className='text-xs text-gray-600'>
                No one from your company has claimed this profile yet
              </div>
            </div>
          </li>
        </ul>

        {/* small horizontal stat row */}
        <div className='mt-3 flex justify-between gap-6 border-t border-[#22A538] pt-3 text-sm'>
          <div className='flex flex-col'>
            <p className='text-base font-semibold text-[#38B000]'>
              12<span className='pl-1 text-[10px] '>pending</span>
            </p>
            <p className='text-xs'>Partner Requests</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-base font-semibold text-[#38B000]'>
              89<span className='pl-1 text-[10px] '>this month</span>
            </p>
            <p className='text-xs'>Company Profile Views</p>
          </div>
          <div className='flex flex-col'>
            <p className='text-base font-semibold text-[#38B000]'>
              23<span className='pl-1 text-[10px] '>matches</span>
            </p>
            <p className='text-xs'>Partnership Opportunities</p>
          </div>
        </div>
      </div>

      {/* Claim summary purple box */}
      <div className='mb-3 rounded-xl border border-[#CBCDFC] bg-violet-50 p-4'>
        <div className='flex  gap-2'>
          <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[#3E50F7] shadow-inner'>
            <ArrowRight className='h-4 w-4 text-white' />
          </div>
          <p className='text-base font-semibold'> Claim it</p>
        </div>
        <p className='pl-12 text-sm text-[#2A3241]'>
          Your email domain{' '}
          <span className='font-semibold text-black'>
            positivetechnologies.com
          </span>{' '}
          will be verified to confirm you work for this company. Our team will
          review your claim within 24 hours.
        </p>
        <div className='mx-6 mt-4 rounded bg-[#DFE0FE] p-2'>
          <p className='text-xs text-[#3E50F7]'>
            You&apos;ll become the first admin and can invite team members
          </p>
        </div>
      </div>
    </div>
  )
}
