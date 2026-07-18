import Image from 'next/image'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import { pp } from './assets'
import { SectionEyebrow } from './SectionEyebrow'

const items = [
  {
    quote:
      '"Referred two companies last quarter. Earned ₹3.2L in commissions without a single sales call."',
    role: 'GTM Consultant',
    loc: 'India'
  },
  {
    quote:
      '"Referred two companies last quarter. Earned ₹3.2L in commissions without a single sales call."',
    role: 'GTM Consultant',
    loc: 'India'
  },
  {
    quote:
      '"Referred two companies last quarter. Earned ₹3.2L in commissions without a single sales call."',
    role: 'GTM Consultant',
    loc: 'India'
  }
] as const

export function PartnerProgramTestimonials() {
  return (
    <section className='bg-white py-14 sm:py-20'>
      <MaxWidthWrapper className='px-4 sm:px-6'>
        <div className='mx-auto mb-4 flex flex-col items-center text-center'>
          <SectionEyebrow>TEstimonials</SectionEyebrow>
        </div>
        <h2 className='mb-10 text-center text-3xl font-bold tracking-tight text-[#0e111b] sm:mb-12 sm:text-5xl sm:leading-[50px]'>
          Partners Are Already Winning
        </h2>
        <ul className='mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-6'>
          {items.map((t, i) => (
            <li
              key={i}
              className='flex flex-col rounded-[18px] border border-[#e2e4eb] bg-white px-5 pb-5 pt-6 transition-all duration-300 hover:z-10 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] sm:px-6 sm:pt-7'
            >
              <div className='mb-2 flex items-start justify-between gap-2'>
                <span className='text-5xl font-semibold leading-none text-[#0e111b]'>
                  “
                </span>
                <Image
                  src={pp.stars}
                  alt=''
                  width={97}
                  height={15}
                  className='mt-0.5'
                />
              </div>
              <p className='mb-4 flex-1 text-sm leading-relaxed text-[#3e424d]'>
                {t.quote}
              </p>
              <div className='border-t border-[#e2e4eb] pt-4'>
                <p className='text-base font-semibold text-[#0e111b]'>
                  {t.role}
                </p>
                <p className='text-sm text-[#3e424d]'>{t.loc}</p>
              </div>
            </li>
          ))}
        </ul>
      </MaxWidthWrapper>
    </section>
  )
}
