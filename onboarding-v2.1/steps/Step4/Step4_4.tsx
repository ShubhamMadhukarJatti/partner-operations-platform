import React, { useState } from 'react'

import { updateOnboardedPartners } from '@/lib/actions/onboarding-v2.1'
import { showCustomToast } from '@/components/custom-toast'

interface Step4_4Props {
  firstName?: string
  lastName?: string
  companyName?: string
  websiteUrl?: string
  email?: string
  currentRole?: string
  teamSize?: string
  primaryCrm?: string
  stackTools?: string[]
  currentPartnersCount?: string
  onPrimaryCrmChange?: (crm: string) => void
  onStackToolsChange?: (tools: string[]) => void
  onCurrentPartnersCountChange?: (count: string) => void
  onNext?: () => void
  onPrev?: () => void
}

export const Step4_4: React.FC<Step4_4Props> = ({
  firstName = 'John',
  lastName = 'Doe',
  companyName = 'Acme corp',
  websiteUrl = 'https://www.acmecorp.io',
  email = 'johndoe@acmecorp.io',
  currentRole = 'Partnership team',
  teamSize = '1-4 people',
  primaryCrm = 'Hubspot',
  stackTools = [],
  currentPartnersCount = '5',
  onPrimaryCrmChange,
  onStackToolsChange,
  onCurrentPartnersCountChange,
  onNext,
  onPrev
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const crmOptions = ['Hubspot', 'Salesforce', 'Pipedrive', 'Zoho CRM', 'Other']
  const toolOptions = [
    {
      id: 'Slack',
      name: 'Slack',
      icon: (
        <div className='relative h-5 w-5'>
          <div className='absolute left-[10.58px] top-[2.50px] h-[6.92px] w-[6.92px] bg-[#2EB67D]' />
          <div className='absolute left-[9.42px] top-[17.50px] h-[6.92px] w-[6.92px] rotate-180 transform bg-[#E01E5A]' />
          <div className='absolute left-[17.50px] top-[10.58px] h-[6.92px] w-[6.92px] rotate-90 transform bg-[#ECB22E]' />
          <div className='absolute left-[2.50px] top-[9.42px] h-[6.92px] w-[6.92px] -rotate-90 transform bg-[#36C5F0]' />
        </div>
      )
    },
    {
      id: 'Google workspace',
      name: 'Google workspace',
      icon: (
        <div className='relative h-5 w-5'>
          <div className='absolute left-[4.18px] top-[3.33px] h-[5.35px] w-[10.41px] bg-[#EA4335]' />
          <div className='absolute left-[10.13px] top-[8.79px] h-[6.27px] w-[6.40px] bg-[#4285F4]' />
          <div className='absolute left-[3.47px] top-[7.01px] h-[5.99px] w-[2.87px] bg-[#FBBC05]' />
          <div className='absolute left-[4.19px] top-[11.32px] h-[5.35px] w-[10.36px] bg-[#34A853]' />
        </div>
      )
    },
    {
      id: 'Notion',
      name: 'Notion',
      icon: (
        <div className='relative h-5 w-5'>
          <div className='absolute left-[2.92px] top-[2.50px] h-[15px] w-[14.40px] bg-[#1E2226]' />
        </div>
      )
    },
    {
      id: 'Zapier',
      name: 'Zapier',
      icon: (
        <div className='relative h-5 w-5 overflow-hidden'>
          <div className='absolute left-[2.50px] top-[2.52px] h-[14.96px] w-[15px] bg-[#FF4A00]' />
        </div>
      )
    },
    {
      id: 'Hubspot',
      name: 'Hubspot',
      icon: (
        <div className='relative h-3 w-3'>
          <div className='absolute left-[2.28px] top-[1px] h-[4.43px] w-[4.44px] outline outline-[0.8px] outline-offset-[-0.4px] outline-[#637381]' />
          <div className='absolute left-[8.14px] top-[2px] h-[3.50px] w-[1.81px] outline outline-[0.8px] outline-offset-[-0.4px] outline-[#637381]' />
          <div className='absolute left-[1.17px] top-[6.59px] h-[4.31px] w-[6.82px] outline outline-[0.8px] outline-offset-[-0.4px] outline-[#637381]' />
          <div className='absolute left-[9.17px] top-[7px] h-[3px] w-[1.56px] outline outline-[0.8px] outline-offset-[-0.4px] outline-[#637381]' />
        </div>
      )
    },
    {
      id: 'Outlook',
      name: 'Outlook',
      icon: (
        <div className='relative h-5 w-5 overflow-hidden'>
          <div className='absolute left-[7.50px] top-[4.17px] h-[11.67px] w-[8.33px] rounded-[0.83px] bg-gradient-to-r from-[#064484] to-[#0F65B5]' />
          <div className='absolute left-[7.50px] top-[5.42px] h-[4.17px] w-[4.17px] bg-[#32A9E7]' />
          <div className='absolute left-[7.50px] top-[9.58px] h-[4.17px] w-[4.17px] bg-[#167EB4]' />
          <div className='absolute left-[11.67px] top-[9.58px] h-[4.17px] w-[4.17px] bg-[#32A9E7]' />
          <div className='absolute left-[11.67px] top-[5.42px] h-[4.17px] w-[4.17px] bg-[#58D9FD]' />
          <div className='absolute left-[6.67px] top-[9.17px] h-[6.67px] w-[10px] bg-gradient-to-r from-[#1B366F] to-[#2657B0]' />
          <div className='absolute left-[15.83px] top-[9.17px] h-[1.67px] w-[0.83px] bg-[#135298]' />
          <div className='absolute left-[16.67px] top-[15.83px] h-[5.83px] w-[10.42px] rotate-180 transform bg-gradient-to-r from-[#44DCFD] to-[#259ED0]' />
          <div className='absolute left-[6.67px] top-[10px] h-[5.83px] w-[10.42px] bg-gradient-to-r from-[#259ED0] to-[#44DCFD]' />
          <div className='absolute left-[6.67px] top-[7.08px] h-[7.50px] w-[5px] bg-black/30' />
          <div className='absolute left-[3.33px] top-[6.25px] h-[7.50px] w-[7.50px] rounded-[0.83px] bg-gradient-to-r from-[#064484] to-[#0F65B5]' />
          <div className='absolute left-[5px] top-[7.92px] h-[4.17px] w-[4.17px] bg-white' />
        </div>
      )
    },
    {
      id: 'Jira',
      name: 'Jira',
      icon: (
        <div className='relative h-5 w-5'>
          <div className='absolute left-[9.69px] top-[3.33px] h-[6.94px] w-[6.98px] bg-[#2684FF]' />
          <div className='absolute left-[6.51px] top-[6.53px] h-[6.94px] w-[6.98px] bg-gradient-to-bl from-[#0052CC] to-[#2684FF]' />
          <div className='absolute left-[3.33px] top-[9.73px] h-[6.94px] w-[6.98px] bg-gradient-to-bl from-[#0052CC] to-[#2684FF]' />
        </div>
      )
    },
    {
      id: 'Linkedin',
      name: 'Linkedin',
      icon: (
        <div className='relative h-5 w-5'>
          <div className='absolute left-[3.33px] top-[3.33px] h-[13.33px] w-[13.33px] bg-[#2867B2]' />
        </div>
      )
    }
  ]

  const handleNext = async () => {
    setIsLoading(true)
    try {
      // API call intentionally disabled per user request
      // await updateOnboardedPartners(currentPartnersCount)
      // Save primaryCrm and stackTools when APIs are available if needed.
      onNext?.()
    } catch (error: any) {
      showCustomToast(
        'Error',
        error.message || 'Failed to update partner count',
        'error',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTool = (toolId: string) => {
    if (!onStackToolsChange) return
    if (stackTools.includes(toolId)) {
      onStackToolsChange(stackTools.filter((t) => t !== toolId))
    } else {
      onStackToolsChange([...stackTools, toolId])
    }
  }

  const incrementPartners = () => {
    const current = parseInt(currentPartnersCount) || 0
    onCurrentPartnersCountChange?.((current + 1).toString())
  }

  const decrementPartners = () => {
    const current = parseInt(currentPartnersCount) || 0
    if (current > 0) {
      onCurrentPartnersCountChange?.((current - 1).toString())
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

            {/* Progress Bar (Step 4 active) */}
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
                  Step 2
                </div>
              </div>
              <div className='h-0 w-6 outline outline-[0.5px] outline-offset-[-0.25px] outline-[#C5D0E4]' />
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
                  Step 3
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

            {/* Content Section */}
            <div className='flex flex-col items-start justify-start gap-8 self-stretch'>
              <div className='flex flex-col items-start justify-start gap-4 self-stretch'>
                <div className='self-stretch font-inter text-lg font-semibold text-[#101828]'>
                  What does your stack look like?
                </div>
                <div className='self-stretch font-inter text-sm font-normal leading-[18.20px] text-[#6A7282]'>
                  We'll pre-configure integrations and suggest matched partners
                  based on this.
                </div>

                <div className='inline-flex items-start justify-start gap-2 self-stretch rounded-lg bg-[#EEF6FF] px-3 py-2'>
                  <div className='relative h-4 w-4'>
                    <div className='absolute left-[2.74px] top-[1.33px] h-[11.33px] w-[10.52px] outline outline-[1px] outline-offset-[-0.5px] outline-[#1447E6]' />
                    <div className='absolute left-[5.67px] top-[14.34px] h-[0.32px] w-[4.67px] outline outline-[1px] outline-offset-[-0.5px] outline-[#1447E6]' />
                  </div>
                  <div className='flex-1 font-inter text-xs font-normal leading-[18px] text-[#1447E6]'>
                    You can connect or disconnect tools any time from
                    Integrations
                  </div>
                </div>
              </div>

              <div className='flex w-full flex-col items-start justify-start gap-6 self-stretch'>
                {/* Primary CRM */}
                <div className='relative flex flex-col items-start justify-start gap-1 self-stretch'>
                  <div className='mb-1 self-stretch font-inter text-sm font-medium leading-tight text-[#666666]'>
                    Primary CRM
                  </div>
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='inline-flex cursor-pointer items-center justify-between self-stretch rounded-lg bg-white px-4 py-2.5 outline outline-1 outline-offset-[-1px] outline-[#CCCCCC]'
                  >
                    <div className='font-inter text-base font-normal leading-normal text-[#666666]'>
                      {primaryCrm || 'Select CRM'}
                    </div>
                    <div className='relative h-4 w-4'>
                      <div
                        className='absolute left-[2.50px] top-[5.50px] h-[6px] w-[11px] bg-[#333333]'
                        style={{
                          maskImage:
                            "url(\"data:image/svg+xml,%3Csvg width='11' height='6' viewBox='0 0 11 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5.5 5L10 1' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                          WebkitMaskImage:
                            "url(\"data:image/svg+xml,%3Csvg width='11' height='6' viewBox='0 0 11 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5.5 5L10 1' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"
                        }}
                      />
                    </div>
                  </div>
                  {isDropdownOpen && (
                    <div className='absolute left-0 top-[100%] z-10 mt-1 w-full rounded-lg bg-white py-1 shadow-lg outline outline-1 outline-[#CCCCCC]'>
                      {crmOptions.map((option) => (
                        <div
                          key={option}
                          className='cursor-pointer px-4 py-2 font-inter text-sm text-[#666666] hover:bg-gray-50'
                          onClick={() => {
                            onPrimaryCrmChange?.(option)
                            setIsDropdownOpen(false)
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tools in your stack */}
                <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
                  <div className='self-stretch font-inter text-sm font-medium leading-tight text-[#666666]'>
                    Tools in your stack
                  </div>
                  <div className='inline-flex flex-wrap content-start items-start justify-start gap-3 self-stretch'>
                    {toolOptions.map((tool) => {
                      const isSelected = stackTools.includes(tool.id)
                      return (
                        <div
                          key={tool.id}
                          onClick={() => toggleTool(tool.id)}
                          className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1 transition-colors ${
                            isSelected
                              ? 'bg-[#6863FB]/5 outline outline-1 outline-[#6B4FBB]'
                              : 'bg-[#F9FAFB] outline outline-1 outline-[#F3F4F6] hover:bg-gray-100'
                          }`}
                        >
                          {tool.icon}
                          <div
                            className={`font-inter text-sm font-normal leading-tight ${isSelected ? 'text-[#6863FB]' : 'text-[#6A7282]'}`}
                          >
                            {tool.name}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Current active partners */}
                <div className='mt-2 inline-flex items-center justify-start gap-2.5 self-stretch rounded-lg p-3 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-1'>
                    <div className='self-stretch font-inter text-sm font-medium leading-tight text-[#666666]'>
                      Current active partners
                    </div>
                    <div className='self-stretch font-inter text-sm font-normal leading-[18.20px] text-[#6A7282]'>
                      Approximate number is fine. You can update this later
                    </div>
                  </div>
                  <div className='flex items-center justify-start gap-4'>
                    <button
                      onClick={decrementPartners}
                      className='flex items-center justify-start gap-1 rounded-full bg-[#F3F4F6] p-1 transition-colors hover:bg-gray-200'
                    >
                      <div className='relative h-4 w-4'>
                        <div className='absolute left-[2px] top-[7.5px] h-[1px] w-3 bg-[#6863FB]' />
                      </div>
                    </button>
                    <div className='w-6 text-center font-inter text-xl font-semibold leading-7 text-[#4A5565]'>
                      {currentPartnersCount}
                    </div>
                    <button
                      onClick={incrementPartners}
                      className='flex items-center justify-start gap-1 rounded-full bg-[#F3F4F6] p-1 transition-colors hover:bg-gray-200'
                    >
                      <div className='relative h-4 w-4'>
                        <div className='absolute left-[2px] top-[7.5px] h-[1px] w-3 bg-[#6863FB]' />
                        <div className='absolute left-[7.5px] top-[2px] h-3 w-[1px] bg-[#6863FB]' />
                      </div>
                    </button>
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
              disabled={isLoading}
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
