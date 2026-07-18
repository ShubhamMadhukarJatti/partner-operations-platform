import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function PartnerArrChart() {
  const bars = [13, 19, 24, 35, 48, 63, 74, 88, 101, 110]
  return (
    <div className='compare-page-card-pop cursor-default rounded-[18px] border border-[#c3c9ff] bg-white p-6 shadow-[0px_12px_32px_-8px_rgba(14,17,27,0.14)] hover:border-[#6863fb]/45 hover:shadow-[0px_12px_36px_-10px_rgba(96,84,236,0.35),0px_8px_24px_-12px_rgba(14,17,27,0.12)]'>
      <p className='font-mono text-[10px] uppercase tracking-[1px] text-[#757a87]'>
        Partner-sourced ARR
      </p>
      <div className='mt-4 flex items-end justify-between gap-1'>
        {bars.map((h, i) => (
          <div key={i} className='flex flex-1 flex-col items-center gap-2'>
            <div
              className='w-full max-w-[28px] rounded-t bg-gradient-to-b from-[#6054ec] to-[#3c2ea4]'
              style={{ height: `${h}px` }}
            />
          </div>
        ))}
      </div>
      <div className='mt-2 flex justify-between font-mono text-[9px] text-[#757a87]'>
        <span>Q1</span>
        <span>Q2</span>
        <span>Q3</span>
        <span>Q4</span>
        <span>Q1</span>
        <span>Q2</span>
        <span>Q3</span>
        <span>Q4</span>
        <span>Q1</span>
        <span>Q2</span>
      </div>
      <div className='mt-6 flex items-baseline justify-between border-t border-[#e2e4eb] pt-4'>
        <div>
          <p className='text-xs text-[#757a87]'>Annual recurring revenue</p>
          <p className='font-mono text-2xl font-semibold text-[#0e111b]'>
            $6.2M
          </p>
        </div>
        <span className='text-sm font-semibold text-[#009b53]'>↑ 15×</span>
      </div>
    </div>
  )
}

export default function ZohoTeamStory() {
  return (
    <section className='bg-white pb-0 pt-16 md:pt-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='compare-page-card-pop cursor-default overflow-hidden rounded-[28px] border border-[#c3c9ff] bg-gradient-to-br from-[#dfe4ff] to-[#ececff] p-8 shadow-[0px_12px_32px_-12px_rgba(104,99,251,0.2)] hover:border-[#6863fb]/40 hover:shadow-[0px_18px_48px_-12px_rgba(96,84,236,0.3),0px_12px_28px_-8px_rgba(14,17,27,0.1)] md:p-12 lg:p-14'>
          <div className='grid gap-12 lg:grid-cols-2 lg:items-center'>
            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-[#d3d7e2] bg-white px-3 py-1.5 pr-4'>
                <span
                  className='size-1.5 rounded-full bg-[#6054ec]'
                  aria-hidden
                />
                <span className='font-mono text-[11px] font-medium uppercase tracking-[1.1px] text-[#3e424d]'>
                  TEAM story
                </span>
              </div>

              <h2 className='mt-6 text-3xl font-bold tracking-tight text-[#0e111b] md:text-[38px] md:leading-[1.15]'>
                Learn how a <span className='text-[#6863fb]'>Partnership/</span>
                <br />
                <span className='text-[#6863fb]'>GTM teams</span>
                <span> can use modern day partner approach.</span>
              </h2>

              <p className='mt-6 max-w-xl text-[15.5px] leading-relaxed text-[#3e424d]'>
                See How Yogesh kapoor scaled her B2B SaaS from $400K to $6.2M
                ARR using nothing but partner-led growth and the exact Sharkdom
                playbook he ran.
              </p>

              <Link
                href='/blog'
                className='group mt-8 inline-flex h-[50px] items-center justify-center gap-2 rounded-[10px] border-b-[6px] border-[#7688a8] bg-[#2a3241] px-8 text-base font-bold text-white shadow-sm transition-all duration-300 ease-out hover:bg-[#3d475a] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863fb] focus-visible:ring-offset-2 active:scale-[0.98]'
              >
                Read the playbook
                <ArrowRight
                  className='size-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1'
                  aria-hidden
                />
              </Link>
            </div>

            <PartnerArrChart />
          </div>
        </div>
      </div>
    </section>
  )
}
