'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ChatLogo from '@/../public/icons/chat.icon.svg'
import Glogo from '@/../public/icons/g-logo.svg'
import HeroSectionWrapper from '@/../public/icons/HeroSectionWrapper.svg'
// 0.5 seconds
import { ArrowRight, Star, StarHalf } from 'lucide-react'

import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerPlayButton,
  VideoPlayerPosterImage
} from '@/components/ui//video-player'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { TextLoop } from '@/components/animated/text-loop'

type Tab = {
  label: string
  value: string
  image: string
}

const ALL_TABS: Tab[] = [
  {
    label: 'Partnership marketing',
    value: 'my-partners',
    image: '/assets/my-partners.svg'
  },
  {
    label: 'Partner enablement',
    value: 'customer-overlap',
    image: '/assets/customer-overlap.svg'
  },
  {
    label: 'Partner match',
    value: 'affiliate-deals',
    image: '/assets/deals-banner.svg'
  },
  {
    label: 'Discovery Engine',
    value: 'discovery-engine',
    image: '/assets/discovery-engine-1.svg'
  }
]

const SLIDE_DURATION = 3000 // 3 seconds
const TRANSITION_DURATION = 500

type StarRatingProps = {
  rating: number // e.g. 4.7
  outOf?: number // default = 5
}

