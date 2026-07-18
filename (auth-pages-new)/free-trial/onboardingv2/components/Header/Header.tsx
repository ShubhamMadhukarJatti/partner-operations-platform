'use client'

import { FC, ReactNode } from 'react'

interface HeaderProps {
  children: ReactNode
  styles?: string
}

export const Header: FC<HeaderProps> = ({ children, styles }) => {
  return (
    <h1
      className={[
        'font-inter] mb-[30px] text-[28px] font-medium text-[#2A3241]',
        styles
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </h1>
  )
}
