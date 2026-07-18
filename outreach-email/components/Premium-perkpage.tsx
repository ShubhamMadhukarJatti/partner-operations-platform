'use client'

import Image from 'next/image'
import { ArrowRight, BarChart3, FileText, Mail, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'

import PremiumPerkIcon from '../../../../../../public/premium-perk.svg'

type StepProps = { onNext?: () => void }

export default function PremiumPerkPage({ onNext }: StepProps) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#F0F2F2] md:p-4 lg:h-[82vh]'>
      <div className='w-full max-w-lg rounded-lg bg-white px-2 pb-6 pt-4 md:px-10'>
        {/* Header */}
        <div className='flex items-center gap-1'>
          <Image src={PremiumPerkIcon} alt='img' height={40} width={40} />
          <h2 className='py-2 pt-3 text-[24px] font-bold text-gray-900'>
            You&rsquo;ve unlocked a{' '}
            <span className='text-primary'>Premium Perk</span>
          </h2>
        </div>

        {/* Description */}
        <p className='mt-2 px-4 text-center text-sm text-gray-600'>
          Meet your Sharkdom Email Box — a free, premium tool to power partner
          outreach, protect your privacy, and track results. Claim it now and
          start sending in minutes.
        </p>

        {/* Features list */}
        <ul className='mt-4 space-y-3 px-4 text-sm text-gray-700 md:px-6'>
          <li className='flex items-start gap-2 pb-1'>
            <ArrowRight className='mt-[2px] h-6 w-6 text-primary' />
            <span className='pt-1'>
              <strong>Sharkdom.com</strong> address for outreach
            </span>
          </li>
          <li className='flex items-start gap-2 pb-1'>
            <ArrowRight className='mt-[2px] h-6 w-6 text-primary' />
            <span className='pt-1'>
              <strong>Built-in analytics:</strong> opens, clicks, bounces,
              engagement
            </span>
          </li>
          <li className='flex items-start items-center gap-2 pb-1'>
            <ArrowRight className='mt-[2px] h-6 w-6 text-primary' />
            <span className='pt-1'>
              Ready-to-send <strong>templates</strong> that convert
            </span>
          </li>
          <li className='flex items-start gap-2 pb-1'>
            <ArrowRight className='mt-[2px] h-6 w-6 text-primary' />
            <span className='pt-1'>
              <strong>Privacy-first</strong> protection, by design
            </span>
          </li>
        </ul>

        {/* Footer text */}
        <p className='mt-4 text-center text-sm text-[#4D5C78]'>
          Why connect your existing email? Replies land in your inbox without
          exposing your personal address, keep your identity private while
          staying responsive.
        </p>

        {/* CTA button */}
        <Button
          variant='primary'
          className='mt-6 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-semibold'
          onClick={onNext}
        >
          Claim My Email Box
          <Mail className='h-5 w-5' />
        </Button>
      </div>
    </div>
  )
}
