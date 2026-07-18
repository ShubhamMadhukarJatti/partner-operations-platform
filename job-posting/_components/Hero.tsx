'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'

const BANNER_BG = '/assets/home/banner_bg.png'

const Hero = () => {
  return (
    <section className='relative min-h-[70vh] w-full overflow-hidden'>
      {/* background */}
      <div className='absolute inset-0 -z-10 h-full w-full'>
        <Image
          src={BANNER_BG}
          alt='Hero background'
          fill
          priority
          className='!h-auto object-cover object-center'
          quality={100}
        />
      </div>

      <div className='mx-auto max-w-6xl px-4 pb-16 pt-28'>
        <div className='grid grid-cols-1 items-center gap-14 lg:grid-cols-2'>
          {/* Left Content */}
          <div className='max-w-xl'>
            <h1 className='text-4xl font-semibold tracking-tight lg:pr-10 lg:text-[52px]/[60px]'>
              Post Your Partnership Hiring Requirement
            </h1>
            <p className='mt-4 max-w-[500px] text-lg leading-[28px] text-[#101828C9]'>
              Tell us what you’re hiring for , Sharkdom will match you with
              qualified partnership professionals from our ecosystem and share
              qualified candidates for your review.
            </p>

            {/* clients */}
            <div className='mt-6'>
              <div className='w-full items-start justify-between pt-6 md:flex'>
                {/* Left: Write to us */}
                <div className='flex flex-col gap-2'>
                  <p className='text-sm text-slate-500'>Write to us at</p>

                  <div className='flex items-center gap-3'>
                    <div className='flex h-[24px] w-[34px] items-center justify-center rounded-xl bg-yellow-400'>
                      <Mail className='h-4 w-4 text-black' />
                    </div>
                    <p className='text-lg font-semibold text-slate-900'>
                      jobs@sharkdom.com
                    </p>
                  </div>
                </div>

                {/* Right: Award images */}
                <div className='mt-6 flex items-center gap-4 md:mt-0'>
                  <Image
                    src='/assets/book-demo/01.png'
                    alt='Top 10 Partnership Solution 2025'
                    width={86}
                    height={82}
                    className='object-contain'
                  />
                  <Image
                    src='/assets/book-demo/02.png'
                    alt='Most Implementable Summer 2024'
                    width={78}
                    height={75}
                    className='object-contain'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='relative hidden lg:block'>
            <div
              className='pointer-events-none absolute right-[-70px] top-1/2 h-[520px] w-[720px] -translate-y-1/2 bg-contain bg-right bg-no-repeat'
              style={{
                backgroundImage: "url('/assets/partnership-jobs-hero3.svg')"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
