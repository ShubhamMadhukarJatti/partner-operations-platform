'use client'

import React from 'react'
import Image from 'next/image'

const CARD_GRADIENT =
  'linear-gradient(116.78deg, #F3F3FC 20.88%, #D1D0FF 102.15%)'
const CTA_GRADIENT = 'linear-gradient(245.82deg, #6863FB 2.04%, #403BC3 82.72%)'
const CTA_SHADOW =
  '0px 2px 4px rgba(0, 0, 0, 0.1), inset 0px 2px 4px rgba(255, 255, 255, 0.4)'

const StarIcon = () => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 14 14'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M7 0L8.575 5.425L14 7L8.575 8.575L7 14L5.425 8.575L0 7L5.425 5.425L7 0Z'
      fill='currentColor'
    />
  </svg>
)

const LearnMoreButton = () => (
  <button
    className='rounded-full font-sansGeneral text-sm font-medium leading-[26px] text-white transition-opacity hover:opacity-90'
    style={{
      padding: '5px 24px',
      background: CTA_GRADIENT,
      boxShadow: CTA_SHADOW
    }}
  >
    Learn more
  </button>
)

const FeatureTag = ({ index, label }: { index: string; label: string }) => (
  <div className='flex items-center gap-2'>
    <div className='flex h-[37px] w-[34px] items-center justify-center rounded-lg border border-[#E5E7EB] bg-white'>
      <span className='font-mono text-lg leading-8 text-black'>{index}</span>
    </div>
    <span className='font-mono text-sm uppercase leading-8 text-black'>
      {label}
    </span>
  </div>
)

