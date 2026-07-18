'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const sidebarItems = [
  {
    title: 'Data Source',
    href: '/my-data'
  },
  {
    title: 'Manage Groups',
    href: '/my-data/manage-groups'
  },
  {
    title: 'Data Sharing',
    href: '/my-data/data-sharing'
  }
]

const Sidebar = () => {
  const pathname = usePathname()
  console.log({ pathname })
  return (
    <div className='sticky top-0 flex min-h-full w-[208px] flex-col border-r border-[#E4E7EE] bg-[#F8FBFF] p-4'>
      {sidebarItems.map((item, key) => (
        <Link
          key={key}
          className={cn(
            'w-full rounded-lg p-2 text-sm font-semibold text-[#2A3241]',
            item.href === pathname && 'bg-[#E5EFFE] text-[#3E50F7]'
          )}
          href={item.href}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}

export default Sidebar
