'use client'

import { useState } from 'react'
import { ChevronDown, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import DataPipelineStepper from '../_components/DataPipelineStepper'

// ─── Salesforce SVG Logo ──────────────────────────────────────────────────────

function SalesforceLogo() {
  return (
    <img
      src='/salesforcelogo.png'
      alt='Salesforce Logo'
      className='h-10 w-auto'
    />
  )
}

// ─── Integration detail cell ──────────────────────────────────────────────────

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-lg bg-[#F3F6FA] px-4 py-3'>
      <p className='text-[11px] font-normal leading-4 text-[#6B7280]'>
        {label}
      </p>
      <p className='mt-0.5 text-sm font-semibold leading-5 text-[#21232C]'>
        {value}
      </p>
    </div>
  )
}

// ─── Separators ───────────────────────────────────────────────────────────────

const SEPARATORS = ['Comma', 'Semicolon', 'Tab', 'Pipe']

const FEATURES = [
  'Bi-directional contact & company sync',
  'Track deal stages across partner pipeline',
  'Auto-assign inbound leads to partners',
  'Full activity timeline sync'
]

const DETAILS = [
  { label: 'Auth type', value: 'OAuth 2.0' },
  { label: 'Sync frequency', value: 'Real-time' },
  { label: 'Setup time', value: '5 min' },
  { label: 'Available on', value: 'Enterprise' }
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConnectCRMPage() {
  const [separator, setSeparator] = useState('Comma')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <GradientPageBackground className='flex h-[calc(100vh-60px)] flex-col'>
      {/* Stepper */}
      <div className='px-6 pt-5'>
        <DataPipelineStepper current={1} />
      </div>

      {/* Scrollable body */}
      <div className='flex flex-1 flex-col items-center gap-7 overflow-y-auto px-6 py-8'>
        {/* Title block */}
        <div className='flex flex-col items-center gap-2 text-center'>
          <div className='flex items-center gap-2'>
            <SalesforceLogo />
            <h1 className='text-2xl font-semibold leading-[34px] text-[#25224A]'>
              Connect Salesforce
            </h1>
          </div>
          <p className='max-w-[520px] text-sm font-normal leading-5 text-[#4D5C78]'>
            Sync customer data and manage your full sales pipeline
            collaboratively with partners.
          </p>
        </div>

        {/* Info card */}
        <div className='w-full max-w-[720px] rounded-xl border border-dashed border-[#6863FB] px-[100px] py-12'>
          <div className='flex flex-col items-center justify-center'>
            {/* What you can do */}
            <h2 className='text-center text-sm font-semibold leading-5 text-[#21232C]'>
              What you can do
            </h2>
            <ul className='mt-3 flex flex-col gap-2'>
              {FEATURES.map((feat) => (
                <li key={feat} className='flex items-center gap-2.5'>
                  <span
                    className='h-2 w-2 shrink-0 rounded-full'
                    style={{ background: '#6863FB' }}
                  />
                  <span className='text-sm font-normal leading-5 text-[#374151]'>
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Integration details */}
          <h2 className='mt-6 text-sm leading-5 text-[#21232C]'>
            Integration details
          </h2>
          <div className='mt-5 grid grid-cols-2 gap-3'>
            {DETAILS.map((d) => (
              <DetailCell key={d.label} label={d.label} value={d.value} />
            ))}
          </div>
        </div>
        <div className='flex w-full max-w-[720px] justify-between'>
          {/* Download template */}
          <div className='flex'>
            <button className='flex items-center gap-1.5 text-sm font-medium leading-5 text-[#6863FB] transition-colors hover:text-[#5651D9]'>
              <Download className='h-4 w-4' />
              Download template
            </button>
          </div>

          {/* Choose Separator */}
          <div className='flex'>
            <div className='relative'>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className='flex items-center gap-2 rounded-md border border-[#E4E7EE] bg-white px-3.5 py-2 text-sm font-medium leading-5 text-[#556B91] shadow-[0px_1px_2px_rgba(42,54,71,0.05)] transition-colors hover:bg-gray-50'
              >
                {separator === 'Comma' ? 'Choose Separator' : separator}
                <ChevronDown className='h-4 w-4 text-[#7688A8]' />
              </button>

              {dropdownOpen && (
                <div className='absolute left-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-md border border-[#E4E7EE] bg-white shadow-md'>
                  {SEPARATORS.map((sep) => (
                    <button
                      key={sep}
                      onClick={() => {
                        setSeparator(sep)
                        setDropdownOpen(false)
                      }}
                      className={`w-full px-3.5 py-2 text-left text-sm font-medium leading-5 transition-colors hover:bg-[#F3F6FA] ${
                        separator === sep
                          ? 'bg-[#F5F0FF] text-[#6863FB]'
                          : 'text-[#21232C]'
                      }`}
                    >
                      {sep}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className='flex items-center justify-between border-t border-[#CDD9F2] bg-white px-6 py-4'>
        <Button
          variant='outline'
          className='h-8 px-4 text-sm font-semibold text-[#21232C]'
        >
          Back
        </Button>
        <Button className='h-8 bg-[#6863FB] px-6 text-sm font-semibold text-white hover:bg-[#5651D9]'>
          Next
        </Button>
      </div>
    </GradientPageBackground>
  )
}
