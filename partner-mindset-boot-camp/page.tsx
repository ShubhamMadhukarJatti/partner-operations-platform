'use client'

import React, { useEffect, useState } from 'react'
import { Bebas_Neue } from 'next/font/google'
import Image from 'next/image'
import { Check, Clock, Globe, Linkedin, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
// Dialog imports from UI component library
import {
  Dialog as UIDialog,
  DialogContent as UIDialogContent,
  DialogDescription as UIDialogDescription,
  DialogHeader as UIDialogHeader,
  DialogTitle as UIDialogTitle
} from '@/components/ui/dialog'

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], display: 'swap' })

interface AnimatedCounterProps {
  from?: number
  target: number
  duration?: number
  prefix?: string
  suffix?: string
}

function AnimatedCounter({
  from = 0,
  target,
  duration = 1500,
  prefix = '',
  suffix = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const currentVal = from + Math.floor(progress * (target - from))
      setCount(currentVal)
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [from, target, duration])

  return (
    <>
      {prefix}
      {count}
      {suffix}
    </>
  )
}

const CustomUsersIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <circle cx='8.25' cy='9.5' r='2.5' />
    <circle cx='15.75' cy='9.5' r='2.5' />
    <path d='M 4.5 17.5 c 0 -3.5, 7 -3.5, 7.5 0 c 0.5 -3.5, 7.5 -3.5, 7.5 0' />
  </svg>
)

