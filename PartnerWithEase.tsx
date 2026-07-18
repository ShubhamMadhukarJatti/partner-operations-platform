import React from 'react'
import Link from 'next/link'

const PartnerWithEase: React.FC = () => {
  return (
    <section className='w-full px-4 py-12 sm:py-16 md:py-20'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col justify-between gap-12 lg:flex-row lg:items-center'>
          {/* Left content */}
          <div className='max-w-2xl space-y-6'>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl'>
              Unlock New Style of Digital Partnerships
            </h2>
            <p className='text-base text-gray-600 sm:text-lg md:text-xl'>
              Transform your business by effortlessly onboarding and managing
              partnerships that drive results. Watch your revenue grow as you
              scale with confidence and precision.
            </p>
            <div className='pt-4'>
              <Link
                href='/free-trial'
                className='inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:px-6 sm:py-3 sm:text-base'
                aria-label='Start my free 14-day trial'
              >
                Start my free 14-day trial
                <svg
                  className='ml-2 h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right vector graphic */}
          <div className='relative flex w-full items-center justify-center lg:w-[391px] lg:justify-end'>
            <div className='relative w-full max-w-[320px] -rotate-6 transform sm:max-w-md'>
              <div className='absolute inset-0 -rotate-3 transform rounded-3xl border-2 border-blue-500'></div>
              <div className='relative rounded-3xl border-2 border-blue-500 bg-white p-6 sm:p-8'>
                <p className='py-6 text-xl font-semibold text-blue-500 sm:py-8 sm:text-2xl md:text-3xl'>
                  Partner with <span className='text-blue-600'>ease</span>,
                  <br />
                  Grow with <span className='text-blue-600'>Speed.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PartnerWithEase
