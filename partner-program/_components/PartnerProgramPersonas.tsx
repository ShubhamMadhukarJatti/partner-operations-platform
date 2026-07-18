import Image from 'next/image'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

import { pp } from './assets'

const personas: { n: string; title: string; body: string; icon: string }[] = [
  {
    n: '01',
    title: 'GTM Consultants',
    body: 'You already advise on strategy. Now get paid when those deals close.',
    icon: pp.persona1
  },
  {
    n: '02',
    title: 'Fractional Partnership Leaders',
    body: 'Embed into teams and bring your network along.',
    icon: pp.persona2
  },
  {
    n: '03',
    title: 'Agency Owners',
    body: 'Refer clients who need partner ops. Earn while they scale.',
    icon: pp.persona3
  },
  {
    n: '04',
    title: 'RevOps Advisors',
    body: 'Your stack recommendations are worth more than you think.',
    icon: pp.persona4
  },
  {
    n: '05',
    title: 'Alliance Consultants',
    body: 'Turn relationship capital into recurring income.',
    icon: pp.persona5
  },
  {
    n: '06',
    title: 'SaaS Veterans',
    body: 'Know the market? Connect the dots and earn commissions.',
    icon: pp.persona6
  }
]

export function PartnerProgramPersonas() {
  return (
    <section className='bg-white py-14 sm:py-20'>
      <MaxWidthWrapper className='px-4 sm:px-6'>
        <div className='mx-auto mb-10 max-w-4xl text-center sm:mb-14'>
          <h2 className='text-3xl font-bold leading-tight tracking-tight text-[#0e111b] sm:text-5xl sm:leading-[57px]'>
            Built for
            <br />
            <span className='text-[#5b76ff]'>People Who Know GTM</span>
          </h2>
        </div>
        <ul className='mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5'>
          {personas.map((p) => (
            <li
              key={p.n}
              className='flex min-h-[220px] flex-col rounded-[18px] border border-[#e2e4eb] bg-white p-6 shadow-[4px_4px_4px_0_rgba(37,99,235,0.25)] transition-all duration-300 hover:z-10 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] sm:min-h-[256px] sm:p-7'
            >
              <span className='mb-4 text-[11px] font-normal uppercase tracking-[1.1px] text-[#757a87]'>
                {p.n}
              </span>
              <div className='mb-4 flex size-11 items-center justify-center rounded-xl bg-[#eaedff]'>
                <Image
                  src={p.icon}
                  alt=''
                  width={22}
                  height={22}
                  className='size-[22px]'
                />
              </div>
              <h3 className='mb-2 text-lg font-semibold leading-tight tracking-tight text-[#0e111b]'>
                {p.title}
              </h3>
              <p className='text-sm leading-relaxed tracking-tight text-[#3e424d]'>
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </MaxWidthWrapper>
    </section>
  )
}
