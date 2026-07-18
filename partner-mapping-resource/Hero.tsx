'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

// Importing pp assets from the partner-program component directory
import { pp } from '../partner-program/_components/assets'
import styles from './Hero.module.css'
import { pmAssets } from './pm-assets'

const BOOK_DEMO_CTA_LABEL = 'Start free trial'
const WATCH_TOUR_CTA_LABEL = 'Watch 2-min video'

/** Same footprint: height + corner radius for both hero CTAs */
const HERO_CTA_DIMS =
  'inline-flex h-[56px] items-center justify-center gap-2 rounded-[10px] px-8 font-jakarta text-base font-bold transition-all duration-200'

const VideoModal = ({
  isOpen,
  onClose,
  videoSrc
}: {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
}) => {
  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-5xl'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          className='absolute -top-12 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-gray-100 sm:-right-4 sm:-top-14'
          aria-label='Close video modal'
        >
          <X className='h-5 w-5' />
        </button>

        <div className='overflow-hidden rounded-[20px] bg-black shadow-2xl ring-1 ring-white/10 sm:rounded-[24px]'>
          <div className='aspect-video w-full'>
            <video
              src={videoSrc}
              controls
              autoPlay
              playsInline
              className='h-full w-full'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const Hero = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  return (
    <section className='relative isolate w-full overflow-x-clip'>
      {/*
        Figma: full-bleed jumbotron (grid + tint) from the top of the viewport, behind
        the whole fixed stack (promo + gap + white pill). The bg layer is absolutely
        positioned with a negative top so it extends into the header spacer; copy uses
        matching padding. NewHeader’s measure() sets --marketing-header-height in sync
        with the placeholder height.
      */}
      <div
        aria-hidden
        className='pointer-events-none absolute bottom-0 left-0 right-0 z-0 overflow-hidden rounded-b-xl'
        style={{
          // Pull up to y=0 so the pattern is visible under the bar and in the space above the pill
          top: 'calc(-1 * var(--marketing-header-height, 140px))'
        }}
      >
        <div
          className='absolute inset-0'
          style={{
            background:
              'linear-gradient(180deg, rgba(104, 99, 251, 0.16) 0%, rgba(104, 99, 251, 0) 100%)'
          }}
        />
        <div className='absolute inset-0 overflow-hidden rounded-b-xl'>
          <Image
            src={pp.pattern}
            alt=''
            fill
            className='object-cover object-top opacity-90'
            priority
            sizes='100vw'
          />
        </div>
      </div>

      <div
        className='relative z-10'
        style={{
          // Tighter to nav (Figma); min keeps copy clear of the fixed bar
          paddingTop:
            'max(0.5rem, calc(var(--marketing-header-height, 140px) - 1.75rem))'
        }}
      >
        <MaxWidthWrapper className='px-4 pb-16 pt-0 sm:px-6 sm:pb-24 lg:pb-32'>
          <div className='flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16'>
            {/* Left Content */}
            <div className='flex flex-1 flex-col items-center text-center lg:items-start lg:text-left'>
              <h1 className='mb-5 text-balance text-4xl font-bold leading-[1.1] text-[#2a3241] sm:mb-6 sm:text-6xl sm:leading-[1.05] md:text-7xl md:leading-[1.02]'>
                Don&apos;t treat partnerships as your{' '}
                <span className='text-[#5b76ff]'>Side Hustle</span>
              </h1>
              <p className='mb-10 max-w-4xl text-pretty text-xl font-medium leading-relaxed tracking-tight text-[#4a5565] sm:mb-12 sm:max-w-5xl sm:text-2xl sm:leading-[1.45]'>
                Companies worldwide are unlocking up to 30% more revenue through
                partnerships. With the right data, you can too, no guesswork, no
                blind spots just measurable impact.
              </p>

              <div className='relative z-30 mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start sm:gap-5'>
                {/* Book Demo CTA */}
                <Link
                  href='/book-demo'
                  className={cn(
                    HERO_CTA_DIMS,
                    'relative z-10 border border-[#1f2633] bg-[#2A3241] text-white',
                    'shadow-[0px_4px_0px_0px_#7688A8]',
                    'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0px_6px_0px_0px_#7688A8]',
                    'active:translate-y-[2px] active:shadow-none',
                    'w-full sm:w-auto'
                  )}
                >
                  <span className='whitespace-nowrap'>
                    {BOOK_DEMO_CTA_LABEL}
                  </span>
                  <ArrowRight
                    className='size-5 shrink-0'
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </Link>

                {/* Watch Tour CTA */}
                <button
                  type='button'
                  onClick={() => setIsVideoModalOpen(true)}
                  className={cn(
                    HERO_CTA_DIMS,
                    'relative z-10 border border-[#2A3241] bg-white text-[#2A3241]',
                    'shadow-[0px_4px_0px_0px_#6863FB]',
                    'hover:-translate-y-1 hover:scale-[1.02] hover:bg-transparent hover:shadow-[0px_6px_0px_0px_#6863FB]',
                    'active:translate-y-[2px] active:shadow-none',
                    'w-full sm:w-auto'
                  )}
                >
                  <span
                    className='flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#EAEDFF]'
                    aria-hidden
                  >
                    <Play className='ml-0.5 size-2.5 fill-[#2A3241]' />
                  </span>
                  <span className='whitespace-nowrap'>
                    {WATCH_TOUR_CTA_LABEL}
                  </span>
                </button>
              </div>

              <div className='flex flex-wrap items-center justify-center gap-6 sm:gap-9 lg:justify-start'>
                <div className='flex items-center gap-2.5'>
                  <p className='whitespace-nowrap text-left text-lg font-medium leading-snug text-[#4a5565]'>
                    Trusted by <span className='text-[#2a3241]'>420+</span>{' '}
                    partnership teams
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className='relative flex flex-1 items-center justify-center lg:justify-end'>
              <div className='relative h-[400px] w-full max-w-[500px] sm:h-[500px] lg:h-[600px]'>
                {/* Main Table View */}
                <div className='absolute left-0 top-12 z-10 w-[145%] overflow-hidden'>
                  <Image
                    src={pmAssets.img2}
                    alt='UI Preview'
                    className='h-auto w-full'
                  />
                </div>

                {/* Floating Chart (Top Right) */}
                <div
                  className={cn(
                    'absolute -right-44 top-0 z-20 w-[45%] overflow-hidden rounded-xl bg-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] ring-1 ring-black/5',
                    styles.float
                  )}
                >
                  <Image
                    src={pmAssets.ig1}
                    alt='Chart'
                    className='h-auto w-full'
                  />
                </div>

                {/* Floating UI Block (Bottom Left) */}
                <div
                  className={cn(
                    'absolute -left-20 bottom-16 z-20 w-[42%] overflow-hidden rounded-xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:bottom-20 lg:bottom-24',
                    styles.floatDelayed
                  )}
                >
                  <Image
                    src={pmAssets.img4}
                    alt='UI Element'
                    className='h-auto w-full'
                  />
                </div>

                {/* Small Pill/Badge (Bottom Right) - Overlapping img2 */}
                <div className='-translate-x-15 absolute bottom-28 right-0 z-30 w-[55%] overflow-hidden rounded-xl'>
                  <Image
                    src={pmAssets.img3}
                    alt='Status'
                    className='h-auto w-full'
                  />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc='https://storage.googleapis.com/sharkdom_resources/hero_section/promo.mp4'
      />
    </section>
  )
}

export default Hero
