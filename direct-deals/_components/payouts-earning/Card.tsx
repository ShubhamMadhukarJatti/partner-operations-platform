'use client'

import React from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { AddAmount } from './AddAmount'
import RequestRewardDrawer from './RequestRewardDrawer'

interface CardProps {
  icon: React.ReactElement
  title: string
  description: string
  value: string
  iconBgColor: string
  buttonText?: string
  type?: 'add' | 'paid' | 'earning'
  handleAddMoney?: () => void
}

const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  value,
  iconBgColor,
  type,
  handleAddMoney
}) => {
  return (
    <div className='flex gap-4 rounded-xl border border-[#E4E7EE] p-4 shadow-sm'>
      <div
        className={`flex items-center justify-center rounded-lg p-4 bg-[${iconBgColor}]`}
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <div className='grow'>
        <div className='flex justify-between'>
          <div>
            <span className='text-base/5 font-bold text-text-100'>{title}</span>
            <p className='mb-4 text-sm/4 text-[#908B93]'>{description}</p>
          </div>
          {type === 'add' && (
            <Button
              variant={'ghost'}
              onClick={handleAddMoney}
              className='bg-[#E5EFFE] p-3  text-shark-sm font-bold text-[#3E50F7] hover:bg-[#E5EFFE] hover:text-[#3E50F7]'
            >
              Add
            </Button>
          )}
        </div>
        <div className='flex justify-between'>
          <span className='text-2xl/8 font-bold text-[#131213]'>₹{value}</span>
          {/* {buttonText && <RequestRewardDrawer buttonText={buttonText} />} */}
        </div>
      </div>
    </div>
  )
}

export default Card
