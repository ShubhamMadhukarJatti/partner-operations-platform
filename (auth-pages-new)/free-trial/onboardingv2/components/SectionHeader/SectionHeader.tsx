'use client'

import { FC } from 'react'

import { Header } from '../Header/Header'
import { Subtitle } from '../Subtitle/Subtitle'

interface SectionHeaderProps {
  title: string
  subtitle: string
}

export const SectionHeader: FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <>
      <Subtitle>{title}</Subtitle>
      <Header styles='mb-[30px] w-full max-w-[750px] text-center'>
        {subtitle}
      </Header>
    </>
  )
}
