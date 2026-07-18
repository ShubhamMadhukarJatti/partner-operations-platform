import React from 'react'
import Link from 'next/link'

import { FullLogo } from '@/components/icons/logo'

type Props = {}

const SendProposalHeader = (props: Props) => {
  return (
    <div className='flex items-center'>
      <Link
        href='/'
        className='flex min-w-[16rem] items-center justify-center text-xl font-semibold'
      >
        <FullLogo className='h-8 w-full md:h-6' />
      </Link>
      <div className='ml-24 w-full'>{/* <ProposalTimeline /> */}</div>
    </div>
  )
}

export default SendProposalHeader
