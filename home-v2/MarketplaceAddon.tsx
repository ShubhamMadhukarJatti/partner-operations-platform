'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Camera, Sparkles, Users, Wand2 } from 'lucide-react'

import { cn } from '@/lib/utils'

import CompareSectionFrameDecor from '../../compare/_components/CompareSectionFrameDecor'

/** Figma 2147205427 Dev CSS — glass panel fill (148.26deg, -37.92% / 98.02%). */
function glassPanelStyle(): React.CSSProperties {
  return {
    backgroundImage:
      'linear-gradient(148.26deg, rgba(255, 255, 255, 0) -37.92%, rgba(255, 255, 255, 0.64) 98.02%)'
  }
}

function rowPillStyle(): React.CSSProperties {
  return {
    backgroundImage:
      'linear-gradient(92.64deg, rgba(255, 255, 255, 0) -29.02%, rgba(255, 255, 255, 0.34) 93.67%)'
  }
}

function SourcingGlassCard() {
  return (
    <div
      className='relative flex min-h-[300px] flex-col rounded-2xl border border-white p-5 backdrop-blur-[25px] lg:min-h-[300px]'
      style={glassPanelStyle()}
    >
      <h3 className='mb-4 font-sansGeneral text-xl font-medium text-[#2D2D2D]'>
        Sourcing Ideal Partners
      </h3>
      <div className='relative flex-1 rounded-xl border border-[rgba(35,31,31,0.1)] bg-[rgba(42,38,38,0.03)] p-3'>
        <div className='mx-auto mb-4 h-2.5 w-[118px] rounded-full bg-black/10' />
        <div className='mb-2 flex gap-2 pl-1'>
          <span className='mt-1 size-2.5 rounded-full bg-black/10' />
          <span className='mt-1 size-2.5 rounded-full bg-black/10' />
          <span className='mt-1 size-2.5 rounded-full bg-black/10' />
        </div>
        {[
          { label: 'Compatibility Score', dot: 'bg-[#D37BFF]' },
          { label: 'License Inventory', dot: 'bg-[#FCAC84]' },
          { label: 'Shortlisting look-a-likes', dot: 'bg-[#80AAFD]' }
        ].map((row) => (
          <div key={row.label} className='mb-2 flex items-center gap-2'>
            <span className={cn('size-2.5 shrink-0 rounded-full', row.dot)} />
            <div
              className='flex h-[30px] flex-1 items-center rounded-lg border border-white px-3'
              style={rowPillStyle()}
            >
              <span className='font-sansGeneral text-[11px] font-medium text-[#0B0B0B]'>
                {row.label}
              </span>
            </div>
          </div>
        ))}
        <div className='absolute bottom-3 left-1/2 w-[90%] max-w-[206px] -translate-x-1/2'>
          <div className='rounded-full border border-[rgba(84,24,114,0.08)] p-0.5'>
            <div className='flex items-center justify-between gap-2 rounded-full border border-[rgba(0,0,0,0.1)] bg-[rgba(37,34,37,0.03)] px-2 py-1.5 shadow-[0px_12px_14px_rgba(0,0,0,0.08)] backdrop-blur-[2px]'>
              <div className='flex min-w-0 items-center gap-2'>
                <span className='relative inline-flex size-3.5 shrink-0 rounded-full border-2 border-[#D37BFF]' />
                <span className='truncate font-sansGeneral text-xs font-medium text-[#0B0B0B]'>
                  Searching right Partners...
                </span>
              </div>
              <div className='flex shrink-0 gap-1'>
                <span
                  className='inline-flex size-6 rounded-full bg-gradient-to-br from-[#D588FC] to-[#B42AF9] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.1)]'
                  aria-hidden
                />
                <span
                  className='inline-flex size-6 rounded-full bg-gradient-to-br from-[#D588FC] to-[#B42AF9] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.1)]'
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PartnerOnboardingGlassCard() {
  return (
    <div
      className='relative flex min-h-[300px] flex-col rounded-2xl border border-white p-5 backdrop-blur-[25px] lg:min-h-[300px]'
      style={glassPanelStyle()}
    >
      <h3 className='mb-4 font-sansGeneral text-xl font-medium text-[#1D1F21]'>
        Partner Onboarding
      </h3>
      <div className='relative flex flex-1 flex-col justify-end gap-4 pb-1'>
        <div className='mx-auto w-full max-w-[232px] space-y-2 pt-4'>
          <div className='h-3 w-3/4 rounded-md bg-[#E9D5FF]/90' />
          <div className='h-3 w-full rounded-md bg-[#DDD6FE]/80' />
        </div>
        <div className='relative mx-auto w-full max-w-[232px]'>
          <div className='absolute inset-x-2 top-4 h-5 rounded-lg bg-white/60' />
          <div className='relative flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm'>
            <span className='inline-flex size-6 shrink-0 rounded-full bg-gradient-to-br from-[#D588FC] to-[#007BFF] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.1)]' />
            <span className='font-sansGeneral text-sm font-medium text-[#1B0C27]'>
              Automated partner journey
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function GradientOrb({
  className,
  children
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex size-[50px] items-center justify-center rounded-full bg-gradient-to-br shadow-[inset_0_-1px_2px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.6)]',
        className
      )}
    >
      {children}
    </div>
  )
}

/** Figma 947:28676 — small glass skeleton card beside mascot (decorative). */
function FloatingGlassSnippet() {
  return (
    <div
      aria-hidden
      className='absolute right-0 top-[14%] z-10 hidden h-[70px] w-[135px] flex-col gap-3 rounded-2xl border border-white p-4 backdrop-blur-[25px] lg:flex'
      style={{
        backgroundImage:
          'linear-gradient(148.26deg, rgba(255, 255, 255, 0) -37.92%, rgba(255, 255, 255, 0.64) 98.02%)'
      }}
    >
      <div className='flex items-center gap-[9px]'>
        <span className='size-2 shrink-0 rounded-full bg-[#D9ABFF]' />
        <div className='h-2 w-[74px] rounded-[10px] bg-[#D9ABFF]' />
      </div>
      <div className='h-[18px] w-[104px] rounded-[10px] bg-[#D9ABFF]' />
    </div>
  )
}

function CenterMascot() {
  return (
    <div className='relative mx-auto flex w-full max-w-[360px] flex-col items-center justify-center py-4 lg:min-h-[340px] lg:py-6'>
      <div className='relative flex aspect-square w-[275px] max-w-full items-center justify-center'>
        <div className='absolute inset-0 rounded-full border-2 border-[#EDEDED]' />

        <div className='absolute left-0 top-6 z-10 md:left-1'>
          <GradientOrb className='from-[#D588FC] to-[#007BFF]'>
            <Sparkles className='size-5 text-white' strokeWidth={1.75} />
          </GradientOrb>
        </div>
        <div className='absolute right-1 top-[28%] z-10 md:right-0'>
          <GradientOrb className='from-[#00C950] to-[#ACB9D4]'>
            <Users className='size-5 text-[#1B1B1B]' strokeWidth={1.75} />
          </GradientOrb>
        </div>
        <div className='absolute bottom-12 right-5 z-10 hidden md:block'>
          <GradientOrb className='from-[#D37BFF] to-[#007BFF]'>
            <Camera className='size-5 text-white' strokeWidth={1.75} />
          </GradientOrb>
        </div>

        <div className='relative z-[1] mt-8 size-[200px] md:mt-10 md:size-[251px]'>
          <Image
            src='/assets/home/shark_image.png'
            alt='Sharkdom marketplace mascot'
            fill
            className='object-contain object-bottom'
            priority
          />
        </div>

        <Link
          href='https://marketplace.sharkdom.com/'
          className='absolute left-2 top-1/2 z-20 flex size-[55px] -translate-y-1/2 items-center justify-center rounded-full shadow-[0px_0px_3.98px_rgba(211,123,255,0.1)] md:left-3'
          style={{
            backgroundImage:
              'linear-gradient(136.1deg, #391D4F 1.84%, #170A22 100%)'
          }}
          aria-label='Open marketplace'
        >
          <Wand2 className='size-7 text-white/90' strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  )
}

function BottomDiscoverCard() {
  return (
    <div className='relative min-h-[284px] overflow-hidden rounded-2xl border border-white bg-[#F1F3FF] backdrop-blur-[25px]'>
      <div className='pointer-events-none absolute -right-[91px] top-1/2 hidden size-[360px] -translate-y-1/2 rounded-full bg-[rgba(35,35,41,0.04)] backdrop-blur-[3.5px] md:block' />
      <div className='pointer-events-none absolute -right-[123px] top-1/2 hidden size-[320px] -translate-y-1/2 rounded-full bg-[rgba(35,35,41,0.04)] backdrop-blur-[3.5px] md:block' />
      <div className='pointer-events-none absolute -right-[153px] top-1/2 hidden size-[280px] -translate-y-1/2 rounded-full bg-[rgba(35,35,41,0.04)] backdrop-blur-[3.5px] md:block' />

      <div className='relative z-[1] grid min-h-[284px] md:grid-cols-[minmax(0,553px)_1fr]'>
        {/*
          Left: Figma 947:28622 — left/top 23px, label↔copy gap 8px, title↔body gap 12px,
          CTA top 223px ⇒ ~90px between copy and button at md+.
        */}
        <div className='flex flex-col p-[23px]'>
          <div className='flex items-end gap-1.5'>
            <span className='inline-flex size-5 shrink-0 rounded-full border-2 border-[#D588FC] bg-gradient-to-br from-[#D588FC]/35 to-white' />
            <span className='font-sansGeneral text-sm leading-[19px] text-[#282C37]'>
              Discover Engine
            </span>
          </div>
          <div className='mt-2 flex flex-col gap-3'>
            <h3 className='font-sansGeneral text-xl font-medium leading-[27px] text-[#1F1C2B]'>
              What more?
            </h3>
            <p className='max-w-[553px] font-sansGeneral text-sm leading-[19px] text-[#1F1C2B]'>
              Search partners by industry, product category, geo, customer base
              & GTM motion and See real profiles from MSPs, ISVs, Agencies, SaaS
              & Consulting partners
            </p>
          </div>
          <Link
            href='/free-trial'
            className='mt-8 inline-flex w-fit items-center justify-center rounded-lg bg-[#2A3241] px-5 py-1.5 font-inter text-base font-medium leading-6 text-[#F1F3FF] transition hover:brightness-110 md:mt-[90px]'
          >
            Get Free Trial
          </Link>
        </div>

        {/*
          Right: illustration fills column; object-contain + object-right avoids cropping off the edge.
        */}
        <div className='relative hidden min-h-[284px] md:block'>
          <div className='pointer-events-none absolute inset-0 min-h-[284px]'>
            <Image
              src='/assets/home/discover-engine-wave.png'
              alt=''
              fill
              className='object-contain object-right'
              sizes='(max-width: 1200px) 50vw, 640px'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MarketplaceAddon() {
  return (
    <section className='px-4 py-16 sm:px-6 md:px-8 md:py-20'>
      <div
        className={cn(
          'relative mx-auto w-full max-w-[1408px] overflow-hidden rounded-[8px] border border-white shadow-sm',
          'bg-gradient-to-r from-[rgba(185,207,255,0.56)] to-[rgba(222,176,255,0.56)]',
          'px-5 pb-12 pt-[50px] md:px-8 md:pb-16 lg:px-[116px]'
        )}
      >
        <CompareSectionFrameDecor />

        <div className='relative z-[1] w-full'>
          <div className='relative w-full'>
            <div className='mx-auto flex min-w-0 max-w-[738.14px] flex-col items-center px-2 text-center'>
              <div className='relative flex h-7 w-[136px] shrink-0 items-center justify-center rounded-full border border-white bg-white'>
                <span className='absolute left-[15px] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#6054EC]' />
                <span className='pl-5 pr-2 text-center font-mono text-[11px] font-medium uppercase leading-[14px] tracking-[1.1px] text-[#32343A]'>
                  INTRODUCING
                </span>
              </div>

              <div className='mt-7 flex min-w-0 max-w-[738px] flex-col items-center gap-[15px]'>
                <h2 className='font-sans text-3xl font-bold leading-[1.05] tracking-[-1.44px] text-[#41404c] md:text-[48px] md:leading-[50.4px]'>
                  <span className='text-[#6863FB]'>Marketplace</span>
                  <span> Addon</span>
                </h2>

                <p className='max-w-[654px] font-sans text-base font-normal leading-[26px] tracking-[-0.08px] text-[#212137] md:text-[16.5px] md:leading-[25.58px]'>
                  A Global Marketplace for your Next Integration, Co-sell or
                  Channel Partner
                </p>
              </div>
            </div>

            <Link
              href='https://marketplace.sharkdom.com/'
              className='mx-auto mt-4 flex h-[50px] min-h-[50px] w-[225px] shrink-0 items-center justify-center rounded-[10px] border-b-[6px] border-[#7688A8] bg-[#2A3241] font-jakarta text-base font-bold leading-[26px] text-white transition hover:brightness-110'
            >
              Explore Directory
              <ArrowRight className='ml-2 size-[18px] shrink-0' aria-hidden />
            </Link>
          </div>

          <div className='relative mx-auto mt-8 grid w-full max-w-[1176px] gap-6 lg:mt-10 lg:grid-cols-[minmax(0,330px)_minmax(260px,1fr)_minmax(0,354px)] lg:items-start lg:justify-center lg:gap-8'>
            <SourcingGlassCard />
            <div className='relative min-w-0'>
              <FloatingGlassSnippet />
              <CenterMascot />
            </div>
            <PartnerOnboardingGlassCard />
          </div>

          <div className='mx-auto mt-2 w-full max-w-[1176px]'>
            <BottomDiscoverCard />
          </div>
        </div>
      </div>
    </section>
  )
}
