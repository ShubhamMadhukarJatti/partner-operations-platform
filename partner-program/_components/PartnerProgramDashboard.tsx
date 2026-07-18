import Image from 'next/image'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import { pp } from './assets'
import { SectionEyebrow } from './SectionEyebrow'

const features = [
  {
    title: 'Deal Submission Portal',
    body: 'Submit leads without calling anyone'
  },
  {
    title: 'Dedicated Partner Slack Channel',
    body: 'Direct line to the partnerships team'
  },
  {
    title: 'Live Commission Notifications',
    body: 'Know the moment a deal closes'
  },
  {
    title: 'Live Pipeline Tracker',
    body: 'See where every deal stands, always'
  },
  {
    title: 'Co-Marketing Materials',
    body: 'Ready-to-use decks and one-pagers'
  },
  {
    title: 'Partner Onboarding in < 2 Days',
    body: 'Fast approval, instant access'
  }
] as const

export function PartnerProgramDashboard() {
  return (
    <section className='bg-[#fafafa] py-14 sm:py-20'>
      <MaxWidthWrapper className='px-4 sm:px-6'>
        <div className='mx-auto mb-4 flex flex-col items-center text-center'>
          <SectionEyebrow>partner dashboard</SectionEyebrow>
        </div>
        <h2 className='mb-3 text-center text-3xl font-bold tracking-tight text-[#0e111b] sm:mb-4 sm:text-5xl sm:leading-[50px]'>
          Your Partner Dashboard
        </h2>
        <p className='mb-10 text-center text-base text-[#3e424d] sm:mb-14'>
          Everything in One Place
        </p>
        <ul className='mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5'>
          {features.map((f) => (
            <li
              key={f.title}
              className='flex flex-col gap-2 rounded-[18px] border border-[#e2e4eb] bg-white p-4 shadow-[4px_4px_4px_0px_rgba(37,99,235,0.25)] transition-all duration-300 hover:z-10 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.35)] sm:p-5'
            >
              <div className='flex items-center gap-2.5'>
                <Image
                  src={pp.checkIcon}
                  alt=''
                  width={20}
                  height={20}
                  className='shrink-0'
                />
                <h3 className='text-lg font-semibold leading-tight tracking-tight text-[#0e111b]'>
                  {f.title}
                </h3>
              </div>
              <p className='pl-7 text-sm leading-relaxed text-[#3e424d]'>
                {f.body}
              </p>
            </li>
          ))}
        </ul>
      </MaxWidthWrapper>
    </section>
  )
}
