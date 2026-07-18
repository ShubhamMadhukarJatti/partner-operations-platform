'use client'

import React, { useState } from 'react'

import { OutlinedInput } from '@/components/ui/outlined-input'

const StatsGrid = ({
  csvData,
  csvHeaders,
  selectedMapping
}: {
  csvData: any[]
  csvHeaders: string[]
  selectedMapping: Record<string, string>
}) => {
  const [value, setValue] = useState<string>(
    `persona${Math.floor(Math.random() * 100)}.csv`
  )

  return (
    <div>
      <div className='grid grid-cols-3 gap-0 rounded-lg border border-text-20 bg-background-ghost-white'>
        {Object.entries(selectedMapping).map(([key, value], index) => (
          <div
            key={index}
            className={`flex flex-col gap-1 p-4 ${
              index % 3 !== 2 ? 'border-r' : ''
            } ${index < 3 ? 'border-b' : ''} border-text-20`}
          >
            <span className='text-xl font-bold leading-6 text-text-100'>
              {(() => {
                if (value === 'other') {
                  return '--,--'
                }
                const index = csvHeaders.indexOf(value)

                const websites = csvData
                  .map((data) => data[index])
                  .filter(Boolean)

                return websites.length
              })()}
            </span>
            <span className='text-sm leading-4 text-text-80'>{` ${key}`}</span>
          </div>
        ))}
      </div>
      <div className='mt-6'>
        <OutlinedInput
          label='Name your import'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  )
}

export default StatsGrid
