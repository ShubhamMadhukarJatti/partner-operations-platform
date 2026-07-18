import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'iconsax-react'

const FounderBanner = () => {
  return (
    <div className='overflow-hidden bg-[#FDF7E9]'>
      <div
        className='relative h-[600px] w-full pl-6 pt-10'
        style={{
          backgroundImage: "url('/assets/founder-banner.png')",
          objectFit: 'contain',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className=' flex w-fit flex-col'>
          <div className='relative flex w-fit items-center gap-2.5 rounded-[32px] border-4 border-b-[14px] border-[#111950] bg-[#FFB804] px-[30px] py-[14px] text-[30px]/[150%] font-bold shadow-lg'>
            Learn how founder can use the power of partnerships!
            {/* <div className='absolute top-0 bottom-0 -left-2 -right-4 -z-10 translate-y-3 rounded-[30px] bg-[#221E15]'></div> */}
          </div>
          <div className='max-w-[790px] self-center border-[10px] border-[#111950] bg-[#FFB804] p-6 pb-10 text-[24px]'>
            Get partnerships materials, case studies and our ongoing AI solution
            from CXPO’s in driving revenue and scaling
          </div>
        </div>
        <Image
          className='absolute right-0 top-[52px]'
          src='/assets/founder-illustration.png'
          alt=''
          width={500}
          height={800}
        />
      </div>
      <Link
        href={'/e-book'}
        className='ml-48 flex w-fit -translate-y-7 items-center  gap-2 rounded-full bg-[#2748B7] px-4 py-2 text-lg font-bold text-white'
      >
        Get FREE Guide <ArrowRight />
      </Link>
    </div>
  )
}

export default FounderBanner
