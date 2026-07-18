import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

const FooterCta = () => {
  return (
    <section className='relative mx-auto w-full max-w-6xl overflow-hidden rounded-[24px] bg-[#736FE3] px-4 py-12 text-white md:px-8'>
      {/* Blue grid pattern background */}
      <div className='pointer-events-none absolute inset-0 opacity-30'>
        <svg width='100%' height='100%'>
          <pattern
            id='cta-grid'
            width='80'
            height='80'
            patternUnits='userSpaceOnUse'
          >
            <path
              d='M 80 0 L 0 0 0 80'
              fill='none'
              stroke='#ffffff'
              strokeWidth='1'
            />
          </pattern>
          <rect width='100%' height='100%' fill='url(#cta-grid)' />
        </svg>
      </div>

      <div className='relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row'>
        {/* Left: Title */}
        <div className='w-full md:w-1/2'>
          <h2 className='text-[40px] font-bold leading-[50px] text-[#FFFFFF]'>
            Do More With Less — Use Partner Marketing
          </h2>
        </div>
        {/* Right: Subtitle, Description, Buttons */}
        <div className='flex w-full flex-col items-center text-center text-[30px] leading-[20px] text-[#FFFFFF] md:w-1/2 md:items-start md:pl-[44px] md:text-left'>
          <h3 className='mb-2 text-lg font-bold md:text-xl'>
            Tight budget? No problem.
          </h3>
          <p className='mb-6 max-w-sm text-[16px] text-sm leading-[24px] text-[#FFFFFF] opacity-90 md:text-base'>
            Partner-led marketing helps you grow without spending more — no
            cuts, just smarter moves.
          </p>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <Link href='/register' className='relative w-fit'>
              <Button
                className='hidden justify-center border border-[#757575] bg-[#FFFFFF] text-[#1E1E1E] hover:bg-[#FFFFFF] sm:flex'
                asChild
              >
                <Link href='/register'>Try for free</Link>
              </Button>
            </Link>
            <Link href='/book-demo'>
              <Button
                className='hidden justify-center border border-[#FFFFFF] bg-[#736FE3] text-[#FFFFFF] hover:bg-[#736FE3] sm:flex'
                asChild
              >
                <Link href='/book-demo'>Get a free demo</Link>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FooterCta
