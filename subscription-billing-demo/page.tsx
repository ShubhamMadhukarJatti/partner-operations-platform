'use client'

import { useRouter } from 'next/navigation'

import { SubscriptionBillingPage } from '@/components/subscription'

export default function SubscriptionBillingDemoPage() {
  const router = useRouter()

  const handleUpgradeClick = () => {
    // Navigate to the subscription plans page
    router.push('/subscription-demo')
  }

  return <SubscriptionBillingPage onUpgradeClick={handleUpgradeClick} />
}
