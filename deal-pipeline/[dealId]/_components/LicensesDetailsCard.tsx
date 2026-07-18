'use client'

import React from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface LicensesDetailsCardProps {
  licensesPurchased?: number
  licensesAllocated?: number
  licensesRemaining?: number
  licensesConsumed?: number
}

export default function LicensesDetailsCard({
  licensesPurchased = 100,
  licensesAllocated = 0,
  licensesRemaining = 100,
  licensesConsumed = 0
}: LicensesDetailsCardProps) {
  return (
    <div className='rounded-2xl border bg-white p-4 md:p-6'>
      <div className='mb-4 flex items-center gap-2'>
        <FileText size={20} className='text-gray-800' />
        <div className='text-base font-semibold text-[#1A202C] md:text-lg'>
          Licenses Details
        </div>
      </div>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-[#6B7280]'>Licenses Purchased:</span>
          <span className='text-sm font-medium text-[#1A202C]'>
            {licensesPurchased}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-[#6B7280]'>Licenses Allocated:</span>
          <span className='text-sm font-medium text-[#1A202C]'>
            {licensesAllocated}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-[#6B7280]'>Licenses Remaining:</span>
          <span className='text-sm font-medium text-[#1A202C]'>
            {licensesRemaining}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-[#6B7280]'>Licenses Consumed:</span>
          <span className='text-sm font-medium text-[#1A202C]'>
            {licensesConsumed}
          </span>
        </div>
      </div>
      <Link href='#' className='mt-4 block'>
        <Button
          variant='link'
          className='w-full justify-start p-0 text-primary-blue hover:underline'
        >
          Request for more Licenses
        </Button>
      </Link>
    </div>
  )
}
