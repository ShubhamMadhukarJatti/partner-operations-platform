'use client'

import React from 'react'

import { Separator } from '@/components/ui/separator'

const DateSeparator: React.FC<{ time: string }> = ({ time }) => {
  return (
    <div className='relative'>
      <Separator />
      <span className='absolute left-1/2 top-[-11px] bg-white'>{time}</span>
    </div>
  )
}

export default DateSeparator
