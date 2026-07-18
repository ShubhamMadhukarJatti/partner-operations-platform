import React, { useState } from 'react'

import { Input } from '@/components/ui/input'

const services = [
  {
    name: 'Service 1',
    prices: { user: 400, monthly: 400, annual: 4800 },
    sharkdom: { user: 400, monthly: 360, annual: 4320 }
  }
  // Add more services if needed
]

const SharkdomSavings = () => {
  const [selectedService, setSelectedService] = useState(services[0])
  const [userCount, setUserCount] = useState(1)
  const [billingType, setBillingType] = useState('Monthly')

  const savings =
    billingType === 'Monthly'
      ? (selectedService.prices.monthly - selectedService.sharkdom.monthly) *
        userCount
      : (selectedService.prices.annual - selectedService.sharkdom.annual) *
        userCount
  const savingsPercent =
    billingType === 'Monthly'
      ? Math.round(
          ((selectedService.prices.monthly - selectedService.sharkdom.monthly) /
            selectedService.prices.monthly) *
            100
        )
      : Math.round(
          ((selectedService.prices.annual - selectedService.sharkdom.annual) /
            selectedService.prices.annual) *
            100
        )

  return (
    <div className='flex flex-col items-center justify-center gap-8 py-12 md:flex-row'>
      <div className='max-w-lg flex-1 text-left'>
        <h2 className='mb-2 text-3xl font-bold text-gray-900 md:text-4xl'>
          See How Much You Can
        </h2>
        <h2 className='mb-4 text-3xl font-bold text-green-600 md:text-4xl'>
          Save with Sharkdom
        </h2>
        <p className='mb-4 text-gray-500'>
          Enter a few details and discover how our platform is the only platform
          you need for enabling, managing and tracking your Partnership
          Journey—saving you time and money
        </p>
      </div>
      <div className='max-w-md flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow'>
        <div className='mb-4 flex flex-col gap-4 md:flex-row md:items-center'>
          <div className='flex-1'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Select Service
            </label>
            <select
              className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200'
              value={selectedService.name}
              onChange={(e) =>
                setSelectedService(
                  services.find((s) => s.name === e.target.value) || services[0]
                )
              }
            >
              {services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div className='flex-1'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Number of Users
            </label>
            <Input
              type='number'
              min={1}
              className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200'
              value={userCount}
              onChange={(e) => setUserCount(Number(e.target.value))}
            />
          </div>
          <div className='flex-1'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Billing type
            </label>
            <div className='mt-1 flex items-center gap-2'>
              <button
                className={`rounded-full border px-3 py-1 text-sm font-medium ${billingType === 'Monthly' ? 'border-blue-500 bg-blue-100 text-blue-700' : 'border-gray-300 bg-white text-gray-500'}`}
                onClick={() => setBillingType('Monthly')}
              >
                Monthly
              </button>
              <button
                className={`rounded-full border px-3 py-1 text-sm font-medium ${billingType === 'Annual' ? 'border-blue-500 bg-blue-100 text-blue-700' : 'border-gray-300 bg-white text-gray-500'}`}
                onClick={() => setBillingType('Annual')}
              >
                Annual
              </button>
            </div>
          </div>
        </div>
        <div className='mb-4 rounded-xl bg-blue-50 p-4'>
          <table className='w-full text-sm'>
            <thead>
              <tr>
                <th className='pb-2 text-left font-medium'>Cost</th>
                <th className='pb-2 text-left font-medium'>
                  {selectedService.name}
                </th>
                <th className='pb-2 text-left font-medium'>Sharkdom</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='py-1'>per User/month</td>
                <td className='py-1'>₹ {selectedService.prices.user}</td>
                <td className='py-1'>₹ {selectedService.sharkdom.user}</td>
              </tr>
              <tr>
                <td className='py-1'>Monthly License</td>
                <td className='py-1'>₹ {selectedService.prices.monthly}</td>
                <td className='py-1'>₹ {selectedService.sharkdom.monthly}</td>
              </tr>
              <tr>
                <td className='py-1'>Annual License</td>
                <td className='py-1'>₹ {selectedService.prices.annual}</td>
                <td className='py-1'>₹ {selectedService.sharkdom.annual}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='mt-2 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3'>
          <span className='mr-2 inline-block flex h-5 w-5 items-center justify-center rounded-full bg-green-500 font-bold text-white'>
            ✓
          </span>
          <span className='font-semibold text-green-700'>
            Save ₹{savings} ({savingsPercent}%)
          </span>
          <span className='text-gray-700'>with Sharkdom</span>
        </div>
      </div>
    </div>
  )
}

export default SharkdomSavings
