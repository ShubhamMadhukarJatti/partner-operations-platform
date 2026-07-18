'use client'

import Image from 'next/image'
import { CheckCircle, XCircle } from 'lucide-react'

import { initialState } from '../../Util/onboardingReducer'

interface RightProfileSidebarProps {
  currentStep: number
  state: typeof initialState
}

// ── feature comparison table data ──────────────────────────────────────────
const comparisonRows = [
  { feature: 'Partner Training', vendor: true, partner: false },
  { feature: 'My Courses', vendor: false, partner: true },
  { feature: 'Partner Mapping', vendor: true, partner: true },
  { feature: 'Partner Access', vendor: true, partner: false },
  { feature: 'Create Program', vendor: true, partner: false },
  { feature: 'Program Analytics', vendor: true, partner: false },
  { feature: 'Pricing Tier', vendor: true, partner: false },
  { feature: 'Co-seller', vendor: true, partner: true },
  { feature: 'Reseller', vendor: true, partner: true }
]

// ── main component ──────────────────────────────────────────────────────────
export const RightProfileSidebar = ({
  currentStep,
  state: _state
}: RightProfileSidebarProps) => {
  return (
    <aside className='hidden w-[340px] shrink-0 border-l bg-[#F9F9FE] lg:flex'>
      <div className='flex w-full flex-col px-6'>
        {/* Illustration */}
        <Image
          src='/onBoarding-v2.1/Onboarding-sidebar.png'
          alt='Onboarding Sidebar'
          width={340}
          height={340}
          className=' h-[260px] w-full rounded-xl object-contain'
        />

        <ComparisonTable visibleRows={currentStep} />
      </div>
    </aside>
  )
}

// ── comparison table ────────────────────────────────────────────────────────
const ComparisonTable = ({ visibleRows }: { visibleRows: number }) => (
  <div className='flex flex-col'>
    <h3 className='mb-4 text-base font-semibold text-[#1C1C28]'>
      How they compare
    </h3>
    <div className='overflow-hidden rounded-xl'>
      {/* Header */}
      <div className='grid grid-cols-[1fr_70px_70px] border-b border-[#E5E7EB] px-4 py-2'>
        <span className='text-[12px] font-semibold uppercase tracking-wider text-[#4B5563]'>
          Features
        </span>
        <span className='text-center text-[12px] font-semibold  tracking-wider text-[#4B5563]'>
          Vendors
        </span>
        <span className='text-center text-[12px] font-semibold  tracking-wider text-[#4B5563]'>
          Partners
        </span>
      </div>

      {/* Rows — reveal one per step */}
      {comparisonRows.map((row, i) => (
        <div
          key={row.feature}
          className={`grid grid-cols-[1fr_70px_70px] items-center px-4 py-2.5 transition-all duration-500 ${
            i < visibleRows ? 'opacity-100' : 'opacity-0'
          } ${i !== comparisonRows.length - 1 ? 'border-b border-[#E4E7EE]' : ''}`}
        >
          <span className='text-xs text-[#374151]'>{row.feature}</span>
          <div className='flex justify-center'>
            {row.vendor ? (
              <CheckCircle className='h-4 w-4 text-[#22C55E]' />
            ) : (
              <XCircle className='h-4 w-4 text-[#EF4444]' />
            )}
          </div>
          <div className='flex justify-center'>
            {row.partner ? (
              <CheckCircle className='h-4 w-4 text-[#22C55E]' />
            ) : (
              <XCircle className='h-4 w-4 text-[#EF4444]' />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)
