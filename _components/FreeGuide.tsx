import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function FreeGuide() {
  return (
    <section className='items-center bg-[#EEF0FD]'>
      <div className='m-auto grid max-w-5xl grid-cols-1 gap-4 p-6 lg:grid-cols-2 lg:gap-24 lg:p-0'>
        <div className='flex flex-col justify-center'>
          <span className='uppercase text-[#7C808D]'>Subscribe to updates</span>
          <h2 className='mb-2 text-5xl font-bold leading-[1.1] text-black'>
            Learn how as a founder you can use the power of partnerships?
          </h2>
          <p className='mb-5 text-[#38393E]'>
            Get partnerships materials, case studies and our ongoing AI solution
            from CXPO&apos;s in driving revenue for your startups with
            partnerships.
          </p>
          <Link
            href={'/e-book'}
            className='flex w-fit items-center gap-4 rounded-md bg-[#434DE1] px-4 py-2 text-base text-white'
          >
            Get Free Guide
            <ArrowRight />
          </Link>
        </div>
        <div className='w-100 relative aspect-[426/602] h-[500px]'>
          <Image
            src={'/assets/power-partnerships.png'}
            alt='power-partnerships'
            fill
          />
        </div>
      </div>
    </section>
  )
}

export default FreeGuide
