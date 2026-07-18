import React from 'react'
import Image from 'next/image'

import { FullLogo2, FullLogoWhite } from '@/components/icons/logo'

const Partnership = () => {
  return (
    <div className='flex flex-col gap-9 '>
      <h3 className='text-[48px] font-bold'>Partnerships</h3>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div className='flex w-full flex-col gap-6'>
          <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-white'>
            <div className='relative flex w-full items-center justify-center gap-8'>
              <FullLogo2 className='h-[38px] w-[188px]' />
              <Image
                src='/icons/vimeo.svg'
                alt=''
                width={139}
                height={38}
                className='-mt-5 object-contain'
              />
              <Image
                src='/icons/strike-through.svg'
                alt=''
                width={428}
                height={0}
                className='absolute'
              />
            </div>
          </div>
          <p className='text-base font-normal text-[#4E4E4E]'>
            When pairing our logo with a partner logo, both logos should feel
            equal in size. The scale of the logos should be optically balanced.{' '}
          </p>
        </div>
        <div className='flex w-full flex-col gap-6'>
          <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-white'>
            <div className='relative flex w-full items-center justify-center gap-8'>
              <FullLogo2 className='h-[38px] w-[188px]' />
              <Image
                src='/icons/vimeo.svg'
                alt=''
                width={139}
                height={38}
                className='-mt-5 object-contain'
              />
              {/* <Image src='/icons/strike-through.svg' alt="" width={428} height={0} className='absolute' /> */}
            </div>
          </div>
          <p className='text-base font-normal text-[#4E4E4E]'>
            The Sharkdom logo should always be on the left side and the
            partner/sponsor logo always on the right. The two logos should
            always be horizontally centered. The Sharkdom logo and the partner
            logo should be in the same color. If possible, partner logos should
            use Sharkdom color palette.
          </p>
        </div>

        <div className='flex w-full flex-col gap-6'>
          <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-[#1EB0E5]'>
            <div className='relative flex w-full items-center justify-center gap-8'>
              <FullLogoWhite className='h-[38px] w-[188px]' />
              <Image
                src='/icons/vimeo-white.svg'
                alt=''
                width={139}
                height={38}
                className='-mt-5 object-contain'
              />
              {/* <Image src='/icons/strike-through.svg' alt="" width={428} height={0} className='absolute' /> */}
            </div>
          </div>
          <p className='text-base font-normal text-[#4E4E4E]'>
            If the partner logo has to remain in its original color, the
            Sharkdom lockup can be white and placed on a background that uses
            the color of the partner.
          </p>
        </div>
        <div className='flex w-full flex-col gap-6'>
          <div className='flex h-[443px] items-center justify-center rounded-xl border border-[#C8CFDC] bg-[#159D33]'>
            <div className='relative flex w-full items-center justify-center gap-8'>
              <FullLogoWhite className='h-[38px] w-[188px]' />
              <Image
                src='/icons/vimeo-white.svg'
                alt=''
                width={139}
                height={38}
                className='-mt-5 object-contain'
              />
              {/* <Image src='/icons/strike-through.svg' alt="" width={428} height={0} className='absolute' /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Partnership
