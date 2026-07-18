import {
  GraduationCap,
  Layers,
  PiggyBank,
  Share2,
  Shield,
  Users
} from 'lucide-react'

const CARDS = [
  {
    n: '01',
    icon: Layers,
    title: '7-day go-live',
    lines: [
      'Ship your partner portal, deal desk and LMS in a',
      'single week — not a six-month implementation',
      'project.'
    ]
  },
  {
    n: '02',
    icon: Share2,
    title: 'Multi-touch attribution',
    lines: [
      "See every partner's contribution to every deal —",
      'from first touch to closed-won, with no manual',
      'tagging.'
    ]
  },
  {
    n: '03',
    icon: Users,
    title: 'Unlimited partners, flat fee',
    lines: [
      'Scale to 1,000 partners without talking to a',
      'sales rep. No per-seat gotchas, no growth',
      'penalty.'
    ]
  },
  {
    n: '04',
    icon: GraduationCap,
    title: 'Built-in partner LMS',
    lines: [
      'Ship branded training, tier up partners',
      'automatically, and certify new reps before they',
      'touch a pipeline.'
    ]
  },
  {
    n: '05',
    icon: PiggyBank,
    title: 'MDF & co-op budgets',
    lines: [
      'Allocate, approve and track marketing funds',
      'per partner — with ROI tied back to sourced',
      'and influenced pipeline.'
    ]
  },
  {
    n: '06',
    icon: Shield,
    title: 'Per-partner permissions',
    lines: [
      'Decide who on your team sees which partner,',
      'which deals, which numbers — one matrix, no IT',
      'ticket.'
    ]
  }
]

export default function PartnerstackWhyGrid() {
  return (
    <section className='bg-white py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-[#d3d7e2] bg-white px-3 py-1.5 pr-4'>
            <span className='size-1.5 rounded-full bg-[#6054ec]' aria-hidden />
            <span className='font-mono text-[11px] font-medium uppercase tracking-[1.1px] text-[#3e424d]'>
              Why Sharkdom
            </span>
          </div>
        </div>

        <h2 className='mx-auto mt-8 max-w-5xl text-center text-4xl font-bold tracking-tight text-[#0e111b] md:text-5xl md:leading-[50px]'>
          What makes Sharkdom the best place to find{' '}
          <span className='text-[#6863fb]'>industry partnerships?</span>
        </h2>

        <p className='mx-auto mt-6 max-w-3xl text-center text-[16.5px] leading-relaxed text-[#3e424d]'>
          Six product decisions that make Sharkdom a different category of
          product from
          <br className='hidden sm:block' /> PartnerStack.
        </p>

        <div className='mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {CARDS.map(({ n, icon: Icon, title, lines }) => (
            <article
              key={n}
              className='compare-page-card-pop cursor-default rounded-[18px] border border-[#e2e4eb] bg-white p-7 shadow-[4px_4px_4px_0px_rgba(37,99,235,0.25)] hover:border-[#6863fb]/45 hover:shadow-[0px_12px_36px_-10px_rgba(96,84,236,0.35),0px_8px_24px_-12px_rgba(14,17,27,0.12)]'
            >
              <span className='font-mono text-[11px] uppercase tracking-[1.1px] text-[#757a87]'>
                {n}
              </span>
              <div className='mt-4 flex size-11 items-center justify-center rounded-xl bg-[#eaedff] text-[#6863fb]'>
                <Icon className='size-5' aria-hidden />
              </div>
              <h3 className='mt-4 text-lg font-semibold tracking-tight text-[#0e111b]'>
                {title}
              </h3>
              <p className='mt-3 text-sm leading-relaxed text-[#3e424d]'>
                {lines.map((line) => (
                  <span key={line} className='block'>
                    {line}
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
