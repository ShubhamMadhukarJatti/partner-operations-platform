import { Bebas_Neue } from 'next/font/google'

import { cn } from '@/lib/utils'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], display: 'swap' })

const benefitCards = [
  {
    title: 'Earn 15-20% ACV',
    body: 'Set up a meeting with your client’s relevant team and earn the highest commission tier. One deal = meaningful income.'
  },
  {
    title: 'Earn 8-10% ACV',
    body: 'Share a lead with context. No meeting required. Pure intel earns you commission when they onboard.'
  },
  {
    title: 'Track Everything Live',
    body: "A dedicated dashboard shows every lead you've submitted, deal progress, and commission status in real time. No chasing."
  }
] as const

const stats = [
  { value: '$3,800', label: 'Avg. partner earns/deal' },
  { value: '2 days', label: 'Approval time' },
  { value: '3 countries', label: 'Active markets' }
] as const

export function PartnerProgramBenefitsAndMetrics() {
  return (
    <section className='bg-white py-10 sm:py-14'>
      <MaxWidthWrapper className='px-4 sm:px-6'>
        <ul className='mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5'>
          {benefitCards.map((card) => (
            <li
              key={card.title}
              className='group relative rounded-[10px] p-[1px] shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] transition-all duration-300 hover:z-10 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'
              style={{
                background:
                  'linear-gradient(180deg, rgb(133, 230, 196) 0%, rgb(109, 68, 229) 100%)'
              }}
            >
              <div className='h-full rounded-[9px] bg-white p-5 sm:p-6'>
                <h3
                  className='mb-3 text-[22px] font-bold leading-6'
                  style={{ color: '#517ce3' }}
                >
                  {card.title}
                </h3>
                <p className='text-base leading-6 text-[#6a7282]'>
                  {card.body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className='mx-auto mt-10 flex max-w-4xl flex-col flex-wrap items-stretch justify-center gap-4 rounded-xl bg-white px-4 py-6 shadow-[0_4px_18px_0_rgba(0,0,0,0.16)] transition-all duration-300 hover:z-10 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] sm:mt-14 sm:flex-row sm:px-5 sm:py-7'>
          {stats.map((s) => (
            <div
              key={s.label}
              className='flex min-w-0 flex-1 flex-col items-center gap-2 border-b border-dashed border-[#e2e4eb] pb-4 last:border-0 sm:border-b-0 sm:border-r sm:pb-0 sm:last:border-r-0'
            >
              <p
                className={cn(
                  bebas.className,
                  'text-4xl leading-9 sm:text-[40px] sm:leading-9',
                  'text-[#5b76ff]'
                )}
              >
                {s.value}
              </p>
              <p className='text-center text-lg font-medium text-[#44526b]'>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
