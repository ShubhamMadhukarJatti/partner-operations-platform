'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import {
  SUBMIT_SUCCESS_SESSION_KEY,
  SUBMIT_SUCCESS_SESSION_VALUE
} from '../../_components/constants'

const STEPS = [
  'Application reviewed by Sharkdom team (48 hours)',
  'LinkedIn profile verified',
  'Approval email sent with dashboard access link',
  'Onboarding call booked (optional but recommended)'
] as const

export function PartnerApplicationSubmittedContent() {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    try {
      const marker = sessionStorage.getItem(SUBMIT_SUCCESS_SESSION_KEY)
      if (marker !== SUBMIT_SUCCESS_SESSION_VALUE) {
        router.replace('/apply-to-partner-program')
        return
      }
      setAllowed(true)
    } catch {
      router.replace('/apply-to-partner-program')
    }
  }, [router])

  if (!allowed) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#F8F9FB] font-sans text-sm text-[#6A7282]'>
        Redirecting…
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F8F9FB] font-sans'>
      <main className='mx-auto flex max-w-[512px] flex-col items-center px-4 pb-16 pt-10 sm:pt-16'>
        <div
          className='mb-8 flex size-20 shrink-0 items-center justify-center rounded-full'
          style={{ background: 'rgba(26, 122, 74, 0.1)' }}
          aria-hidden
        >
          <Check
            className='size-10 text-[#1A7A4A]'
            strokeWidth={3}
            aria-hidden
          />
        </div>

        <h1 className='mb-3 text-center text-[32px] font-extrabold leading-[48px] text-[#1A1A2E]'>
          Application Received!
        </h1>

        <p className='mb-8 max-w-[448px] text-center text-sm font-normal leading-[21px] text-[#6A7282]'>
          We review all applications within 48 hours. You&apos;ll receive an
          email with next steps.
        </p>

        <section
          className='mb-10 w-full max-w-[448px] rounded-[14px] border border-[#F3F4F6] bg-white px-6 py-6 dark:bg-card'
          aria-labelledby='what-next-heading'
        >
          <h2
            id='what-next-heading'
            className='mb-5 text-sm font-bold leading-[21px] text-[#1A1A2E]'
          >
            What happens next
          </h2>
          <ol className='flex flex-col gap-4'>
            {STEPS.map((text, i) => (
              <li key={text} className='flex gap-3'>
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full',
                    'bg-[#6863FB] text-xs font-bold leading-[18px] text-white'
                  )}
                >
                  {i + 1}
                </span>
                <p className='text-sm font-normal leading-[21px] text-[#4A5565]'>
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className='flex w-full max-w-[448px] flex-wrap items-center justify-center gap-4'>
          <Button
            type='button'
            className='h-[41px] rounded-[10px] border-0 bg-[#6863FB] px-5 text-sm font-bold text-white hover:bg-[#6863FB]/90'
            onClick={() => router.push('/set-password')}
          >
            Access Your Dashboard
          </Button>
          <Button
            asChild
            variant='outline'
            className='h-[43px] rounded-[10px] border border-[#D1D5DC] bg-white px-5 text-sm font-bold text-[#4A5565] hover:bg-[#F8F9FB] dark:bg-card'
          >
            <Link href='/'>Back to Home</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
