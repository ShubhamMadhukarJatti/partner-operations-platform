'use client'

import React, { FC, useState } from 'react'

interface Step3Props {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onPrev?: () => void
}

// ─── Helper icons ──────────────────────────────────────────────
const CheckIcon = () => (
  <div
    style={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#5A9327',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <svg
      width='12'
      height='12'
      viewBox='0 0 24 24'
      fill='none'
      stroke='white'
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='20 6 9 17 4 12' />
    </svg>
  </div>
)

const CrossIcon = () => (
  <div
    style={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#B50001',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <svg
      width='12'
      height='12'
      viewBox='0 0 24 24'
      fill='none'
      stroke='white'
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='18' y1='6' x2='6' y2='18' />
      <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
  </div>
)

// ─── Comparison table data ──────────────────────────────────────
// true = check, false = cross
const TABLE_ROWS: { feature: string; vendor: boolean; partner: boolean }[] = [
  { feature: 'Partner Training', vendor: true, partner: false },
  { feature: 'My courses', vendor: false, partner: true },
  { feature: 'Partner mapping', vendor: true, partner: true },
  { feature: 'Partner access', vendor: true, partner: false },
  { feature: 'Create Program', vendor: true, partner: false },
  { feature: 'Program Analytics', vendor: true, partner: false },
  { feature: 'Pricing Tier', vendor: true, partner: false },
  { feature: 'Co-seller', vendor: true, partner: true },
  { feature: 'Reseller', vendor: true, partner: true }
]

export const Step3: FC<Step3Props> = ({ value, onChange, onNext, onPrev }) => {
  const [showCompare, setShowCompare] = useState(false)

  const options = [
    {
      id: 'vendor',
      label: 'Vendor',
      description: 'List your product and get discovered by partners worldwide',
      icon: (
        <img
          src='/onBoarding-v2.1/vendor.svg'
          alt='Vendor'
          className='h-6 w-6'
        />
      )
    },
    {
      id: 'partner',
      label: 'Partner',
      description: 'Grow together through referrals and co-selling with brands',
      icon: (
        <img
          src='/onBoarding-v2.1/partner.svg'
          alt='Partner'
          className='h-6 w-6'
        />
      )
    }
  ]

  return (
    <div className='relative mx-auto flex w-full max-w-[480px] flex-col items-center justify-start gap-4 pb-8 pt-24'>
      {/* Breadcrumb */}
      <div className='mb-2 flex w-full items-center gap-2 text-sm'>
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
          Step 1
        </div>
        <div className='h-[1px] w-6 bg-gray-200' />
        <div className='flex items-center gap-2 text-gray-500'>
          <div className='h-4 w-4 rounded-full border border-gray-300' />
          Step 2
        </div>
        <div className='h-[1px] w-6 bg-gray-200' />
        <div className='flex items-center gap-2 text-gray-500'>
          <div className='h-4 w-4 rounded-full border border-gray-300' />
          Step 3
        </div>
      </div>

      {/* Header */}
      <div className='mb-4 flex w-full flex-col gap-1'>
        <h1 className='text-[28px] font-semibold leading-tight text-[#101828]'>
          Your role
        </h1>
        <h2 className='text-[28px] font-normal leading-tight text-[#A7A6CC]'>
          How will you use Sharkdom?
        </h2>
        <p className='mt-2 text-base text-[#6A7282]'>
          Choose your role to personalise your experience.
          <br />
          <span className='font-semibold text-[#4B5563]'>
            You can only register as one.
          </span>
        </p>
      </div>

      {/* ── Selection Cards ── */}
      <div className='mb-6 flex w-full gap-4'>
        {options.map((option) => {
          const isSelected = value === option.id
          return (
            <div
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`relative flex-1 cursor-pointer rounded-2xl border p-5 transition-all ${
                isSelected
                  ? 'border-[#6863FB] bg-transparent'
                  : 'border-gray-200 bg-white/50 hover:border-gray-300'
              }`}
            >
              {/* Radio indicator */}
              <div className='absolute right-4 top-4'>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    isSelected ? 'border-[#6863FB]' : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <div className='h-2.5 w-2.5 rounded-full bg-[#6863FB]' />
                  )}
                </div>
              </div>

              <div className='mb-4 text-[#6863FB]'>{option.icon}</div>
              <h3 className='mb-1 text-base font-semibold text-gray-900'>
                {option.label}
              </h3>
              <p className='text-sm leading-snug text-gray-500'>
                {option.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* See how they compare toggle */}
      {!showCompare && (
        <div className='w-full text-center'>
          <button
            onClick={() => setShowCompare(true)}
            className='text-base font-medium text-[#6863FB] hover:underline'
          >
            See how they compare
          </button>
        </div>
      )}

      {/* ── Comparison Table ── */}
      {showCompare && (
        <div
          className='mb-8 w-full overflow-hidden rounded-2xl'
          style={{
            background: 'rgba(255,255,255,0.30)',
            outline: '1px rgba(197,208,228,0.25) solid',
            outlineOffset: '-1px'
          }}
        >
          {/* Table header */}
          <div className='flex items-center gap-4 border-b border-[#C5D0E4] px-4 py-3'>
            <div className='flex-1 text-[13px] font-medium text-[#4A5565]'>
              Features
            </div>
            <div className='w-16 text-center text-[13px] font-medium text-[#4A5565]'>
              Vendor
            </div>
            <div className='w-16 text-center text-[13px] font-medium text-[#4A5565]'>
              Partner
            </div>
          </div>

          {/* Table rows — each row has a bottom divider except the last */}
          {TABLE_ROWS.map((row, idx) => (
            <div
              key={row.feature}
              className={`flex items-center gap-4 px-4 py-3 ${
                idx < TABLE_ROWS.length - 1 ? 'border-b border-[#C5D0E4]' : ''
              }`}
            >
              <div className='flex-1 text-[13px] font-normal text-[#4A5565]'>
                {row.feature}
              </div>
              <div className='flex w-16 items-center justify-center'>
                {row.vendor ? <CheckIcon /> : <CrossIcon />}
              </div>
              <div className='flex w-16 items-center justify-center'>
                {row.partner ? <CheckIcon /> : <CrossIcon />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={onNext}
        disabled={!value}
        className='w-full rounded-lg bg-[#6863FB] py-3 font-medium text-white transition-colors hover:bg-[#5a55d6] disabled:cursor-not-allowed disabled:opacity-50'
      >
        Continue
      </button>

      {/* Terms & Privacy */}
      <div className='mt-6 flex w-full items-center justify-center gap-4 text-xs text-[#6A7282]'>
        <span>Terms of service</span>
        <div className='h-1 w-1 rounded-full bg-[#99A1AF]' />
        <span>Privacy policy</span>
      </div>
    </div>
  )
}
