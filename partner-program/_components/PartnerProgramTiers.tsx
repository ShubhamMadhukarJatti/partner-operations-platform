import { Bebas_Neue } from 'next/font/google'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import { SectionEyebrow } from './SectionEyebrow'

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], display: 'swap' })

export function PartnerProgramTiers() {
  return (
    <section className='border-y border-[#e2e4eb] bg-[#f4f4ff] py-14 sm:py-20'>
      <MaxWidthWrapper className='px-4 sm:px-6'>
        <div className='mx-auto mb-10 flex flex-col items-center text-center sm:mb-12'>
          <div className='mb-4'>
            <SectionEyebrow>tiers</SectionEyebrow>
          </div>
          <h2 className='text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0e111b] sm:text-5xl sm:leading-[50px]'>
            Commission Tiers
          </h2>
          <p className='mt-3 max-w-xl text-center text-base leading-relaxed text-[#3e424d] sm:text-lg'>
            Choose the level that fits your engagement style
          </p>
        </div>

        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-7 lg:max-w-6xl lg:grid-cols-2 lg:gap-8'>
          <div
            className='group relative z-0 flex min-h-[520px] flex-col overflow-hidden rounded-[40px] p-8 shadow-[0_24px_48px_-12px_rgba(30,64,175,0.35)] transition-all duration-500 hover:z-10 hover:-translate-y-4 hover:scale-[1.03] hover:shadow-[0_40px_80px_-15px_rgba(30,64,175,0.6)] sm:min-h-[540px] sm:p-10'
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgb(120, 165, 255) 0%, rgb(70, 120, 245) 45%, rgb(55, 95, 220) 100%)'
            }}
          >
            <div className='absolute right-4 top-4 z-20 rounded-full bg-white px-3.5 py-2 shadow-sm sm:right-5 sm:top-5 sm:px-4'>
              <span className='text-[10px] font-bold uppercase tracking-[0.12em] text-[#3d5ae8] sm:text-[11px]'>
                Highest earned tier
              </span>
            </div>
            <p className='relative z-10 text-base font-medium text-white/90 sm:text-lg'>
              Tier 1
            </p>
            <h3 className='relative z-10 mt-2 text-3xl font-bold leading-tight tracking-tight text-white sm:mt-2.5 sm:text-4xl md:text-[2.5rem] md:leading-[1.12]'>
              Champion Partner
            </h3>
            <div className='relative z-10 mt-8 flex-1 space-y-6 text-white sm:mt-9'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/70'>
                  What you do
                </p>
                <p className='mt-2 text-base font-medium leading-snug sm:text-lg'>
                  Set up intro meeting + influence deal
                </p>
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/70'>
                  Commission
                </p>
                <div className='mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0'>
                  <span
                    className={cn(
                      bebas.className,
                      'text-[4.5rem] leading-[0.92] sm:text-8xl sm:leading-[0.9]'
                    )}
                  >
                    15-20
                  </span>
                  <span className='text-2xl font-medium text-white/95 sm:text-3xl'>
                    %
                  </span>
                  <span className='text-base font-medium text-white/90 sm:pb-0.5 sm:text-lg'>
                    first year ACV
                  </span>
                </div>
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/70'>
                  Best for
                </p>
                <p className='mt-2 text-base font-medium leading-snug sm:text-lg'>
                  GTM consultants, alliance leads
                </p>
              </div>
            </div>
            <div className='relative z-10 mt-9 sm:mt-10'>
              <Link
                href='/apply-to-partner-program?tier=CHAMPION'
                className='flex h-14 w-full items-center justify-center rounded-xl bg-white text-base font-semibold text-[#0e111b] shadow-sm transition hover:bg-zinc-50 sm:h-[3.25rem] sm:text-lg'
              >
                Apply as Champion
              </Link>
            </div>
          </div>

          <div
            className='group relative z-0 flex min-h-[520px] flex-col overflow-hidden rounded-[40px] p-8 shadow-[0_24px_48px_-12px_rgba(120,30,150,0.3)] transition-all duration-500 hover:z-10 hover:-translate-y-4 hover:scale-[1.03] hover:shadow-[0_40px_80px_-15px_rgba(120,30,150,0.55)] sm:min-h-[540px] sm:p-10'
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgb(210, 160, 255) 0%, rgb(180, 100, 235) 42%, rgb(130, 45, 200) 100%)'
            }}
          >
            <p className='relative z-10 text-base font-medium text-white/90 sm:text-lg'>
              Tier 2
            </p>
            <h3 className='relative z-10 mt-2 text-3xl font-bold leading-tight tracking-tight text-white sm:mt-2.5 sm:text-4xl md:text-[2.5rem] md:leading-[1.12]'>
              Referral Partner
            </h3>
            <div className='relative z-10 mt-8 flex-1 space-y-6 text-white sm:mt-9'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/70'>
                  What you do
                </p>
                <p className='mt-2 text-base font-medium leading-snug sm:text-lg'>
                  Share qualified lead + context (async)
                </p>
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/70'>
                  Commission
                </p>
                <div className='mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0'>
                  <span
                    className={cn(
                      bebas.className,
                      'text-[4.5rem] leading-[0.92] sm:text-8xl sm:leading-[0.9]'
                    )}
                  >
                    8-10
                  </span>
                  <span className='text-2xl font-medium text-white/95 sm:text-3xl'>
                    %
                  </span>
                  <span className='text-base font-medium text-white/90 sm:pb-0.5 sm:text-lg'>
                    first year ACV
                  </span>
                </div>
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/70'>
                  Best for
                </p>
                <p className='mt-2 text-base font-medium leading-snug sm:text-lg'>
                  Agencies, network referrers, async intros
                </p>
              </div>
            </div>
            <div className='relative z-10 mt-9 sm:mt-10'>
              <Link
                href='/apply-to-partner-program?tier=REFERRAL'
                className='flex h-14 w-full items-center justify-center rounded-xl bg-white text-base font-semibold text-[#0e111b] shadow-sm transition hover:bg-zinc-50 sm:h-[3.25rem] sm:text-lg'
              >
                Apply as Referral
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
