'use client'

import React from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
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

const RejectDialogue: React.FC<{
  isOpen: boolean
  setIsOpen: (e: boolean) => void
  handleRejectApplication: (e: number) => void
  id: number
}> = ({ isOpen, setIsOpen, handleRejectApplication, id }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='flex flex-col gap-2 overflow-hidden border-none shadow-none'>
        <div className='flex grow flex-col gap-6'>
          <h3 className='text-shark-xl font-bold'>Reject application</h3>

          <div>
            <p className='text-shark-sm text-[#667085]'>Reason for rejection</p>
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
          <Button
            onClick={() => handleRejectApplication(id)}
            variant={'destructive'}
          >
            Reject application
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RejectDialogue
