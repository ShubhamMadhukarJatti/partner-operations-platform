import React from 'react'
import Image from 'next/image'

const SecureAccountMapping = () => {
  return (
    <section className='mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-4 py-12 md:flex-row md:px-8'>
      {/* Left: Chart Illustration */}
      <div className='mb-8 flex w-full items-center justify-center md:mb-0 md:w-1/2'>
        <div className='relative flex h-[220px] w-[320px] items-center justify-center md:h-[280px] md:w-[400px]'>
          {/* Subtle grid background */}
          <div className='absolute inset-0'>
            <svg
              width='100%'
              height='100%'
              className='text-[#E5E7EB]'
              style={{ opacity: 0.5 }}
            >
              <defs>
                <pattern
                  id='grid'
                  width='40'
                  height='40'
                  patternUnits='userSpaceOnUse'
                >
                  <path
                    d='M 40 0 L 0 0 0 40'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1'
                  />
                </pattern>
              </defs>
              <rect width='100%' height='100%' fill='url(#grid)' />
            </svg>
          </div>
          {/* Pie chart illustration (replace with your own if needed) */}
          <Image
            src='/assets/partner-pie-chart.svg'
            alt='Partner Pie Chart'
            width={220}
            height={220}
            className='relative z-10 mx-auto'
          />
        </div>
      </div>
      {/* Right: Text Content */}
      <div className='flex w-full flex-col items-start md:w-1/2 md:pl-12'>
        <h2 className='mb-2 text-2xl font-bold md:text-3xl xl:text-4xl'>
          <span className='text-gradient'>Find Ideal Partners</span>
          <br />
          <span className='text-black'>Through Secure Account Mapping</span>
        </h2>
        <p className='mt-4 max-w-xl text-base text-[#6B7280] md:text-lg'>
          Identify IPPs (Ideal Partner Profiles) by securely sharing overlapping
          customer data—fully encrypted, consent-based, and 100% in your
          control.
        </p>
      </div>
    </section>
  )
}

export default SecureAccountMapping
