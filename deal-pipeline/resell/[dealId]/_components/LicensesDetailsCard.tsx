'use client'

import React, { useState } from 'react'
import { FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'

import RequestLicensesModal from './RequestLicensesModal'

interface LicensesDetailsCardProps {
  licensesPurchased?: number
  licensesAllocated?: number
  licensesRemaining?: number
  licensesConsumed?: number
  dealId?: string
}

export default function LicensesDetailsCard({
  licensesPurchased = 100,
  licensesAllocated = 0,
  licensesRemaining = 100,
  licensesConsumed = 0,
  dealId
}: LicensesDetailsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
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
        <Button
          variant='link'
          className='mt-4 w-full justify-start p-0 text-primary-blue hover:underline'
          onClick={() => setIsModalOpen(true)}
        >
          Request for more Licenses
        </Button>
      </div>
      <RequestLicensesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        dealId={dealId}
      />
    </>
  )
}
