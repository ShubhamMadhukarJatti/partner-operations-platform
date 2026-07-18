import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'iconsax-react'

type Props = {}

const FreeGuideNew = (props: Props) => {
  return (
    <section className='items-center bg-[#EEF0FD] py-16'>
      <div className='m-auto grid max-w-6xl grid-cols-1 gap-4 p-6 lg:grid-cols-3 lg:gap-12 lg:p-0'>
        <div className='col-span-2 flex flex-col justify-center'>
          <span className='font-semibold uppercase text-text-80'>
            Subscribe to updates
          </span>
          <h2 className='mb-2 text-4xl font-bold leading-[1.1] text-black'>
            Learn how as a founder you can use the power of partnerships?
          </h2>
          <p className='mb-5 max-w-xl text-shark-base  text-text-80'>
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

        <Image
          src={'/assets/power-partnerships.png'}
          alt='power-partnerships'
          height={500}
          width={500}
        />
      </div>
    </section>
  )
}

export default FreeGuideNew
