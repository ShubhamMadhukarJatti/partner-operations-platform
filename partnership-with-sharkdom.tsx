import { Clock } from 'lucide-react'

import { Logo } from '@/components/icons/logo'

export const PartnershipWithSharkdom = () => {
  return (
    <section className='m-8 mt-8 flex flex-col gap-6 rounded-xl bg-gray-800 p-8 py-4 text-white'>
      <div className='flex flex-col items-center justify-between lg:flex-row'>
        <h2 className='flex flex-row items-center gap-2 text-2xl font-semibold lg:text-3xl'>
          <Logo className='size-14 rounded-full bg-white p-1 lg:size-10' />
          Sharkdom&apos;s Way of Partnering
        </h2>

        <div className='mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 p-2 text-white sm:flex-row lg:w-auto'>
          <div>
            <Clock className='' />
          </div>
          <p className='text-center'>
            New partner in <br />
            <strong className='font-bold'>2 Days</strong>
          </p>
        </div>
      </div>
      <div className='grid-cols-12 flex-col gap-2 space-y-4 lg:grid lg:space-y-0'>
        <div className='col-span-4 flex min-h-60 flex-col items-center justify-around gap-4 rounded-xl bg-green-600 p-4 text-white md:col-span-2'>
          <span className='text-center text-lg font-semibold'>Day 1-2</span>
          <p className='text-center text-xl font-semibold'>
            In house Proposals <br /> + <br /> MOU signing
          </p>
          <div className='flex flex-wrap items-center justify-center gap-1 rounded-full bg-white p-1 text-center text-sm text-green-800'>
            <Clock size={16} /> <span>48 Hours</span>
          </div>
        </div>
        <div className='col-span-8 flex min-h-60 flex-col items-center justify-center gap-4 rounded-xl bg-primary p-4 text-white md:col-span-10'>
          <span className='text-center text-lg font-semibold'>
            Day ZERO of partnership
          </span>
          <p className='text-center text-xs font-semibold xs:text-base sm:text-lg md:text-2xl'>
            #EcosystemLedGrowth
          </p>
          <p className='text-center text-lg font-semibold'>
            Invest time on what matters -{' '}
            <strong className='tracking-wide'>Your Startup!</strong>
          </p>
        </div>
      </div>
    </section>
  )
}
