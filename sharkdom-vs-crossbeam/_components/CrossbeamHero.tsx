import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export default function CrossbeamHero() {
  return (
    <section className='relative overflow-hidden bg-transparent pb-16 pt-10 md:pb-24 md:pt-14'>
      <div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8'>
        <div className='mb-6 inline-flex items-center rounded-full border border-[#d3d7e2] bg-white px-4 py-2 text-xs font-medium tracking-tight text-[#3e424d] shadow-sm'>
          Head-to-head comparison
        </div>

        <h1 className='max-w-5xl text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight tracking-tight text-[#2a3241]'>
          <span className='block'>Comparing</span>
          <span className='block'>
            Sharkdom{' '}
            <span className='text-[clamp(2.25rem,5.5vw,3.75rem)]'>
              vs Crossbeam?
            </span>
          </span>
        </h1>

        <p className='mx-auto mt-4 max-w-3xl bg-gradient-to-r from-[#5d90ff] to-[#6863fb] bg-clip-text text-2xl font-bold italic leading-snug text-transparent md:text-[2.5rem] md:leading-tight'>
          You are losing out big time.
        </p>

        <p className='mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#3e424d] md:text-[19px] md:leading-[28.5px]'>
          See why 420+ partnership teams switched from Crossbeam to Sharkdom —
          faster onboarding, deeper attribution, and zero spreadsheet tax. The
          full breakdown, nothing spun.
        </p>

        <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center'>
          <Link
            href='/book-demo'
            className={cn(
              'group relative z-10 inline-flex h-[50px] min-h-[50px] shrink-0 items-center justify-center gap-2 rounded-[10px]',
              'border border-[#7688a8] bg-[#2a3241] px-8 text-base font-bold text-white',
              'shadow-[0px_3px_0px_0px_#7688a8]',
              'transition hover:translate-y-px hover:bg-[#3d475a] hover:shadow-[0px_2px_0px_0px_#7688a8]',
              'active:translate-y-[2px] active:shadow-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863fb] focus-visible:ring-offset-2'
            )}
          >
            Book a 20-min demo
            <ArrowRight
              className='size-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1'
              aria-hidden
            />
          </Link>
          <Link
            href='#feature-comparison'
            className={cn(
              'relative z-10 inline-flex h-[50px] min-h-[50px] shrink-0 items-center justify-center rounded-[10px]',
              'border border-black bg-white px-8',
              'font-sansGeneral text-base font-semibold leading-none text-black',
              'shadow-[0px_3px_0px_0px_#000000]',
              'transition hover:translate-y-px hover:bg-neutral-50 hover:shadow-[0px_2px_0px_0px_#000000]',
              'active:translate-y-[2px] active:shadow-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2'
            )}
          >
            See the full table
          </Link>
        </div>
      </div>
    </section>
  )
}
