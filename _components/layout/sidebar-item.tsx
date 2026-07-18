'use client'

import React, { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from 'iconsax-react'
import { LucideIcon, Pin, PinOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

export type IconComponent = React.ComponentType<any>

interface SidebarItemProps {
  name: string
  icon?: string | LucideIcon | Icon | IconComponent
  filledIcon?: string | LucideIcon | Icon | IconComponent
  isSettings?: boolean
  href: string
  notificationCount?: number
  isLocked?: boolean
  isCollapsed?: boolean
  tooltip?: string
  isActive?: boolean
  isPinned?: boolean
  onTogglePin?: () => void
  showPinControl?: boolean
}

const SidebarItemComponent: React.FC<SidebarItemProps> = ({
  name,
  icon: Icon,
  filledIcon: FilledIcon,
  href,
  notificationCount,
  isLocked,
  isSettings,
  isCollapsed = false,
  tooltip,
  isActive = false,
  isPinned = false,
  onTogglePin,
  showPinControl = false
}) => {
  const router = useRouter()

  const renderIcon = (collapsed?: boolean) => {
    if (!Icon) return null

    return <Icon size={collapsed ? 16 : 16} color='currentColor' />
  }

  const handleMouseEnter = useCallback(() => {
    if (!isLocked) {
      router.prefetch(href)
    }
  }, [router, href, isLocked])

  const showPin = !isCollapsed && showPinControl && Boolean(onTogglePin)

  const content = (
    <>
      <span
        className={cn(
          'flex min-w-0 items-center gap-2 font-[500]',
          isActive
            ? 'text-[#475467] dark:text-[#111111]'
            : 'text-[#4D5C78] dark:text-white'
        )}
      >
        <span className='shrink-0'>{renderIcon()}</span>
        {!isCollapsed && (
          <span
            className={cn(
              'truncate',
              isActive
                ? 'text-[#475467] dark:text-[#111111]'
                : 'text-[#4D5C78] dark:text-white'
            )}
          >
            {name}
          </span>
        )}
      </span>

      <span className='flex shrink-0 items-center gap-1'>
        {notificationCount !== undefined && notificationCount > 0 && (
          <span className='rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground'>
            {notificationCount}
          </span>
        )}

        {showPin && isActive && (
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <button
                type='button'
                aria-label={isPinned ? `Unpin ${name}` : `Pin ${name}`}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onTogglePin?.()
                }}
                className={cn(
                  'inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#9AA7BF] transition-colors hover:bg-[#EEF3FC] hover:text-[#5F6B81]',
                  isPinned && 'text-[#7B6BFF]'
                )}
              >
                {isPinned ? (
                  <PinOff size={12} className='rotate-45' />
                ) : (
                  <Pin size={12} className='rotate-45' color='#9AA7BF' />
                )}
              </button>
            </TooltipTrigger>

            <TooltipContent
              side='right'
              align='center'
              sideOffset={12}
              className='relative left-[21px] overflow-visible whitespace-nowrap rounded-[12px] border border-[#EAECF0] bg-white px-[13px] py-[6px] text-[14px] font-[500] text-[#344054] shadow-[0px_4px_14px_rgba(16,24,40,0.06)]'
            >
              <span className='absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-l border-[#EAECF0] bg-white' />

              <span className='relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-[400] leading-[26px] tracking-[-0.31px]'>
                {isPinned ? (
                  'Click on pin icon to unpin item'
                ) : (
                  <>
                    <span>Click on</span>
                    <Pin size={14} className='rotate-45 text-[#98A2B3]' />
                    <span>icon to Pin your favourite items</span>
                  </>
                )}
              </span>
            </TooltipContent>
          </Tooltip>
        )}
      </span>
    </>
  )

  if (isCollapsed) {
    const collapsedButton = (
      <Button
        asChild={!isLocked}
        disabled={isLocked}
        className={cn(
          'h-[32px] w-[30px] rounded-xl border border-transparent bg-transparent p-0 shadow-none transition-all duration-200',
          'hover:bg-[#F2F4F7]',
          {
            'cursor-not-allowed opacity-50 hover:bg-transparent': !!isLocked,
            'bg-[#EEF2FF] shadow-[inset_0_0_0_1px_rgba(224,231,255,1)] hover:bg-[#EEF2FF]':
              isActive && !isLocked
          }
        )}
      >
        {isLocked ? (
          <span className='flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl'>
            {renderIcon(true)}
          </span>
        ) : (
          <Link
            href={href}
            className='flex h-11 w-11 items-center justify-center rounded-xl'
            onMouseEnter={handleMouseEnter}
          >
            <span className='flex items-center justify-center'>
              {renderIcon(true)}
            </span>
          </Link>
        )}
      </Button>
    )

    return (
      <Tooltip delayDuration={180}>
        <TooltipTrigger asChild>{collapsedButton}</TooltipTrigger>
        {tooltip && (
          <TooltipContent side='right' align='center' sideOffset={10}>
            {tooltip}
          </TooltipContent>
        )}
      </Tooltip>
    )
  }

  const buttonElement = (
    <Button
      asChild={!isLocked}
      disabled={isLocked}
      className={cn(
        'mx-0 h-9 justify-start rounded-lg border border-transparent bg-transparent px-2.5 py-0 text-[13px] font-medium shadow-none',
        {
          'text-[#2A3A52] hover:bg-[#EEF2FA] hover:text-[#1C2D49] dark:text-gray-200 dark:hover:bg-[#23214D] dark:hover:text-white':
            !isActive && !isLocked,
          'cursor-not-allowed text-[#9CA3AF] opacity-60 hover:bg-gray-50 dark:hover:bg-accent':
            !!isLocked,
          'bg-[linear-gradient(90deg,_#E5EDFF_0%,_#F3E3FF_100%)] text-[#475467] hover:bg-[linear-gradient(90deg,_#E5EDFF_0%,_#F3E3FF_100%)] dark:bg-[#23214D] dark:text-[#111111] dark:hover:bg-[#23214D]':
            isActive && !isLocked
        }
      )}
    >
      {isLocked ? (
        <span className='flex w-full cursor-not-allowed items-center justify-between gap-2 overflow-hidden'>
          {content}
        </span>
      ) : (
        <Link
          href={href}
          className='flex w-full items-center justify-between gap-2 overflow-hidden'
          onMouseEnter={handleMouseEnter}
        >
          {content}
        </Link>
      )}
    </Button>
  )

  if (tooltip) {
    return (
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
        <TooltipContent
          side='right'
          align='center'
          sideOffset={12}
          className='relative left-[21px] overflow-visible whitespace-nowrap rounded-[12px] border border-[#EAECF0] bg-white px-[13px] py-[6px] text-[14px] font-[500] text-[#344054] shadow-[0px_4px_14px_rgba(16,24,40,0.06)]'
        >
          <span className='absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-l border-[#EAECF0] bg-white' />
          <span className='relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-[400] leading-[26px] tracking-[-0.31px]'>
            {tooltip}
          </span>
        </TooltipContent>
      </Tooltip>
    )
  }

  return buttonElement
}

export const SidebarItem = React.memo(SidebarItemComponent)
