import Image from 'next/image'

import { cn } from '@/lib/utils'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import { pp } from './assets'
import { SectionEyebrow } from './SectionEyebrow'

const steps = [
  {
    title: 'Apply',
    body: 'Fill out a short application. Tell us who you are and who you work with. Approval within 2 business days.',
    media: 'step1' as const
  },
  {
    title: 'Submit a Lead',
    body: 'Found a company that needs Sharkdom? Submit via your dashboard company, contact and short pain point description.',
    media: 'step2' as const
  },
  {
    title: 'We Close the Deal',
    body: 'Our partnerships team qualifies the lead and assigns an AE. You track progress in real time. We do the selling.',
    media: 'step3' as const
  },
  {
    title: 'You Get Paid',
    body: "Deal converts to paid client. Commission confirmed in your dashboard. Payout processed per your tier's SLA.",
    media: 'step4' as const
  }
] as const

/**
 * Visual-only CTA in step graphics — same 3D / hover / active motion as
 * “Book a Demo” in NewHeader (not a navigation target).
 */
function FauxPrimaryCta({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      role='presentation'
      className={cn(
        'relative z-10 inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#3E5DA1] bg-[#5B76FF] px-3',
        'font-sansGeneral text-xs font-semibold leading-none text-white',
        'shadow-[0px_3px_0px_0px_#3E5DA1]',
        'pointer-events-auto select-none transition will-change-transform',
        'hover:translate-y-px hover:shadow-[0px_2px_0px_0px_#3E5DA1]',
        'active:translate-y-[2px] active:shadow-none',
        'sm:px-4 sm:text-sm',
        className
      )}
    >
      {children}
    </span>
  )
}

