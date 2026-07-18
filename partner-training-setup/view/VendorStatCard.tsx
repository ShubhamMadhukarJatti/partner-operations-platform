import React from 'react'

interface StatCardProps {
  label: string
  value: string
  subLabel?: string
}

const VendorStatCard = ({ label, value, subLabel }: StatCardProps) => {
  return (
    <div className='flex flex-col items-center justify-center text-center'>
      <div className='text-2xl font-bold text-gray-900 dark:text-white'>
        {value}
      </div>
      <div className='text-sm text-gray-500 dark:text-white'>{label}</div>
      {subLabel && (
        <div className='text-xs text-gray-400 dark:text-white'>{subLabel}</div>
      )}
    </div>
  )
}

export default VendorStatCard
