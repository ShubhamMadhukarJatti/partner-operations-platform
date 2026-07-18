'use client'

import React, { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Pause } from 'lucide-react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

type Props = {}

const LandingCta = (props: Props) => {
  return (
    <MaxWidthWrapper className='mb-10 mt-[100px]  w-full max-w-7xl px-1 xl:max-w-screen-2xl'>
      <div className='rounded-xl bg-[#FDF7E7] py-[64px] lg:rounded-[100px]'>
        <div className='relative mx-auto h-[177px] w-[100%] lg:h-[463px] lg:w-[895px]'>
          <Image src={'/assets/marketing-illustration.png'} alt='' fill />
        </div>

        <div className='mt-8 flex flex-col gap-4'>
          <h2 className='text-center text-2xl font-bold lg:text-4xl'>
            Use partnerships Marketing and DO MORE WITH LESS
          </h2>
          <p className='text-center text-sm font-normal text-[#242424] lg:text-base/[18px]'>
            Don’t have Big Budget for Marketing Worry Not! No need to cut cost
            any further?
          </p>
        </div>

        <div className='mt-10 flex flex-col justify-center gap-6 px-3 lg:flex-row'>
          <Link
            href='/register'
            className='flex h-[55px]  items-center justify-center rounded-[48px] bg-[#2748B7] px-9 py-3.5 text-center text-sm font-bold text-white'
          >
            Try for free
          </Link>
          <Link
            href='/book-demo'
            className='flex h-[55px] items-center justify-center rounded-[48px] border border-[#151552] bg-white px-9 py-3.5 text-center text-sm font-bold text-[#151552]'
          >
            Get a free demo
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default LandingCta
