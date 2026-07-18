'use client'

import { FC } from 'react'
import Image from 'next/image'

import { Header } from '../Header/Header'
import { Subtitle } from '../Subtitle/Subtitle'

interface SectionHeaderProps {
  title: string
  subtitle: string
  image?: any
  step?: boolean
}

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  subtitle,
  image,
  step
}) => {
  return (
    <div className='flex flex-col pt-10'>
      {/* {!step && (
        <div className='flex justify-center pb-4'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#3E50F71A] p-1'>
            <Image src={image} alt='sharkdom' height={20} width={20} />
          </div>
        </div>
      )} */}
      <Subtitle>{title}</Subtitle>
      <Header styles='w-full'>{subtitle}</Header>
    </div>
  )
}