export function PartnerProgramHowItWorks() {
  return (
    <section className='-mt-2 bg-white pb-16 pt-6 sm:-mt-3 sm:pb-20 sm:pt-8 md:pb-24'>
      <MaxWidthWrapper className='px-4 sm:px-6'>
        <div className='mx-auto flex max-w-4xl flex-col items-center text-center'>
          <div className='mb-4 sm:mb-5'>
            <SectionEyebrow>steps</SectionEyebrow>
          </div>
          <h2 className='text-3xl font-bold leading-tight tracking-tight text-[#0e111b] sm:text-5xl sm:leading-[1.1] md:text-6xl'>
            How it works?
          </h2>
          <p className='mt-3 text-balance text-base text-[#3e424d] sm:mt-4 sm:text-lg md:text-xl'>
            Four simple steps to start earning
          </p>
        </div>

        <ul className='mx-auto mt-10 grid max-w-7xl list-none grid-cols-1 gap-5 sm:mt-12 sm:gap-6 md:mt-14 md:grid-cols-2 lg:mt-16 xl:grid-cols-4'>
          {steps.map((step) => (
            <li key={step.title} className='h-full'>
              <article
                className={cn(
                  'flex h-full min-h-0 flex-col overflow-hidden transition-all duration-300 hover:z-10 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.25)]',
                  'rounded-[22px] border border-[#e6e8ef] bg-white',
                  'shadow-[0_1px_0_rgba(15,23,42,0.04),0_6px_20px_-4px_rgba(15,23,42,0.08)]'
                )}
              >
                <div
                  className={cn(
                    'relative h-[200px] shrink-0 overflow-hidden sm:h-[250px] md:h-[280px]',
                    'border-b border-[#eef0f5]'
                  )}
                >
                  <StepArt variant={step.media} />
                </div>
                <div className='flex flex-1 flex-col px-5 pb-6 pt-8 sm:px-6 sm:pb-7 sm:pt-9 md:pt-10'>
                  <h3 className='text-center text-lg font-bold leading-snug text-[#0e111b] sm:text-xl md:text-2xl'>
                    {step.title}
                  </h3>
                  <p className='mt-3 text-center text-sm leading-relaxed text-[#3e424d] sm:mt-4 sm:text-base sm:leading-relaxed'>
                    {step.body}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </MaxWidthWrapper>
    </section>
  )
}

function StepArt({ variant }: { variant: (typeof steps)[number]['media'] }) {
  if (variant === 'step1') {
    return (
      <>
        <div className='absolute inset-0'>
          <Image
            src={pp.stepBg1}
            alt=''
            fill
            className='object-cover'
            sizes='(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw'
          />
        </div>
        <div className='absolute inset-0 flex items-center justify-center p-3 sm:p-4'>
          <div className='relative flex w-full max-w-[200px] flex-col items-center sm:max-w-[220px]'>
            <div
              className={cn(
                'w-full rounded-2xl border border-white/55 bg-white/25 p-3 sm:rounded-3xl sm:p-4',
                'shadow-[0_4px_24px_rgba(99,102,241,0.2)] backdrop-blur-md'
              )}
            >
              <FauxPrimaryCta className='h-8 min-h-0 w-full sm:h-9 md:h-10'>
                Apply
              </FauxPrimaryCta>
            </div>
            <Image
              src={pp.stepEllipseA}
              alt=''
              width={64}
              height={64}
              className='absolute -right-1 top-1/2 w-14 -translate-y-1/2 translate-x-1/2 opacity-90 sm:-right-2 sm:w-16'
            />
            <Image
              src={pp.stepEllipseB}
              alt=''
              width={30}
              height={30}
              className='absolute -bottom-1 right-1/4 w-6 translate-y-1/2 opacity-90 sm:bottom-0 sm:w-7'
            />
          </div>
        </div>
      </>
    )
  }
  if (variant === 'step2') {
    return (
      <>
        <div className='absolute inset-0'>
          <Image
            src={pp.stepBg1}
            alt=''
            fill
            className='object-cover'
            sizes='(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw'
          />
        </div>
        <div className='absolute inset-0 flex items-center justify-center p-3 sm:p-4'>
          <div className='relative flex w-full max-w-[220px] flex-col items-center sm:max-w-[250px]'>
            <div
              className={cn(
                'w-full rounded-2xl border border-white/55 bg-white/25 p-2.5 sm:rounded-3xl sm:p-3.5',
                'shadow-[0_4px_24px_rgba(99,102,241,0.2)] backdrop-blur-md'
              )}
            >
              <FauxPrimaryCta
                className={cn(
                  'min-h-8 w-full whitespace-nowrap px-2.5 py-2 text-[11px]',
                  'sm:min-h-9 sm:px-3 sm:py-2 sm:text-xs md:min-h-10 md:text-sm'
                )}
              >
                Submit a Lead
              </FauxPrimaryCta>
            </div>
            <div className='absolute -left-1 top-[18%] sm:top-1/4'>
              <Image
                src={pp.stepEllipseC}
                alt=''
                width={64}
                height={64}
                className='w-12 rotate-6 opacity-90 sm:w-14'
              />
            </div>
            <div className='absolute -bottom-0.5 left-[18%] sm:bottom-0 sm:left-1/4'>
              <Image
                src={pp.stepEllipseD}
                alt=''
                width={30}
                height={30}
                className='w-5 rotate-6 opacity-90 sm:w-6'
              />
            </div>
          </div>
        </div>
      </>
    )
  }
  if (variant === 'step3') {
    return (
      <>
        <div className='absolute inset-0'>
          <Image
            src={pp.stepBg2}
            alt=''
            fill
            className='object-cover'
            sizes='(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw'
          />
        </div>
        <div className='absolute left-1/2 top-1/2 w-[min(9rem,78%)] -translate-x-1/2 -translate-y-1/2 sm:w-[8.5rem]'>
          <div
            className={cn(
              'rounded-[1.15rem] border-[5px] border-white bg-white p-1.5',
              'shadow-[0_8px_28px_rgba(15,23,42,0.12),0_2px_8px_rgba(99,102,241,0.15)]',
              'sm:rounded-3xl sm:border-[6px] sm:p-2'
            )}
          >
            <div className='overflow-hidden rounded-[0.7rem] shadow-inner sm:rounded-xl'>
              <Image
                src={pp.stepCheckFrame}
                alt=''
                width={100}
                height={100}
                className='h-auto w-full'
              />
            </div>
          </div>
        </div>
      </>
    )
  }
  return (
    <div className='absolute inset-0'>
      <Image
        src={pp.stepBg3}
        alt=''
        fill
        className='object-cover'
        sizes='(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw'
      />
    </div>
  )
}
