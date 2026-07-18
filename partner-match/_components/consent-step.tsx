'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { EyeSlash, Share } from 'iconsax-react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type ConsentStepProps = {
  setStep: () => void

  sourceIcon: string
  dataSource?: string
  source?: React.ReactNode
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isUploaded: boolean
}

const ConsentStep: React.FC<ConsentStepProps> = ({
  setStep,

  sourceIcon,
  dataSource,
  source,
  setIsOpen,
  isUploaded
}) => {
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <>
      {showSuccess ? (
        <div className='flex h-full flex-col items-center justify-center'>
          <Image src={sourceIcon} alt='' width={115} height={64} />
          <div className='mt-20'>
            <div className='h-64 w-64 '>
              <Lottie
                animationData={require('@/lib/lottie-json/verified.json')}
                loop={true}
              />
            </div>
            <span className='mt-1 text-shark-lg text-text-100'>
              {dataSource} Successfully Connected
            </span>
          </div>
        </div>
      ) : (
        <div className='my-8'>
          <Button
            variant={'link'}
            onClick={() => setIsOpen(false)}
            className='fds-text-sm mb-8 flex items-center text-primary-blue '
          >
            <ArrowLeft size={16} className='mr-1' />
            Back to Home
          </Button>

          <div className='mb-6 flex flex-col items-center'>
            <div className='mb-4 flex items-center justify-center'>
              <Image src={sourceIcon} alt='' width={115} height={64} />
            </div>
            <p className='fds-text-lead-semibold text-center text-[#2A3241]'>
              Sharkdom uses{' '}
              <span className='font-medium text-orange-500'>{dataSource}</span>{' '}
              to connect your account
            </p>
          </div>

          <div className='mb-6'>{source}</div>

          <div className='mb-6  bg-[#EDF2FF] p-4'>
            <h3 className='fds-text-semibold mb-2 text-[#10366F]'>
              How to connect {dataSource}
            </h3>
            {/* TAake from props */}
            <ol className='list-decimal pl-5 text-shark-sm text-[#2A3241]'>
              <li className='mb-1'>Provide admin permission in Sharkdom</li>
              <li>Add credentials for the authenticating user in your CRM</li>
            </ol>
          </div>

          <div className='mb-6 bg-[#FDF3E3] p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='fds-text text-[#2A3241]'>
                Recommended fields for better results
              </h3>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex items-start'>
                <div className='mt-0.5 flex-shrink-0'>
                  <div className='flex h-4 w-4 items-center justify-center rounded-sm bg-green-500'>
                    <svg
                      width='10'
                      height='8'
                      viewBox='0 0 10 8'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M1 4L3.5 6.5L9 1'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-2'>
                  <span className='font-medium'>Mandatory:</span> Name, Website
                </div>
              </div>
              <div className='flex items-start'>
                <div className='mt-0.5 flex-shrink-0'>
                  <div className='flex h-4 w-4 items-center justify-center rounded-sm bg-amber-400'>
                    <svg
                      width='10'
                      height='8'
                      viewBox='0 0 10 8'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M1 4L3.5 6.5L9 1'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                </div>
                <div className='ml-2'>
                  <span className='font-medium'>
                    Nice-to-have (Optional though):
                  </span>{' '}
                  Industry, Contact Number
                </div>
              </div>
            </div>
          </div>

          {/* Benefits section */}
          <div className='mb-6 space-y-4 rounded-lg border border-[#E4E7EE] p-4'>
            <div className='flex'>
              <div className='mr-3 flex-shrink-0'>
                <Share size={24} variant='Bold' />
              </div>
              <div>
                <h4 className='fds-text text-[#2A3241]'>
                  Connect Effortlessly
                </h4>
                <p className='text-shark-sm text-text-80'>
                  Sharkdom lets you securely connect your marketing data in
                  couple of minutes.
                </p>
              </div>
            </div>
            <div className='flex'>
              <div className='mr-3 flex-shrink-0'>
                <EyeSlash size={24} variant='Bold' />
              </div>
              <div>
                <h4 className='fds-text text-[#2A3241]'>
                  Your data belongs to you
                </h4>
                <p className='text-shark-sm text-text-80'>
                  Sharkdom doesn&apos;t sell personal info, and will only use it
                  with your permission.
                </p>
              </div>
            </div>
          </div>

          <p className='mb-12 text-shark-xs text-[#4D5C78]'>
            By selecting Continue you agree to the{' '}
            <a href='#' className='text-primary-blue'>
              Sharkdom End User Privacy Policy
            </a>
            .
          </p>

          <Button
            onClick={() => {
              setStep()
              setTimeout(() => {
                setShowSuccess(true)
              }, 2000)
            }}
            className='fds-text-semibold w-[218px] rounded-md bg-primary-blue py-2 text-white transition-colors hover:bg-primary-blue'
            disabled={!isUploaded}
          >
            Continue
          </Button>
        </div>
      )}
    </>
  )
}

export default ConsentStep
