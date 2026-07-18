import React, { useEffect, useRef, useState } from 'react'

import { showCustomToast } from '@/components/custom-toast'

interface AboutYouProps {
  companyName: string
  websiteUrl: string
  currentRole: string
  partnershipTeamStrength: string
  onChange: (field: string, value: string) => void
  onNext: () => void
  onPrev?: () => void
}

export const AboutYou: React.FC<AboutYouProps> = ({
  companyName,
  websiteUrl,
  currentRole,
  partnershipTeamStrength,
  onChange,
  onNext,
  onPrev
}) => {
  const [isTeamOpen, setIsTeamOpen] = useState(false)
  const [isSizeOpen, setIsSizeOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const teamRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teamRef.current && !teamRef.current.contains(event.target as Node)) {
        setIsTeamOpen(false)
      }
      if (sizeRef.current && !sizeRef.current.contains(event.target as Node)) {
        setIsSizeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const roles = [
    {
      value: 'Partnership Team',
      desc: 'Partnership manager, head of partnership'
    },
    { value: 'Sales Team', desc: 'VP of Sales, Channel Sales Manager' },
    { value: 'GTM Team', desc: 'GTM specialist manager' },
    { value: 'Other', desc: 'Head of Revenue, revops' }
  ]

  const sizes = [
    { value: 'Just me (0)', desc: 'I handle partnerships individually' },
    { value: 'Small team (1-4)', desc: 'A small, focused partnership team' },
    { value: 'Medium Team (5-20)', desc: 'Established partnership department' },
    {
      value: 'Large team (20+)',
      desc: 'Enterprise-scale partnership organization'
    }
  ]

  const isFormValid =
    companyName.trim() !== '' &&
    websiteUrl.trim() !== '' &&
    currentRole.trim() !== '' &&
    partnershipTeamStrength.trim() !== ''

  const handleNext = async () => {
    if (!isFormValid) return
    setIsChecking(true)
    try {
      const url = `https://${websiteUrl.trim()}`

      const pattern =
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9#]+\/?)*\/?$/i
      if (!pattern.test(url)) {
        showCustomToast('Error', 'Invalid URL', 'error', 5000)
        return
      }

      const res = await fetch(
        `/api/onboarding/website/check?website=${encodeURIComponent(url)}`
      )
      const json = await res.json()

      if (json.data === true) {
        onNext()
      } else {
        showCustomToast(
          'Error',
          json.message || 'Company is already registered!',
          'error',
          5000
        )
      }
    } catch (error) {
      showCustomToast('Error', 'Failed to check website', 'error', 5000)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className='relative mx-auto flex w-full max-w-[480px] flex-col items-start justify-start gap-4 pb-8 pt-24'>
      {/* Back Button */}
      {onPrev && (
        <div
          onClick={onPrev}
          className='mb-4 flex w-full cursor-pointer items-center text-sm font-medium text-[#6863FB] hover:underline'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='mr-2'
          >
            <path
              d='M10 12L6 8L10 4'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          Back
        </div>
      )}

      {/* Breadcrumb */}
      <div className='mb-2 flex w-full items-center gap-2 text-sm'>
        {/* Step 1: Completed */}
        <div className='flex items-center gap-2 font-medium text-[#10B981]'>
          <div className='flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981]'>
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
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          Step 1
        </div>
        <div className='h-[1px] w-6 bg-gray-200'></div>

        {/* Step 2: Active */}
        <div className='flex items-center gap-2 font-medium text-[#6863FB]'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              cx='8'
              cy='8'
              r='7'
              stroke='#6863FB'
              strokeWidth='1.5'
              strokeDasharray='3 3'
            />
          </svg>
          Step 2
        </div>
        <div className='h-[1px] w-6 bg-gray-200'></div>

        {/* Step 3: Inactive */}
        <div className='flex items-center gap-2 text-gray-500'>
          <div className='h-4 w-4 rounded-full border border-gray-300'></div>
          Step 3
        </div>
      </div>
      <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
        <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
          <div className='flex flex-col justify-center self-stretch font-inter text-2xl font-semibold text-[#101828]'>
            About you
          </div>
          <div className='flex flex-col justify-center font-inter text-2xl font-normal text-[#A7A6CC]'>
            Tell us about your company
          </div>
        </div>
        <div className='mt-2 flex flex-col justify-center self-stretch'>
          <span className='font-inter text-sm font-normal leading-[18.20px] text-[#6A7282]'>
            Helps us tailor partner recommendations and integrations from day
            one.
          </span>
        </div>

        <div className='mt-2 inline-flex items-start justify-start gap-2 self-stretch rounded-xl bg-[#DBEAFE] px-3 py-2 outline outline-1 outline-offset-[-1px] outline-[#BEDBFF]'>
          <div className='relative mt-0.5 h-4 w-4'>
            <div className='absolute left-[2.74px] top-[1.33px] h-[11.33px] w-[10.52px] outline outline-1 outline-offset-[-0.5px] outline-[#1447E6]' />
            <div className='absolute left-[5.67px] top-[14.34px] h-[0.32px] w-[4.67px] outline outline-1 outline-offset-[-0.5px] outline-[#1447E6]' />
          </div>
          <div className='flex-1 font-inter text-xs font-normal leading-[18px] text-[#1447E6]'>
            This helps us pre-load the right partner categories and integration
            defaults for your industry.
          </div>
        </div>
      </div>

      <div className='mt-2 flex w-full flex-col items-start justify-start gap-4 self-stretch'>
        {/* Company Name */}
        <div className='flex w-full flex-col items-start justify-start gap-1.5 self-stretch'>
          <div className='self-stretch font-inter text-sm font-medium leading-tight text-[#666666]'>
            Company name
          </div>
          <div className='inline-flex w-full items-center justify-start self-stretch overflow-hidden rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
            <input
              type='text'
              value={companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
              placeholder='Acme Corp'
              className='w-full flex-1 bg-transparent px-4 py-2.5 font-inter text-base font-normal leading-normal text-[#1A1A1A] outline-none'
            />
          </div>
        </div>

        {/* Company Website */}
        <div className='flex w-full flex-col items-start justify-start gap-1.5 self-stretch'>
          <div className='self-stretch font-inter text-sm font-medium leading-tight text-[#666666]'>
            Company website
          </div>
          <div className='inline-flex w-full items-center justify-start self-stretch overflow-hidden rounded-lg bg-white outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
            <div className='flex items-center justify-center gap-2.5 border-r border-[#CCCCCC] bg-gray-50/50 py-2.5 pl-4 pr-3'>
              <div className='font-inter text-base font-normal leading-normal text-[#333333]'>
                https://
              </div>
            </div>
            <input
              type='text'
              value={websiteUrl}
              onChange={(e) => {
                let val = e.target.value
                if (val.startsWith('https://')) val = val.substring(8)
                if (val.startsWith('http://')) val = val.substring(7)
                if (val.startsWith('www.')) val = val.substring(4)
                onChange('websiteUrl', val)
              }}
              placeholder='acmecorp.com'
              className='w-full flex-1 bg-transparent px-4 py-2.5 font-inter text-base font-normal leading-normal text-[#1A1A1A] outline-none'
            />
          </div>
        </div>

        {/* Your team dropdown */}
        <div
          className='relative flex w-full flex-col items-start justify-start gap-1.5 self-stretch'
          ref={teamRef}
        >
          <div className='self-stretch font-inter text-sm font-medium leading-tight text-[#666666]'>
            Your team
          </div>
          <div
            onClick={() => setIsTeamOpen(!isTeamOpen)}
            className={`inline-flex w-full cursor-pointer items-center justify-between self-stretch overflow-hidden rounded-lg px-4 py-2.5 outline outline-1 outline-offset-[-1px] transition-all ${isTeamOpen ? 'bg-white shadow-[0_0_0_2px_rgba(104,99,251,0.2)] outline-[#6B4FBB]' : 'bg-white outline-[#F3F4F6]'}`}
          >
            <div
              className={`flex-1 font-inter text-base font-normal leading-normal ${currentRole ? 'text-[#1A1A1A]' : 'text-[#99A1AF]'}`}
            >
              {currentRole || 'Select'}
            </div>
            <div
              className={`transition-transform duration-200 ${isTeamOpen ? 'rotate-180' : ''}`}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4 6L8 10L12 6'
                  stroke='#333333'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </div>

          {isTeamOpen && (
            <div className='absolute left-0 top-[72px] z-50 inline-flex w-full flex-col items-start justify-start gap-1 rounded-lg bg-white p-2 shadow-lg outline outline-1 outline-[#F3F4F6]'>
              {roles.map((role) => (
                <div
                  key={role.value}
                  onClick={() => {
                    onChange('currentRole', role.value)
                    setIsTeamOpen(false)
                  }}
                  className='group relative flex cursor-pointer flex-col items-start justify-start self-stretch rounded-md px-3 py-2 hover:bg-gray-50'
                >
                  <div className='inline-flex items-start justify-between self-stretch'>
                    <span
                      className={`font-inter text-base leading-normal ${currentRole === role.value ? 'font-medium text-[#6863FB]' : 'font-normal text-[#101828] group-hover:text-[#6863FB]'}`}
                    >
                      {role.value}
                    </span>
                    {currentRole === role.value && (
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='mt-1'
                      >
                        <path
                          d='M3.3335 8L6.66683 11.3333L13.3335 4.66667'
                          stroke='#6B4FBB'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    )}
                  </div>
                  <span className='mt-0.5 font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                    {role.desc}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team size dropdown */}
        <div
          className='relative flex w-full flex-col items-start justify-start gap-1.5 self-stretch'
          ref={sizeRef}
        >
          <div className='self-stretch font-inter text-sm font-medium leading-tight text-[#666666]'>
            Team size
          </div>
          <div
            onClick={() => setIsSizeOpen(!isSizeOpen)}
            className={`inline-flex w-full cursor-pointer items-center justify-between self-stretch overflow-hidden rounded-lg px-4 py-2.5 outline outline-1 outline-offset-[-1px] transition-all ${isSizeOpen ? 'bg-white shadow-[0_0_0_2px_rgba(104,99,251,0.2)] outline-[#6B4FBB]' : 'bg-white outline-[#F3F4F6]'}`}
          >
            <div
              className={`flex-1 font-inter text-base font-normal leading-normal ${partnershipTeamStrength ? 'text-[#1A1A1A]' : 'text-[#99A1AF]'}`}
            >
              {partnershipTeamStrength || 'Select'}
            </div>
            <div
              className={`transition-transform duration-200 ${isSizeOpen ? 'rotate-180' : ''}`}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4 6L8 10L12 6'
                  stroke='#333333'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </div>

          {isSizeOpen && (
            <div className='absolute left-0 top-[72px] z-50 inline-flex w-full flex-col items-start justify-start gap-1 rounded-lg bg-white p-2 shadow-lg outline outline-1 outline-[#F3F4F6]'>
              {sizes.map((size) => (
                <div
                  key={size.value}
                  onClick={() => {
                    onChange('partnershipTeamStrength', size.value)
                    setIsSizeOpen(false)
                  }}
                  className='group relative flex cursor-pointer flex-col items-start justify-start self-stretch rounded-md px-3 py-2 hover:bg-gray-50'
                >
                  <div className='inline-flex items-start justify-between self-stretch'>
                    <span
                      className={`font-inter text-base leading-normal ${partnershipTeamStrength === size.value ? 'font-medium text-[#6863FB]' : 'font-normal text-[#101828] group-hover:text-[#6863FB]'}`}
                    >
                      {size.value}
                    </span>
                    {partnershipTeamStrength === size.value && (
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='mt-1'
                      >
                        <path
                          d='M3.3335 8L6.66683 11.3333L13.3335 4.66667'
                          stroke='#6B4FBB'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    )}
                  </div>
                  <span className='mt-0.5 font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                    {size.desc}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleNext}
        disabled={!isFormValid || isChecking}
        className='mt-4 w-full rounded-lg bg-[#6863FB] py-3 font-medium text-white transition-colors hover:bg-[#5a55d6] disabled:cursor-not-allowed disabled:opacity-50'
      >
        {isChecking ? 'Checking...' : 'Continue'}
      </button>

      {/* Terms & Privacy */}
      <div className='mt-6 flex w-full items-center justify-center gap-4 text-xs text-[#6A7282]'>
        <span>Terms of service</span>
        <div className='h-1 w-1 rounded-full bg-[#99A1AF]'></div>
        <span>Privacy policy</span>
      </div>
    </div>
  )
}
