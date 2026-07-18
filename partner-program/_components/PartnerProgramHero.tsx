import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import { pp } from './assets'

export function PartnerProgramHero() {
  return (
    <section className='relative isolate w-full overflow-x-clip'>
      {/*
        Figma: full-bleed jumbotron (grid + tint) from the top of the viewport, behind
        the whole fixed stack (promo + gap + white pill). The bg layer is absolutely
        positioned with a negative top so it extends into the header spacer; copy uses
        matching padding. NewHeader’s measure() sets --marketing-header-height in sync
        with the placeholder height.
      */}
      <div
        aria-hidden
        className='pointer-events-none absolute bottom-0 left-0 right-0 z-0 overflow-hidden rounded-b-xl'
        style={{
          // Pull up to y=0 so the pattern is visible under the bar and in the space above the pill
          top: 'calc(-1 * var(--marketing-header-height, 140px))'
        }}
      >
        <div
          className='absolute inset-0'
          style={{
            background:
              'linear-gradient(180deg, rgba(104, 99, 251, 0.16) 0%, rgba(104, 99, 251, 0) 100%)'
          }}
        />
        <div className='absolute inset-0 overflow-hidden rounded-b-xl'>
          <Image
            src={pp.pattern}
            alt=''
            fill
            className='object-cover object-top opacity-90'
            priority
            sizes='100vw'
          />
        </div>
      </div>

      <div
        className='relative z-10'
        style={{
          // Tighter to nav (Figma); min keeps copy clear of the fixed bar
          paddingTop:
            'max(0.5rem, calc(var(--marketing-header-height, 140px) - 1.75rem))'
        }}
      >
        <MaxWidthWrapper className='px-4 pb-16 pt-0 sm:px-6 sm:pb-24'>
          <div className='mx-auto flex max-w-5xl flex-col items-center text-center'>
            <div
              className='mb-6 inline-flex h-10 items-center justify-center rounded-full border border-[#d3d7e2] bg-white px-4 shadow-sm sm:mb-8 sm:h-11 sm:px-5'
              style={{
                boxShadow:
                  '0 1px 2px 0 rgba(14, 17, 27, 0.04), 0 2px 6px 0 rgba(14, 17, 27, 0.04)'
              }}
            >
              <span className='text-center text-[11px] font-medium tracking-[-0.08px] text-[#3e424d] sm:text-xs sm:tracking-tight md:text-sm'>
                PARTNER PROGRAM
              </span>
            </div>

            <h1 className='mb-5 text-balance text-4xl font-bold leading-[1.1] text-[#2a3241] sm:mb-6 sm:text-6xl sm:leading-[1.05] md:text-7xl md:leading-[1.02]'>
              Turn Your GTM Expertise Into{' '}
              <span className='text-[#5b76ff]'>Recurring Income</span>
            </h1>
            <p className='mb-10 max-w-4xl text-pretty text-xl font-medium leading-relaxed tracking-tight text-[#4a5565] sm:mb-12 sm:max-w-5xl sm:text-2xl sm:leading-[1.45]'>
              Refer companies to Sharkdom. Earn 8-20% commission on every deal
              you influence.
            </p>

            <div className='mb-12 flex w-full max-w-3xl flex-col items-stretch justify-center gap-4 sm:mb-14 sm:flex-row sm:items-center sm:gap-5'>
              <Link
                href='/apply-to-partner-program?tier=CHAMPION'
                className={cn(
                  'relative z-10 inline-flex h-14 w-full min-w-0 items-center justify-center gap-2.5 rounded-lg border border-[#3E5DA1] bg-[#5B76FF] px-10',
                  'font-sansGeneral text-lg font-bold leading-none text-white',
                  'shadow-[0px_3px_0px_0px_#3E5DA1]',
                  'transition-all duration-300 hover:z-20 hover:-translate-y-2 hover:scale-105 hover:shadow-[0_10px_20px_rgba(91,118,255,0.4),0px_6px_0px_0px_#3E5DA1]',
                  'active:translate-y-[2px] active:shadow-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/40 focus-visible:ring-offset-2',
                  'sm:h-16 sm:min-w-[min(100%,20rem)] sm:px-12'
                )}
              >
                Apply as Champion Partner
                <ArrowRight className='size-7 shrink-0' aria-hidden />
              </Link>
              <Link
                href='/apply-to-partner-program?tier=REFERRAL'
                className={cn(
                  'relative z-10 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-lg border border-[#5B76FF] bg-white px-10',
                  'font-sansGeneral text-lg font-semibold leading-none text-[#5B76FF]',
                  'shadow-[0px_3px_0px_0px_#5B76FF]',
                  'transition-all duration-300 hover:z-20 hover:-translate-y-2 hover:scale-105 hover:bg-[#F8F9FF] hover:shadow-[0_10px_20px_rgba(91,118,255,0.2),0px_6px_0px_0px_#5B76FF]',
                  'active:translate-y-[2px] active:shadow-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B76FF] focus-visible:ring-offset-2',
                  'sm:h-16 sm:min-w-[min(100%,19rem)] sm:px-12'
                )}
              >
                Apply as Referral Partner
                <ArrowRight className='size-7 shrink-0' aria-hidden />
              </Link>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-6 sm:gap-9'>
              <div className='flex max-w-[220px] items-center gap-2.5'>
                <Image
                  src={pp.trust1}
                  alt=''
                  width={16}
                  height={16}
                  className='shrink-0'
                />
                <span className='text-left text-sm leading-snug text-[#495363]'>
                  G2 Top 10
                </span>
              </div>
              <p className='text-center text-sm text-[#495363] sm:whitespace-nowrap'>
                270+ partner programs
              </p>
              <div className='flex max-w-[240px] items-center gap-2.5'>
                <Image
                  src={pp.trust2}
                  alt=''
                  width={16}
                  height={16}
                  className='shrink-0'
                />
                <span className='text-left text-sm leading-snug text-[#495363]'>
                  Trusted in US, India, UK
                </span>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  )
}
