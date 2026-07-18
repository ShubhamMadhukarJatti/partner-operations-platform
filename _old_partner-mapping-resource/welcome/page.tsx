'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const activities = [
  {
    id: 1,
    text: 'the Partner has sent you a partnership proposal',
    link: 'Checkout'
  },
  {
    id: 2,
    text: 'the Partner has sent you a partnership proposal',
    link: 'Checkout'
  },
  {
    id: 3,
    text: 'the Partner has sent you a partnership proposal',
    link: 'Checkout'
  },
  {
    id: 4,
    text: 'the Partner has sent you a partnership proposal',
    link: 'Checkout'
  }
]

export default function Welcome() {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-[#f8fbff] px-8 py-6 font-sans'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-1 text-[22px] font-semibold text-[#222]'>
          Welcome, Sappy
        </h1>
        <p className='mb-7 text-[13px] text-[#8b98b8]'>
          Ready to grow your partner network?
        </p>
        {/* Top Row: Two Main Cards */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Promote partner program card */}
          <div className='lg:col-span-2'>
            <div
              className='flex h-full items-center justify-between overflow-hidden rounded-2xl border border-[#eaf1ff] bg-white p-0 shadow-sm'
              style={{
                background: 'linear-gradient(90deg, #fff 60%, #f8fbff 100%)'
              }}
            >
              {/* Left Illustration */}
              <div className='flex items-center p-20'>
                <Image
                  src='/images/partner-program\partner-program-get-started-banner.svg'
                  alt='Promote partner program'
                  width={190}
                  height={250}
                />
              </div>
              {/* Right Content */}
              <div className='flex flex-1 flex-col items-start justify-center p-8 pl-0'>
                <div className='mb-2 flex items-center gap-2'>
                  {/* <svg
                    width='22'
                    height='22'
                    viewBox='0 0 32 32'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g clipPath='url(#clip0_3137_88370)'>
                      <path
                        d='M23.8888 14.1112C26.8888 11.1112 27.0763 7.54244 26.9825 5.95119C26.9669 5.70867 26.8635 5.48012 26.6917 5.30827C26.5198 5.13643 26.2913 5.03304 26.0487 5.01744C24.4575 4.92369 20.8913 5.10869 17.8888 8.11119L10 15.9999L16 21.9999L23.8888 14.1112Z'
                        fill='#3e50f7'
                        stroke='#3e50f7'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M17.0003 9H9.29407C9.02921 9.00012 8.77521 9.10532 8.58782 9.2925L4.29407 13.5863C4.16298 13.7176 4.07103 13.8829 4.02853 14.0636C3.98602 14.2442 3.99464 14.4332 4.05341 14.6092C4.11218 14.7853 4.21878 14.9415 4.36129 15.0604C4.5038 15.1793 4.67659 15.2562 4.86032 15.2825L10.0003 16'
                        fill='white'
                      />
                      <path
                        d='M17.0003 9H9.29407C9.02921 9.00012 8.77521 9.10532 8.58782 9.2925L4.29407 13.5863C4.16298 13.7176 4.07103 13.8829 4.02853 14.0636C3.98602 14.2442 3.99464 14.4332 4.05341 14.6092C4.11218 14.7853 4.21878 14.9415 4.36129 15.0604C4.5038 15.1793 4.67659 15.2562 4.86032 15.2825L10.0003 16'
                        stroke='#3e50f7'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M23 15V22.7063C22.9999 22.9711 22.8947 23.2251 22.7075 23.4125L18.4137 27.7063C18.2824 27.8373 18.1171 27.9293 17.9364 27.9718C17.7558 28.0143 17.5668 28.0057 17.3908 27.9469C17.2147 27.8881 17.0585 27.7815 16.9396 27.639C16.8207 27.4965 16.7438 27.3237 16.7175 27.14L16 22'
                        fill='white'
                      />
                      <path
                        d='M23 15V22.7063C22.9999 22.9711 22.8947 23.2251 22.7075 23.4125L18.4137 27.7063C18.2824 27.8373 18.1171 27.9293 17.9364 27.9718C17.7558 28.0143 17.5668 28.0057 17.3908 27.9469C17.2147 27.8881 17.0585 27.7815 16.9396 27.639C16.8207 27.4965 16.7438 27.3237 16.7175 27.14L16 22'
                        stroke='#3e50f7'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M11.82 23.4772C11.3362 24.5384 9.70625 26.9997 5 26.9997C5 22.2934 7.46125 20.6634 8.5225 20.1797'
                        stroke='#3e50f7'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_3137_88370'>
                        <rect width='32' height='32' fill='white' />
                      </clipPath>
                    </defs>
                  </svg> */}
                  <span className='text-xl font-semibold leading-7 text-blue-600'>
                    Promote partner program
                  </span>
                </div>
                <div className='mb-4 text-sm text-[#8b98b8]'>
                  Attract & Manage new partners to your program
                </div>
                <button
                  className='rounded-lg border border-[#3e50f7] bg-white px-5 py-2 text-sm font-medium text-[#3e50f7] shadow-sm transition hover:bg-[#eaf1ff]'
                  onClick={() =>
                    router.push('/partner-mapping-resource/partner-program')
                  }
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
          {/* Send Proposal Card */}
          <div>
            <div className='flex h-full flex-col justify-between rounded-2xl border border-[#eaf1ff] bg-white p-6'>
              <div className='bg-gradient-to-l from-[#E4F8FF99] to-[#fff]'>
                <Image
                  src='/images/partner-program\partner-program-get-proposal-banner.svg'
                  alt='Send Proposal'
                  width={500}
                  height={250}
                />
              </div>
              <div className='bg-white text-left'>
                <h2 className='mb-1 text-lg font-semibold text-[#3e50f7]'>
                  Send Proposal
                </h2>
                <p className='mb-3 text-xs text-[#8b98b8]'>
                  Pitch structured partnerships to prospects in minutes.
                </p>
                <button className='rounded-lg border border-[#3e50f7] bg-white px-5 py-2 text-sm font-medium text-[#3e50f7] shadow-sm transition hover:bg-[#eaf1ff]'>
                  Start Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Row: Stats and Activity */}
        <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Stats Cards */}
          <div className='flex gap-4 lg:col-span-2'>
            <div className='flex flex-1 flex-col items-center rounded-xl border border-gray-100 bg-white p-6'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50'>
                <svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
                  <path
                    d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                    fill='#3B82F6'
                  />
                </svg>
              </div>
              <div className='mb-2 text-sm font-medium text-gray-500'>
                Active Partners
              </div>
              <span className='text-3xl font-bold text-blue-600'>6</span>
            </div>
            <div className='flex flex-1 flex-col items-center space-y-6'>
              {/* Proposals Sent Card */}
              <div className='flex w-full max-w-sm items-center rounded-2xl border border-gray-200 bg-white p-8 transition-colors duration-200 hover:border-blue-200'>
                <div className='mr-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50'>
                  <svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
                    <path
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      stroke='#3B82F6'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='flex flex-col'>
                  <div className='mb-1 text-sm font-medium text-gray-600'>
                    Proposals Sent
                  </div>
                  <span className='text-4xl font-bold text-blue-600'>4</span>
                </div>
              </div>

              {/* Partner Form Submissions Card */}
              <div className='flex w-full max-w-sm items-center rounded-2xl border border-gray-200 bg-white p-8 transition-colors duration-200 hover:border-blue-200'>
                <div className='mr-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50'>
                  <svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
                    <path
                      d='M9 12h6m-3-3v6m5 2H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z'
                      stroke='#3B82F6'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='flex flex-col'>
                  <div className='mb-1 text-sm font-medium text-gray-600'>
                    Partner Form Submissions
                  </div>
                  <span className='text-4xl font-bold text-blue-600'>56</span>
                </div>
              </div>
            </div>
          </div>
          {/* Activity Feed */}
          <div>
            <div className='h-full rounded-2xl border border-[#eaf1ff] bg-white p-6'>
              <h3 className='mb-4 text-[16px] font-semibold text-[#222]'>
                Activity
              </h3>
              <ul className='space-y-4'>
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <li
                      key={i}
                      className='flex items-start gap-2 text-[15px] text-[#3e50f7]'
                    >
                      <span className='mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf1ff]'>
                        <svg
                          width='16'
                          height='16'
                          fill='none'
                          viewBox='0 0 16 16'
                        >
                          <rect width='16' height='16' rx='4' fill='#eaf1ff' />
                          <rect
                            x='4'
                            y='4'
                            width='8'
                            height='8'
                            rx='2'
                            fill='#3e50f7'
                          />
                        </svg>
                      </span>
                      <div>
                        <span className='font-bold text-[#2A3241]'>
                          the Partner
                        </span>
                        <span className='ml-1 font-normal text-[#8b98b8]'>
                          has sent you a partnership proposal
                        </span>
                        <div>
                          <a
                            href='#'
                            className='text-xs font-semibold text-[#3e50f7] hover:underline'
                          >
                            Checkout
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
