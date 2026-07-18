'use client'

import { useEffect, useRef, useState } from 'react'

import { Logo } from '@/components/icons/logo'

import EmailConfirmationCard from './EmailConfirmation'
import EmailInbox from './EmailInbox'
import MailboxLinkedPage from './MailBoxLinkPage'
import PremiumPerkPage from './Premium-perkpage'

const EmailPage = ({
  isClaimed,
  isLoading,
  org
}: {
  isClaimed: boolean
  isLoading: boolean
  org: any | null
}) => {
  const [step, setStep] = useState<number>(0)

  useEffect(() => {
    if (isClaimed) {
      setStep(3)
    }
  }, [isClaimed])

  if (isLoading) {
    return (
      <div
        className='flex items-center justify-center'
        style={{ height: 'calc(100vh - 100px)' }}
      >
        <Logo className='h-10 w-auto animate-pulse' />
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      {step === 0 && !isClaimed && (
        <PremiumPerkPage
          onNext={() => {
            setStep(1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}

      {step === 1 && (
        <EmailConfirmationCard
          email={org?.name}
          onNext={() => {
            setStep(2)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}

      {step === 2 && (
        <MailboxLinkedPage
          onContinue={() => {
            setStep(3)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
      {step === 3 && <EmailInbox />}
    </div>
  )
}

export default EmailPage
