import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type Props = {}

const BreadCrumbs = (props: Props) => {
  return (
    <div className='flex items-center gap-0.5 py-7'>
      <Link href={'/explore'}>
        <p className='text-sm text-[#0062F1]'>Explore</p>
      </Link>
      <ChevronRight className='size-4 text-[#A9ABB5]' />
      <p className='text-sm text-[#272727]'>Litmus.ai</p>
    </div>
  )
}

export default BreadCrumbs
