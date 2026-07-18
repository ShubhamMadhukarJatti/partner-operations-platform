'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CirclePlus,
  DollarSign,
  Folder,
  Home,
  List,
  LogOut,
  MessageCircleQuestion,
  Settings
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { NewFullLogo } from '@/components/icons/logo'
import {
  PARTNER_PORTAL_COMMISSION_PATH,
  PARTNER_PORTAL_DASHBOARD_PATH,
  PARTNER_PORTAL_INFORMATION_PATH,
  PARTNER_PORTAL_LEAD_DIRECTORY_PATH,
  PARTNER_PORTAL_LEAD_SUBMISSION_PATH,
  PARTNER_PORTAL_RESOURCES_PATH
} from '@/app/partner-program-portal-app/constants'

const navItems: { label: string; icon: typeof Home; href?: string }[] = [
  { label: 'Dashboard', icon: Home, href: PARTNER_PORTAL_DASHBOARD_PATH },
  {
    label: 'Submit Lead',
    icon: CirclePlus,
    href: PARTNER_PORTAL_LEAD_SUBMISSION_PATH
  },
  { label: 'My Leads', icon: List, href: PARTNER_PORTAL_LEAD_DIRECTORY_PATH },
  {
    label: 'Commission',
    icon: DollarSign,
    href: PARTNER_PORTAL_COMMISSION_PATH
  },
  { label: 'Resources', icon: Folder, href: PARTNER_PORTAL_RESOURCES_PATH },
  {
    label: 'Profile & Settings',
    icon: Settings,
    href: PARTNER_PORTAL_INFORMATION_PATH
  },
  { label: 'Get Help', icon: MessageCircleQuestion }
]

type PartnerPortalSidebarProps = {
  onSignOut: () => void
}

export function PartnerPortalSidebar({ onSignOut }: PartnerPortalSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className='fixed left-0 top-0 z-40 flex h-dvh w-[220px] flex-col overflow-y-auto bg-[#F1F1FF]'>
      <div className='box-border border-b border-white/10 px-5 pb-px pt-5'>
        <div className='flex flex-col gap-0.5'>
          <NewFullLogo className='h-7 w-[160px]' />
          <p className='text-xs font-normal leading-[18px] text-[#364153]'>
            Partner Portal
          </p>
        </div>
      </div>

      <nav className='flex flex-1 flex-col pt-3'>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = Boolean(item.href && pathname === item.href)
          const rowClass = cn(
            'flex h-[41px] w-full items-center gap-3 pl-5 transition-colors',
            active &&
              'bg-gradient-to-r from-[rgba(185,207,255,0.8)] to-[rgba(222,176,255,0.8)]',
            item.href &&
              'cursor-pointer hover:bg-[rgba(185,207,255,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6863FB]',
            !item.href && 'cursor-default'
          )
          const iconClass = cn(
            'size-[18px] shrink-0',
            active ? 'text-[#1A1A2E]' : 'text-[#364153]'
          )
          const labelClass = cn(
            'text-sm font-medium leading-[21px]',
            active ? 'text-[#1A1A2E]' : 'text-[#364153]',
            item.label === 'Get Help' && 'font-normal'
          )

          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={rowClass}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={iconClass} strokeWidth={1.5} aria-hidden />
                <span className={labelClass}>{item.label}</span>
              </Link>
            )
          }

          return (
            <div key={item.label} className={rowClass}>
              <Icon className={iconClass} strokeWidth={1.5} aria-hidden />
              <span className={labelClass}>{item.label}</span>
            </div>
          )
        })}
      </nav>

      <div className='border-t border-white/10 px-4 pb-4 pt-[17px]'>
        <button
          type='button'
          onClick={onSignOut}
          className='flex items-center gap-2 text-[13px] font-medium leading-5 text-[#364153] hover:text-[#1A1A2E]'
        >
          <LogOut className='size-4 shrink-0' strokeWidth={1.33} aria-hidden />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
