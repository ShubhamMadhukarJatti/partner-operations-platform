import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

type Props = {
  totalPartners: number
  invitedPartners: number
  verifiedPartners: number
  onboardedPartners: number
}

const OfflinePartnerStats = ({
  totalPartners,
  invitedPartners,
  verifiedPartners,
  onboardedPartners
}: Props) => {
  return (
    <div className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4'>
      <div className='relative overflow-hidden rounded-2xl border border-[#E4E7EE] p-4'>
        <div className='absolute right-[-10px] top-0 flex h-full w-1/2 justify-end lg:w-28'>
          <Image
            src={'assets/blue-illustration.svg'}
            alt='blue-illustration'
            width={100}
            height={100}
            className='h-full w-full'
          />
        </div>
        <p>Total Partners</p>
        <div className='py-1'>
          <span className='text-shark-xl font-bold text-text-100'>
            {totalPartners}
          </span>{' '}
          <span className='text-shark-sm text-text-100'>added</span>
        </div>

        <Link
          // href={`https://doc.sharkdom.com/section/all-partners/proposal-credits`}
          href={'#'}
          className='flex items-center gap-2 pt-2 text-sm font-medium text-primary hover:no-underline'
          target='_blank'
        >
          <span>Learn more</span>
          <ArrowUpRight className='h-4 w-4 border-b border-primary underline' />
        </Link>
      </div>
      <div className='relative overflow-hidden rounded-2xl border border-[#E4E7EE] p-4'>
        <div className='absolute right-[-10px] top-0 flex h-full w-1/2 justify-end lg:w-28'>
          <Image
            src={'assets/green-illustration.svg'}
            alt='green-illustration'
            width={100}
            height={100}
            className='h-full w-full'
          />
        </div>
        <p>Invited Partners</p>
        <div className='py-1'>
          <span className='text-xl font-bold text-[rgb(42,50,65)]'>
            {invitedPartners}
          </span>{' '}
          <span className='text-sm text-[#2A3241]'>added</span>
        </div>

        <Link
          // href={`https://doc.sharkdom.com/section/all-partners/proposal-credits`}
          href={'#'}
          className='flex items-center gap-2 pt-2 text-sm font-medium text-primary hover:no-underline'
          target='_blank'
        >
          <span>Learn more</span>
          <ArrowUpRight className='h-4 w-4 border-b border-primary underline' />
        </Link>
      </div>
      <div className='relative overflow-hidden rounded-2xl border border-[#E4E7EE] p-4'>
        <div className='absolute right-[-10px] top-0 flex h-full w-1/2 justify-end lg:w-28'>
          <Image
            src={'assets/orange-illustration.svg'}
            alt='orange-illustration'
            width={100}
            height={100}
            className='h-full w-full'
          />
        </div>
        <p>Verified Partners</p>
        <div className='py-1'>
          <span className='text-xl font-bold text-[#2A3241]'>
            {verifiedPartners}
          </span>{' '}
          <span className='text-sm text-[#2A3241]'>added</span>
        </div>

        <Link
          // href={`https://doc.sharkdom.com/section/all-partners/proposal-credits`}
          href={'#'}
          className='flex items-center gap-2 pt-2 text-sm font-medium text-primary hover:no-underline'
          target='_blank'
        >
          <span>Learn more</span>
          <ArrowUpRight className='h-4 w-4 border-b border-primary underline' />
        </Link>
      </div>
      <div className='relative overflow-hidden rounded-2xl border border-[#E4E7EE] p-4'>
        <div className='absolute right-[-10px] top-0 flex h-full w-1/2 justify-end lg:w-28'>
          <Image
            src={'assets/red-illustration.svg'}
            alt='red-illustration'
            width={100}
            height={100}
            className='h-full w-full'
          />
        </div>
        <p>Partners Onboarded</p>
        <div className='py-1'>
          <span className='text-xl font-bold text-[#2A3241]'>
            {onboardedPartners}
          </span>{' '}
          <span className='text-sm text-[#2A3241]'>added</span>
        </div>

        <Link
          // href={`https://doc.sharkdom.com/section/all-partners/proposal-credits`}
          href={'#'}
          className='flex items-center gap-2 pt-2 text-sm font-medium text-primary hover:no-underline'
          target='_blank'
        >
          <span>Learn more</span>
          <ArrowUpRight className='h-4 w-4 border-b border-primary underline' />
        </Link>
      </div>
    </div>
  )
}

export default OfflinePartnerStats
