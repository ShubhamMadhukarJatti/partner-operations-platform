import React from 'react'
import Image from 'next/image'

const EscrowMatrix = () => {
  return (
    <section className='relative mx-auto w-full max-w-6xl overflow-x-hidden px-2 py-12 md:px-0'>
      {/* Subtle grid background */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        <svg
          width='100%'
          height='100%'
          className='h-full w-full'
          style={{ minHeight: 400 }}
        >
          <defs>
            <pattern
              id='escrow-grid'
              width='60'
              height='60'
              patternUnits='userSpaceOnUse'
            >
              <path
                d='M 60 0 L 0 0 0 60'
                fill='none'
                stroke='#E5E7EB'
                strokeWidth='1'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#escrow-grid)' />
        </svg>
      </div>
      {/* Main content */}
      <div className='relative z-10 flex flex-col items-center'>
        {/* Top row: Secure Data Uploads and Center Box */}
        <div className='mb-8 flex w-full flex-col items-center justify-between md:flex-row'>
          {/* Left Upload */}
          <div className='mb-4 flex flex-1 justify-center md:mb-0 md:justify-end'>
            <div className='flex items-center gap-2 rounded-lg bg-[#FFB707] px-5 py-2 font-semibold text-white shadow-md'>
              <span className='inline-block'>
                <svg width='20' height='20' fill='none' viewBox='0 0 20 20'>
                  <rect
                    width='20'
                    height='20'
                    rx='4'
                    fill='#fff'
                    fillOpacity='.15'
                  />
                  <path
                    d='M10 4v8m0 0l-3-3m3 3l3-3M4 16h12'
                    stroke='#fff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
              Secure Data Upload A
            </div>
          </div>
          {/* Center Box */}
          <div className='relative flex flex-1 justify-center'>
            <div className='flex min-w-[260px] max-w-[320px] flex-col items-center rounded-xl bg-[#2563EB] px-8 py-6 text-white shadow-lg'>
              <span className='mb-2'>
                <svg width='32' height='32' fill='none' viewBox='0 0 32 32'>
                  <rect
                    width='32'
                    height='32'
                    rx='8'
                    fill='#fff'
                    fillOpacity='.10'
                  />
                  <path
                    d='M16 22a2 2 0 002-2v-2a2 2 0 00-4 0v2a2 2 0 002 2z'
                    stroke='#fff'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M12 14v-2a4 4 0 118 0v2'
                    stroke='#fff'
                    strokeWidth='1.5'
                  />
                </svg>
              </span>
              <span className='text-lg font-bold tracking-wide'>SHARKDOM</span>
              <span className='mt-1 text-xs opacity-80'>
                encrypted escrow environment
              </span>
            </div>
          </div>
          {/* Right Upload */}
          <div className='mt-4 flex flex-1 justify-center md:mt-0 md:justify-start'>
            <div className='flex items-center gap-2 rounded-lg bg-[#00AD3C] px-5 py-2 font-semibold text-white shadow-md'>
              <span className='inline-block'>
                <svg width='20' height='20' fill='none' viewBox='0 0 20 20'>
                  <rect
                    width='20'
                    height='20'
                    rx='4'
                    fill='#fff'
                    fillOpacity='.15'
                  />
                  <path
                    d='M10 4v8m0 0l-3-3m3 3l3-3M4 16h12'
                    stroke='#fff'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </span>
              Secure Data Upload B
            </div>
          </div>
        </div>
        {/* SVG lines connecting boxes (desktop only) */}

        {/* Bottom row: Three boxes */}
        <div className='mt-12 flex w-full flex-col items-stretch justify-between gap-4 md:flex-row'>
          {/* Prospects */}
          <div className='flex-1 rounded-xl border border-[#E5E7EB] bg-white shadow-md'>
            <div className='rounded-t-xl bg-[#2563EB] px-4 py-2 font-semibold text-white'>
              Prospects
            </div>
            <div className='p-4 text-xs text-[#151552]'>
              SAAS CRM
              <div className='mt-2 h-2 w-24 rounded bg-[#F3F3F3]' />
              <div className='mt-1 h-2 w-16 rounded bg-[#F3F3F3]' />
            </div>
          </div>
          {/* Matrix view */}
          <div className='mx-0 flex-1 rounded-xl border border-[#E5E7EB] bg-white shadow-md md:mx-4'>
            <div className='rounded-t-xl bg-[#2563EB] px-4 py-2 font-semibold text-white'>
              Matrix view
            </div>
            <div className='p-4 text-xs text-[#151552]'>
              <div className='mb-2 flex font-semibold'>
                <div className='w-1/3'> </div>
                <div className='w-1/3 text-center'>SAAS CRM</div>
                <div className='w-1/3 text-center'>
                  Marketing automation platform
                </div>
              </div>
              <div className='mb-1 flex'>
                <div className='w-1/3'>Open</div>
                <div className='w-1/3 text-center'>150</div>
                <div className='w-1/3 text-center'>50</div>
              </div>
              <div className='flex'>
                <div className='w-1/3'>Customers</div>
                <div className='w-1/3 text-center'>30</div>
                <div className='w-1/3 text-center'>-</div>
              </div>
            </div>
          </div>
          {/* Open opportunities */}
          <div className='flex-1 rounded-xl border border-[#E5E7EB] bg-white shadow-md'>
            <div className='rounded-t-xl bg-[#2563EB] px-4 py-2 font-semibold text-white'>
              Open opportunities
            </div>
            <div className='p-4 text-xs text-[#151552]'>
              Marketing automation
              <div className='mt-2 h-2 w-24 rounded bg-[#F3F3F3]' />
              <div className='mt-1 h-2 w-16 rounded bg-[#F3F3F3]' />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EscrowMatrix
