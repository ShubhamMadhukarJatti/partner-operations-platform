'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // For the latest version of Next.js

import { cn } from '@/lib/utils'
import { Logo } from '@/components/icons/logo'
import { LogoutButton } from '@/components/shared/logout'

type Props = {}

const AdminHeader = (props: Props) => {
  const pathname = usePathname() // Gets the current pathname

  const routes = [
    { name: 'Search', path: '/admin-portal/search' },
    { name: 'Statistics', path: '/admin-portal/statistics' },
    { name: 'Demo', path: '/admin-portal/demo' },
    { name: 'Partner Alert', path: '/admin-portal/partner-alert' },
    { name: 'Create Template', path: '/admin-portal/create-template' },
    { name: 'Run Trigger', path: '/admin-portal/run-trigger' },
    { name: 'Email Campaigns', path: '/admin-portal/email-campaigns' },
    { name: 'Scheduler', path: '/admin-portal/scheduler' },
    { name: 'AI Recommendation', path: '/admin-portal/ai-recommendation' },
    { name: 'Refresh Tokens', path: '/admin-portal/refresh-tokens' }
  ]

  return (
    <div className='flex items-center justify-between bg-muted px-8 py-4'>
      <Logo className='h-10 w-full' />

      <nav className='flex space-x-4'>
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              'px-3 py-2 text-sm font-medium',
              pathname === route.path
                ? 'bg-primary text-white'
                : 'text-muted-foreground'
            )}
          >
            {route.name}
          </Link>
        ))}
      </nav>

      <LogoutButton isAdmin={true} />
    </div>
  )
}

export default AdminHeader
