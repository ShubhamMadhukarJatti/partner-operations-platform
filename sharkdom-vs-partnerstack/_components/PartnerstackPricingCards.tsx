import { Bebas_Neue } from 'next/font/google'
import Image from 'next/image'
import { Check, X } from 'lucide-react'

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400'
})

const PARTNERSTACK_ITEMS = [
  { ok: false as const, label: 'Most analytics features are not FREE' },
  { ok: false as const, label: 'Free trial is not available' },
  { ok: false as const, label: 'Extra credits are not available' },
  { ok: true as const, label: 'Commission based fees apply' }
]

const SHARKDOM_ITEMS = [
  'Most features to get you started are FREE',
  'Free trial available immediately',
  'Extra credits available for growth',
  'Starting at just $9/mo flat'
]

export default function PartnerstackPricingCards() {
  return (
    <section className='border-y border-[#e8eaf4] bg-[#f9faff] py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <header className='mx-auto flex max-w-4xl flex-col items-center text-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-[#e8eaf4] bg-[#f4f6fc] px-3.5 py-2 pl-3 shadow-[0px_1px_2px_rgba(14,17,27,0.04)]'>
            <span
              className='size-2 shrink-0 rounded-full bg-[#6863fb]'
              aria-hidden
            />
            <span className='text-[11px] font-bold uppercase tracking-[1.2px] text-[#6863fb]'>
              Pricing, like-for-like
            </span>
          </div>

          <h2 className='mt-10 max-w-[38rem] font-bold tracking-[-0.03em] text-[#111827]'>
            <span className='block text-[clamp(1.875rem,4.5vw,3rem)] leading-[1.12] md:text-[48px] md:leading-[50px]'>
              Compare pricing for a
            </span>
            <span className='mt-1 block text-[clamp(1.875rem,4.5vw,3rem)] leading-[1.12] md:text-[48px] md:leading-[50px]'>
              <span className='text-[#7c71ff]'>100-partner</span>{' '}
              <span className='text-[#111827]'>team</span>
            </span>
          </h2>

          <p className='mt-6 max-w-xl text-pretty text-base font-normal leading-relaxed text-[#6b7280] md:max-w-[36rem] md:text-[17px] md:leading-[26px]'>
            Modeled on the PartnerStack and Sharkdom published plans. Annual
            billing, 100 partners, 5 internal users.
          </p>
        </header>

        <div className='mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8'>
          {/* PartnerStack */}
          <div className='compare-page-card-pop cursor-default rounded-[20px] border border-[#e2e4eb] bg-white p-7 shadow-sm hover:border-[#6863fb]/45 hover:shadow-[0px_12px_36px_-10px_rgba(96,84,236,0.35),0px_8px_24px_-12px_rgba(14,17,27,0.12)]'>
            <div className='inline-block rounded-md bg-[#f6f3ee] px-4 py-1'>
              <span className='text-[13px] font-semibold text-[#0e111b]'>
                PartnerStack
              </span>
            </div>
            <p className='mt-3 font-mono text-xs font-semibold uppercase tracking-[0.96px] text-[#757a87]'>
              Commission-based plan
            </p>
            <div
              className={`mt-4 flex flex-wrap items-end gap-1 ${bebas.className}`}
            >
              <span className='text-[28px] leading-none text-[#0e111b]'>$</span>
              <span className='text-5xl leading-none tracking-tight text-[#0e111b]'>
                Commission
              </span>
              <span className='mb-1 text-sm font-medium text-[#757a87]'>
                /based
              </span>
            </div>
            <ul className='mt-6 space-y-3 border-t border-[#e2e4eb]/80 pt-6'>
              {PARTNERSTACK_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className='flex items-center gap-2 text-[13.5px] text-[#3e424d]'
                >
                  {item.ok === true ? (
                    <Check
                      className='size-4 shrink-0 text-[#009b53]'
                      strokeWidth={3}
                    />
                  ) : item.ok === false ? (
                    <X
                      className='size-4 shrink-0 text-[#e64343]'
                      strokeWidth={3}
                    />
                  ) : (
                    <span className='size-4 shrink-0' aria-hidden />
                  )}
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Sharkdom */}
          <div className='compare-page-card-pop relative cursor-default overflow-hidden rounded-[20px] border border-[#6863fb] bg-gradient-to-br from-[#6595ff] via-[#8774ff] to-[#c471ff] p-7 shadow-lg hover:shadow-[0px_24px_56px_-12px_rgba(70,60,200,0.55),0px_12px_28px_-8px_rgba(14,17,27,0.18)]'>
            <div className='absolute right-8 top-8 rounded-full bg-white px-3 py-1'>
              <span className='font-mono text-[10.7px] font-bold uppercase tracking-[0.64px] text-[#6863fb]'>
                Save 50%+
              </span>
            </div>
            <Image
              src='/icons/full-logo.svg'
              alt='Sharkdom'
              width={122}
              height={22}
              className='h-6 w-auto brightness-0 invert'
            />
            <p className='mt-3 font-mono text-[12.2px] font-semibold uppercase tracking-[0.98px] text-[#edeef8]'>
              Pro Plan · flat
            </p>
            <div
              className={`mt-4 flex flex-wrap items-end gap-1 text-white ${bebas.className}`}
            >
              <span className='text-[28px] leading-none'>$</span>
              <span className='text-[49px] leading-none tracking-tight'>9</span>
              <span className='mb-1 font-sans text-sm font-medium text-[#f0f4ff]'>
                /mo onwards
              </span>
            </div>
            <ul className='mt-6 space-y-3 border-t border-white/25 pt-6'>
              {SHARKDOM_ITEMS.map((label) => (
                <li
                  key={label}
                  className='flex items-start gap-2 text-[13.8px] font-medium text-[#eff3ff]'
                >
                  <Check
                    className='mt-0.5 size-4 shrink-0 text-white'
                    strokeWidth={3}
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
