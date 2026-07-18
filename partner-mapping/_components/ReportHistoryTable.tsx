// OverViewTable.tsx
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  useReportHistory,
  type ReportHistoryItem
} from '@/http-hooks/partner-mapping'

import GetBeeLogo from '../../../../../../public/getbe-icon.svg'
import SearchInput from './SearchInput'

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export default function ReportHistoryTable() {
  const [searchInput, setSearchInput] = useState<string>('')
  const { data, isLoading, error } = useReportHistory()

  const filtered =
    data?.data?.filter((item) =>
      item.partnerOrganization.partnerName
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    ) || []

  if (isLoading) {
    return (
      <div className='w-full pb-4'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-gray-500'>Loading report history...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-full pb-4'>
        <div className='flex items-center justify-center py-8'>
          <div className='text-red-500'>
            Error loading report history. Please try again.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full pb-4'>
      <div className='w-1/3 pb-6 pt-2'>
        <SearchInput
          searchQuery={searchInput}
          handleInput={(e: any) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className='hidden md:block'>
        <div className='overflow-hidden rounded-lg border border-gray-100 bg-white'>
          <div className='grid grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-3 text-sm text-gray-500'>
            <div className='col-span-3'>Partner Name</div>
            <div className='col-span-2'>Created on</div>
            <div className='col-span-2'>Your Matrix</div>
            <div className='col-span-2'>Partner&apos;s Matrix</div>
            <div className='col-span-1'>Overlap</div>
            <div className='col-span-2 pl-4'>Report</div>
          </div>

          {filtered.map((item) => (
            <div
              key={item.id}
              className='grid grid-cols-12 items-center gap-4 border-b bg-white px-6 py-4 text-sm'
            >
              {/* Partner */}
              <div className='col-span-3 flex items-center gap-4'>
                <div className='flex h-10 w-10 items-center justify-center'>
                  <img
                    src={item.partnerOrganization.partnerLogoUrl}
                    alt={`${item.partnerOrganization.partnerName} logo`}
                    className='h-8 w-8 rounded-full object-cover'
                  />
                </div>
                <span className='font-medium text-gray-800'>
                  {item.partnerOrganization.partnerName}
                </span>
              </div>

              {/* Created on - Note: API doesn't provide created date, using placeholder */}
              <div className='col-span-2'>-</div>

              {/* Your Matrix */}
              <div className='col-span-2'>{item.yourMatrix}</div>

              {/* Partner's Matrix */}
              <div className='col-span-2'>{item.partnerMatrix}</div>

              {/* Overlap */}
              <div className='col-span-1 pl-2'>{item.overlapCount}</div>

              {/* Report */}
              <div className='col-span-2 pl-4'>
                {/* <button className='rounded-md border border-indigo-400 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200'>
                  Download Again
                </button> */}
                {item.reportCount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / Small screens */}
      <div className='space-y-3 md:hidden'>
        {filtered.map((item) => (
          <div
            key={item.id}
            className='rounded-lg border border-gray-100 bg-white p-4 shadow-sm'
          >
            <div className='flex items-start gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                <Image
                  src={GetBeeLogo}
                  alt={`${item.partnerOrganization.partnerName} logo`}
                  className='h-8 w-8 rounded-full object-cover'
                />
              </div>
              <div className='flex-1'>
                <div className='font-medium text-gray-800'>
                  {item.partnerOrganization.partnerName}
                </div>

                <div className='mt-1 text-xs text-gray-500'>
                  Created on: <span className='text-gray-700'>-</span>
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                  Your Matrix:{' '}
                  <span className='text-gray-700'>{item.yourMatrix}</span>
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                  Partner&apos;s Matrix:{' '}
                  <span className='text-gray-700'>{item.partnerMatrix}</span>
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                  Overlap:{' '}
                  <span className='text-gray-700'>{item.overlapCount}</span>
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                  Report:{' '}
                  <span className='text-gray-700'>{item.reportCount}</span>
                </div>

                <div className='mt-3'>
                  {/* <button className='w-full rounded-md border border-indigo-400 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200'>
                    Download Again
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
