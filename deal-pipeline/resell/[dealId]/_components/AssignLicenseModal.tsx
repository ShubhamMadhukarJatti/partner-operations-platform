'use client'

import React, { useState } from 'react'
import { User, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AssignLicenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  customerName?: string
  customerId?: number
  dealId?: string | number
  onConfirm?: (allocationData?: any) => void
}

export default function AssignLicenseModal({
  open,
  onOpenChange,
  email,
  customerName,
  customerId,
  dealId,
  onConfirm
}: AssignLicenseModalProps) {
  const [validityInDays, setValidityInDays] = useState<string>('30')
  const [isAllocating, setIsAllocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    // Validate inputs
    if (!customerId || !dealId) {
      setError('Customer ID or Deal ID is missing')
      return
    }

    const validityDays = parseInt(validityInDays)
    if (isNaN(validityDays) || validityDays <= 0) {
      setError('Please enter a valid number of days (greater than 0)')
      return
    }

    try {
      setIsAllocating(true)
      setError(null)

      const requestBody = {
        customerId: customerId,
        dealId: typeof dealId === 'string' ? parseInt(dealId) : dealId,
        validityInDays: validityDays
      }

      const response = await fetch(
        '/api/reseller/deals/customer/license/allocate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        )
      }

      const result = await response.json()

      if (result.success && result.data) {
        // Call the onConfirm callback to refresh data, passing the allocation result
        onConfirm?.(result.data)
        // Reset form and close modal
        setValidityInDays('365')
        setError(null)
        onOpenChange(false)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error: any) {
      console.error('Error allocating license:', error)
      setError(error.message || 'Failed to allocate license. Please try again.')
    } finally {
      setIsAllocating(false)
    }
  }

  const handleCancel = () => {
    setValidityInDays('365')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-w-[90%] gap-6 rounded-2xl p-6 md:max-w-[500px]'
        hideCloseBtn
      >
        <DialogHeader className='relative'>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <User size={24} className='text-blue-600' />
            </div>
            <div className='flex-1'>
              <DialogTitle className='text-xl font-bold text-[#1A202C]'>
                Assign License to &quot;{email}&quot;
              </DialogTitle>
              <DialogDescription className='mt-2 text-sm text-[#6B7280]'>
                The license notification will be sent to the mentioned email
              </DialogDescription>
            </div>
          </div>
          <DialogClose asChild>
            <Button
              variant='ghost'
              className='absolute right-0 top-0 h-8 w-8 p-0 hover:bg-transparent'
              onClick={handleCancel}
            >
              <X size={20} className='text-gray-500' />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className='space-y-4'>
          {/* <div>
            <Label className='mb-1 block text-sm font-medium text-[#6B7280]'>
              Validity in Days<span className='text-red-500'>*</span>
            </Label>
            <Input
              type='number'
              placeholder='Enter validity in days (e.g., 365)'
              value={validityInDays}
              onChange={(e) => setValidityInDays(e.target.value)}
              // disabled={isAllocating}
              disabled={true}
              min='1'
              className='rounded-lg'
            />
            <p className='mt-1 text-xs text-[#6B7280]'>
              Enter the number of days the license should be valid
            </p>
          </div> */}

          {error && (
            <div className='rounded-lg border border-red-200 bg-red-50 p-3'>
              <p className='text-sm text-red-800'>{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className='flex gap-3 sm:gap-3'>
          <Button
            variant='outline'
            onClick={handleCancel}
            className='flex-1'
            disabled={isAllocating}
          >
            Cancel
          </Button>
          <Button
            variant={isAllocating ? 'disable' : 'primary'}
            onClick={handleConfirm}
            disabled={isAllocating}
            className={cn(
              'flex-1',
              isAllocating &&
                'disabled:pointer-events-auto disabled:cursor-not-allowed'
            )}
          >
            {isAllocating ? 'Allocating...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
