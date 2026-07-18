'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { icons } from '@/lib/constants/subscription-constants'
import { getBillingOverview } from '@/lib/db/subscription'
import { Skeleton } from '@/components/ui/skeleton'

import AddressContactCard from './AddressContactCard'
import PaymentHistoryCard from './PaymentHistoryCard'
import SubscriptionCard from './SubscriptionCard'

interface SubscriptionBillingPageProps {
  className?: string
  onUpgradeClick?: () => void
}

const SubscriptionBillingPage: React.FC<SubscriptionBillingPageProps> = ({
  className = '',
  onUpgradeClick
}) => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch billing overview data
  const {
    data: billingData,
    isLoading: billingLoading,
    refetch: refetchBilling
  } = useQuery<any>({
    queryKey: ['get-billing-overview'],
    queryFn: () => getBillingOverview(),
    enabled: isClient, // Only run query on client side
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true
  })

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick()
    }
    router.push('/settings/subscription-plans')
  }

  return (
    <div className={`flex h-screen bg-white dark:bg-transparent ${className}`}>
      {/* Main Content Area */}
      <div className='flex flex-1 flex-col'>
        {/* Main Content */}
        <div className='flex-1 p-8'>
          {billingLoading ? (
            /* Loading State */
            <div className='mx-auto flex max-w-4xl justify-between gap-4'>
              <Skeleton className='h-[400px] w-[48%]' />
              <Skeleton className='h-[400px] w-[48%]' />
            </div>
          ) : (
            /* Subscription or Free Trial state */
            <div className='mx-auto flex max-w-4xl justify-between'>
              {/* Address & Contact Card */}
              <AddressContactCard
                addressContact={billingData?.addressContact}
                onSaveSuccess={() => refetchBilling()}
              />

              {/* Right Column */}
              <div className='flex w-[48%] flex-col gap-4'>
                <SubscriptionCard
                  key={`sub-card-${billingData?.subscriptionPlan?.id}-${billingData?.subscriptionSummary?.status}`}
                  onUpgradeClick={handleUpgradeClick}
                  subscription={billingData}
                />

                <PaymentHistoryCard
                  key={`payment-card-${billingData?.invoices?.length}`}
                  invoices={billingData?.invoices}
                  cardDetails={billingData?.cardDetails}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionBillingPage
