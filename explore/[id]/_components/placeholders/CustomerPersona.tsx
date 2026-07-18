import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const CustomerPersona: React.FC = () => {
  return (
    <div className='rounded-xl border bg-white'>
      <div className='flex flex-col'>
        <h2 className='flex w-full items-center justify-between gap-2 border-b px-4 py-3 text-shark-base font-bold text-text-100'>
          Customer Persona
          <span className='rounded border border-[#FECDCA] bg-[#FEF3F2] px-2 py-0.5 text-sm font-medium text-[#B42318]'>
            Missing
          </span>
        </h2>
        <div className='items-center justify-between p-4 sm:flex'>
          <Skeleton className='h-4 w-full lg:w-[600px]' />
        </div>
      </div>
    </div>
  )
}

export default React.memo(CustomerPersona)
