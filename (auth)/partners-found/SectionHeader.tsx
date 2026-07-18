'use client'

import { FC } from 'react'
import Image from 'next/image'

import { Header } from '@/app/onboarding-v2.1/components/Header/Header'
import { Subtitle } from '@/app/onboarding-v2.1/components/Subtitle/Subtitle'

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
    <div className='flex flex-col pt-14'>
      {!step && (
        <div className='flex justify-center  pb-4'>
          <div className=''>
            <Image src={image} alt='sharkdom' height={50} width={50} />
          </div>
        </div>
      )}
      <Subtitle>{title}</Subtitle>
      <Header styles='w-full'>{subtitle}</Header>
    </div>
  )
}
