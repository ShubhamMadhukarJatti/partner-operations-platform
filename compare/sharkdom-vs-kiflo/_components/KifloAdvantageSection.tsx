import { Clock, ListChecks, Users } from 'lucide-react'

import CompareAdvantageIllustrationCard from '../../_components/CompareAdvantageIllustrationCard'
import CompareSectionFrameDecor from '../../_components/CompareSectionFrameDecor'

const CARD_GRADIENT =
  'linear-gradient(169.66274769105058deg, rgb(255, 255, 255) 13.478%, rgba(255, 255, 255, 0) 99.933%)'

const CARDS = [
  {
    icon: Clock,
    title: 'Program is a co-sell motion with multiple partners',
    body: 'Sharkdom figures out which deals are actually being moved by which partner using forecasting and KPI’s.'
  },
  {
    icon: ListChecks,
    title: 'Running multiple partner motions',
    body: 'If you need one platform for all to run multiple partner motions from co-sell, co-marketing to reseller and affiliate, then Sharkdom is the one.'
  },
  {
    icon: Users,
    title: 'Three-tier attribution',
    body: 'Keep track of multi touch points coming from your partners wjo sourced and influenced deals.'
  }
] as const

/**
 * Figma: Frame 2147205057 (node 947:35897) — Designing file.
 * Panel 1408×842, rounded 8px, gradient + frame guides; two-col row gap 20px;
 * Card 01 431×373; right stack w 565.72px, cards 116px, gap 16px.
 */
export default function KifloAdvantageSection() {
  return (
    <section className='relative py-10 md:py-14 lg:py-16'>
      <div className='relative mx-auto w-full max-w-[1408px] overflow-hidden rounded-lg bg-gradient-to-r from-[rgba(185,207,255,0.56)] to-[rgba(222,176,255,0.56)] px-4 sm:px-6 md:px-10 lg:px-12 lg:pb-[72px] lg:pt-[50px]'>
        <CompareSectionFrameDecor />

        <div className='relative z-[1] mx-auto max-w-[1017px]'>
          {/* 947:35898 */}
          <div className='flex justify-center'>
            <div className='inline-flex h-7 items-center gap-2 rounded-full border border-white bg-white px-3.5 pr-4'>
              <span
                className='size-1.5 shrink-0 rounded-full bg-[#6054ec]'
                aria-hidden
              />
              <span className='font-mono text-[11px] font-medium uppercase tracking-[1.1px] text-[#32343a]'>
                Sharkdom advantage
              </span>
            </div>
          </div>

          {/* 947:35987 */}
          <div className='mx-auto mt-6 flex max-w-[738px] flex-col items-center gap-[15px] text-center md:mt-8'>
            <h2 className='w-full text-[clamp(2rem,4.2vw,3rem)] font-bold tracking-[-0.03em] text-[#41404c] md:text-[48px] md:leading-[50px] md:tracking-[-1.44px]'>
              <span className='block md:leading-[50px]'>
                Challenges teams hit
              </span>
              <span className='mt-1 block md:mt-0 md:leading-[50px]'>
                <span className='text-[#41404c]'>with </span>
                <span className='text-[#6863fb]'>legacy partner tools</span>
              </span>
            </h2>
            <p className='w-full max-w-[654px] text-[16.5px] leading-[25.58px] tracking-[-0.08px] text-[#212137]'>
              Kiflo PRM was purpose built for those partner program with a
              referral motion with 5–20 affiliates and your main pain is paying
              them on time..
            </p>
          </div>

          {/* 947:35912 — gap 20px; right column 565.72px */}
          <div className='mt-10 flex flex-col items-center gap-5 md:mt-12 lg:mt-14 lg:flex-row lg:items-start lg:justify-center'>
            <CompareAdvantageIllustrationCard />

            <ul className='flex w-full flex-col gap-4 lg:w-[565.72px] lg:max-w-[565.72px] lg:shrink-0'>
              {CARDS.map(({ icon: Icon, title, body }) => (
                <li
                  key={title}
                  className='compare-page-card-pop flex min-h-[116px] cursor-default items-start gap-4 rounded-[14px] border border-solid border-white py-[22px] pl-6 pr-5 shadow-[0px_1px_2px_rgba(14,17,27,0.05)] hover:border-[#6863fb]/45 hover:shadow-[0px_12px_36px_-10px_rgba(96,84,236,0.35),0px_8px_24px_-12px_rgba(14,17,27,0.12)] sm:pr-6'
                  style={{ backgroundImage: CARD_GRADIENT }}
                >
                  <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#6863fb] text-white'>
                    <Icon className='size-5' aria-hidden strokeWidth={2} />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 className='text-[17px] font-semibold tracking-[-0.17px] text-[#1b1919]'>
                      {title}
                    </h3>
                    <p className='mt-2 text-[14px] leading-[21px] tracking-[-0.08px] text-[#3c3b4f]'>
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
