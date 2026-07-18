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

import MapProperties from '../map-properties'

type Props = {
  onClose: () => void
  onContinue: () => Promise<Record<string, string>>
  allHeaders: string[]
  defaultHeaders: string[]
  selectedMapping: Record<string, string>
  setSelectedMapping: (mapping: Record<string, string>) => void
}

function Step2({
  onClose,
  onContinue,
  allHeaders,
  defaultHeaders,
  selectedMapping,
  setSelectedMapping
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleOnNext = async () => {
    try {
      setIsLoading(true)
      await onContinue?.()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <DrawerContent className='max-w-[90%] gap-6 rounded-2xl px-5 py-4 md:max-w-[569px]'>
      <DrawerHeader className='my-0 flex flex-row items-start justify-between py-0'>
        <div>
          <Image
            src={'/icons/hubspot-icon.svg'}
            alt='method-logo'
            width={64}
            height={64}
          />
          <DrawerTitle className='mt-2 text-xl font-bold leading-6 text-text-100 '>
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
      <MapProperties
        headers={defaultHeaders}
        allHeaders={allHeaders}
        selectedMapping={selectedMapping}
        setSelectedMapping={setSelectedMapping}
        isSearchEnabledDropdown={true}
      />
      <DrawerFooter className='mt-6'>
        <DrawerClose asChild>
          <Button
            onClick={onClose}
            className='h-12 w-full rounded-lg border border-text-20 bg-white text-base font-bold leading-5 text-text-100 hover:bg-background-ghost-white hover:text-text-100 disabled:bg-text-20 disabled:text-text-60'
          >
            Cancel
          </Button>
        </DrawerClose>

        <Button
          disabled={Object.values(selectedMapping).some(
            (value) => value === ''
          )}
          onClick={handleOnNext}
          className='h-12 w-full rounded-lg text-base font-bold leading-5 disabled:bg-text-20 disabled:text-text-60'
          loading={isLoading}
          loadingText='Loading...'
        >
          Next
        </Button>
      </DrawerFooter>
    </DrawerContent>
  )
}

export default Step2
