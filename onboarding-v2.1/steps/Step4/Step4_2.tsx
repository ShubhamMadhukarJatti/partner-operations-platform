import React, { useState } from 'react'

import { updateRegionToPartnerWith } from '@/lib/actions/onboarding-v2.1'
import { showCustomToast } from '@/components/custom-toast'

interface Step4_2Props {
  firstName?: string
  lastName?: string
  companyName?: string
  websiteUrl?: string
  email?: string
  currentRole?: string
  teamSize?: string
  regions?: string[]
  onChange?: (regions: string[]) => void
  onNext?: () => void
  onPrev?: () => void
}

export const Step4_2: React.FC<Step4_2Props> = ({
  firstName = 'John',
  lastName = 'Doe',
  companyName = 'Acme corp',
  websiteUrl = 'https://www.acmecorp.io',
  email = 'johndoe@acmecorp.io',
  currentRole = 'Partnership team',
  teamSize = '1-4 people',
  regions = [],
  onChange,
  onNext,
  onPrev
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    if (regions.length === 0) return
    setIsLoading(true)
    try {
      // await updateRegionToPartnerWith(regions)
      onNext?.()
    } catch (error: any) {
      showCustomToast(
        'Error',
        error.message || 'Failed to update regions',
        'error',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRegion = (region: string) => {
    if (!onChange) return
    if (regions.includes(region)) {
      onChange(regions.filter((r) => r !== region))
    } else {
      onChange([...regions, region])
    }
  }

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
        <div className='inline-flex flex-1 flex-col items-start justify-between self-stretch rounded-xl p-4 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
          <div className='flex flex-col items-start justify-start gap-8 self-stretch'>
            <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
              <div className='self-stretch font-inter text-xs font-medium uppercase text-[#6A7282]'>
                Almost there
              </div>
              <div className='self-stretch font-inter text-sm font-medium text-[#6A7282]'>
                Just a few quick questions to tailor Sharkdom to how you work.
              </div>
            </div>

            {/* Progress Bar (Step 2 active) */}
            <div className='inline-flex items-center justify-start gap-3 self-stretch'>
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#007A55]'>
                  <svg
                    width='6'
                    height='4'
                    viewBox='0 0 6 4'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 2L2.5 3.5L5 1'
                      stroke='white'
                      strokeWidth='1'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                  Step 1
                </div>
              </div>
              <div className='h-0 w-6 outline outline-[0.5px] outline-offset-[-0.25px] outline-[#C5D0E4]' />
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <img
                  src='/onBoarding-v2.1/stepicon.svg'
                  alt='Step Icon'
                  className='h-4 w-4'
                />
                <div className='font-inter text-xs font-semibold leading-tight text-[#6863FB]'>
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
                Which regions do you prefer to partner with?
              </div>
              <div className='self-stretch font-inter text-sm font-normal leading-[18.20px] text-[#6A7282]'>
                Select all regions where you'd like to find and work with
                partners
              </div>
            </div>

            {/* Options */}
            <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
              <div className='inline-flex items-start justify-start gap-4 self-stretch'>
                <div
                  onClick={() => toggleRegion('APAC')}
                  className={`flex flex-1 cursor-pointer items-start justify-end gap-4 rounded-lg px-4 py-3 outline outline-1 transition-all ${regions.includes('APAC') ? 'bg-[#6863FB]/5 outline-[#6B4FBB]' : 'bg-white/50 outline-[#C5D0E4]/25'}`}
                >
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-0.5'>
                    <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                      APAC
                    </div>
                    <div className='self-stretch font-inter text-xs font-normal leading-[18px] text-[#6A7282]'>
                      Asia-Pacific region including China, Japan, India,
                      Australia
                    </div>
                  </div>
                  <div
                    className={`mt-1 inline-flex h-4 w-4 flex-col items-center justify-center rounded-full ${regions.includes('APAC') ? 'bg-[#F9FAFB] outline outline-1 outline-[#6B4FBB]' : 'bg-[#F9FAFB] outline outline-1 outline-[#E5E7EB]'}`}
                  >
                    {regions.includes('APAC') && (
                      <div className='h-2 w-2 rounded-full bg-[#6863FB]' />
                    )}
                  </div>
                </div>

                <div
                  onClick={() => toggleRegion('MENA')}
                  className={`flex flex-1 cursor-pointer items-start justify-end gap-4 rounded-lg px-4 py-3 outline outline-1 transition-all ${regions.includes('MENA') ? 'bg-[#6863FB]/5 outline-[#6B4FBB]' : 'bg-white/50 outline-[#C5D0E4]/25'}`}
                >
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-0.5'>
                    <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                      MENA
                    </div>
                    <div className='self-stretch font-inter text-sm font-normal leading-[21px] text-[#666666]'>
                      Middle East and North Africa
                    </div>
                  </div>
                  <div
                    className={`mt-1 inline-flex h-4 w-4 flex-col items-center justify-center rounded-full ${regions.includes('MENA') ? 'bg-[#F9FAFB] outline outline-1 outline-[#6B4FBB]' : 'bg-[#F9FAFB] outline outline-1 outline-[#E5E7EB]'}`}
                  >
                    {regions.includes('MENA') && (
                      <div className='h-2 w-2 rounded-full bg-[#6863FB]' />
                    )}
                  </div>
                </div>
              </div>

              <div className='inline-flex items-start justify-start gap-4 self-stretch'>
                <div
                  onClick={() => toggleRegion('Europe')}
                  className={`flex flex-1 cursor-pointer items-start justify-end gap-4 rounded-lg px-4 py-3 outline outline-1 transition-all ${regions.includes('Europe') ? 'bg-[#6863FB]/5 outline-[#6B4FBB]' : 'bg-white/50 outline-[#C5D0E4]/25'}`}
                >
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-0.5'>
                    <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                      Europe
                    </div>
                    <div className='self-stretch font-inter text-sm font-normal leading-[21px] text-[#666666]'>
                      European Union and surrounding countries
                    </div>
                  </div>
                  <div
                    className={`mt-1 inline-flex h-4 w-4 flex-col items-center justify-center rounded-full ${regions.includes('Europe') ? 'bg-[#F9FAFB] outline outline-1 outline-[#6B4FBB]' : 'bg-[#F9FAFB] outline outline-1 outline-[#E5E7EB]'}`}
                  >
                    {regions.includes('Europe') && (
                      <div className='h-2 w-2 rounded-full bg-[#6863FB]' />
                    )}
                  </div>
                </div>

                <div
                  onClick={() => toggleRegion('North America')}
                  className={`flex flex-1 cursor-pointer items-start justify-end gap-4 rounded-lg px-4 py-3 outline outline-1 transition-all ${regions.includes('North America') ? 'bg-[#6863FB]/5 outline-[#6B4FBB]' : 'bg-white/50 outline-[#C5D0E4]/25'}`}
                >
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-0.5'>
                    <div className='font-inter text-base font-normal leading-normal text-[#101828]'>
                      North America
                    </div>
                    <div className='self-stretch font-inter text-sm font-normal leading-[21px] text-[#666666]'>
                      United States, Canada, and Mexico
                    </div>
                  </div>
                  <div
                    className={`mt-1 inline-flex h-4 w-4 flex-col items-center justify-center rounded-full ${regions.includes('North America') ? 'bg-[#F9FAFB] outline outline-1 outline-[#6B4FBB]' : 'bg-[#F9FAFB] outline outline-1 outline-[#E5E7EB]'}`}
                  >
                    {regions.includes('North America') && (
                      <div className='h-2 w-2 rounded-full bg-[#6863FB]' />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className='mt-8 inline-flex items-center justify-between self-stretch'>
            <button
              onClick={onPrev}
              className='flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 outline outline-1 outline-offset-[-1px] outline-[#CCCCCC] transition-colors hover:bg-gray-50'
            >
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
                    d='M5 9L1 5M1 5L5 1M1 5H11'
                    stroke='#212B36'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <span className='font-inter text-sm font-semibold leading-tight text-[#1A1A1A]'>
                Previous
              </span>
            </button>
            <button
              onClick={handleNext}
              disabled={regions.length === 0 || isLoading}
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
