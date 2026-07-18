import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

type Props = {
  onImportPartners?: () => void
  Heading?: string
  Description?: string
}

const OfflinePartnersEmptyState = ({
  onImportPartners,
  Heading,
  Description
}: Props) => {
  return (
    <div
      // style={{
      //   background:
      //     'linear-gradient(95.75deg, #E4EEFF -9.27%, #FFFFFF 51.72%, #FFFFFF 112.7%)'
      // }}
      // className='relative items-center justify-center gap-8'

      className='w-full'
    >
      {/* <div className='absolute bottom-0 right-0'>
        <Image src='/dots.svg' alt='dots' height={200} width={200} />
      </div> */}
      <div className='flex items-center justify-center gap-4'>
        <Image
          src='/nature,wildlife,adventure,outdoors,eco-friendly.svg'
          alt='handshake'
          height={157}
          width={148}
        />
      </div>
      <div className='items-center justify-center gap-4 pt-4'>
        <div className='w-full text-center text-base font-bold leading-none tracking-normal'>
          {Heading ?? 'No Active Partners!'}
        </div>
      </div>
      <div className='flex justify-center gap-4'>
        <div className='w-[450px] py-2 text-center text-sm text-slate-500'>
          {Description ??
            'It looks like you haven’t imported any external partners yet. Once completed, you can manage your partner journey'}
        </div>
      </div>
      {onImportPartners && (
        <div className='flex items-center justify-center gap-4'>
          <Button onClick={onImportPartners}>Import your partners</Button>
        </div>
      )}

      {/* <div className='flex justify-between gap-10 text-shark-blue-700'>
        <div className='flex flex-col items-start gap-2'>
          <Image
            src={'/tick-verify.svg'}
            className='pt-1'
            alt='tick verify'
            height={16}
            width={16}
          />{' '}
          <div className='text-sm'>
            Manage all partnerships at <br /> one place
          </div>
        </div>
        <div className='flex flex-col items-start gap-2'>
          <Image
            src={'/tick-verify.svg'}
            className='pt-1'
            alt='tick verify'
            height={16}
            width={16}
          />{' '}
          <div className='text-sm'>
            Keep track of all partnership <br /> documents
          </div>
        </div>
        <div className='flex flex-col items-start gap-2'>
          <Image
            src={'/tick-verify.svg'}
            className='pt-1'
            alt='tick verify'
            height={16}
            width={16}
          />{' '}
          <div className='text-sm'>
            Streamline communciation <br /> with partners
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default OfflinePartnersEmptyState