export default function PartnerMindsetBootCamp() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    linkedin: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        linkedin: '',
        message: ''
      })
    }, 1500)
  }

  const scrollToCurriculum = () => {
    const element = document.getElementById('curriculum-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      className='min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white'
      style={{
        marginTop: 'calc(-1 * var(--marketing-header-height, 140px))'
      }}
    >
      {/* Hero Section */}
      <section
        className='relative overflow-hidden border-b border-indigo-100/50 pb-20 md:pb-28'
        style={{
          background:
            'linear-gradient(90deg, rgba(185, 207, 255, 0.56) 0%, rgba(222, 176, 255, 0.56) 100%)',
          paddingTop:
            'max(6rem, calc(var(--marketing-header-height, 140px) + 2.5rem))'
        }}
      >
        {/* Glow decoration */}
        <div className='pointer-events-none absolute left-[5%] top-[-10%] -z-10 h-[40rem] w-[40rem] rounded-full bg-indigo-200/40 blur-3xl' />
        <div className='pointer-events-none absolute bottom-[-10%] right-[5%] -z-10 h-[45rem] w-[45rem] rounded-full bg-purple-200/35 blur-3xl' />

        <div className='relative z-10 mx-auto max-w-6xl px-6 text-center'>
          {/* Pill Badge */}
          <div
            className='mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-indigo-200/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 md:text-sm'
            style={{
              background:
                'linear-gradient(90deg, rgba(185, 207, 255, 0.23) 0%, rgba(222, 176, 255, 0.23) 100%)'
            }}
          >
            <span className='h-2 w-2 animate-pulse rounded-full bg-indigo-600' />
            Sharkdom Exclusive Program
          </div>

          {/* Heading */}
          <h1 className='mx-auto mb-6 max-w-5xl text-4xl font-extrabold leading-[1.15] tracking-tight md:text-6xl lg:text-[72px]'>
            <span className='block text-[#41404C] md:whitespace-nowrap'>
              Build a Partner Program That
            </span>
            <span className='block text-[#6863FB]'>
              Actually Drives Revenue
            </span>
          </h1>

          {/* Subheading */}
          <p className='mx-auto mb-10 max-w-3xl text-lg font-normal leading-relaxed text-slate-600 md:text-xl lg:text-2xl'>
            A 4-week live boot camp for partnership managers. Exclusive
            scholarship seats available for Sharkdom customers.
          </p>

          {/* CTAs */}
          <div className='mx-auto flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button className='h-14 w-full rounded-xl bg-[#2A3241] px-8 text-base font-bold text-white shadow-[0_4px_0_0_#7688A8] transition-all duration-150 hover:bg-[#323b4e] active:translate-y-[2px] active:shadow-[0_2px_0_0_#7688A8] sm:w-auto'>
              Claim Scholarship Now
            </Button>
            <Button
              onClick={scrollToCurriculum}
              variant='outline'
              className='h-14 w-full rounded-xl border-2 border-[#2A3241] bg-white px-8 text-base font-bold text-[#2A3241] shadow-[0_4px_0_0_#2A3241] transition-all duration-150 hover:bg-slate-50 hover:text-[#2A3241] active:translate-y-[2px] active:shadow-[0_2px_0_0_#2A3241] sm:w-auto'
            >
              See What&apos;s Covered
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights Banner */}
      <section className='relative overflow-hidden bg-[#EDE9FF] py-12'>
        <div className='relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 divide-y divide-[#D8D4FD] px-6 text-center md:grid-cols-3 md:gap-4 md:divide-x md:divide-y-0'>
          <div className='flex flex-col items-center justify-center pt-6 md:pt-0'>
            <div className='mb-2 text-4xl font-extrabold text-[#7B6CF6] md:text-5xl'>
              <AnimatedCounter target={500} suffix='+' />
            </div>
            <div className='text-sm font-semibold uppercase tracking-wider text-[#4A4070] md:text-base'>
              Partner Managers Trained
            </div>
          </div>
          <div className='flex flex-col items-center justify-center pt-6 md:pt-0'>
            <div className='mb-2 text-4xl font-extrabold text-[#7B6CF6] md:text-5xl'>
              <AnimatedCounter target={91} suffix='%' />
            </div>
            <div className='text-sm font-semibold uppercase tracking-wider text-[#4A4070] md:text-base'>
              Report Faster Program Launch
            </div>
          </div>
          <div className='flex flex-col items-center justify-center pt-6 md:pt-0'>
            <div className='mb-2 text-4xl font-extrabold text-[#7B6CF6] md:text-5xl'>
              <AnimatedCounter from={100} target={1} prefix='#' />
            </div>
            <div className='text-sm font-semibold uppercase tracking-wider text-[#4A4070] md:text-base'>
              Highest-Rated Instructor
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className='border-b border-slate-100 bg-white py-20 md:py-28'>
        <div className='mx-auto max-w-6xl px-6'>
          <div className='mx-auto mb-16 max-w-none text-center'>
            <span className='mb-3 block text-xs font-bold uppercase tracking-widest text-indigo-600 md:text-sm'>
              Is This For You?
            </span>
            <h2 className='text-xl font-bold tracking-tight text-slate-950 md:text-2xl lg:whitespace-nowrap lg:text-[28px] xl:text-[32px]'>
              This boot camp is built for partnership managers who are serious
              about results
            </h2>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
            {/* Card 1: Starting Fresh */}
            <div className='flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:shadow-md md:p-10'>
              <div>
                <span className='mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 md:text-xs'>
                  Starting Fresh
                </span>
                <h3 className='mb-6 text-xl font-bold text-slate-950 md:text-2xl'>
                  You&apos;re starting from scratch
                </h3>
                <ul className='space-y-4'>
                  <li className='flex items-start gap-3'>
                    <div className='mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600'>
                      <Check className='size-3.5 stroke-[3]' />
                    </div>
                    <span className='text-sm text-slate-600 md:text-base'>
                      Your company has no partner program yet
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <div className='mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600'>
                      <Check className='size-3.5 stroke-[3]' />
                    </div>
                    <span className='text-sm text-slate-600 md:text-base'>
                      Your SDRs are outmatching last prospects; zero% converting
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <div className='mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600'>
                      <Check className='size-3.5 stroke-[3]' />
                    </div>
                    <span className='text-sm text-slate-600 md:text-base'>
                      You need a framework — not just a tool
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Scaling Up */}
            <div className='flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:shadow-md md:p-10'>
              <div>
                <span className='mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 md:text-xs'>
                  Scaling Up
                </span>
                <h3 className='mb-6 text-xl font-bold text-slate-950 md:text-2xl'>
                  You have a program but it&apos;s not scaling
                </h3>
                <ul className='space-y-4'>
                  <li className='flex items-start gap-3'>
                    <div className='mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600'>
                      <Check className='size-3.5 stroke-[3]' />
                    </div>
                    <span className='text-sm text-slate-600 md:text-base'>
                      You have 2-3 partner managers but no structured training
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <div className='mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600'>
                      <Check className='size-3.5 stroke-[3]' />
                    </div>
                    <span className='text-sm text-slate-600 md:text-base'>
                      Co-sell is happening over WhatsApp
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <div className='mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600'>
                      <Check className='size-3.5 stroke-[3]' />
                    </div>
                    <span className='text-sm text-slate-600 md:text-base'>
                      Your PRM has low adoption
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section
        id='curriculum-section'
        className='scroll-mt-20 border-b border-slate-100 bg-slate-50 py-20 md:py-28'
      >
        <div className='mx-auto max-w-7xl px-6 md:px-8'>
          <div className='mx-auto mb-12 flex max-w-3xl flex-col items-center text-center'>
            <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-sm'>
              <span className='h-1.5 w-1.5 rounded-full bg-indigo-600' />
              Curriculum
            </div>
            <h2 className='mb-4 text-3xl font-extrabold tracking-tight text-slate-950 md:text-5xl'>
              4 <span className='text-indigo-600'>Weeks</span>. 4{' '}
              <span className='text-indigo-600'>Transformations</span>.
            </h2>
            <p className='max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base'>
              Each live session builds on the last — from strategic foundation
              to revenue measurement.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10'>
            {/* Card 1 */}
            <div className='flex min-h-[280px] flex-col justify-between rounded-[24px] border border-indigo-100 bg-white p-8 shadow-[0_8px_30px_rgba(224,231,255,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(165,180,252,0.5)] md:p-10'>
              <div>
                <span className='mb-4 block font-mono text-xs font-semibold tracking-wider text-slate-400'>
                  01
                </span>
                <div className='mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
                  <Clock className='size-6 stroke-[2]' />
                </div>
                <h3 className='mb-3 text-lg font-bold tracking-tight text-slate-950 md:text-xl lg:whitespace-nowrap'>
                  Partner Program Foundations & ICP Alignment
                </h3>
                <p className='text-sm leading-relaxed text-slate-600 md:text-base'>
                  Define your ideal partner profile, map partner personas to
                  customer segments, and build the strategic foundation your
                  program needs to grow.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className='flex min-h-[280px] flex-col justify-between rounded-[24px] border border-indigo-100 bg-white p-8 shadow-[0_8px_30px_rgba(224,231,255,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(165,180,252,0.5)] md:p-10'>
              <div>
                <span className='mb-4 block font-mono text-xs font-semibold tracking-wider text-slate-400'>
                  02
                </span>
                <div className='mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
                  <CustomUsersIcon className='size-6 stroke-[2]' />
                </div>
                <h3 className='mb-3 text-lg font-bold tracking-tight text-slate-950 md:text-xl lg:whitespace-nowrap'>
                  Program Design, Tiers & Incentive Structures
                </h3>
                <p className='text-sm leading-relaxed text-slate-600 md:text-base'>
                  Create compelling partner tiers, design benefits that actually
                  motivate, and build a tiering model that scales without
                  complexity.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className='flex min-h-[280px] flex-col justify-between rounded-[24px] border border-indigo-100 bg-white p-8 shadow-[0_8px_30px_rgba(224,231,255,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(165,180,252,0.5)] md:p-10'>
              <div>
                <span className='mb-4 block font-mono text-xs font-semibold tracking-wider text-slate-400'>
                  03
                </span>
                <div className='mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
                  <Clock className='size-6 stroke-[2]' />
                </div>
                <h3 className='mb-3 text-lg font-bold tracking-tight text-slate-950 md:text-xl lg:whitespace-nowrap'>
                  Key program components
                </h3>
                <p className='text-sm leading-relaxed text-slate-600 md:text-base'>
                  covers program components i.e. requirements, benefits,
                  incentives, governance and operational dependencies.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className='flex min-h-[280px] flex-col justify-between rounded-[24px] border border-indigo-100 bg-white p-8 shadow-[0_8px_30px_rgba(224,231,255,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(165,180,252,0.5)] md:p-10'>
              <div>
                <span className='mb-4 block font-mono text-xs font-semibold tracking-wider text-slate-400'>
                  04
                </span>
                <div className='mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
                  <CustomUsersIcon className='size-6 stroke-[2]' />
                </div>
                <h3 className='mb-3 text-lg font-bold tracking-tight text-slate-950 md:text-xl lg:whitespace-nowrap'>
                  Activation
                </h3>
                <p className='text-sm leading-relaxed text-slate-600 md:text-base'>
                  launch planning (owners, timelines, systems, and readiness)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className='border-b border-slate-100 bg-[#F4F6FC] py-24 md:py-32'>
        <div className='mx-auto max-w-6xl px-6'>
          <div className='mx-auto mb-20 flex max-w-4xl flex-col items-center text-center'>
            <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm'>
              <span className='size-1.5 rounded-full bg-indigo-600' />
              Your Instructors
            </span>
            <h2 className='mb-4 tracking-tight'>
              <span className='block text-4xl font-bold leading-tight text-slate-950 md:text-6xl'>
                Meet the <span className='text-indigo-600'>Practitioners</span>
              </span>
              <span className='mt-2 block text-3xl font-bold leading-tight text-slate-900 md:text-5xl'>
                Behind the Program
              </span>
            </h2>
            <p className='mx-auto max-w-4xl text-lg text-slate-600 md:text-xl'>
              Not theorists. Operators who&apos;ve built and scaled programs at
              the world&apos;s leading
              <br className='hidden md:block' /> companies.
            </p>
          </div>

          <div className='mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-8 pt-16 md:grid-cols-2 md:gap-10'>
            {/* Instructor 1 (Pablo Hanono) */}
            <div className='relative flex flex-col rounded-[32px] border border-[#E2E4EB] bg-white p-8 pt-20 shadow-[0_8px_30px_rgba(224,231,255,0.7)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_16px_36px_rgba(165,180,252,0.4)] md:p-10 md:pt-24'>
              {/* Orbital Avatar Container */}
              <div className='absolute -top-12 left-1/2 flex size-32 -translate-x-1/2 items-center justify-center'>
                {/* Outer concentric ring */}
                <div className='absolute size-[106px] rounded-full border border-[#736EFF]' />
                {/* Inner concentric ring */}
                <div className='absolute size-[98px] rounded-full border border-[#ABA9FE]' />
                {/* Avatar Image */}
                <div className='relative size-24 rounded-full border-4 border-white bg-[#CAC9FE] shadow-md'>
                  {/* Clipped image (shoulders) */}
                  <div className='absolute inset-0 overflow-hidden rounded-full'>
                    <Image
                      src='/images/pablo.png'
                      alt='Pablo Hanono'
                      fill
                      className='origin-bottom scale-[1.15] object-cover object-top'
                      sizes='96px'
                      priority
                    />
                  </div>
                  {/* Pop-out image (head) */}
                  <div
                    className='absolute inset-0'
                    style={{ clipPath: 'inset(-100% -100% 30% -100%)' }}
                  >
                    <Image
                      src='/images/pablo.png'
                      alt='Pablo Hanono'
                      fill
                      className='origin-bottom scale-[1.15] object-cover object-top'
                      sizes='96px'
                      priority
                    />
                  </div>
                </div>
              </div>

              <span className='mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                Senior Partner Leader &<br className='hidden md:block' />{' '}
                Educator
              </span>
              <h3
                className={`mb-6 text-[38px] font-normal uppercase leading-[38px] tracking-[-0.98px] text-slate-950 lg:text-[49px] lg:leading-[48.96px] ${bebas.className}`}
              >
                Pablo Hanono
              </h3>

              <ul className='space-y-3.5 text-left font-geist'>
                <li className='flex items-start gap-3'>
                  <Check className='mt-0.5 size-4 shrink-0 text-emerald-500' />
                  <span className='text-xs font-medium leading-relaxed text-slate-600 md:text-sm'>
                    10+ years running partner programs at Oracle and Pega
                    Systems.
                  </span>
                </li>
                <li className='flex items-start gap-3'>
                  <Check className='mt-0.5 size-4 shrink-0 text-emerald-500' />
                  <span className='text-xs font-medium leading-relaxed text-slate-600 md:text-sm'>
                    Creator of Books of the Channel.
                  </span>
                </li>
                <li className='flex items-start gap-3'>
                  <Check className='mt-0.5 size-4 shrink-0 text-emerald-500' />
                  <span className='text-xs font-medium leading-relaxed text-slate-600 md:text-sm'>
                    Highest MPS-rated instructor at Partnership Mastermind.
                  </span>
                </li>
              </ul>
            </div>

            {/* Instructor 2 (Chris Lavoie) */}
            <div className='relative flex flex-col rounded-[32px] border border-[#6863FB] bg-gradient-to-b from-[#6C7FF2] to-[#B185FA] p-8 pt-20 text-white shadow-[0_8px_30px_rgba(165,180,252,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_16px_36px_rgba(165,180,252,0.4)] md:p-10 md:pt-24'>
              {/* Orbital Avatar Container */}
              <div className='absolute -top-12 left-1/2 flex size-32 -translate-x-1/2 items-center justify-center'>
                {/* Outer concentric ring */}
                <div className='absolute size-[106px] rounded-full border border-[#736EFF]' />
                {/* Inner concentric ring */}
                <div className='absolute size-[98px] rounded-full border border-[#ABA9FE]' />
                {/* Avatar Image */}
                <div className='relative size-24 rounded-full border-4 border-white bg-[#CAC9FE] shadow-md'>
                  {/* Clipped image (shoulders) */}
                  <div className='absolute inset-0 overflow-hidden rounded-full'>
                    <Image
                      src='/images/chris.png'
                      alt='Chris Lavoie'
                      fill
                      className='origin-bottom scale-[1.15] object-cover object-top'
                      sizes='96px'
                      priority
                    />
                  </div>
                  {/* Pop-out image (head) */}
                  <div
                    className='absolute inset-0'
                    style={{ clipPath: 'inset(-100% -100% 30% -100%)' }}
                  >
                    <Image
                      src='/images/chris.png'
                      alt='Chris Lavoie'
                      fill
                      className='origin-bottom scale-[1.15] object-cover object-top'
                      sizes='96px'
                      priority
                    />
                  </div>
                </div>
              </div>

              <span className='mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white/70'>
                Founder, Partnership Mastermind
              </span>
              <h3
                className={`mb-6 text-[38px] font-normal uppercase leading-[38px] tracking-[-0.98px] text-white lg:text-[49px] lg:leading-[48.96px] ${bebas.className}`}
              >
                Chris Lavoie
              </h3>

              <ul className='space-y-3.5 text-left font-geist'>
                <li className='flex items-start gap-3'>
                  <Check className='mt-0.5 size-4 shrink-0 text-white' />
                  <span className='text-xs font-medium leading-relaxed text-white/90 md:text-sm'>
                    Built the Partnership Operator Network with 200+ fractional
                    partner experts.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section
        className='border-b border-indigo-50 py-20 md:py-28'
        style={{
          background:
            'linear-gradient(90deg, rgba(185, 207, 255, 0.23) 0%, rgba(222, 176, 255, 0.23) 100%)'
        }}
      >
        <div className='mx-auto max-w-5xl px-6'>
          <div className='mx-auto mb-16 max-w-3xl text-center'>
            <span className='mb-3 block text-xs font-bold uppercase tracking-widest text-indigo-600 md:text-sm'>
              Sharkdom Exclusive
            </span>
            <h2 className='mb-4 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl'>
              What Sharkdom Customers Get
            </h2>
            <p className='text-sm text-slate-600 md:text-base'>
              Perks negotiated specifically for the Sharkdom community — not
              available to general applicants.
            </p>
          </div>

          <div className='mx-auto flex max-w-4xl flex-col gap-6'>
            {/* Card 1 */}
            <div className='flex items-center gap-6 rounded-2xl border border-slate-100/50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-indigo-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:p-8'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#6863FB] text-white shadow-sm md:size-12'>
                <Check className='size-5 stroke-[3.5] md:size-6' />
              </div>
              <div>
                <h4 className='text-base font-bold text-slate-950 md:text-lg'>
                  Exclusive scholarship pricing
                </h4>
                <p className='mt-1 text-sm leading-relaxed text-slate-500 md:text-base'>
                  Significantly reduced tuition available only to Sharkdom
                  customers — not listed publicly.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className='flex items-center gap-6 rounded-2xl border border-slate-100/50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-indigo-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:p-8'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#6863FB] text-white shadow-sm md:size-12'>
                <Check className='size-5 stroke-[3.5] md:size-6' />
              </div>
              <div>
                <h4 className='text-base font-bold text-slate-950 md:text-lg'>
                  Sharkdom co-branded certificate on completion
                </h4>
                <p className='mt-1 text-sm leading-relaxed text-slate-500 md:text-base'>
                  A joint certificate from Sharkdom and Partnership Mastermind
                  to add to your LinkedIn profile.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className='flex items-center gap-6 rounded-2xl border border-slate-100/50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-indigo-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:p-8'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#6863FB] text-white shadow-sm md:size-12'>
                <Check className='size-5 stroke-[3.5] md:size-6' />
              </div>
              <div>
                <h4 className='text-base font-bold text-slate-950 md:text-lg'>
                  Private 45-min AMA with Pablo and Chris
                </h4>
                <p className='mt-1 text-sm leading-relaxed text-slate-500 md:text-base'>
                  Ask anything about your specific partner program. Direct
                  access to both instructors, reserved for this cohort.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className='flex items-center gap-6 rounded-2xl border border-slate-100/50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-indigo-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:p-8'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#6863FB] text-white shadow-sm md:size-12'>
                <Check className='size-5 stroke-[3.5] md:size-6' />
              </div>
              <div>
                <h4 className='text-base font-bold text-slate-950 md:text-lg'>
                  Priority cohort placement
                </h4>
                <p className='mt-1 text-sm leading-relaxed text-slate-500 md:text-base'>
                  First pick of available US and UK timezone slots — secured
                  before public registration opens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cohort Details Banner */}
      <section
        className='relative overflow-hidden border-b border-t border-[#D8D4FD] py-12'
        style={{
          background: 'linear-gradient(109deg, #DFE4FF 0%, #ECECFF 100%)'
        }}
      >
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(123,108,246,0.05),transparent_50%)]' />
        <div className='relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3 md:gap-4'>
          <div className='flex flex-col items-center text-center'>
            <div className='mb-4 flex size-12 items-center justify-center rounded-xl border border-indigo-200/40 bg-white/70 text-[#7B6CF6] shadow-sm'>
              <Clock className='size-6' />
            </div>
            <span className='mb-1 text-xs font-semibold uppercase tracking-wider text-[#4A4070]'>
              Format
            </span>
            <span className='text-lg font-bold text-[#41404C]'>
              Live, 4 × 90-min sessions
            </span>
          </div>

          <div className='flex flex-col items-center text-center'>
            <div className='mb-4 flex size-12 items-center justify-center rounded-xl border border-indigo-200/40 bg-white/70 text-[#7B6CF6] shadow-sm'>
              <Users className='size-6' />
            </div>
            <span className='mb-1 text-xs font-semibold uppercase tracking-wider text-[#4A4070]'>
              Cohort Size
            </span>
            <span className='text-lg font-bold text-[#41404C]'>
              Max 10 participants
            </span>
          </div>

          <div className='flex flex-col items-center text-center'>
            <div className='mb-4 flex size-12 items-center justify-center rounded-xl border border-indigo-200/40 bg-white/70 text-[#7B6CF6] shadow-sm'>
              <Globe className='size-6' />
            </div>
            <span className='mb-1 text-xs font-semibold uppercase tracking-wider text-[#4A4070]'>
              Regions
            </span>
            <span className='text-lg font-bold text-[#41404C]'>
              US and UK timezones
            </span>
          </div>
        </div>
      </section>

      {/* CTA Bottom Section (Temporarily hidden for client clearance) */}
      {/*
      <section
        className='relative overflow-hidden border-t border-indigo-100/50 py-24 md:py-32'
        style={{
          background: 'linear-gradient(109deg, #DFE4FF 0%, #ECECFF 100%)'
        }}
      >
        <div className='pointer-events-none absolute right-[10%] top-[10%] h-[35rem] w-[35rem] rounded-full bg-indigo-300/10 blur-3xl' />
        <div className='pointer-events-none absolute bottom-[-10%] left-[5%] h-[35rem] w-[35rem] rounded-full bg-purple-300/10 blur-3xl' />
        
        <div className='pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7B6CF6]/15 blur-[100px]' />

        <div className='pointer-events-none absolute left-10 top-10 size-20 rounded-full border-2 border-indigo-200/30' />
        <div className='pointer-events-none absolute bottom-10 right-10 size-20 rounded-2xl border-2 border-indigo-200/30' />

        <div className='relative z-10 mx-auto max-w-4xl px-6 text-center'>
          <span className='mb-4 block text-xs font-bold uppercase tracking-widest text-[#6863FB] md:text-sm'>
            Limited Availability
          </span>
          <h2 className='mb-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-[#41404C] md:text-5xl lg:text-6xl'>
            Seats fill fast. Claim your Sharkdom scholarship now.
          </h2>
          <p className='mx-auto mb-10 max-w-2xl text-base leading-relaxed text-[#4A4070] md:text-lg'>
            DM us on LinkedIn or fill the form below. Our team will confirm your
            spot within 24 hours.
          </p>

          <Button
            onClick={() => setIsModalOpen(true)}
            className='h-14 rounded-xl px-8 text-base font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]'
            style={{
              backgroundColor: '#7B6CF6',
              boxShadow: '0 12px 40px 0 rgba(123, 108, 246, 0.50)'
            }}
          >
            Apply for Your Scholarship Seat
          </Button>

          <div className='mt-8 text-xs text-[#4A4070]/70'>
            Powered by Sharkdom × Partnership Mastermind
          </div>
        </div>
      </section>
      */}

      {/* Interactive Scholarship Modal (Temporarily commented out) */}
      {/*
      <UIDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <UIDialogContent className='w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl'>
          <UIDialogHeader>
            <UIDialogTitle className='text-2xl font-bold tracking-tight text-slate-950'>
              Apply for Scholarship Seat
            </UIDialogTitle>
            <UIDialogDescription className='text-sm text-slate-500'>
              Submit your details to secure a co-branded scholarship slot. Our
              team will review and confirm within 24 hours.
            </UIDialogDescription>
          </UIDialogHeader>

          {submitted ? (
            <div className='flex animate-fade-in flex-col items-center justify-center py-8 text-center'>
              <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
                <Check className='size-6 stroke-[3]' />
              </div>
              <h3 className='mb-2 text-lg font-bold text-slate-900'>
                Application Submitted!
              </h3>
              <p className='mx-auto max-w-xs text-sm text-slate-500'>
                Thank you! We will reach out to you via email within the next 24
                hours to confirm your spot.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setIsModalOpen(false)
                }}
                className='mt-6 bg-slate-900 text-white hover:bg-slate-800'
              >
                Close Window
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
              <div>
                <label
                  className='mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700'
                  htmlFor='name'
                >
                  Full Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                  placeholder='John Doe'
                />
              </div>

              <div>
                <label
                  className='mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700'
                  htmlFor='email'
                >
                  Work Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                  placeholder='john@company.com'
                />
              </div>

              <div>
                <label
                  className='mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700'
                  htmlFor='company'
                >
                  Company Name
                </label>
                <input
                  type='text'
                  id='company'
                  name='company'
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                  placeholder='Acme Inc.'
                />
              </div>

              <div>
                <label
                  className='mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700'
                  htmlFor='linkedin'
                >
                  LinkedIn Profile URL
                </label>
                <input
                  type='url'
                  id='linkedin'
                  name='linkedin'
                  required
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                  placeholder='https://linkedin.com/in/username'
                />
              </div>

              <div>
                <label
                  className='mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700'
                  htmlFor='message'
                >
                  Brief Message (Optional)
                </label>
                <textarea
                  id='message'
                  name='message'
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  className='w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                  placeholder='Anything specific you hope to learn or accomplish?'
                />
              </div>

              <Button
                type='submit'
                loading={isSubmitting}
                loadingText='Submitting Application...'
                className='mt-6 h-11 w-full rounded-xl bg-[#2A3241] font-bold text-white shadow-[0_4px_0_0_#7688A8] transition-all duration-150 hover:bg-[#323b4e] active:translate-y-[2px] active:shadow-[0_2px_0_0_#7688A8]'
              >
                Submit Application
              </Button>
            </form>
          )}
        </UIDialogContent>
      </UIDialog>
      */}
    </div>
  )
}
