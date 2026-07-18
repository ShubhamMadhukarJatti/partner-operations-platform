'use client'

import { useRouter } from 'next/navigation'

import { SubscriptionPage } from '@/components/subscription'

export default function SubscriptionDemoPage() {
  const router = useRouter()

  const handleBackClick = () => {
    // Navigate back to the subscription billing page
    router.push('/subscription-billing-demo')
  }

  return (
    <SubscriptionPage
      onBackClick={handleBackClick}
      onContinue={(
        _items: any,
        _cycle: string,
        _mods: string[],
        _currency: string
      ) => {
        router.push('/subscription-billing-demo')
      }}
    />
  )
}
