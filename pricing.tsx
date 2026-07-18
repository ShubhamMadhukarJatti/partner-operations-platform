'use client'

import { pricing_plans } from '@/config/data'
import { cn } from '@/lib/utils'
import PricingCard from '@/app/(marketing)/_components/home/pricing-card'

export const Pricing = ({ isDashboard }: { isDashboard: Boolean }) => {
  return (
    <section
      id='pricing'
      className={cn('flex flex-col items-center gap-12 py-20 lg:gap-16', {
        'pt-8': isDashboard
      })}
    >
      <h2 className='text-center text-3xl font-semibold text-[#475467]'>
        Choose a plan that suits your needs
      </h2>
      {/*{!isDashboard && (
        <h2 className='text-center text-3xl font-semibold'>
          Simple & transparent pricing
      </h2>
      )}*/}

      <div
        className={cn(
          ' grid grid-cols-1 gap-x-2 gap-y-6 px-2 sm:grid-cols-2 xl:grid-cols-4',
          {
            'xl:grid-cols-3': isDashboard
          }
        )}
      >
        {pricing_plans.map((plan, index) => {
          return (
            <>
              {isDashboard && index === 0 ? null : (
                <PricingCard isHomePage={true} key={plan.title} plan={plan} />
              )}
            </>
          )
        })}
      </div>
    </section>
  )
}
