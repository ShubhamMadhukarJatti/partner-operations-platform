import React, { useState } from 'react'

import { updateCompanyType } from '@/lib/actions/onboarding-v2.1'
import { showCustomToast } from '@/components/custom-toast'

interface Step4Props {
  firstName?: string
  lastName?: string
  companyName?: string
  websiteUrl?: string
  email?: string
  currentRole?: string
  teamSize?: string
  marketSegment?: string
  onChange?: (segment: string) => void
  onNext?: () => void
}

const ArrowIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M3.33333 8H12.6667M12.6667 8L8 3.33333M12.6667 8L8 12.6667'
      stroke='#C4CDD5'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export const Step4: React.FC<Step4Props> = ({
  firstName = 'John',
  lastName = 'Doe',
  companyName = 'Acme corp',
  websiteUrl = 'https://www.acmecorp.io',
  email = 'johndoe@acmecorp.io',
  currentRole = 'Partnership team',
  teamSize = '1-4 people',
  marketSegment = '',
  onChange,
  onNext
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    if (!marketSegment) return
    setIsLoading(true)
    try {
      // API call intentionally disabled per user request
      // await updateCompanyType(marketSegment)
      onNext?.()
    } catch (error: any) {
      showCustomToast(
        'Error',
        error.message || 'Failed to update market segment',
        'error',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const options = [
    {
      id: 'B2B',
      titleTokens: ['B', 'B'],
      desc: 'Business to Business - Selling to other businesses'
    },
    {
      id: 'B2C',
      titleTokens: ['B', 'C'],
      desc: 'Business to Consumer - Selling directly to end consumers'
    },
    {
      id: 'B2B2C',
      titleTokens: ['B', 'B', 'C'],
      desc: 'Business to Business to Consumer - Through business partners to end consumers'
    }
  ]

  return (
    <div className='inline-flex h-full w-full flex-col items-center justify-start gap-8 rounded-2xl bg-white p-6 shadow-[0px_8px_8px_-4px_rgba(10,13,18,0.04),_0px_20px_24px_-4px_rgba(10,13,18,0.10)]'>
      {/* Header */}
      <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
        <div className='self-stretch font-inter text-2xl font-semibold text-[#101828]'>
          Welcome {firstName},
        </div>
        <div className='self-stretch font-inter text-2xl font-normal text-[#A7A6CC]'>
          Optimising your AI workforce
        </div>
      </div>

      <div className='inline-flex flex-1 items-start justify-start gap-6 self-stretch'>
        {/* Left Panel */}
        <div className='inline-flex w-[349px] flex-col items-start justify-between self-stretch pb-4'>
          <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
            <div className='flex w-full flex-col items-start justify-start gap-2 rounded-[20px] bg-[#F9FAFB] p-2'>
              {/* Company Info */}
              <div className='flex flex-col items-start justify-start gap-4 self-stretch rounded-xl bg-white p-3 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                <div className='self-stretch break-words font-inter text-xs font-medium uppercase text-[#6A7282]'>
                  Your Company
                </div>
                <div className='inline-flex items-start justify-start gap-4 self-stretch rounded-md'>
                  <div className='flex h-10 w-10 items-center justify-center gap-[6.67px] rounded-[6.67px] bg-gradient-to-br from-[#D588FC] to-[#007BFF] outline outline-[1.11px] outline-[#F3F4F6]'>
                    <div className='h-[12.13px] w-[17.60px] bg-white' />
                    <div className='h-[12.13px] w-[17.60px] bg-white' />
                  </div>
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-2'>
                    <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
                      <div className='self-stretch break-words font-inter text-sm font-medium text-[#101828]'>
                        {companyName}
                      </div>
                      <div className='self-stretch break-words font-inter text-xs font-normal leading-[14.40px] text-[#1447E6]'>
                        {websiteUrl}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className='flex flex-col items-start justify-start gap-4 self-stretch rounded-xl bg-white p-3 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                <div className='self-stretch break-words font-inter text-xs font-medium uppercase text-[#6A7282]'>
                  Your Profile
                </div>
                <div className='inline-flex items-start justify-start gap-4 self-stretch rounded-md'>
                  <div className='flex items-center justify-start gap-2'>
                    <img
                      src='https://placehold.co/40x40'
                      alt='Profile'
                      width={40}
                      height={40}
                      className='rounded-md outline outline-[1.11px] outline-[#F3F4F6]'
                    />
                  </div>
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-2'>
                    <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
                      <div className='self-stretch break-words font-inter text-sm font-medium text-[#101828]'>
                        {firstName} {lastName}
                      </div>
                      <div className='self-stretch break-words font-inter text-xs font-normal leading-[14.40px] text-[#1447E6]'>
                        {email}
                      </div>
                    </div>

                    <div className='inline-flex items-center justify-start gap-2 self-stretch'>
                      <div className='break-words font-inter text-xs font-normal leading-[14.40px] text-[#6A7282]'>
                        {currentRole}
                      </div>
                      <div className='h-0.5 w-0.5 rounded-full bg-[#99A1AF]' />
                      <div className='flex items-center justify-start gap-[6px]'>
                        <div className='relative h-3 w-3'>
                          <svg
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <circle
                              cx='8.94995'
                              cy='2.28998'
                              r='1.28998'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <circle
                              cx='3.03003'
                              cy='2.28998'
                              r='1.28998'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <circle
                              cx='9.72998'
                              cy='6.00995'
                              r='1.25995'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <circle
                              cx='2.25995'
                              cy='6.00995'
                              r='1.25995'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <circle
                              cx='5.94995'
                              cy='6.01996'
                              r='1.28998'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <ellipse
                              cx='6.00495'
                              cy='9.74502'
                              rx='1.98499'
                              ry='1.25494'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                          </svg>
                        </div>
                        <div className='break-words font-inter text-xs font-normal leading-[14.40px] text-[#6A7282]'>
                          {teamSize}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add phone number CTA */}
            <div className='mt-2 inline-flex w-full flex-col items-start justify-start gap-4 rounded-[20px] bg-[#EEF6FF] p-2'>
              <div className='inline-flex items-start justify-start gap-4 self-stretch rounded-xl bg-white p-3 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                <div className='relative mt-0.5 flex h-5 w-4 items-center justify-center'>
                  <img
                    src='/onBoarding-v2.1/phone.svg'
                    alt='Phone'
                    className='h-full w-full object-contain'
                  />
                </div>
                <div className='inline-flex flex-1 flex-col items-start justify-start gap-3 opacity-80'>
                  <div className='flex flex-col items-start justify-start gap-1'>
                    <div className='self-stretch break-words font-inter text-sm font-medium text-[#4A5565]'>
                      Add phone number
                    </div>
                    <div className='inline-flex items-center justify-start gap-1 self-stretch'>
                      <div className='break-words font-inter text-xs font-normal leading-[14.40px] text-[#6A7282]'>
                        Takes 10 secs
                      </div>
                      <div className='h-[2px] w-[2px] rounded-full bg-[#99A1AF]' />
                      <div className='break-words font-inter text-xs font-normal leading-[14.40px] text-[#6A7282]'>
                        Optional
                      </div>
                    </div>
                  </div>
                  <div className='inline-flex cursor-pointer items-start justify-start'>
                    <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                      <div className='relative h-4 w-4'>
                        <div
                          className='absolute left-[2px] top-[2px] h-3 w-3 bg-[#6863FB]'
                          style={{
                            maskImage:
                              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M6 1V11M1 6H11' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                            WebkitMaskImage:
                              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M6 1V11M1 6H11' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center'
                          }}
                        />
                      </div>
                      <div className='break-words font-inter text-sm font-semibold leading-tight text-[#6863FB]'>
                        Add now
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-start rounded-full bg-gradient-to-r from-[#F5ECFF] to-[#EDF9FF] px-1.5 py-0.5'>
                  <div className='break-words font-inter text-[10px] font-medium leading-[15px] text-[#F49C46]'>
                    +2 AI Credits
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What you unlock */}
          <div className='mt-6 flex flex-col items-start justify-start gap-4 self-stretch'>
            <div className='self-stretch font-inter text-xs font-medium uppercase text-[#6A7282]'>
              WHAT YOU UNLOCK
            </div>
            <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
              <div className='inline-flex items-center justify-start gap-3 self-stretch'>
                <img
                  src='/onBoarding-v2.1/dweep.svg'
                  alt='Dweep AI'
                  className='h-4 w-4'
                />
                <div
                  className='flex-1 font-inter text-sm font-normal'
                  style={{
                    backgroundImage:
                      'linear-gradient(122.24deg, #D588FC 16.63%, #007BFF 44.4%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  8 Dweep AI credits
                </div>
              </div>
              <div className='inline-flex items-center justify-start gap-3 self-stretch'>
                <div className='relative flex h-4 w-4 items-center justify-center overflow-hidden'>
                  <img
                    src='/onBoarding-v2.1/access.svg'
                    alt='Access'
                    className='h-full w-full'
                  />
                </div>
                <div className='flex-1 font-inter text-sm font-normal text-[#6A7282]'>
                  Access to 20+ integrations
                </div>
              </div>
              <div className='inline-flex items-start justify-start gap-3 self-stretch'>
                <div className='relative mt-0.5 flex h-4 w-4 items-center justify-center'>
                  <img
                    src='/onBoarding-v2.1/partnerportfolio.svg'
                    alt='Partner Portfolio'
                    className='h-full w-full'
                  />
                </div>
                <div className='flex-1 font-inter text-sm font-normal text-[#6A7282]'>
                  Effortlessly import your current <br />
                  partner portfolio
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className='relative z-10 inline-flex flex-1 flex-col items-start justify-between self-stretch rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
          <div className='flex flex-col items-start justify-start gap-8 self-stretch'>
            <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
              <div className='self-stretch font-inter text-xs font-medium uppercase text-[#6A7282]'>
                Almost there
              </div>
              <div className='self-stretch font-inter text-sm font-medium text-[#6A7282]'>
                Just a few quick questions to tailor Sharkdom to how you work.
              </div>
            </div>

            {/* Progress Bar (Step 1 active) */}
            <div className='inline-flex items-center justify-start gap-3 self-stretch'>
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <img
                  src='/onBoarding-v2.1/stepicon.svg'
                  alt='Step Icon'
                  className='h-4 w-4'
                />
                <div className='font-inter text-xs font-semibold leading-tight text-[#6863FB]'>
                  Step 1
                </div>
              </div>
              <div className='h-0 w-6 outline outline-[0.5px] outline-offset-[-0.25px] outline-[#C5D0E4]' />
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='relative h-4 w-4'>
                  <div className='absolute left-[1px] top-[15px] h-[14px] w-[14px] -rotate-90 transform rounded-full border border-[#C5D0E4]' />
                </div>
                <div className='font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                  Step 2
                </div>
              </div>
              <div className='h-0 w-6 outline outline-[0.5px] outline-offset-[-0.25px] outline-[#C5D0E4]' />
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='relative h-4 w-4'>
                  <div className='absolute left-[1px] top-[15px] h-[14px] w-[14px] -rotate-90 transform rounded-full border border-[#C5D0E4]' />
                </div>
                <div className='font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                  Step 3
                </div>
              </div>
              <div className='h-0 w-6 outline outline-[0.5px] outline-offset-[-0.25px] outline-[#C5D0E4]' />
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='relative h-4 w-4'>
                  <div className='absolute left-[1px] top-[15px] h-[14px] w-[14px] -rotate-90 transform rounded-full border border-[#C5D0E4]' />
                </div>
                <div className='font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                  Step 4
                </div>
              </div>
              <div className='h-0 w-6 outline outline-[0.5px] outline-offset-[-0.25px] outline-[#C5D0E4]' />
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='relative h-4 w-4'>
                  <div className='absolute left-[1px] top-[15px] h-[14px] w-[14px] -rotate-90 transform rounded-full border border-[#C5D0E4]' />
                </div>
                <div className='font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                  Step 5
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
              <div className='self-stretch font-inter text-lg font-semibold text-[#101828]'>
                Choose your market segment?
              </div>
              <div className='self-stretch font-inter text-sm font-normal leading-[18.20px] text-[#6A7282]'>
                Understanding your market helps us suggest suitable IPP(Ideal
                Partners)
              </div>
            </div>

            {/* Options */}
            <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
              <div className='inline-flex items-start justify-start gap-4 self-stretch'>
                {/* B2B Option */}
                <div
                  onClick={() => onChange?.('B2B')}
                  className={`flex flex-1 cursor-pointer items-start justify-end gap-4 rounded-lg px-4 py-3 transition-colors ${
                    marketSegment === 'B2B'
                      ? 'bg-[#6863FB]/5 outline outline-1 outline-[#6863FB]'
                      : 'bg-white/50 outline outline-1 outline-[#C5D0E4]/25 hover:bg-gray-50'
                  }`}
                >
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-0.5'>
                    <div className='mb-1 inline-flex items-center justify-start gap-1 self-stretch'>
                      <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                        B
                      </div>
                      <ArrowIcon />
                      <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                        B
                      </div>
                    </div>
                    <div
                      className={`self-stretch font-inter text-xs font-normal leading-[18px] ${marketSegment === 'B2B' ? 'text-[#6A7282]' : 'text-[#666666]'}`}
                    >
                      Business to Business - Selling to other businesses
                    </div>
                  </div>
                  <div
                    className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full ${marketSegment === 'B2B' ? 'bg-[#F9FAFB] outline outline-1 outline-[#6863FB]' : 'bg-[#F9FAFB] outline outline-1 outline-[#E5E7EB]'}`}
                  >
                    {marketSegment === 'B2B' && (
                      <div className='h-2 w-2 rounded-full bg-[#6863FB]' />
                    )}
                  </div>
                </div>

                {/* B2C Option */}
                <div
                  onClick={() => onChange?.('B2C')}
                  className={`flex flex-1 cursor-pointer items-start justify-end gap-4 rounded-lg px-4 py-3 transition-colors ${
                    marketSegment === 'B2C'
                      ? 'bg-[#6863FB]/5 outline outline-1 outline-[#6863FB]'
                      : 'bg-white/50 outline outline-1 outline-[#C5D0E4]/25 hover:bg-gray-50'
                  }`}
                >
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-0.5'>
                    <div className='mb-1 inline-flex items-center justify-start gap-1 self-stretch'>
                      <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                        B
                      </div>
                      <ArrowIcon />
                      <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                        C
                      </div>
                    </div>
                    <div
                      className={`self-stretch font-inter text-xs font-normal leading-[18px] ${marketSegment === 'B2C' ? 'text-[#6A7282]' : 'text-[#666666]'}`}
                    >
                      Business to Consumer - Selling directly to end consumers
                    </div>
                  </div>
                  <div
                    className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full ${marketSegment === 'B2C' ? 'bg-[#F9FAFB] outline outline-1 outline-[#6863FB]' : 'bg-[#F9FAFB] outline outline-1 outline-[#E5E7EB]'}`}
                  >
                    {marketSegment === 'B2C' && (
                      <div className='h-2 w-2 rounded-full bg-[#6863FB]' />
                    )}
                  </div>
                </div>
              </div>

              {/* B2B2C Option */}
              <div
                onClick={() => onChange?.('B2B2C')}
                className={`inline-flex w-[265.50px] cursor-pointer items-start justify-end gap-4 rounded-lg px-4 py-3 transition-colors ${
                  marketSegment === 'B2B2C'
                    ? 'bg-[#6863FB]/5 outline outline-1 outline-[#6863FB]'
                    : 'bg-white/50 outline outline-1 outline-[#C5D0E4]/25 hover:bg-gray-50'
                }`}
              >
                <div className='inline-flex flex-1 flex-col items-start justify-start gap-0.5'>
                  <div className='mb-1 inline-flex items-center justify-start gap-1 self-stretch'>
                    <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                      B
                    </div>
                    <ArrowIcon />
                    <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                      B
                    </div>
                    <ArrowIcon />
                    <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                      C
                    </div>
                  </div>
                  <div
                    className={`self-stretch font-inter text-xs font-normal leading-[18px] ${marketSegment === 'B2B2C' ? 'text-[#6A7282]' : 'text-[#666666]'}`}
                  >
                    Business to Business to Consumer - Through business partners
                    to end consumers
                  </div>
                </div>
                <div
                  className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full ${marketSegment === 'B2B2C' ? 'bg-[#F9FAFB] outline outline-1 outline-[#6863FB]' : 'bg-[#F9FAFB] outline outline-1 outline-[#E5E7EB]'}`}
                >
                  {marketSegment === 'B2B2C' && (
                    <div className='h-2 w-2 rounded-full bg-[#6863FB]' />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className='mt-8 inline-flex items-center justify-end self-stretch'>
            <button
              onClick={handleNext}
              disabled={!marketSegment || isLoading}
              className='flex items-center justify-center gap-2 rounded-lg bg-[#6863FB] px-4 py-2 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] outline outline-1 outline-offset-[-1px] outline-[#6B4FBB] transition-all hover:bg-[#5651D9] disabled:cursor-not-allowed'
            >
              <span className='font-inter text-sm font-semibold leading-tight text-white'>
                {isLoading ? 'Saving...' : 'Next'}
              </span>
              <div className='relative h-4 w-4'>
                <svg
                  width='12'
                  height='10'
                  viewBox='0 0 12 10'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='absolute left-[2px] top-[3px]'
                >
                  <path
                    d='M7 1L11 5M11 5L7 9M11 5H1'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
