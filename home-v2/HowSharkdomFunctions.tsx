'use client'

import React from 'react'
import { BarChart2, Handshake, RefreshCw, Search, Users } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'Automated setup & enablement'
  },
  {
    icon: Users,
    title: 'Onboarding',
    description: 'Automated setup & enablement'
  },
  {
    icon: Handshake,
    title: 'Joint Actions',
    description: 'Co-selling & campaigns'
  },
  {
    icon: BarChart2,
    title: 'Activation',
    description: 'Track metrics & revenue'
  },
  {
    icon: RefreshCw,
    title: 'Attribution',
    description: 'Continuous optimization'
  }
]

const cardPopClass =
  'rounded-2xl border border-[#E8E8F0] bg-white p-5 shadow-[0px_2px_8px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-300 ease-out motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-[0px_20px_40px_-16px_rgba(15,23,42,0.14),0px_8px_16px_-8px_rgba(99,102,241,0.12)] motion-reduce:hover:scale-100'

const HowSharkdomFunctions = () => {
  return (
    <section className='bg-[#F6F6FF] py-20'>
      <div className='container mx-auto px-4 md:px-8'>
        <div className='flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between'>
          {/* Left Content */}
          <div className='flex-1 lg:sticky lg:top-24'>
            <div className='mb-6 inline-flex rounded-full border border-[#E2D5F3] bg-white px-3 py-1.5 font-jakarta text-xs font-semibold uppercase tracking-[0.06em] text-[#6B7280] shadow-[0px_4px_12px_rgba(0,0,0,0.06)]'>
              PARTNERSHIP CONTINUITY
            </div>

            <h2 className='mb-6 font-jakarta text-4xl font-bold leading-[1.12] tracking-tight text-black md:text-5xl lg:text-[52px] lg:leading-[1.08]'>
              How <span className='text-[#6366F1]'>Sharkdom</span> functions
            </h2>

            <p className='max-w-xl font-jakarta text-lg font-normal leading-relaxed text-[#4D4D6E]'>
              Sharkdom automatically records every interaction so new team
              members instantly understand partnership history.
            </p>
          </div>

          {/* Right Content - Cards */}
          <div className='flex w-full flex-col gap-5 lg:max-w-[600px]'>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-6 ${cardPopClass}`}
              >
                <div
                  className='flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[14px] bg-[#6366F1] text-white shadow-[0px_4px_14px_-4px_rgba(99,102,241,0.65)]'
                  aria-hidden
                >
                  <step.icon size={24} strokeWidth={2} />
                </div>

                <div className='flex flex-col'>
                  <h3 className='text-base font-bold text-[#110D2C]'>
                    {step.title}
                  </h3>
                  <p className='text-sm font-normal text-[#4D4D6E]'>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowSharkdomFunctions
