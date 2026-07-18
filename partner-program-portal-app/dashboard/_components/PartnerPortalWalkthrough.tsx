'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePartnerSession } from '@/app/partner-program-portal-app/_components/PartnerSessionContext'

const STEPS = [
  { num: 1, label: 'Your Tier' },
  { num: 2, label: 'Submit a Lead' },
  { num: 3, label: 'Track Commission' }
] as const

type PartnerPortalWalkthroughProps = {
  open: boolean
  onDismiss: () => void
}

export function PartnerPortalWalkthrough({
  open,
  onDismiss
}: PartnerPortalWalkthroughProps) {
  const { profile } = usePartnerSession()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (open) setStep(0)
  }, [open])

  if (!open) return null

  const isLast = step === 2

  function handleSkip() {
    onDismiss()
  }

  function handlePrimary() {
    if (isLast) {
      onDismiss()
      return
    }
    setStep((s) => Math.min(s + 1, 2))
  }

  return (
    <div
      className='absolute inset-0 z-50 flex items-center justify-center bg-black/45 p-4 font-sans'
      role='dialog'
      aria-modal='true'
      aria-label='Partner portal walkthrough'
    >
      <div
        className='w-full max-w-[448px] rounded-2xl bg-white p-8 shadow-xl dark:bg-card'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-6 grid w-full grid-cols-3 gap-2'>
          {STEPS.map((s, i) => {
            const active = i === step
            return (
              <button
                key={s.num}
                type='button'
                onClick={() => setStep(i)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex h-[26px] w-full min-w-0 shrink-0 items-center justify-center gap-0.5 whitespace-nowrap rounded-full px-1 text-center text-[10px] font-bold leading-[18px] transition-colors sm:gap-1 sm:px-1.5 sm:text-[11px]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB] focus-visible:ring-offset-2',
                  active
                    ? 'bg-[#6863FB] text-white'
                    : 'border border-[#CEDCFB] bg-white text-[#6A7282] hover:bg-[#F8F9FB] dark:bg-card'
                )}
              >
                <span>{s.num}</span>
                <span>{s.label}</span>
              </button>
            )
          })}
        </div>

        {step === 0
          ? (() => {
              const isChampion = profile?.partnershipTier === 'CHAMPION_PARTNER'
              return (
                <>
                  <div className='mb-4 rounded-[14px] bg-[#F5F1FF] px-4 pb-4 pt-5'>
                    <div
                      className={cn(
                        'mb-3 inline-flex rounded-full px-2.5 py-0.5',
                        isChampion
                          ? 'bg-[rgba(245,166,35,0.2)]'
                          : 'bg-[#E5E7EB]'
                      )}
                    >
                      <span
                        className={cn(
                          'text-[11px] font-bold uppercase leading-4 tracking-[0.275px]',
                          isChampion ? 'text-[#B8860B]' : 'text-[#4A5565]'
                        )}
                      >
                        {isChampion ? 'Champion Partner' : 'Referral Partner'}
                      </span>
                    </div>
                    <p className='text-[32px] font-extrabold leading-[48px] text-[#6863FB]'>
                      {isChampion ? '15-20%' : '8-10%'}
                    </p>
                    <p className='text-xs font-normal leading-[18px] text-[#6A7282]'>
                      first year ACV
                    </p>
                  </div>
                  <p className='mb-8 text-sm font-normal leading-[21px] text-[#4A5565]'>
                    You are a{' '}
                    {isChampion ? 'Champion Partner' : 'Referral Partner'}. You
                    earn {isChampion ? '15-20%' : '8-10%'} ACV when you{' '}
                    {isChampion ? 'set up a meeting' : 'share a qualified lead'}{' '}
                    that leads to onboarding.
                  </p>
                </>
              )
            })()
          : null}

        {step === 1 ? (
          <>
            <div className='mb-4 flex h-[104px] items-center justify-center rounded-[14px] bg-[rgba(107,79,187,0.1)] px-4 pt-4'>
              <span className='text-center text-[48px] font-normal leading-[72px] text-[#0A0A0A]'>
                +
              </span>
            </div>
            <p className='mb-8 text-sm font-normal leading-[21px] text-[#4A5565]'>
              Click Submit Lead anytime you have a company in mind. Fill in what
              you know — we handle the rest.
            </p>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className='mb-4 flex h-[104px] items-center justify-center rounded-[14px] bg-[rgba(26,122,74,0.1)] px-4 pt-4'>
              <span className='text-center text-[48px] font-normal leading-[72px] text-[#0A0A0A]'>
                $
              </span>
            </div>
            <p className='mb-8 text-sm font-normal leading-[21px] text-[#4A5565]'>
              Every lead you submit is tracked here. Watch it move from
              Submitted<span className='whitespace-pre'> </span>→ Demo →
              Onboarded → Paid.
            </p>
          </>
        ) : null}

        <div className='flex flex-col gap-3 sm:h-[41px] sm:flex-row sm:items-center sm:justify-between'>
          <button
            type='button'
            onClick={handleSkip}
            className={cn(
              'text-left text-[13px] font-medium leading-[19.5px] hover:underline',
              step === 2 ? 'text-[#99A1AF]' : 'text-[#4A5565]'
            )}
          >
            Skip walkthrough
          </button>
          <Button
            type='button'
            onClick={handlePrimary}
            className='h-auto min-h-[41px] rounded-[10px] bg-[#6863FB] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6863FB]/90 sm:w-auto sm:min-w-[89px] sm:max-w-[273px] sm:shrink-0 sm:whitespace-nowrap'
          >
            {isLast ? 'Got it — Take me to my Dashboard' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
