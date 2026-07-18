'use client'

import React from 'react'
import Link from 'next/link'
import {
  Check,
  Clock,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  Zap
} from 'lucide-react'

import { Button } from '@/components/ui/button'

// Card Data
const leftCards = [
  {
    title: 'Increased Efficiency',
    description:
      'Automate tasks and reduce manual workloads by using spreadsheets',
    icon: <Check className='h-4 w-4 text-violet-600' />
  },
  {
    title: 'Scalable Solutions',
    description: 'Easily grow with the demands of your data',
    icon: <Check className='h-4 w-4 text-violet-600' />
  },
  {
    title: 'Faster Decision-Making',
    description: 'Leverage real-time insights for quicker choices',
    icon: <Check className='h-4 w-4 text-violet-600' />
  }
]

const rightCards = [
  {
    title: 'Enhanced Collaboration',
    description: 'Streamline workflows with team-friendly features',
    icon: <Check className='h-4 w-4 text-violet-600' />
  },
  {
    title: 'Data Security',
    description: 'Safeguard your data with top-tier encryption',
    icon: <Check className='h-4 w-4 text-violet-600' />
  },
  {
    title: 'Continuous Improvement',
    description: 'Let AI adapt and improve with evolving data',
    icon: <Check className='h-4 w-4 text-violet-600' />
  }
]

// Comparison Table Data
const comparisonData = [
  { feature: 'Partner Intelligence', before: false, after: true },
  { feature: 'Onboarding Time', before: false, after: true },
  { feature: 'Context', before: false, after: true },
  { feature: 'GTM Visibility', before: false, after: true },
  { feature: 'Co Selling allignment', before: false, after: true },
  {
    feature: 'Lifecycle tracking when people leave',
    before: false,
    after: true
  },
  { feature: 'Compatibility Scoring', before: false, after: true }
]

const WhyChooseSharkdom = () => {
  return (
    <section className='bg-[#F9FAFB] py-16 md:py-24'>
      <div className='container mx-auto max-w-7xl px-4'>
        {/* Header Section — Figma Frame 2147205053 */}
        <div className='mb-16 flex flex-col items-center text-center'>
          <div className='mb-6 flex justify-center'>
            <div className='inline-flex rounded-full border border-[#E2D5F3] bg-white px-3 py-1.5 font-jakarta text-xs font-semibold uppercase tracking-[0.06em] text-[#6B7280] shadow-[0px_4px_12px_rgba(0,0,0,0.06)]'>
              BENEFITS
            </div>
          </div>
          <h2 className='mb-6 font-jakarta text-4xl font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-[60px] lg:leading-[1.08]'>
            <span className='text-[#111827]'>Why choose </span>
            <span className='text-[#6366F1]'>Sharkdom?</span>
          </h2>
          <p className='mx-auto max-w-[600px] font-jakarta text-lg font-normal leading-relaxed text-[#4B5563]'>
            Traditional tools leave you guessing. Sharkdom brings clarity,
            intelligence, and automation to every partnership decision.
          </p>
        </div>

        {/* Top Section: Cards & Center Image */}
        <div className='mb-24 grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Left Column */}
          <div className='flex flex-col gap-3'>
            {leftCards.map((card, index) => (
              <FeatureCard key={index} {...card} />
            ))}
          </div>

          {/* Center Column - Video */}
          <div className='flex items-center justify-center'>
            <video
              autoPlay
              muted
              loop
              playsInline
              className='h-auto w-full max-w-[400px] rounded-3xl object-contain'
            >
              <source src='/assets/home/why_sharkdom.mp4' type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Right Column */}
          <div className='flex flex-col gap-3'>
            {rightCards.map((card, index) => (
              <FeatureCard key={index} {...card} />
            ))}
          </div>
        </div>

        {/* Bottom Section: Comparison Table */}
        <div className='hover-scale-smooth rounded-[32px] border border-[#E4E7EE] bg-white p-6 md:p-12'>
          <div className='grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-gray-100 pb-8 text-center md:grid-cols-3'>
            <div className='text-left font-semibold text-gray-400 md:hidden'>
              Feature
            </div>
            <div className='hidden md:block' />{' '}
            {/* Empty corner for alignment */}
            <div className='text-sm font-semibold text-gray-900 md:text-xl'>
              Before Sharkdom
            </div>
            <div className='text-sm font-semibold text-gray-900 md:text-xl'>
              After Sharkdom
            </div>
          </div>

          <div className='mt-8 flex flex-col gap-6 md:gap-8'>
            {comparisonData.map((row, index) => (
              <div
                key={index}
                className='grid grid-cols-[1.5fr_1fr_1fr] items-center gap-4 text-center md:grid-cols-3'
              >
                <div className='text-left text-sm font-medium text-gray-700 md:text-lg'>
                  {row.feature}
                </div>
                <div className='flex justify-center'>
                  {row.before ? <CheckIcon /> : <CrossIcon />}
                </div>
                <div className='flex justify-center'>
                  {row.after ? <CheckIcon /> : <CrossIcon />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-4 pt-12'>
          <Link href='/register'>
            <Button
              className='rounded-full border border-[#5B56E8]
             bg-[linear-gradient(245.82deg,#6863FB_2.04%,#403BC3_82.72%)] px-7 py-3
             text-base font-medium
             text-white
             shadow-[0px_4px_0px_0px_#A4A1FD]
             transition hover:translate-y-[1px]
             hover:shadow-[0px_3px_0px_0px_#A4A1FD] focus:outline-none
             focus:ring-2
             focus:ring-[#6863FB]/40 active:translate-y-[3px] active:shadow-none'
            >
              Get Started
            </Button>
          </Link>

          <Link href='/book-demo'>
            <Button
              className='flex items-center gap-2
             rounded-full border border-[#EDECEF] bg-white
             px-7 py-3 text-base
             font-medium
             text-black shadow-[0px_4px_0px_0px_#6863FB]
             transition hover:translate-y-[1px]
             hover:bg-transparent hover:shadow-[0px_3px_0px_0px_#6863FB] active:translate-y-[3px] active:shadow-none'
            >
              Book a Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Helper Components
const FeatureCard = ({
  title,
  description,
  icon
}: {
  title: string
  description: string
  icon: React.ReactNode
}) => (
  <div className='hover-scale-smooth flex h-full flex-col rounded-[20px] border border-[#E4E7EE] p-4'>
    <div
      className='mb-3 inline-flex w-fit items-center justify-center rounded-[4px] p-[6px] shadow-sm'
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0EAF6 100%)'
      }}
    >
      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-[#0F172A]'>
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement, {
              className: 'h-3 w-3 text-white'
            })
          : icon}
      </div>
    </div>
    <h3 className='mb-1 text-base font-semibold text-gray-900'>{title}</h3>
    <p className='text-sm leading-relaxed text-gray-600'>{description}</p>
  </div>
)

const CheckIcon = () => (
  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600'>
    <Check className='h-5 w-5' />
  </div>
)

const CrossIcon = () => (
  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500'>
    <X className='h-5 w-5' />
  </div>
)

export default WhyChooseSharkdom
