// components/CompareControls.tsx
'use client'

import React from 'react'

import { Button } from '@/components/ui/button'

type Option = { value: string; label: string }

type Props = {
  leftOptions: Option[] // first dropdown options
  rightOptions: Option[] // second dropdown options
  leftValue?: string
  rightValue?: string
  onLeftChange?: (v: string) => void
  onRightChange?: (v: string) => void
  onCompare?: (left: string, right: string) => void
  className?: string
}

export default function FilterOption({
  leftOptions,
  rightOptions,
  leftValue,
  rightValue,
  onLeftChange,
  onRightChange,
  onCompare,
  className = ''
}: Props) {
  const handleCompare = () => {
    onCompare?.(
      leftValue ?? leftOptions[0]?.value,
      rightValue ?? rightOptions[0]?.value
    )
  }

  return (
    <div className={`flex flex-row items-center gap-3 ${className}`}>
      {/* Left select */}
      <label className='relative inline-block'>
        <select
          value={leftValue}
          onChange={(e) => onLeftChange?.(e.target.value)}
          className='w-56 appearance-none rounded-md border-2 border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 md:w-64'
          aria-label='Left selection'
        >
          {leftOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* down chevron (pure CSS) */}
        <span
          aria-hidden
          className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
        >
          ▾
        </span>
      </label>

      {/* Right select */}
      <label className='relative inline-block'>
        <select
          value={rightValue}
          onChange={(e) => onRightChange?.(e.target.value)}
          className='w-72 appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 md:w-96'
          aria-label='Right selection'
        >
          {rightOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <span
          aria-hidden
          className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
        >
          ▾
        </span>
      </label>

      {/* Compare button */}
      <Button
        type='button'
        variant='primary'
        onClick={handleCompare}
        className='ml-1 rounded-lg px-4 py-2'
        aria-label='Compare'
      >
        Compare
      </Button>
    </div>
  )
}
