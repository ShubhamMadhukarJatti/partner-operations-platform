'use client'

import React from 'react'

import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

const options = [
  {
    label: 'op1',
    value: 'op1'
  },
  {
    label: 'op1',
    value: 'op1'
  },
  {
    label: 'op1',
    value: 'op1'
  },
  {
    label: 'op1',
    value: 'op1'
  }
]

const ReportDeal: React.FC<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  orgName: string
}> = ({ isOpen, setIsOpen, orgName }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='flex max-w-[460px] flex-col gap-2 overflow-hidden border-none shadow-none'>
        <div className='flex grow flex-col gap-6'>
          <h3 className='text-shark-xl font-bold'>Report Deal?</h3>

          <div className=''>
            <p className='mb-4 text-shark-sm font-normal text-[#667085]'>
              You are about to report{' '}
              <span className='font-bold text-text-100'>{orgName}’s deal</span>.
              This action cant be undone
            </p>
            <p className='mb-2 text-shark-sm text-[#667085]'>
              Reason for reporting the deal
            </p>
            <div className='flex flex-col gap-4'>
              {options.map((op, index) => (
                <div key={index}>
                  <p className='flex items-center gap-2'>
                    <Checkbox className='' />
                    {op.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-shark-sm text-[#667085]'>Add Remarks</p>
            <Textarea placeholder='Add rejection remarks' className='w-full ' />
          </div>
        </div>
        <div className='flex justify-end gap-3 py-6'>
          <Button
            onClick={() => setIsOpen(false)}
            className='border border-primary bg-white text-primary hover:bg-primary hover:text-white'
            variant='default'
          >
            Go Back
          </Button>
          <Button variant={'destructive'}>Report</Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ReportDeal
