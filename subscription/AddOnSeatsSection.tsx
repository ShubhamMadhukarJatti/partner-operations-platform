'use client'

import { icons } from '@/lib/constants/subscription-constants'

interface AddOnSeatsSectionProps {
  className?: string
  currentSubscription?: any
  seatCount?: number
  onSeatChange?: (count: number) => void
}

const AddOnSeatsSection: React.FC<AddOnSeatsSectionProps> = ({
  className = '',
  currentSubscription,
  seatCount = 1,
  onSeatChange
}) => {
  const handleIncrement = () => onSeatChange?.(Math.min(4, seatCount + 1))
  const handleDecrement = () => onSeatChange?.(Math.max(1, seatCount - 1))

  return (
    <div className={className}>
      {/* Section Title */}
      <div className='mb-4 flex items-center gap-2'>
        <icons.Search size={20} />
        <h2 className='text-xl font-bold text-[#2A3241] dark:text-white'>
          Add-on Seats Plan
        </h2>
      </div>

      {/* Add more users text */}
      <p className='mb-4 text-sm' style={{ color: '#4A5568' }}>
        Add more users
      </p>

      {/* Quantity Selector */}
      <div className='flex items-center gap-4'>
        <button
          onClick={handleDecrement}
          className='flex h-8 w-8 items-center justify-center rounded border border-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:bg-white/5'
          style={{ color: '#4A5568' }}
        >
          <icons.Minus size={16} />
        </button>

        <div
          className='flex h-8 w-16 items-center justify-center rounded border border-gray-300 text-sm font-medium dark:border-border'
          style={{ color: '#4A5568' }}
        >
          {seatCount}
        </div>

        <button
          onClick={handleIncrement}
          className='flex h-8 w-8 items-center justify-center rounded border border-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:bg-white/5'
          style={{ color: '#4A5568' }}
        >
          <icons.Plus size={16} />
        </button>
      </div>
    </div>
  )
}

export default AddOnSeatsSection
