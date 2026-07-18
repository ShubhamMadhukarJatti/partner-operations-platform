'use client'

import React, { useState } from 'react'

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
    label: 'Wrong Buyer/Seller details',
    value: 'Wrong Buyer/Seller details'
  },
  {
    label: 'Wrong Invoice details',
    value: 'Wrong Invoice details'
  },
  {
    label: 'Wrong Tax Rate/Amount/Type',
    value: 'Wrong Tax Rate/Amount/Type'
  },
  {
    label: 'Wrong Discount/Charge amount',
    value: 'Wrong Discount/Charge amount'
  },
  {
    label: 'Wrong Classification code/ Description',
    value: 'Wrong Classification code/ Description'
  }
]

const RejectDialogue: React.FC<{
  handleRejectApplication: (e: number, r: string) => void
  id: number
  status: string
}> = ({ handleRejectApplication, id, status }) => {
  const [open, setOpen] = useState<boolean>(false)

  const [checkedValue, setCheckedValue] = useState<string>('')

  const handleRejecting = (id: number, reason: string) => {
    handleRejectApplication(id, reason)
    setOpen(false)
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className='w-full'>
        <Button
          type='button'
          variant={'destructive'}
          className='w-full border border-destructive bg-white text-destructive hover:text-white'
          disabled={status !== 'REQUEST_RECEIVED'}
        >
          Reject
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='flex flex-col gap-2 overflow-hidden border-none shadow-none'>
        <div className='flex grow flex-col gap-6'>
          <h3 className='text-shark-xl font-bold'>Reject application</h3>

          <div>
            <p className='mb-2 text-shark-sm  text-[#667085]'>
              Reason for rejection
            </p>
            <div className='flex flex-col gap-4'>
              {options.map((op, index) => (
                <div key={index} onClick={() => setCheckedValue(op.value)}>
                  <p className='flex items-center gap-2'>
                    <Checkbox
                      className=''
                      checked={checkedValue === op.value}
                    />
                    {op.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* <div className='flex flex-col gap-2'>
            <p className='text-shark-sm text-[#667085]'>Add Remarks</p>
            <Textarea placeholder='Add rejection remarks' className='w-full ' />
          </div> */}
        </div>
        <div className='flex justify-end gap-3 py-6'>
          <Button
            onClick={() => setOpen(false)}
            className='border border-primary bg-white text-primary hover:bg-primary hover:text-white'
            variant='default'
          >
            Go Back
          </Button>
          <Button
            onClick={() => handleRejecting(id, checkedValue)}
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
