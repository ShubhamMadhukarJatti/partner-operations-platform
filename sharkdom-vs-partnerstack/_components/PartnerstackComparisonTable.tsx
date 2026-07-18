import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'

type Cell =
  | { kind: 'check' }
  | { kind: 'cross' }
  | { kind: 'text'; value: string; note?: string }

const ROWS: {
  title: string
  subtitle?: string
  partnerstack: Cell
  sharkdom: Cell
}[] = [
  {
    title: 'Account Claim',
    subtitle: 'Onboarding process and initial account access',
    partnerstack: { kind: 'text', value: 'Mandatory' },
    sharkdom: { kind: 'text', value: 'Free to Signup' }
  },
  {
    title: 'Offline Partners',
    subtitle: 'Support for partnerships operating offline',
    partnerstack: { kind: 'cross' },
    sharkdom: { kind: 'text', value: 'In-built' }
  },
  {
    title: 'Partner Verification (QOP)',
    subtitle: 'Quality of Partner verification systems',
    partnerstack: { kind: 'cross' },
    sharkdom: { kind: 'text', value: 'In-built' }
  },
  {
    title: 'Partner Registration',
    subtitle: 'Frictionless registration for new partners',
    partnerstack: { kind: 'text', value: 'Available' },
    sharkdom: { kind: 'text', value: 'In-built' }
  },
  {
    title: 'Integrations',
    subtitle: 'Number of supported native integrations',
    partnerstack: { kind: 'text', value: '15' },
    sharkdom: { kind: 'text', value: '29' }
  },
  {
    title: 'Customers',
    subtitle: 'Target company stages and sizes',
    partnerstack: { kind: 'text', value: 'Mid-Stage, Large' },
    sharkdom: { kind: 'text', value: 'All Types' }
  },
  {
    title: 'Affiliate Program',
    subtitle: 'Management of affiliate rewards and links',
    partnerstack: { kind: 'check' },
    sharkdom: { kind: 'check' }
  },
  {
    title: 'Partner Enablement',
    subtitle: 'Training, resource libraries and onboarding guides',
    partnerstack: { kind: 'check' },
    sharkdom: { kind: 'check' }
  },
  {
    title: 'Pricing Comparison',
    subtitle: 'Base pricing model structures',
    partnerstack: { kind: 'text', value: 'Commission based' },
    sharkdom: { kind: 'text', value: 'Starting @$9' }
  },
  {
    title: 'Max Seats',
    subtitle: 'Internal workspace user limits',
    partnerstack: { kind: 'text', value: '2' },
    sharkdom: { kind: 'text', value: '10' }
  },
  {
    title: 'API',
    subtitle: 'Custom integrations and developer APIs',
    partnerstack: { kind: 'cross' },
    sharkdom: { kind: 'text', value: 'In-built' }
  },
  {
    title: 'Target Audience',
    subtitle: 'Primary users of the platform',
    partnerstack: { kind: 'text', value: 'Bloggers, Growth Teams' },
    sharkdom: { kind: 'text', value: 'Founders, Sales & Ops' }
  },
  {
    title: 'Customer Support',
    subtitle: 'Available channels and response speed',
    partnerstack: { kind: 'text', value: 'Email' },
    sharkdom: { kind: 'text', value: '24x7' }
  },
  {
    title: 'Partner Recognition Kit',
    subtitle: 'Automated partner tier and badge recognition',
    partnerstack: { kind: 'cross' },
    sharkdom: { kind: 'check' }
  }
]

function CellContent({ cell }: { cell: Cell }) {
  if (cell.kind === 'check') {
    return (
      <span className='inline-flex size-6 items-center justify-center rounded-full bg-[#e0f5e6] text-[#009b53]'>
        <Check className='size-3.5 stroke-[3]' aria-hidden />
      </span>
    )
  }
  if (cell.kind === 'cross') {
    return (
      <span className='inline-flex size-6 items-center justify-center rounded-full bg-[#ffe7e4] text-[#e64343]'>
        <X className='size-3.5 stroke-[3]' aria-hidden />
      </span>
    )
  }
  return (
    <div className='flex flex-col items-center justify-center gap-1 text-center text-[13.5px] text-[#3e424d]'>
      {cell.note ? (
        <>
          <span className='inline-flex size-6 items-center justify-center rounded-full bg-[#ffe7e4] text-[#e64343]'>
            <X className='size-3.5 stroke-[3]' aria-hidden />
          </span>
          <span className='max-w-[200px] leading-snug'>{cell.note}</span>
        </>
      ) : (
        <span className='font-medium text-[#0e111b]'>{cell.value}</span>
      )}
    </div>
  )
}

