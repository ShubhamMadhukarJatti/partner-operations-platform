import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/partner-programs/home' },
  // { name: 'Analytics', href: '/analytics' },
  { name: 'Partners', href: '/partner-programs/partners' }
]

const PartnerProgramsSidebar = () => {
  const pathname = usePathname()

  return (
    <div className='h-full w-[208px] border border-[#E4E7EE] bg-[#F8FBFF]'>
      <nav className='space-y-1 p-4'>
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'block rounded-lg p-2 text-shark-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#E5EFFE] font-bold text-primary-blue'
                  : 'text-text-100'
              )}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default PartnerProgramsSidebar
