'use client'

import { subscriptionPlans } from '@/lib/constants/subscription-constants'

import SubscriptionPlanCard from './SubscriptionPlanCard'

interface SubscriptionPlansSectionProps {
  className?: string
  currentSubscription?: any
  selectedPlanId?: string | null
  onPlanSelect?: (planId: string) => void
  seatsByPlanId?: Record<string, number>
  onSeatChangeForPlan?: (planId: string, count: number) => void
}

const SubscriptionPlansSection: React.FC<SubscriptionPlansSectionProps> = ({
  className = '',
  currentSubscription,
  selectedPlanId,
  onPlanSelect,
  seatsByPlanId = {},
  onSeatChangeForPlan
}) => {
  return (
    <div className={className}>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {subscriptionPlans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.id}
            plan={plan}
            onUpgrade={() => onPlanSelect?.(plan.id)}
            isCurrentPlan={currentSubscription?.price?.planType?.startsWith(
              plan.id
            )}
            isSelected={selectedPlanId === plan.id}
            seatCount={seatsByPlanId[plan.id] ?? 0}
            onSeatChange={(count) => onSeatChangeForPlan?.(plan.id, count)}
          />
        ))}
      </div>
    </div>
  )
}

export default SubscriptionPlansSection
