'use client'

import { FC, ReactNode } from 'react'

interface SubtitleProps {
  children: ReactNode
}

export const Subtitle: FC<SubtitleProps> = ({ children }) => {
  return (
    <p className='mb-4 flex justify-center text-center font-inter text-3xl font-semibold'>
      {children}
    </p>
  )
}