export default function PartnerstackComparisonTable() {
  return (
    <section
      className='scroll-mt-28 bg-white py-16 md:py-24'
      id='feature-comparison'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-[#d3d7e2] bg-white px-3 py-1.5 pr-4'>
            <span className='size-1.5 rounded-full bg-[#6054ec]' aria-hidden />
            <span className='font-mono text-[11px] font-medium uppercase tracking-[1.1px] text-[#3e424d]'>
              Feature-by-feature
            </span>
          </div>
        </div>

        <div className='mt-8 flex flex-wrap items-center justify-center gap-2 text-center md:gap-3'>
          <span className='text-4xl font-bold tracking-tight text-[#0e111b] md:text-5xl'>
            PartnerStack
          </span>
          <span className='text-3xl italic text-[#320e9d] md:text-[33px]'>
            vs
          </span>
          <span className='text-4xl font-bold tracking-tight text-[#6863fb] md:text-5xl'>
            Sharkdom
          </span>
        </div>

        <p className='mx-auto mt-4 max-w-3xl text-center text-[16.5px] leading-relaxed text-[#3e424d]'>
          Every row benchmarked against the published feature set. Last updated
          Q2 2026.
        </p>

        <div className='compare-page-card-pop mt-12 cursor-default overflow-x-auto rounded-[24px] border border-[#e2e4eb] bg-white shadow-[0px_12px_32px_-8px_rgba(14,17,27,0.14)] hover:border-[#6863fb]/35 hover:shadow-[0px_18px_44px_-10px_rgba(96,84,236,0.28),0px_12px_32px_-8px_rgba(14,17,27,0.16)]'>
          {/* Header */}
          <div className='relative grid min-w-[720px] grid-cols-[minmax(200px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)] gap-0 border-b border-[#e2e4eb] bg-gradient-to-b from-[#f1f1fe] to-white px-4 py-6 md:min-w-0 md:grid-cols-[minmax(240px,2fr)_minmax(160px,1fr)_minmax(160px,1fr)] md:px-8'>
            <div className='flex flex-col justify-center gap-1'>
              <span className='font-mono text-[10.5px] font-medium uppercase tracking-[1.05px] text-[#293e60]'>
                Capability
              </span>
              <span className='text-xl font-semibold tracking-tight text-[#0e111b] md:text-[26px] md:leading-[30px]'>
                14 categories
              </span>
            </div>
            <div className='flex flex-col items-center justify-center gap-1 text-center'>
              <span className='font-mono text-[10.5px] font-medium uppercase tracking-[1.05px] text-[#293e60]'>
                Challenger
              </span>
              <span className='text-xl font-bold text-[#757a87] md:text-[22px]'>
                PartnerStack
              </span>
            </div>
            <div className='relative flex flex-col items-center justify-center gap-1 text-center'>
              <span className='font-mono text-[10.5px] font-medium uppercase tracking-[1.05px] text-[#293e60]'>
                Winner
              </span>
              <Image
                src='/icons/full-logo.svg'
                alt='Sharkdom'
                width={116}
                height={21}
                className='h-5 w-auto md:h-[21px]'
              />
            </div>
          </div>

          <div className='min-w-[720px] md:min-w-0'>
            {ROWS.map((row) => (
              <div
                key={row.title}
                className='grid grid-cols-[minmax(200px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)] border-b border-[#e2e4eb] md:grid-cols-[minmax(240px,2fr)_minmax(160px,1fr)_minmax(160px,1fr)]'
              >
                <div className='px-4 py-5 md:px-8'>
                  <p className='text-[15px] font-medium text-[#0e111b]'>
                    {row.title}
                  </p>
                  {row.subtitle ? (
                    <p className='mt-1 text-[12.5px] leading-snug text-[#757a87]'>
                      {row.subtitle}
                    </p>
                  ) : null}
                </div>
                <div className='flex items-center justify-center border-l border-[#e2e4eb] px-3 py-4'>
                  <CellContent cell={row.partnerstack} />
                </div>
                <div className='flex items-center justify-center border-l border-[#e2e4eb] bg-[rgba(96,84,236,0.04)] px-3 py-4'>
                  <CellContent cell={row.sharkdom} />
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-col items-stretch justify-between gap-4 border-t border-[#e2e4eb] bg-[#f2f2ff] px-4 py-6 md:flex-row md:items-center md:px-8'>
            <p className='font-mono text-[13px] text-[#3e424d]'>
              Based on{' '}
              <span className='font-bold text-[#0e111b]'>
                public docs &amp; customer interviews
              </span>
              <span> · Updated Q2 2026</span>
            </p>
            <Link
              href='/register'
              className='group inline-flex h-[50px] shrink-0 items-center justify-center gap-2 self-center rounded-[10px] border-b-[6px] border-[#7688a8] bg-[#2a3241] px-8 text-base font-bold text-white shadow-sm transition-all duration-300 ease-out hover:bg-[#3d475a] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863fb] focus-visible:ring-offset-2 active:scale-[0.98] md:self-auto'
            >
              Start your free trial
              <ArrowRight
                className='size-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1'
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
