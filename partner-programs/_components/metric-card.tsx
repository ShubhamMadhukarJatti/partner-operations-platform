'use client'

import { ArrowUp } from 'lucide-react'

type MetricCardProps = {
  title: string
  value: string | number
  change?: number | null
  className?: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change }) => {
  return (
    <div className='w-full rounded-2xl border border-[#E9EAEB]  bg-white p-5'>
      <div className='space-y-2'>
        <h3 className='text-shark-sm font-medium text-[#535862]'>{title}</h3>
        <div className='flex items-center justify-between'>
          <span className='text-shark-xl font-semibold text-[#181D27]'>
            {value}
          </span>

          <div className='flex items-center gap-1 rounded-full border border-[#ABEFC6] bg-[#ECFDF3] px-2 py-0.5'>
            <ArrowUp className='h-3 w-3 text-[#067647]' />
            <span className='text-shark-sm font-medium text-[#067647]'>
              {change}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
