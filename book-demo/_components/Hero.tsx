import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

import { cn } from '@/lib/utils'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import { pp } from '../../partner-program/_components/assets'
import BookDemoForm from './BookDemoForm'
import ClientsCarousel from './ClientsCarousel'
import styles from './Hero.module.css'
import SliderTestimonials from './SliderTestimonials'

type TrustedCompany = {
  thumbnailUrl: string
  altText: string
}

const TRUSTED_COMPANIES: TrustedCompany[] = [
  {
    thumbnailUrl: '/icons/relokart-grey.svg',
    altText: 'relokart'
  },
  {
    thumbnailUrl: '/icons/whalesbook-grey.svg',
    altText: 'whalesbook'
  },
  {
    thumbnailUrl: '/icons/vipas-ai-grey.svg',
    altText: 'vipas-ai'
  },
  {
    thumbnailUrl: '/icons/chums-ai-grey.svg',
    altText: 'chums-ai'
  }
]

const Hero = () => {
  return (
    <section
      className='relative isolate w-full overflow-hidden bg-[#F3F3FF]'
      style={{
        marginTop: 'calc(-1 * var(--marketing-header-height, 140px))'
      }}
    >
      {/* background */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 z-0 overflow-hidden'
      >
        <div
          className='absolute inset-0'
          style={{
            background:
              'linear-gradient(180deg, rgba(104, 99, 251, 0.16) 0%, #F3F3FF 40%, #FFFFFF 100%)'
          }}
        />
        <div className='absolute inset-0 overflow-hidden [mask-image:linear-gradient(180deg,black_0%,transparent_60%)]'>
          <Image
            src={pp.pattern}
            alt=''
            fill
            className='object-cover object-top opacity-100'
            priority
            sizes='100vw'
          />
        </div>
      </div>

      <div
        className='relative z-10'
        style={{
          paddingTop:
            'max(5rem, calc(var(--marketing-header-height, 140px) + 2rem))'
        }}
      >
        <MaxWidthWrapper>
          <div className='grid grid-cols-1 items-start gap-16 lg:grid-cols-2'>
            {/* Left Content */}
            <div className='flex flex-col'>
              {/* Top Badge */}
              <div className='mb-6 flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm'>
                <span className='rounded bg-[#1A1A2E] px-2 py-0.5 text-[10px] font-bold text-white'>
                  NEW
                </span>
                <span className='text-sm font-medium text-gray-600'>
                  talk to us →
                </span>
              </div>

              <h1 className='text-4xl font-bold leading-[1.1] tracking-tight text-[#1A1A2E] lg:text-[64px]'>
                Book a 1:1 with us & Unlock <br />
                <span className='text-[#6366F1]'>Partner led Growth</span>{' '}
                <br />
                as your <span className='text-[#1A1A2E]'>Side Hustle</span>
              </h1>

              <p className='mt-8 max-w-xl text-xl leading-relaxed text-gray-600'>
                See why 420+ partnership teams switched from Crossbeam to
                Sharkdom. Unlock growth through strategic partner mapping.
              </p>

              {/* Action Buttons */}
              <div className='mt-10 flex flex-wrap gap-4'>
                <Link
                  href='/book-demo'
                  className={cn(
                    'inline-flex h-[50px] items-center justify-center gap-2 rounded-[10px] px-8 font-jakarta text-base font-bold transition-all duration-200',
                    'relative z-10 border border-[#1f2633] bg-[#2A3241] text-white',
                    'shadow-[0px_4px_0px_0px_#7688A8]',
                    'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0px_6px_0px_0px_#7688A8]',
                    'active:translate-y-[2px] active:shadow-none'
                  )}
                >
                  Book a 20-min demo{' '}
                  <ArrowRight className='h-5 w-5 shrink-0' strokeWidth={2.5} />
                </Link>
                <button
                  onClick={() =>
                    document
                      .getElementById('comparison-section')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className={cn(
                    'inline-flex h-[50px] items-center justify-center gap-2 rounded-[10px] px-8 font-jakarta text-base font-bold transition-all duration-200',
                    'relative z-10 border border-[#2A3241] bg-white text-[#2A3241]',
                    'shadow-[0px_4px_0px_0px_#6863FB]',
                    'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0px_6px_0px_0px_#6863FB]',
                    'active:translate-y-[2px] active:shadow-none'
                  )}
                >
                  See the full table
                </button>
              </div>

              {/* Stats Section */}
              <div className='mt-16 grid grid-cols-2 gap-8 border-t border-gray-200 pt-8 lg:grid-cols-4'>
                <div>
                  <div className='text-3xl font-bold text-[#1A1A2E]'>37%</div>
                  <p className='mt-1 text-xs text-gray-500'>
                    more sign-ups through strategic partnerships
                  </p>
                </div>
                <div>
                  <div className='text-3xl font-bold text-[#1A1A2E]'>5x</div>
                  <p className='mt-1 text-xs text-gray-500'>
                    faster business growth with the right connections
                  </p>
                </div>
                <div>
                  <div className='text-3xl font-bold text-[#1A1A2E]'>41%</div>
                  <p className='mt-1 text-xs text-gray-500'>
                    revenue boost from an optimized referral program
                  </p>
                </div>
                <div>
                  <div className='text-3xl font-bold text-[#1A1A2E]'>5x</div>
                  <p className='mt-1 text-xs text-gray-500'>
                    stronger, long-lasting partnerships
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className='relative'>
              <div
                id='demo-form'
                className='rounded-[32px] bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
              >
                <BookDemoForm />
              </div>

              {/* Footer Items below Form */}
              <div className='mt-12 flex items-center justify-between'>
                <div className='flex flex-col gap-3'>
                  <p className='text-sm font-medium text-gray-500'>
                    Write to us at
                  </p>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-[32px] w-[42px] items-center justify-center rounded-lg bg-yellow-400'>
                      <Mail className='h-5 w-5 text-black' />
                    </div>
                    <p className='text-lg font-bold text-[#1A1A2E]'>
                      sales@sharkdom.com
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-6'>
                  <Image
                    src='/assets/book-demo/01.png'
                    alt='Top 10 Award'
                    width={80}
                    height={80}
                    className='opacity-80'
                  />
                  <Image
                    src='/assets/book-demo/02.png'
                    alt='Summer 2024 Award'
                    width={80}
                    height={80}
                    className='opacity-80'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Powered By Section */}
          <div className='mt-4 text-center'>
            <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400'>
              POWERING PARTNERSHIPS AT
            </p>
            <div className='mt-10 flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale'>
              <span className='text-2xl font-bold text-gray-400'>Vertex</span>
              <span className='text-2xl font-bold text-gray-400'>
                NORTHWIND
              </span>
              <span className='text-2xl font-bold text-gray-400'>
                acme/cloud
              </span>
              <span className='text-2xl font-bold text-gray-400'>Helios</span>
              <span className='text-2xl font-bold text-gray-400'>PIONEER</span>
              <span className='text-2xl font-bold text-gray-400'>orbit.io</span>
            </div>
          </div>

          {/* Testimonials at bottom */}
          <div className='mt-4'>
            <SliderTestimonials />
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  )
}

export default Hero
