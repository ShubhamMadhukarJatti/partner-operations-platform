'use client'

import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  title: string
}

export const HeaderSection: FC<HeaderProps> = ({ title }) => {
  return (
    <div
      className='m-6 flex flex-col rounded-lg p-3'
      style={{
        border: '1px solid #A1BAF1',
        background:
          'linear-gradient(71deg, rgba(228, 248, 255, 0.60) 5.06%, rgba(255, 255, 255, 0.50) 57.85%, rgba(225, 225, 248, 0.60) 112.82%)'
      }}
    >
      <Link href='/explore'>
        <p className='flex items-center gap-2 text-base font-medium'>
          <ArrowLeft size={20} />
          {title}
        </p>
      </Link>
    </div>
  )
}
