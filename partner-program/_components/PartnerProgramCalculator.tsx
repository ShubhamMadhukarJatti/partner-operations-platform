'use client'

import { useMemo, useState } from 'react'
import { Bebas_Neue } from 'next/font/google'

import { cn } from '@/lib/utils'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], display: 'swap' })

const TIERS = [
  { id: 'c15', label: '15% (Champion - Low)', rate: 0.15 },
  { id: 'c175', label: '17.5% (Champion - Mid)', rate: 0.175 },
  { id: 'c20', label: '20% (Champion - High)', rate: 0.2 },
  { id: 'r8', label: '8% (Referral)', rate: 0.08 },
  { id: 'r10', label: '10% (Referral)', rate: 0.1 }
] as const

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
}

export function PartnerProgramCalculator() {
  const [dealSize, setDealSize] = useState('50000')
  const [tierId, setTierId] = useState<(typeof TIERS)[number]['id']>('c15')

  const rate = useMemo(
    () => TIERS.find((t) => t.id === tierId)?.rate ?? 0.15,
    [tierId]
  )

  const payout = useMemo(() => {
    const n = parseFloat(dealSize.replace(/[^0-9.]/g, '')) || 0
    return Math.round(n * rate)
  }, [dealSize, rate])

  return (
    <section className='bg-white py-14 sm:py-20'>
      <MaxWidthWrapper className='px-4 sm:px-6'>
        <div
          className='relative mx-auto max-w-5xl overflow-hidden rounded-[36px] px-5 py-10 transition-all duration-300 hover:z-10 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(185,207,255,0.8)] sm:px-10 sm:py-12'
          style={{
            background:
              'linear-gradient(90deg, rgba(185, 207, 255, 0.56) 0%, rgba(222, 176, 255, 0.56) 100%)'
          }}
        >
          <h2 className='mb-8 text-center text-3xl font-bold tracking-tight text-[#0e111b] sm:mb-10 sm:text-5xl sm:leading-[50px]'>
            Estimated your <span className='text-[#5b76ff]'>Earnings</span>
          </h2>

          <div className='grid grid-cols-1 gap-6 gap-x-8 md:grid-cols-2'>
            <div className='flex flex-col gap-3'>
              <label
                className='text-lg font-medium text-[#21232c]'
                htmlFor='pp-deal-size'
              >
                Deal Size
              </label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-[#21232c]'>
                  $
                </span>
                <input
                  id='pp-deal-size'
                  type='text'
                  inputMode='numeric'
                  value={dealSize}
                  onChange={(e) => setDealSize(e.target.value)}
                  className='h-[54px] w-full rounded-[10px] border-0 bg-white pl-8 pr-4 text-lg font-medium text-[#21232c] shadow-sm outline-none ring-1 ring-[#e2e4eb] focus:ring-2 focus:ring-[#5b76ff]'
                  aria-describedby='pp-deal-hint'
                />
              </div>
              <span id='pp-deal-hint' className='sr-only'>
                Enter the annual deal size in US dollars
              </span>
            </div>
            <div className='flex flex-col gap-3'>
              <label
                className='text-lg font-medium text-[#21232c]'
                htmlFor='pp-tier'
              >
                Commission Tier
              </label>
              <div className='relative'>
                <select
                  id='pp-tier'
                  value={tierId}
                  onChange={(e) =>
                    setTierId(e.target.value as (typeof TIERS)[number]['id'])
                  }
                  className='h-[54px] w-full cursor-pointer appearance-none rounded-[10px] border-0 bg-white px-4 pr-10 text-lg font-medium text-[#21232c] shadow-sm outline-none ring-1 ring-[#e2e4eb] focus:ring-2 focus:ring-[#5b76ff]'
                >
                  {TIERS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#3e424d]'>
                  ▼
                </span>
              </div>
            </div>
          </div>

          <div className='relative mt-8 min-h-[147px] rounded-2xl border-2 border-[#5b76ff] bg-white px-4 py-6 text-center transition-all duration-300 hover:z-10 hover:-translate-y-2 hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(91,118,255,0.25)] sm:px-8'>
            <p className='text-lg font-medium text-[#21232c]'>
              Your Estimated Payout
            </p>
            <p
              className={cn(
                bebas.className,
                'mt-2 text-6xl tracking-tight text-[#5b76ff] sm:text-7xl'
              )}
            >
              {formatCurrency(payout)}
            </p>
            <p className='mt-1 text-sm text-[#6a7282]'>
              Based on first-year ACV
            </p>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
