'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import PageHeader from '@/components/shared/page-header'

import Sidebar from './_components/Sidebar'

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex h-full flex-1 overflow-hidden'>
        {/* <Sidebar /> */}
        <div className='hide-scrollbar grow overflow-y-auto'>{children}</div>
      </div>
    </div>
  )
}

export default layout
