import React from 'react'
import { ArrowLeft, PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

import Report from './Report'

const CreateReportDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='primary'>
          <PlusIcon strokeWidth={4} /> Create Report
        </Button>
      </DialogTrigger>
      <DialogContent className='h-screen w-screen max-w-none p-0'>
        <ScrollArea className='h-screen'>
          <div className='mx-auto w-full max-w-[860px]'>
            <DialogClose className='mt-6 flex items-center gap-1.5 text-sm font-semibold text-[#3E50F7]'>
              {' '}
              <ArrowLeft size={20} /> Back to home{' '}
            </DialogClose>
            <Report />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CreateReportDialog
