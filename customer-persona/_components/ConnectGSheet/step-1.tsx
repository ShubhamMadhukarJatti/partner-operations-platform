import React from 'react'
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

type Props = {
  onClose: () => void
  onContinue: () => void
}

function Step1({ onClose, onContinue }: Props) {
  // const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleOnContinue = () => {
    try {
      // setIsLoading(true)
      onContinue?.()
      // setIsLoading(false)
    } catch (error) {
      // setIsLoading(false)
    }
  }

  return (
    <DrawerContent className='max-w-[90%] gap-2 rounded-2xl px-5 py-4 md:max-w-[483px]'>
      <DrawerHeader>
        <DrawerClose asChild>
          <Button
            variant='ghost'
            className='flex justify-end p-0 hover:bg-transparent'
            onClick={() => onClose()}
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
      <Image
        src={'/icons/sharkdom-sheets-logo.svg'}
        alt='sharkdom-sheets-icon'
        width={115}
        height={64}
        className='flex aspect-[4/1] w-full items-center'
      />
      <DrawerTitle className='mb-4 text-pretty text-center text-2xl font-bold text-black'>
        Sharkdom uses <span className='text-[#21A464]'>Google Sheets</span> to
        connect your account
      </DrawerTitle>
      <DrawerDescription className='rounded-lg border border-[#E4E7EE] bg-[#F8FBFF] p-4'>
        <div className='my-2 flex items-start gap-2'>
          <Image
            src={'/icons/share.svg'}
            alt='share-icon'
            width={35}
            height={35}
          />
          <div>
            <h6 className='text-lg font-bold text-[#4D5C78]'>
              Connect Effortlessely
            </h6>
            <p className='text-sm text-[#4D5C78]'>
              Sharkdom lets you securely connect your marketing data in couple
              of minutes.
            </p>
          </div>
        </div>
        <div className='my-2 flex items-start gap-2'>
          <Image
            src={'/icons/eye-slash.svg'}
            alt='eye-slash'
            width={35}
            height={35}
          />
          <div>
            <h6 className='text-lg font-bold text-[#4D5C78]'>
              Your data belongs to you
            </h6>
            <p className='text-sm text-[#4D5C78]'>
              Sharkdom doesn’t sell personal info, and will only use it with
              your permission.
            </p>
          </div>
        </div>
      </DrawerDescription>
      <DrawerFooter className='mt-6 gap-6 sm:flex sm:flex-col'>
        <div className='flex flex-col items-center'>
          <p className='text-sm text-[#4D5C78]'>
            By selecting “Continue” you agree to the
          </p>
          <p className='text-sm font-bold text-[#0062F1]'>
            Sharkdom End User Privacy Policy
          </p>
        </div>
        <Button
          onClick={handleOnContinue}
          className='h-12 w-full rounded-lg text-base font-bold leading-5 disabled:bg-text-20 disabled:text-text-60'
          // loading={isLoading}
          loadingText='Continue...'
        >
          Continue
        </Button>
      </DrawerFooter>
    </DrawerContent>
  )
}

export default Step1
