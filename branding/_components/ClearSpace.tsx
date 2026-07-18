import React from 'react'

import { FullLogo2 } from '@/components/icons/logo'

const ClearSpace = () => {
  return (
    <div className='flex flex-col gap-9 '>
      <h3 className='text-[48px] font-bold'>Clear Space</h3>
      <div className='flex w-full flex-col gap-6'>
        <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-white'>
          {/* <FullLogo2 className='w-[317px] h-[60px]' /> */}
          <div className='grid grid-cols-[50px_1fr_50px] grid-rows-3 p-4'>
            <div className='flex h-[50px] w-[50px] items-center justify-center self-end border border-[#D432B4] text-base text-[#D432B4]'>
              {' '}
              X{' '}
            </div>
            <div className='h-[50px] self-end border-t border-[#D432B4]'></div>
            <div className='flex h-[50px] w-[50px] items-center justify-center self-end border border-[#D432B4] text-base text-[#D432B4]'>
              X
            </div>

            <div className='flex h-auto items-center justify-center border-l border-[#D432B4] text-base text-[#D432B4]'></div>
            <FullLogo2 className='inline-block h-[60px] w-[317px] border border-[#D432B4] ' />
            <div className=' flex h-full items-center justify-center border-r border-[#D432B4] text-base text-[#D432B4]'></div>

            <div className='flex h-[50px] w-[50px] items-center justify-center border border-[#D432B4] text-base text-[#D432B4]'>
              X
            </div>
            <div className='h-[50px] border-b border-[#D432B4]'></div>
            <div className='flex h-[50px] w-[50px] items-center justify-center border border-[#D432B4] text-base text-[#D432B4]'>
              X
            </div>
          </div>
        </div>
        <p className='text-base font-normal text-[#4E4E4E]'>
          The clear space zone ensures the legibility and impact of the logo by
          isolating it from competing visual elements such ha text or supporting
          graphics
        </p>
      </div>
    </div>
  )
}

export default ClearSpace
