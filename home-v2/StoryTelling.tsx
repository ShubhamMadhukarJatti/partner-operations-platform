'use client'

import React from 'react'

import { Input } from '@/components/ui/input'

const StoryTelling = () => {
  return (
    <div className='bg-white px-4 py-16 sm:px-6 lg:px-20'>
      <h2 className='mb-12 text-center text-[40px] font-semibold leading-[52px] tracking-[0px] md:text-[40px] xl:text-[40px]'>
        When Partnerships Don’t{' '}
        <span className='text-gradient font-semibold'>Click</span>
      </h2>
      <div className='m-6 pb-6 pt-6'>
        <div className='relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-3'>
          <div className='space-y-12 text-left'>
            <div className='relative h-[180px] w-[300px] gap-[40px] rounded-[12px] p-4'>
              <h3 className='text-lg font-semibold'>
                <span className='text-[#2563EB]'>No Confidence</span>
                <span className='text-[#2A3241]'> = No Buy-In</span>
              </h3>
              <p className='mt-2 text-sm' style={{ color: '#657795' }}>
                Without visibility into partner ROI, leadership pulls back. Your
                team burns out. And your best partners quietly disengage.
              </p>
            </div>
            <div className='relative h-[180px] w-[300px] gap-[40px] rounded-[12px] p-4'>
              <h3 className='text-lg font-semibold'>
                <span className='text-[#2A3241]'>Every </span>
                <span className='text-[#2563EB]'>Disconnected</span>
                <span className='text-[#2A3241]'> Task Costs You.</span>
              </h3>
              <p className='mt-2 text-sm' style={{ color: '#657795' }}>
                Missed revenue. Untracked deals. Disappointed partners. You’re
                losing momentum — and no one knows why.
              </p>
            </div>
          </div>
          <div className='relative flex flex-col items-center justify-center gap-6'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <img src='/assets/puzzle-bg.png' alt='Puzzle' />
            </div>
            <div className='relative mx-auto grid w-full max-w-xl grid-cols-2 grid-rows-2 gap-4'>
              <div className='col-start-2 row-start-1 flex justify-end'>
                <div className='z-10 flex h-[100px] w-[160px] flex-col items-center rounded-lg bg-white p-4 shadow'>
                  <img
                    src='/assets/revenue-chart.png'
                    className='mb-2 w-[80px]'
                  />
                  <span className='font-inter text-[12px] font-normal leading-[18px] tracking-[0] text-gray-700'>
                    Revenue growth
                  </span>
                </div>
              </div>
              <div className='col-start-1 row-start-2 mr-[20px] mt-[20px]'>
                <div className='space-y-4'>
                  <div className='flex items-start gap-2'>
                    <img
                      src='https://randomuser.me/api/portraits/men/32.jpg'
                      alt='partner'
                      className='mt-1 h-6 w-6 rounded-full'
                    />
                    <div className='z-10 w-[220px] rounded-lg bg-white p-3 shadow'>
                      <p className='font-inter text-[10px] font-normal leading-[15px] tracking-[0] text-[#2563EB]'>
                        You
                      </p>

                      <p className='font-inter text-[12px] font-normal leading-[18px] tracking-[0] text-gray-700'>
                        When can we see the final Draft?
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-end'>
                    <div className='flex items-start gap-2'>
                      <div className='z-10 w-[48px] rounded-lg bg-white p-3 shadow'>
                        <p className='font-inter text-[10px] font-normal leading-[15px] tracking-[0] text-[#2563EB]'>
                          You
                        </p>

                        <p className='font-inter text-[12px] font-normal leading-[18px] tracking-[0] text-gray-700'>
                          ...
                        </p>
                      </div>
                      <img
                        src='https://randomuser.me/api/portraits/men/33.jpg'
                        alt='partner'
                        className='mt-1 h-6 w-6 rounded-full'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-start-2 row-start-2 ml-[20px] mt-[20px]'>
                <div className='z-10 w-[160px] rounded-lg bg-white p-4 shadow'>
                  <p className='mb-2 text-center font-inter text-[12px] font-normal leading-[18px] tracking-[0] text-gray-700'>
                    Plan
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-start gap-2'>
                      <Input
                        type='checkbox'
                        className='form-checkbox mt-1 text-blue-600'
                        defaultChecked
                      />
                      <div className='flex w-full flex-col gap-1'>
                        <div className='h-1 w-full rounded bg-gray-300'></div>
                        <div className='h-1 w-[80%] rounded bg-gray-300'></div>
                      </div>
                    </li>
                    <li className='flex items-start gap-2'>
                      <Input
                        type='checkbox'
                        className='form-checkbox mt-1 text-blue-600'
                      />
                      <div className='flex w-full flex-col gap-1'>
                        <div className='h-1 w-[60%] rounded bg-gray-300'></div>
                        <div className='h-1 w-[30%] rounded bg-gray-300'></div>
                      </div>
                    </li>
                    <li className='flex items-start gap-2'>
                      <Input
                        type='checkbox'
                        className='form-checkbox mt-1 text-blue-600'
                      />
                      <div className='flex w-full flex-col gap-1'>
                        <div className='h-1 w-[80%] rounded bg-gray-300'></div>
                        <div className='h-1 w-[50%] rounded bg-gray-300'></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='ml-[30px] space-y-12 text-left'>
            <div className='relative h-[180px] w-[300px] gap-[40px] rounded-[12px] p-4'>
              <h3 className='text-lg font-semibold'>
                <span className='text-[#2A3241]'>You’re </span>
                <span className='text-[#2563EB]'>Drowning</span>
                <span className='text-[#2A3241]'> in Silos, Not Signals.</span>
              </h3>
              <p className='mt-2 text-sm' style={{ color: '#657795' }}>
                Make collaboration feel seamless. Bring the right people
                together across both companies — so conversations stay relevant,
                and execution stays fast.
              </p>
            </div>
            <div className='relative h-[180px] w-[300px] gap-[40px] rounded-[12px] p-4'>
              <h3 className='text-lg font-semibold'>
                <span className='text-[#2A3241]'>
                  Partnerships Matter. But They{' '}
                </span>
                <span className='text-[#2563EB]'>Feel Broken</span>
              </h3>
              <p className='mt-2 text-sm' style={{ color: '#657795' }}>
                3 out of 4 B2B deals happen through partners today. But most
                teams manage them with outdated spreadsheets, scattered emails
                and missed pings.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-16 flex justify-center'>
        <div className='font-briem border-gray flex flex-col items-center rounded-md border px-4 py-2 text-[16px] font-normal leading-[24px] tracking-[0] text-[#00AD3C]'>
          The Shift:
          <span className='text-[16px] leading-[24px] text-[#2563EB]'>↓</span>
        </div>
      </div>
    </div>
  )
}

export default StoryTelling
