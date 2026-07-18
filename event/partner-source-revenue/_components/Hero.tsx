'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import SessionCard from '@/app/(marketing)/_components/SessionCard'

const BANNER_BG = '/assets/home/banner_bg.png'
const HERO_IMG_1 = '/events/event_hero5.png'
const HERO_IMG_2 = '/events/event_hero4.png'

const Hero = () => {
  const handleLinkClick = () => {
    const url =
      'https://www.linkedin.com/events/allaboutpartnersourcedrevenuexs7415502518715183104/theater/'
    window.open(url, '_blank')
  }

  return (
    <section className='relative flex min-h-[70vh] w-full items-center overflow-hidden pt-20'>
      {/* Background Image */}
      <div className='absolute inset-0 -z-10 h-full w-full'>
        <Image
          src={BANNER_BG}
          alt='Hero Background'
          fill
          priority
          className='object-cover object-center'
          quality={100}
        />
      </div>

      {/* Main Content */}
      <div className='mx-auto w-full max-w-6xl px-4 md:px-8'>
        <div className='flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between'>
          {/* Left Image */}
          <div className='relative w-full max-w-[500px] lg:w-[28%]'>
            <Image
              src={HERO_IMG_2}
              alt='Events Hero'
              width={600}
              height={500}
              className='h-auto w-full object-contain'
              priority
            />
          </div>

          {/* Center Content */}
          <div className='flex flex-col gap-6 lg:max-w-[44%]'>
            <h1
              className='font-semibold leading-[1.1] tracking-tight'
              style={{ fontSize: 'clamp(36px, 5vw, 54px)', color: '#101828' }}
            >
              Why Your Partnerships look successful but don’t Show Up in Revenue
              Forecasts
            </h1>
            <SessionCard
              participants={[
                { name: 'Snehanshu S.' },
                { name: 'Kyle H.' },
                { name: 'Deepak V.' }
              ]}
              date='January 15, 2026'
              time='09:00 PM - 10:00 PM IST'
              actions={[
                {
                  label: 'Register Event for FREE',
                  onClick: handleLinkClick,
                  icon: ArrowRight
                }
              ]}
            />
          </div>

          {/* Right Image */}
          <div className='relative w-full max-w-[500px] lg:w-[28%]'>
            <Image
              src={HERO_IMG_1}
              alt='Events Hero'
              width={600}
              height={500}
              className='h-auto w-full object-contain'
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
