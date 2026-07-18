import React from 'react'
import { Check, Minus, MinusCircle } from 'lucide-react'

type Feature = {
  label: string
  key: string
  isBool?: boolean
}

type Plan = {
  plan: string
  features: Record<string, any>
}

type PricingComparisonTableProps = {
  title: string
  plans: Plan[]
  features: Feature[]
  className?: string
}

const PricingComparisonTable = ({
  title,
  plans,
  features,
  className
}: PricingComparisonTableProps) => {
  return (
    <div
      className={`mx-auto overflow-hidden rounded-[12px] border border-solid border-[#DBE9FE] p-0 ${className}`}
    >
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[600px] table-fixed bg-white text-xs sm:text-[15px]'>
          <thead>
            <tr>
              <th className='w-1/3 rounded-tl-2xl px-3 py-3 text-left text-sm font-semibold sm:px-5 sm:py-4 sm:text-[16px]'>
                {title}
              </th>
              {plans.map((plan, idx) => (
                <th
                  key={plan.plan}
                  className={
                    'px-3 py-3 text-center text-sm font-semibold sm:px-5 sm:py-4 sm:text-[16px]' +
                    (idx === plans.length - 1 ? ' rounded-tr-2xl' : '')
                  }
                >
                  {plan.plan}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white'>
            {features.map((feature) => (
              <tr key={feature.key} className='border-t border-gray-200'>
                <td className='px-3 py-2 text-left text-xs font-medium sm:px-5 sm:py-3 sm:text-sm'>
                  {feature.label}
                </td>
                {plans.map((plan) => (
                  <td
                    key={plan.plan}
                    className='px-3 py-2 text-center sm:px-5 sm:py-3'
                  >
                    {feature.isBool !== true ? (
                      <span className='text-xs sm:text-sm'>
                        {plan.features[feature.key] ||
                          (feature.key === 'customerSupport' ? (
                            <MinusCircle
                              className='mx-auto'
                              size={16}
                              fill='#D1D5DB'
                              color='#D1D5DB'
                            />
                          ) : null)}
                      </span>
                    ) : plan.features[feature.key] ? (
                      <div className='mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#6863FB]/40'>
                        <Check size={12} color='#6863FB' strokeWidth={3} />
                      </div>
                    ) : (
                      <div className='mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#ADB8CB]/20'>
                        <Minus size={12} color='#ADB8CB' strokeWidth={3} />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PricingComparisonTable
