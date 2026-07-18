import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ChevronRight } from 'lucide-react'

type Props = {
  title: string
  desc: string
  ctaTitle: string
}

function Header() {
  return (
    <section className='relative bg-white py-12 text-center tracking-[0%] md:py-20'>
      <Image src={'/assets/grid-bg.svg'} alt='grid-bg' fill />
      {/* Heading Section */}
      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h1 className='!plus-jakarta-sans-700 text-[64px]  font-semibold text-gray-900'>
          Sharkdom for{' '}
          <span className='relative text-[#F84F2E]'>
            partner managers{' '}
            <img
              src='/assets/founder-line.png'
              alt=''
              className='absolute bottom-[-8px] right-0 w-full'
            />{' '}
          </span>
        </h1>
        <p className='mx-auto mt-8 max-w-[872px] text-[20px]/[30px] font-normal text-[#231E16]'>
          Best person to take care of partnerships is the person who have
          decision making power making founder/co-founder the best suited for
          this roles specially a strategic partnerships but cofounders have many
          things on their tables so for managing partnerships one might have to
          go overboard. To tackle this, Sharkdom has automated the partnership
          workflows making it easier and affordable for cofounders and other
          CXO’s roles to use Sharkdom for bulidng their channel partners and
          more.
        </p>

        {/* Buttons Section */}
        <div className='mt-8 flex flex-col items-center justify-center gap-4 md:flex-row'>
          <button className='relative flex items-center gap-2.5 rounded-[32px] border-4 border-b-[14px] border-[#221E15] bg-[#FFB804] px-[30px] py-[14px] text-[16px]/[24px] font-bold shadow-lg'>
            Why Cofounders prefer Sharkdom <ArrowDown size={24} />
            {/* <div className='absolute top-0 bottom-0 -left-2 -right-4 -z-10 translate-y-3 rounded-[30px] bg-[#221E15]'></div> */}
          </button>
          <Link
            href={'/book-demo'}
            className='bg-tranparent flex items-center gap-2 px-3 py-3 font-bold text-[#231E16]'
          >
            Talk to the team
            <ChevronRight stroke='#2160FD' />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Header