function StarRating({ rating, outOf = 5 }: StarRatingProps) {
  const fullStars = Math.floor(rating) // whole number
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75 // half star logic
  const emptyStars = outOf - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className='flex items-center gap-1 text-yellow-400'>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          fill='currentColor'
          strokeWidth={0}
          className='h-8'
        />
      ))}

      {/* Half star if needed */}
      {hasHalfStar && (
        <StarHalf fill='currentColor' strokeWidth={0} className='h-8' />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          stroke='currentColor'
          fill='none'
          className='h-8'
        />
      ))}
    </div>
  )
}

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  // const slideTimer = useRef<NodeJS.Timeout>()

  const goToSlide = useCallback(
    (tab: Tab, index: number) => {
      if (isTransitioning) return

      setIsTransitioning(true)

      setTimeout(() => {
        setIsTransitioning(false)
      }, TRANSITION_DURATION)
    },
    [isTransitioning]
  )

  // Handle manual tab click
  const handleTabClick = (tab: Tab) => {
    const index = ALL_TABS.findIndex((t) => t.value === tab.value)
    goToSlide(tab, index)
  }

  return (
    <section className='relative min-h-screen w-full overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0 h-full w-full'>
        <Image
          src={HeroSectionWrapper}
          alt='Hero Background'
          fill
          priority
          className='object-cover object-center'
          quality={100}
          sizes='100vw'
        />
        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20' />
      </div>

      <div className='relative z-10 mx-auto flex flex-col items-center rounded-3xl py-4 lg:mt-[25px] lg:pt-2'>
        <div ref={containerRef}>
          <div className='relative px-2 sm:px-6 md:pt-4 lg:px-8'>
            <div className='relative z-10 flex flex-col items-center justify-center gap-2'>
              <Link href='/dashboard'>
                <div className='flex gap-2 rounded-full bg-[#EDEDFF] md:px-2 md:py-1'>
                  <p className='rounded-full bg-[#6863FB] px-4 py-[2px] text-[11px] font-normal text-white  md:text-sm'>
                    New feature
                  </p>
                  <p className='flex items-center gap-1 pr-2 text-[11px] font-normal  text-[#4D49DC] md:text-sm'>
                    Check out the team dashboard <ArrowRight size={18} />
                  </p>
                </div>
              </Link>
              <div className='relative z-10 mx-auto my-4  text-center text-3xl font-semibold tracking-tight text-[#1E1E1E] md:text-3xl lg:text-5xl xxl:text-6xl'>
                <span className='mr-2'>The Modern PRM for</span>
                <TextLoop className='text-[#6863FB]'>
                  <span>Partner Ops</span>
                  <span>Partner Onboarding</span>
                  <span>Partner Activation</span>
                </TextLoop>
                <p>Automation.</p>
              </div>
              <div className='relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                <Link href='/book-demo'>
                  <Button className='hidden items-center justify-center gap-x-2 rounded-full bg-[#6863FB] px-8 py-3 font-medium text-white sm:flex'>
                    Book Demo
                    <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='relative mt-4 flex w-[70%] items-center justify-center rounded-3xl border-4 border-[#E5E7EB]'>
          {/* Background fallback image that shows immediately */}
          <div
            className='absolute inset-0 z-0 rounded-3xl'
            style={{
              backgroundImage: 'url(/hero-image.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              aspectRatio: '16/9',
              minHeight: '300px'
            }}
          />

          <VideoPlayer
            className='relative z-10 overflow-hidden rounded-3xl'
            style={{
              width: '100%',
              aspectRatio: '16/9',
              minHeight: '300px',
              backgroundColor: 'transparent'
            }}
          >
            <VideoPlayerPlayButton className='absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 fill-white' />
            <VideoPlayerContent
              preload='auto'
              slot='media'
              src='https://storage.googleapis.com/sharkdom_resources/hero_section/promo.mp4'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <VideoPlayerPosterImage
              slot='poster'
              src='https://storage.googleapis.com/sharkdom_resources/hero_section/frame-10%20(2).png'
              placeholderSrc='/hero-image.webp'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </VideoPlayer>
          <Badge className='absolute bottom-2 left-1/2 z-20 -translate-x-1/2 bg-white text-black'>
            Time to watch: 92s
          </Badge>
        </div>
        <div className='my-10 flex  flex-row items-center gap-4 text-center text-shark-sm font-normal text-black'>
          <div className='flex flex-col items-center gap-2 pt-3'>
            <div className='relative h-12 w-8 md:h-16 md:w-12'>
              <Image
                src={Glogo}
                alt='img'
                fill
                className='object-contain' // keeps aspect ratio
              />
            </div>

            <p className='text-base font-semibold'>4.7/5</p>
            <StarRating rating={4.7} />
          </div>
          <div className='flex flex-col items-center'>
            <Image src={ChatLogo} alt='img' height={200} width={200} />
            <p className='text-base font-semibold'>4.8/5</p>
            <StarRating rating={4.7} />
          </div>
        </div>
        <MaxWidthWrapper className='max-w-full '>
          <div className='max-w-8xl mx-auto'>
            <div className='bg-white px-4 py-6 sm:px-10 lg:px-6'>
              <div className='grid grid-cols-1 items-center gap-x-4 gap-y-10 sm:grid-cols-4 lg:gap-x-6'>
                {/* Left Column */}
                <div className='flex flex-col items-center justify-center'>
                  <h3 className='text-3xl font-medium leading-tight md:text-2xl'>
                    <span className='bg-[#6863FB] bg-clip-text text-transparent'>
                      225+
                    </span>{' '}
                    happy <br /> customers.
                  </h3>
                  <p className='mt-2 max-w-xs text-sm text-gray-500 lg:text-center'>
                    discovering and enabling impactful partnerships.
                  </p>
                </div>

                {/* Stat 1 */}
                <div className='text-center'>
                  <div className='text-3xl font-medium md:text-2xl'>3X</div>
                  <div className='mt-2 text-xs uppercase tracking-wide text-gray-500'>
                    Faster partner <br /> onboarding
                  </div>
                </div>

                {/* Stat 2 */}
                <div className='text-center'>
                  <div className=' text-3xl font-medium md:text-2xl'>39%</div>
                  <div className='mt-2 text-xs uppercase tracking-wide text-gray-500'>
                    Lower churn from <br /> partner-sourced deals
                  </div>
                </div>

                {/* Stat 3 */}
                <div className='text-center'>
                  <div className='text-3xl font-medium md:text-2xl'>32K</div>
                  <div className='mt-2 text-xs uppercase tracking-wide text-gray-500'>
                    Average partner-influenced <br /> revenue lift
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>

        {/* CSS Animation for Progress Bar */}
        <style>
          {`
            @keyframes progress {
              from { width: 0; }
              to { width: 100%; }
            }

            .transition-transform {
              transition: transform ${TRANSITION_DURATION}ms ease-in-out;
            }
              @keyframes marquee {
                from {
                  transform: translateX(100%);
                }
                to {
                  transform: translateX(-100%);
                }
              }
            /* Smooth poster image loading */
            media-controller {
              min-width: 100%;
              min-height: 100%;
              display: block;
            }
            
            media-controller::part(poster) {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          `}
        </style>
      </div>
    </section>
  )
}

export default Hero
