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
              Hire for Partnerships From pool of 550+ partnership roles
            </h1>
            <p className='mt-4 max-w-[500px] text-lg leading-[28px] text-[#101828C9]'>
              Access from curated pool of Partnership, Alliances & GTM talent.
              Post roles. Get introductions. No exclusives
            </p>

            <div className='flex flex-wrap items-center gap-4 pt-10'>
              <Link href='/job-posting'>
                <Button
                  className='rounded-xl border
      border-[#5B56E8]
      bg-[linear-gradient(245.82deg,#6863FB_2.04%,#403BC3_82.72%)]
      px-8 py-4
      text-base font-medium text-white
      shadow-[0px_4px_0px_0px_#A4A1FD]
      transition hover:translate-y-[1px]
      hover:shadow-[0px_3px_0px_0px_#A4A1FD]
      focus:outline-none focus:ring-2 focus:ring-[#6863FB]/40
      active:translate-y-[3px] active:shadow-none'
                >
                  Post a Free Role{' '}
                  <ArrowRight className='ml-2 h-5 w-5 transition group-hover:translate-x-1' />
                </Button>
              </Link>

              <Link href='/job-preview'>
                <Button
                  className='flex items-center gap-2
      rounded-xl
      border border-[#EDECEF] bg-white
      px-8 py-4 text-base font-medium text-[#5B56E8]
      shadow-[0px_4px_0px_0px_#6863FB]
      transition hover:translate-y-[1px]
      hover:bg-white
      hover:shadow-[0px_3px_0px_0px_#6863FB]
      active:translate-y-[3px] active:shadow-none'
                >
                  Notify for Jobs{' '}
                  <ArrowRight className='ml-2 h-5 w-5 transition group-hover:translate-x-1' />
                </Button>
              </Link>
            </div>

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
                backgroundImage: "url('/assets/partnership-jobs-hero2.svg')"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
