'use client'

import { FC, ReactNode } from 'react'

interface SubtitleProps {
  children: ReactNode
}

export const Subtitle: FC<SubtitleProps> = ({ children }) => {
  return (
    <p className='mb-[20px] font-inter text-[16px] font-normal text-[#2A3241]'>
      {children}
    </p>
  )
}
