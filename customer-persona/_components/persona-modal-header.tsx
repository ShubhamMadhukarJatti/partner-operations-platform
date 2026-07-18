import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

const PersonaModalHeader = ({
  title,
  description,
  logo,
  setOpen
}: {
  title: string
  description: string
  logo: string
  setOpen: (open: boolean) => void
}) => {
  return (
    <DialogHeader className='my-0 flex flex-row items-start justify-between py-0'>
      <div>
        <Image src={logo} alt='method-logo' width={64} height={64} />
        <DialogTitle className='mt-2 text-xl font-bold leading-6 text-text-100 '>
          {title}
        </DialogTitle>
        <DialogDescription className='text-sm leading-4 text-text-80'>
          {description}
        </DialogDescription>
      </div>

      <DialogClose asChild>
        <Button
          variant='ghost'
          className='p-0 hover:bg-transparent'
          onClick={() => setOpen(false)}
        >
          <Image
            src={'/close-circle.svg'}
            alt='method-logo'
            width={32}
            height={32}
          />
        </Button>
      </DialogClose>
    </DialogHeader>
  )
}

export default PersonaModalHeader
