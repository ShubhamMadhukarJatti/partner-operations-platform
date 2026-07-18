import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

interface AboutProps {
  title: string
}

const About: React.FC<AboutProps> = ({ title }) => {
  return (
    <div className='rounded-xl border bg-white'>
      <div className='flex flex-col'>
        <h2 className='w-full border-b px-4 py-3 text-shark-base font-bold text-text-100'>
          {title}
        </h2>
        <div className='p-4 sm:flex sm:items-center sm:justify-between'>
          <Skeleton className='h-4 w-full lg:w-[600px]' />
        </div>
      </div>
    </div>
  )
}

export default React.memo(About)
