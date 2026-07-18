import React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const AppCard: React.FC<{
  disabled?: boolean
  value: string
  imageUrl: string
  title: string
  description: string
  isConnected: boolean
  isDefault?: boolean
  onChangeSetting: (value: any) => void
}> = ({
  disabled = false,
  imageUrl,
  description,
  title,
  isConnected,
  isDefault,
  onChangeSetting,
  value
}) => {
  return (
    <div
      className={cn(
        'relative flex w-full flex-col gap-3 rounded-lg border bg-white p-4 transition-all duration-200',
        disabled
          ? 'border-gray-200 bg-gray-50 '
          : 'border-[#ADB7CB] hover:shadow-md'
      )}
    >
      {/* Disabled overlay for better visual indication */}
      {disabled && (
        <div className='pointer-events-none absolute inset-0 z-10 rounded-lg bg-white/40' />
      )}

      <div className='flex w-full items-center justify-between'>
        <div className='relative'>
          <Image
            src={imageUrl}
            alt={`${title} logo`}
            width={42}
            height={42}
            className={cn(disabled && '')}
          />
        </div>
        <Switch
          disabled={disabled || !isConnected}
          id={value}
          checked={isDefault && !disabled}
          onCheckedChange={(checked) =>
            !disabled &&
            onChangeSetting({
              defaultApp: checked ? value : ''
            })
          }
        />
      </div>

      <div className='space-y-1'>
        <div className='flex items-center justify-between'>
          <p
            className={cn(
              'text-base font-semibold',
              disabled ? 'text-gray-800' : 'text-[#2A3241]'
            )}
          >
            {title}
          </p>
          <span
            className={cn(
              'rounded-lg px-2 py-1 text-xs font-normal text-white',
              disabled
                ? 'bg-gray-400'
                : 'bg-[linear-gradient(to_right,#13BA83,#1F7659)]'
            )}
          >
            {disabled ? 'Coming Soon' : 'New'}
          </span>
        </div>
        <p
          className={cn(
            'text-sm font-normal',
            disabled ? 'text-gray-800' : 'text-[#4D5C78]'
          )}
        >
          {description}
        </p>
      </div>

      <Button
        disabled={disabled}
        variant={isConnected ? 'default' : 'outline'}
        className={cn(
          'w-fit font-semibold',
          isConnected ? '' : 'border-[#3E50F7] text-[#3E50F7]'
        )}
      >
        {isConnected ? 'Connected' : 'Connect'}
      </Button>
    </div>
  )
}

export default AppCard
