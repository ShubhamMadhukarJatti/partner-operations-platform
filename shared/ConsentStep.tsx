// Modified File *(latest)*

'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { EyeSlash, Share } from 'iconsax-react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type ConsentStepProps = {
  setStep: () => void
  sourceIcon: string
  dataSource?: string
  source?: React.ReactNode
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isUploaded: boolean
  install: () => void
  sheetUrl: string
  setSheetUrl: (url: string) => void
  isButtonLoading: boolean
  initialShowSuccess?: boolean
  onSuccessContinue?: () => void
  /** When set, used for the top "Back to Home" control instead of browser history. */
  onBack?: () => void
}

const ConsentStep: React.FC<ConsentStepProps> = ({
  setStep,
  sourceIcon,
  dataSource,
  source,
  setIsOpen,
  isUploaded,
  install,
  sheetUrl,
  setSheetUrl,
  isButtonLoading,
  initialShowSuccess = false,
  onSuccessContinue,
  onBack
}) => {
  const [showSuccess, setShowSuccess] = useState(initialShowSuccess)
  const router = useRouter()

  useEffect(() => {
    setShowSuccess(initialShowSuccess)
  }, [initialShowSuccess])

  return (
    <>
      {showSuccess ? (
        <div className='flex h-full flex-col items-center justify-center'>
          <Image src={sourceIcon} alt='' width={115} height={64} />
          <div className='mt-20 flex flex-col items-center'>
            <div className='h-64 w-64'>
              <Lottie
                animationData={require('@/lib/lottie-json/verified.json')}
                loop={true}
              />
            </div>
            <span className='mt-1 text-shark-lg text-text-100'>
              {dataSource} Successfully Connected
            </span>
            {onSuccessContinue && (
              <Button
                onClick={onSuccessContinue}
                className='mt-8 w-[218px] rounded-md bg-primary-blue py-2 text-shark-base font-bold text-white transition-colors hover:bg-primary-blue'
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='my-8'>
          <Button
            variant={'link'}
            onClick={() => (onBack ? onBack() : router.push('/my-data'))}
            className='mb-8 flex items-center text-shark-sm font-semibold text-primary-blue '
          >
            <ArrowLeft size={16} className='mr-1' />
            Back to Home
          </Button>

          <div className='mb-6 flex flex-col items-center'>
            <div className='mb-4 flex items-center justify-center'>
              <Image src={sourceIcon} alt='' width={115} height={64} />
            </div>
            <p className='text-center text-shark-lg font-bold text-[#2A3241]'>
              Sharkdom uses{' '}
              <span className='font-medium text-orange-500'>{dataSource}</span>{' '}
              to connect your account
            </p>
          </div>

          <div className='mb-6'>{source}</div>

          {/* Google Sheet URL input removed - handled on configuration page */}

          <div className='mb-6  bg-[#EDF2FF] p-4'>
            <h3 className='mb-2 text-shark-base font-bold text-[#10366F]'>
              How to connect {dataSource}
            </h3>
            <ol className='list-decimal pl-5 text-shark-sm text-[#2A3241]'>
              <li className='mb-1'>Provide admin permission in Sharkdom</li>
              <li>Add credentials for the authenticating user in your CRM</li>
            </ol>
          </div>

          <div className='mb-6 bg-[#FDF3E3] p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='text-shark-base font-bold text-[#10366F]'>
                What you&apos;ll get
              </h3>
            </div>
            <p className='text-shark-sm text-[#2A3241]'>
              Access to your customer data for advanced analytics and partner
              matching.
            </p>
          </div>

          {/* Benefits section */}
          <div className='mb-6 space-y-4 rounded-lg border border-[#E4E7EE] p-4'>
            <div className='flex'>
              <div className='mr-3 flex-shrink-0'>
                <Share size={24} variant='Bold' />
              </div>
              <div>
                <h4 className='text-shark-base font-medium text-[#2A3241]'>
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
                <h4 className='text-shark-base font-medium text-[#2A3241]'>
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
              if (isUploaded) {
                setStep()
                setTimeout(() => {
                  setShowSuccess(true)
                }, 2000)
              } else {
                install()
              }
            }}
            className='w-[218px] rounded-md bg-primary-blue py-2 text-shark-base font-bold text-white transition-colors hover:bg-primary-blue'
            disabled={false}
            loading={isButtonLoading}
          >
            {isUploaded ? 'Next' : 'Connect'}
          </Button>
        </div>
      )}
    </>
  )
}

export default ConsentStep
