'use client'

import { FC, ReactNode } from 'react'

interface HeaderProps {
  children: ReactNode
  styles?: string
}

export const Header: FC<HeaderProps> = ({ children, styles }) => {
  return (
    <p
      className={
        'mb-6 text-center font-inter text-base font-normal text-[#717182]'
      }
    >
      {children}
    </p>
  )
}
