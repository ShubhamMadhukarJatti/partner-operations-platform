import Image from 'next/image'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'
import { Logo } from '@/components/icons/logo'

export function EmailAlert() {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className='flex flex-col items-center gap-6'>
        <Logo className='w-[150px]' />

        <div>
          <h2 className='text-center text-shark-xl font-bold  text-text-100'>
            Great!, Email has sent successfully
          </h2>
          <p className='text-text-8 mt-2 text-center text-shark-sm'>
            You will receive Email with complete details of the company.
          </p>
        </div>

        <Image src={'/email-alert.png'} width={300} alt='' height={256} />

        <AlertDialogFooter className='mt-6 w-full'>
          <AlertDialogCancel className='w-full rounded-lg border border-text-40 font-bold text-primary-light-blue'>
            Dismiss
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
