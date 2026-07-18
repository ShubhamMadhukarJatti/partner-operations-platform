import { Bell } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  PARTNER_PORTAL_DUMMY_AVATAR_INITIAL,
  PARTNER_PORTAL_DUMMY_DISPLAY_NAME
} from '@/app/partner-program-portal-app/constants'

export type PartnerPortalHeaderProps = {
  displayName?: string
  avatarInitial?: string
  partnershipTier?: string
}

export function PartnerPortalHeader({
  displayName,
  avatarInitial,
  partnershipTier
}: PartnerPortalHeaderProps) {
  const initial =
    avatarInitial?.trim().slice(0, 1) || PARTNER_PORTAL_DUMMY_AVATAR_INITIAL

  const isChampion = partnershipTier === 'CHAMPION_PARTNER'

  return (
    <header className='sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-solid border-[#E5E7EB] bg-white px-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] dark:bg-card'>
      <p className='text-sm font-normal leading-[21px] text-[#6A7282]'>
        Welcome back,{' '}
        <span className='font-bold text-[#1A1A2E]'>{displayName}</span>
      </p>
      <div className='flex items-center gap-3'>
        <div
          className={cn(
            'rounded-full px-2.5 py-0.5',
            isChampion ? 'bg-[rgba(245,166,35,0.2)]' : 'bg-[#E5E7EB]'
          )}
        >
          <span
            className={cn(
              'text-[11px] font-bold uppercase leading-4 tracking-[0.275px]',
              isChampion ? 'text-[#B8860B]' : 'text-[#4A5565]'
            )}
          >
            {isChampion ? 'Champion Partner' : 'Referral Partner'}
          </span>
        </div>
        <button
          type='button'
          className='flex size-8 items-center justify-center text-[#6A7282] hover:text-[#364153]'
          aria-label='Notifications'
        >
          <Bell className='size-5' strokeWidth={1.67} />
        </button>
        <div className='flex size-8 items-center justify-center rounded-full bg-[#6863FB] text-[13px] font-bold leading-5 text-white'>
          {initial}
        </div>
      </div>
    </header>
  )
}
