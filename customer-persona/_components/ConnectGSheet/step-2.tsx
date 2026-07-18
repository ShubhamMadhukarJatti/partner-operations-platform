import React, { useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'

import PersonaModalStep from '../persona-modal-step'

type Props = {
  onClose: () => void
  onConnect: (sheetUrl: string) => Promise<Record<string, string>>
}

function Step2({ onClose, onConnect }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fileLink, setFileLink] = useState<string>('')

  const handleOnConnect = async () => {
    try {
      console.log('!! -- handleOnConnect -- !!')
      setIsLoading(true)
      await onConnect(fileLink)
      setIsLoading(false)
    } catch (error) {
      console.log('error -- ', error)
      setIsLoading(false)
    }
  }

  return (
    <DrawerContent className='max-w-[90%] gap-6 rounded-2xl px-5 py-4 md:max-w-[569px]'>
      <DrawerHeader className='my-0 flex flex-row items-start justify-between py-0'>
        <div>
          <Image
            src={'/icons/google-sheets-icon.svg'}
            alt='method-logo'
            width={64}
            height={64}
          />
          <DrawerTitle className='mb-1 mt-2 text-left text-2xl font-bold leading-6 text-text-100'>
            Map Properties
          </DrawerTitle>
          <DrawerDescription className='text-sm leading-4 text-text-80'>
            Ensure columns from your file are mapped correctly to contact
            properties.
          </DrawerDescription>
        </div>

        <DrawerClose asChild>
          <Button
            variant='ghost'
            className='p-0 hover:bg-transparent'
            onClick={onClose}
          >
            <Image
              src={'/close-circle.svg'}
              alt='method-logo'
              width={32}
              height={32}
            />
          </Button>
        </DrawerClose>
      </DrawerHeader>
      <PersonaModalStep
        isCompleted={false}
        step1Title='Connect File'
        step2Title='Map Columns'
      />

      <Input
        type='text'
        placeholder='Link'
        className='w-full'
        onChange={(e) => setFileLink(e.target.value)}
      />

      <DrawerFooter className='border-t border-[#E4E7EE]'>
        <Button
          disabled={!fileLink}
          onClick={handleOnConnect}
          className='mt-3 h-12 w-full rounded-lg text-base font-bold leading-5 disabled:bg-text-20 disabled:text-text-60'
          loading={isLoading}
          loadingText='Loading...'
        >
          Connect
        </Button>
      </DrawerFooter>
    </DrawerContent>
  )
}

export default Step2