const PartnerScaleSection = () => {
  return (
    <section className='bg-white py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='mb-20 flex flex-col justify-between gap-12 lg:flex-row lg:items-end'>
          <div className='max-w-[800px] px-6'>
            <div className='mb-8 inline-flex rounded-full border border-[#E2D5F3] bg-white px-3 py-1.5 font-jakarta text-xs font-semibold uppercase tracking-[0.06em] text-[#0F172A] shadow-[0px_4px_12px_rgba(0,0,0,0.06)]'>
              AI-DRIVEN FEATURES
            </div>
            <h2 className='mb-6 font-jakarta text-3xl font-bold leading-[1.12] tracking-tight lg:text-[58px] lg:leading-[1.08]'>
              <span className='text-[#6366F1]'>Partner, scale and manage</span>
              <br />
              <span className='text-black'>entire partnership ecosystem</span>
            </h2>
            <p className='font-jakarta text-lg font-normal leading-relaxed text-[#4B5563] lg:text-xl'>
              Sharkdom helps you clear deal ownership, provide customized
              portals access to your partners and much more
            </p>
          </div>
          <div className='relative flex-shrink-0'>
            <div className='relative hidden h-[200px] w-[160px] lg:block lg:h-[280px] lg:w-[240px]'>
              <Image
                src='/assets/home/partner_scale/img_shark.png'
                alt='Shark AI'
                fill
                unoptimized
                className='object-contain'
              />
            </div>
          </div>
        </div>

        {/* Cards Grid – gap-8 = 32px matches Figma */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          {/* ──── Card 1 – Joint GTM Hub (7 / 12 cols) ──── */}
          <div
            className='hover-scale-smooth relative flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] lg:col-span-7 lg:h-[494px]'
            style={{ background: CARD_GRADIENT }}
          >
            {/* Heading – px-8 = 32px per Figma */}
            <div className='flex flex-col gap-2 px-6 pt-6 lg:px-8 lg:pt-8'>
              <FeatureTag index='01' label='Joint GTM Hub' />
              <h3 className='font-jakarta text-2xl font-semibold leading-8 text-[#101828]'>
                Keep All your Joint GTM initiatives at one place
              </h3>
              <p className='text-base leading-6 text-[#4A5565]'>
                Talk to partners like they&apos;re already in your team.
              </p>
            </div>

            {/* Content: bullets left, mockup right */}
            <div className='relative flex-1 px-6 pt-4 lg:px-8 lg:pt-6'>
              {/* Bullets + CTA */}
              <div className='relative z-10 flex flex-col gap-[14px]'>
                {[
                  'Co-selling alignment',
                  'Activity sync across teams',
                  'Shared Analytics'
                ].map((item, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div className='shrink-0 text-[#1B0C27]'>
                      <StarIcon />
                    </div>
                    <span className='whitespace-nowrap font-sansGeneral text-base font-medium leading-[26px] text-[#1B0C27]'>
                      {item}
                    </span>
                  </div>
                ))}
                <div className='pt-1'>
                  <LearnMoreButton />
                </div>
              </div>

              {/* Mockup frame – overflows right edge, clipped by card overflow-hidden */}
              <div className='relative mt-6 h-[300px] w-full lg:absolute lg:right-[-32px] lg:top-[24px] lg:mt-0 lg:h-[calc(100%+8px)] lg:w-[67%]'>
                <div
                  className='h-full w-full'
                  style={{
                    background: '#FCFAFB',
                    border: '1px solid rgba(239, 238, 255, 0.63)',
                    boxShadow:
                      '0px 4px 4px -1px rgba(12, 12, 13, 0.1), 0px 4px 4px -1px rgba(12, 12, 13, 0.05)',
                    borderRadius: '20px 0px 0px 20px'
                  }}
                >
                  <div
                    className='relative ml-2 mt-2 h-[calc(100%-16px)] w-[calc(100%-8px)]'
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(239, 238, 255, 0.63)',
                      boxShadow:
                        '0px 16px 32px -4px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05)',
                      borderRadius: '20px 0px 0px 20px'
                    }}
                  >
                    <Image
                      src='/assets/home/partner_scale/img_1.png'
                      alt='Joint GTM Initiatives'
                      fill
                      unoptimized
                      sizes='(max-width: 768px) 100vw, 500px'
                      className='rounded-l-[18px] object-cover object-left-top p-1'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ──── Card 2 – Access Control (5 / 12 cols) ──── */}
          <div
            className='hover-scale-smooth relative flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] lg:col-span-5 lg:h-[494px]'
            style={{ background: CARD_GRADIENT }}
          >
            {/* Heading */}
            <div className='flex flex-col gap-2 px-6 pt-6 lg:px-8 lg:pt-8'>
              <FeatureTag index='02' label='Access Control' />
              <h3 className='text-2xl font-semibold leading-8 text-[#101828]'>
                Internal Team Permission
              </h3>
              <p className='text-base leading-6 text-[#4A5565]'>
                Manage who can see which partner visibility within your internal
                team with ease.
              </p>
            </div>

            {/* CTA sits above mockup in z-order */}
            <div className='z-10 px-6 pt-3 lg:px-8'>
              <LearnMoreButton />
            </div>

            {/* Mockup – positioned right, overlapping upward */}
            <div className='relative flex-1 overflow-visible pt-5'>
              <div className='relative mx-auto h-[280px] w-[90%] lg:absolute lg:right-0 lg:top-[-28px] lg:h-[325px] lg:w-[60%]'>
                <div
                  className='h-full w-full overflow-hidden'
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow:
                      '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
                    borderRadius: '20px'
                  }}
                >
                  <div className='relative h-full w-full'>
                    <Image
                      src='/assets/home/partner_scale/img_2.png'
                      alt='Internal Team Permission'
                      fill
                      unoptimized
                      sizes='(max-width: 768px) 100vw, 380px'
                      className='object-contain object-top p-3'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ──── Card 3 – Partner Discovery (5 / 12 cols) ────
              Figma: padding 32px 0 0; Heading px 40 gap 8; radar Frame 383×383
              at left 188px top 210px (overflows bottom — clip at card edge) */}
          <div
            className='hover-scale-smooth relative isolate flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] lg:col-span-5 lg:h-[480px]'
            style={{ background: CARD_GRADIENT }}
          >
            <div className='flex flex-col gap-2 px-6 pt-8 lg:px-10'>
              <FeatureTag index='03' label='Partner Discovery' />
              <h3 className='text-2xl font-semibold leading-8 text-[#101828]'>
                Announce, Attract and Filter Partners publicly at Scale
              </h3>
              <p className='text-base leading-6 text-[#4A5565]'>
                Treat your partner program as public GTM Asset instead of a
                simple internal page.
              </p>
            </div>

            <div className='relative z-10 px-6 pt-3 lg:px-10'>
              <LearnMoreButton />
            </div>

            {/* Radar mockup: Figma ~383×383, anchored bottom-right */}
            <div className='relative z-0 mt-4 min-h-[220px] flex-1 lg:mt-2'>
              <div className='absolute inset-x-0 bottom-0 top-0 flex items-end justify-center lg:inset-x-0 lg:justify-end'>
                <div className='relative h-[min(100%,383px)] w-[min(100%,383px)] max-w-[100%] shrink-0 lg:mb-0 lg:mr-0 lg:h-[383px] lg:w-[383px] lg:translate-x-2 lg:translate-y-6'>
                  <Image
                    src='/assets/home/partner_scale/img_3.png'
                    alt='Partner Discovery'
                    fill
                    unoptimized
                    sizes='(max-width: 1024px) 100vw, 383px'
                    className='object-contain object-bottom'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ──── Card 4 – Partner LMS (7 / 12 cols) ────
              Figma: Heading px 40 gap 8; Frame 2147205405 white 766×268
              left 40 top 176, border-radius 20px */}
          <div
            className='hover-scale-smooth relative isolate flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] lg:col-span-7 lg:h-[480px]'
            style={{ background: CARD_GRADIENT }}
          >
            <div className='flex flex-col gap-2 px-6 pt-8 lg:px-10'>
              <FeatureTag index='04' label='Partner LMS' />
              <h3 className='text-2xl font-semibold leading-8 text-[#101828]'>
                Comprehensive Partner Training
              </h3>
              <p className='text-base leading-6 text-[#4A5565]'>
                Customize and track each and every detail of your Learning
                Management System (LMS)
              </p>
            </div>

            <div className='mx-6 mt-4 shrink-0 overflow-hidden rounded-[20px] bg-white lg:mx-10 lg:mt-[35px] lg:h-[268px]'>
              <div className='relative h-[200px] w-full sm:h-[220px] lg:h-full'>
                <Image
                  src='/assets/home/partner_scale/img_4.png'
                  alt='Partner Training'
                  fill
                  unoptimized
                  sizes='(max-width: 1024px) 100vw, 766px'
                  className='object-contain object-center p-3 sm:p-4 lg:object-top lg:px-6 lg:pb-4 lg:pt-5'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PartnerScaleSection
