import React, { useState } from 'react'

import { Input } from '@/components/ui/input'

const services = [
  { label: 'Crossbeam', value: 'crossbeam' },
  { label: 'impartner', value: 'impartner' },
  { label: 'clazar', value: 'clazar' },
  { label: 'Partner Insights', value: 'partner_insights' }
]

// Pricing data for each service and Sharkdom
const servicePricing: Record<
  string,
  { perUser: number; monthly: number; annual: number }
> = {
  crossbeam: { perUser: 150, monthly: 150, annual: 1800 },
  impartner: { perUser: 249, monthly: 249, annual: 2988 },
  clazar: { perUser: 499, monthly: 499, annual: 5988 },
  partner_insights: { perUser: 450, monthly: 450, annual: 5400 }
}
const sharkdomPricing = { perUser: 41, monthly: 41, annual: 395 }

export default function SavingsCalculator() {
  const [service, setService] = useState('crossbeam')
  const [users, setUsers] = useState(1)
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  // Get selected service pricing
  const selectedPricing = servicePricing[service]
  const sharkdom = sharkdomPricing

  // Calculate costs
  const costPerUser = selectedPricing.perUser
  const sharkdomPerUser = sharkdom.perUser
  const monthlyCost = selectedPricing.monthly * users
  const annualCost = selectedPricing.annual * users
  const sharkdomMonthly = sharkdom.monthly * users
  const sharkdomAnnual = sharkdom.annual * users

  // Calculate savings
  const savings =
    billing === 'monthly'
      ? monthlyCost - sharkdomMonthly
      : annualCost - sharkdomAnnual
  const savingsPercent =
    billing === 'monthly'
      ? Math.round(((monthlyCost - sharkdomMonthly) / monthlyCost) * 100)
      : Math.round(((annualCost - sharkdomAnnual) / annualCost) * 100)

  return (
    <div className='flex w-full flex-col items-center bg-white px-2 py-12'>
      <h2 className='mb-2 text-center text-2xl font-semibold text-[#222] sm:text-3xl md:text-4xl'>
        See How Much You Can{' '}
        <span className='text-[#22C55E]'>Save with Sharkdom</span>
      </h2>
      <p className='mb-8 max-w-2xl text-center text-sm text-gray-500 sm:text-base'>
        Enter a few details and discover how our platform is the only platform
        you need for enabling, managing and tracking your Partnership
        Journey—saving you time and money
      </p>
      <div className='flex w-full max-w-5xl flex-col gap-8'>
        {/* Top Calculator Card */}
        <div className='flex flex-col gap-6 rounded-[16px] border border-[#E9F5F1] bg-white px-4 py-6 shadow-[0_2px_12px_0_rgba(16,30,54,0.04)] sm:px-6 md:px-8 md:py-7'>
          {/* Inputs Row */}
          <div className='flex w-full flex-col items-start gap-4 sm:gap-6 md:flex-row md:gap-12'>
            <div className='flex w-full min-w-[160px] flex-col md:w-auto'>
              <label className='mb-1 block text-[13px] font-medium text-[#7B8A9D]'>
                Select Service
              </label>
              <select
                className='w-full rounded-md border border-[#E9F5F1] bg-white px-3 py-1.5 text-[15px] font-medium text-[#222] transition focus:outline-none focus:ring-2 focus:ring-[#22C55E]'
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex w-full min-w-[140px] flex-col md:w-auto'>
              <label className='mb-1 block text-[13px] font-medium text-[#7B8A9D]'>
                Billing type
              </label>
              <div className='mt-1 flex items-center gap-4 sm:gap-6'>
                <label className='flex cursor-pointer items-center gap-2'>
                  <Input
                    type='radio'
                    className='h-4 w-4 accent-[#22C55E]'
                    checked={billing === 'monthly'}
                    onChange={() => setBilling('monthly')}
                  />
                  <span className='text-[14px] text-[#222] sm:text-[15px]'>
                    Monthly
                  </span>
                </label>
                <label className='flex cursor-pointer items-center gap-2'>
                  <Input
                    type='radio'
                    className='h-4 w-4 accent-[#22C55E]'
                    checked={billing === 'annual'}
                    onChange={() => setBilling('annual')}
                  />
                  <span className='text-[14px] text-[#222] sm:text-[15px]'>
                    Annual
                  </span>
                </label>
              </div>
            </div>
          </div>
          {/* Results Row */}
          <div className='mt-2 flex w-full flex-col gap-4 md:flex-row'>
            <div className='flex flex-col justify-between rounded-lg bg-[#F6F8FC] px-4 py-4 sm:px-6 md:flex-1'>
              <div className='flex flex-col gap-3 sm:flex-row sm:gap-0'>
                <div className='flex flex-1 flex-col items-center'>
                  <span className='mb-1 text-xs font-medium text-[#7B8A9D]'>
                    Cost/User/month
                  </span>
                  <span className='text-lg font-semibold text-[#222] sm:text-xl'>
                    $ {costPerUser}
                  </span>
                </div>
                <div className='flex flex-1 flex-col items-center'>
                  <span className='mb-1 text-xs font-medium text-[#7B8A9D]'>
                    Monthly License cost
                  </span>
                  <span className='text-lg font-semibold text-[#222] sm:text-xl'>
                    $ {monthlyCost}
                  </span>
                </div>
                <div className='flex flex-1 flex-col items-center'>
                  <span className='mb-1 text-xs font-medium text-[#7B8A9D]'>
                    Annual License cost
                  </span>
                  <span className='text-lg font-semibold text-[#222] sm:text-xl'>
                    $ {annualCost}
                  </span>
                </div>
              </div>
            </div>
            <div className='flex min-w-full items-center justify-center gap-2 rounded-lg bg-[#E9FCEB] px-4 py-4 sm:px-6 md:min-w-[220px]'>
              <svg
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 20 20'
                className='flex-shrink-0'
              >
                <circle cx='10' cy='10' r='10' fill='#22C55E' />
                <path
                  d='M6 10.5l2.5 2.5L14 7.5'
                  stroke='#fff'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <div className='flex flex-col items-center text-center sm:flex-row sm:text-left'>
                <span className='text-[15px] font-semibold text-[#22C55E] sm:text-[16px]'>
                  Save ${savings}{' '}
                  <span className='font-bold'>({savingsPercent}%)</span>
                </span>
                <span className='text-[14px] font-normal text-[#222] sm:ml-1 sm:text-[15px]'>
                  with Sharkdom
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Calculator Card */}
        <div className='flex w-full flex-col items-start gap-6 md:flex-row md:gap-8'>
          {/* Left: Form */}
          <div className='flex w-full min-w-[260px] flex-1 flex-col gap-6 md:w-auto'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
              <label className='text-[13px] font-medium text-[#7B8A9D] sm:w-40'>
                Select Service
              </label>
              <select
                className='flex-1 appearance-none rounded-[8px] border border-[#E9F5F1] bg-white px-3 py-1.5 text-[15px] font-medium text-[#222] transition focus:outline-none focus:ring-2 focus:ring-[#22C55E]'
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
              <label className='text-[13px] font-medium text-[#7B8A9D] sm:w-40'>
                Number of Users
              </label>
              <Input
                type='number'
                min={1}
                className='flex-1 appearance-none rounded-[8px] border border-[#E9F5F1] bg-white px-3 py-1.5 text-[15px] font-medium text-[#222] transition focus:outline-none focus:ring-2 focus:ring-[#22C55E]'
                value={users}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setUsers(val < 1 ? 1 : val)
                }}
                onBlur={(e) => {
                  if (Number(e.target.value) < 1) setUsers(1)
                }}
              />
            </div>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
              <label className='text-[13px] font-medium text-[#7B8A9D] sm:w-40'>
                Billing type
              </label>
              <div className='flex flex-1 items-center gap-4 sm:gap-6'>
                <label className='flex cursor-pointer items-center gap-2'>
                  <Input
                    type='radio'
                    className='h-4 w-4 border border-[#E9F5F1] accent-[#22C55E] focus:ring-2 focus:ring-[#22C55E]'
                    checked={billing === 'monthly'}
                    onChange={() => setBilling('monthly')}
                  />
                  <span className='text-[14px] text-[#222] sm:text-[15px]'>
                    Monthly
                  </span>
                </label>
                <label className='flex cursor-pointer items-center gap-2'>
                  <Input
                    type='radio'
                    className='h-4 w-4 border border-[#E9F5F1] accent-[#22C55E] focus:ring-2 focus:ring-[#22C55E]'
                    checked={billing === 'annual'}
                    onChange={() => setBilling('annual')}
                  />
                  <span className='text-[14px] text-[#222] sm:text-[15px]'>
                    Annual
                  </span>
                </label>
              </div>
            </div>
          </div>
          {/* Right: Comparison Card */}
          <div className='flex w-full flex-1 flex-col gap-4 rounded-xl bg-[#F6F8FC] px-4 py-5 sm:px-6 sm:py-6 md:px-7'>
            <div className='overflow-x-auto'>
              <table className='mb-2 w-full min-w-[280px] text-[14px] sm:text-[15px]'>
                <thead>
                  <tr>
                    <th className='pb-2 text-left font-semibold text-[#7B8A9D]'>
                      &nbsp;
                    </th>
                    <th className='pb-2 text-left font-semibold text-[#222]'>
                      {services.find((s) => s.value === service)?.label}
                    </th>
                    <th className='pb-2 text-left font-semibold text-[#22C55E]'>
                      Sharkdom
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='py-1 text-[#7B8A9D]'>Cost/User/month</td>
                    <td className='py-1 font-semibold text-[#222]'>
                      $ {costPerUser}
                    </td>
                    <td className='py-1 font-semibold text-[#222]'>
                      $ {sharkdomPerUser}
                    </td>
                  </tr>
                  <tr>
                    <td className='py-1 text-[#7B8A9D]'>
                      Monthly License cost
                    </td>
                    <td className='py-1 font-semibold text-[#222]'>
                      $ {monthlyCost}
                    </td>
                    <td className='py-1 font-semibold text-[#222]'>
                      $ {sharkdomMonthly}
                    </td>
                  </tr>
                  <tr>
                    <td className='py-1 text-[#7B8A9D]'>Annual License cost</td>
                    <td className='py-1 font-semibold text-[#222]'>
                      $ {annualCost}
                    </td>
                    <td className='py-1 font-semibold text-[#222]'>
                      $ {sharkdomAnnual}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='mt-2 flex flex-col items-center gap-2 rounded-lg bg-[#E9FCEB] px-4 py-3 text-center sm:flex-row sm:px-5 sm:text-left'>
              <svg
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 20 20'
                className='flex-shrink-0'
              >
                <circle cx='10' cy='10' r='10' fill='#22C55E' />
                <path
                  d='M6 10.5l2.5 2.5L14 7.5'
                  stroke='#fff'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <div className='flex flex-col items-center sm:flex-row'>
                <span className='text-[15px] font-semibold text-[#22C55E] sm:text-[16px]'>
                  Save ${savings}{' '}
                  <span className='font-bold'>({savingsPercent}%)</span>
                </span>
                <span className='text-[14px] font-normal text-[#222] sm:ml-1 sm:text-[15px]'>
                  with Sharkdom
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
