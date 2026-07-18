import { useRef } from 'react'
import { CloseCircle } from 'iconsax-react'
import SignaturePad from 'react-signature-canvas'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function DrawSignature() {
  const sigPad = useRef(null) as React.RefObject<SignaturePad>

  const clear = () => {
    sigPad.current?.clear()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='flex w-full gap-2 rounded-lg border border-primary-light-blue bg-transparent text-shark-base font-bold text-primary-light-blue hover:bg-transparent hover:text-primary-light-blue'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284' />
            <path d='M3 21h18' />
          </svg>
          Draw Signature
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='p-4'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center justify-between text-shark-xl font-bold text-text-100'>
            Draw Signature
            <AlertDialogCancel className='border-none p-0 hover:bg-transparent'>
              <CloseCircle size={28} />
            </AlertDialogCancel>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div>
          <SignaturePad
            canvasProps={{
              className: 'w-full h-64 border border-dashed rounded-md'
            }}
            ref={sigPad}
          />

          <Button
            variant={'link'}
            className='p-0 text-shark-base text-primary-light-blue'
            onClick={clear}
          >
            Clear
          </Button>
        </div>
        <AlertDialogFooter className='w-full'>
          <AlertDialogAction className='h-12 w-full rounded-lg text-shark-base font-bold text-white'>
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
