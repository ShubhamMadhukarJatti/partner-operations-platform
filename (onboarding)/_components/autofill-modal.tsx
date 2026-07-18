import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

export default function AutofillModal({
  open,
  onClose,
  onConfirm,
  data
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  data: any
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[483px]'>
        <div className='mb-6 flex justify-center'>
          <Image
            src='/rewrite.png'
            alt='Autofill Image'
            width={191}
            height={103}
          />
        </div>
        <DialogHeader>
          <DialogTitle className='text-center'>
            Autofill Confirmation
          </DialogTitle>
          <DialogDescription className='text-center'>
            Allow AI to update your company information automatically
          </DialogDescription>
        </DialogHeader>
        <div className='mt-6 flex'>
          <Button
            variant='outline'
            onClick={onClose}
            className='mr-2 h-12 flex-1 rounded-xl text-sm font-bold'
          >
            No
          </Button>
          <Button
            onClick={onConfirm}
            className='ml-2 h-12 flex-1 rounded-md text-sm font-bold'
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
