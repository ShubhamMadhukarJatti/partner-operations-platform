import React from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'

import { SidebarItem } from './sidebar-item'

interface SidebarGroupProps {
  section: {
    href?: string
    title: string
    icon?: any
    filledIcon?: any
    tooltip?: string
    items?: Array<{
      name: string
      icon: any
      filledIcon?: any
      href?: string
      tooltip?: string
      notificationCount?: number
      isLocked?: boolean
      matchPattern?: string
      excludePaths?: string[]
      isPinned?: boolean
      onTogglePin?: () => void
      showPinControl?: boolean
    }>
  }
  isOpen: boolean
  onToggle: () => void
  isCollapsed?: boolean
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({
  section,
  isOpen,
  onToggle,
  isCollapsed = false
}) => {
  const pathname = usePathname()

  const isItemActive = (
    href?: string,
    matchPattern?: string,
    excludePaths?: string[]
  ) => {
    if (!href) return false

    if (matchPattern) {
      const patternBase = matchPattern.replace(/\/$/, '')
      const matchesPattern =
        pathname === patternBase || pathname?.startsWith(`${patternBase}/`)

      if (matchesPattern && excludePaths?.length) {
        return !excludePaths.some((excludePath) =>
          pathname?.startsWith(excludePath)
        )
      }

      return matchesPattern
    }

    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  const isSectionActive =
    Boolean(section.href && pathname?.startsWith(section.href)) ||
    Boolean(
      section.items?.some((item) =>
        isItemActive(item.href, item.matchPattern, item.excludePaths)
      )
    )

  if (isCollapsed) {
    return (
      <div className='flex flex-col items-center gap-1'>
        {section.items?.map((item) => {
          const isActive = isItemActive(
            item.href,
            item.matchPattern,
            item.excludePaths
          )

          return (
            <SidebarItem
              key={item.name}
              name=''
              icon={item.icon}
              filledIcon={item.filledIcon}
              href={item.href || '#'}
              tooltip={item.tooltip || item.name}
              notificationCount={item.notificationCount}
              isLocked={item.isLocked}
              isCollapsed
              isActive={isActive}
              isPinned={item.isPinned}
              onTogglePin={item.onTogglePin}
              showPinControl={false}
            />
          )
        })}
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger
        className={cn(
          'h-11 w-full rounded-lg border border-transparent px-2.5 text-[13px] font-medium transition-all duration-200 ease-in-out',
          isSectionActive || isOpen
            ? 'text-[#2A2E8B] dark:text-white'
            : 'text-[#2A3A52] hover:bg-[#EEF2FA] hover:text-[#1C2D49] dark:text-white dark:hover:bg-[#23214D] dark:hover:text-white'
        )}
      >
        <div className='flex w-full items-center justify-between'>
          <div className='flex min-w-0 items-center gap-2.5 text-[#2F3B51] transition-all duration-200 dark:text-white'>
            {section.icon ? <section.icon size={16} /> : null}
            <span className='truncate text-[13px] font-medium text-[#2F3B51] dark:text-white'>
              {section.title}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={cn(
              'shrink-0 text-[#344054] transition-transform duration-200 dark:text-white',
              isOpen ? 'rotate-180' : 'rotate-[-90deg]'
            )}
          />
        </div>
      </CollapsibleTrigger>

      {section.items && (
        <CollapsibleContent
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'
          )}
        >
          <div className='mt-1 space-y-1 pl-4'>
            {section.items.map((item, itemIndex) => {
              const isActive = isItemActive(
                item.href,
                item.matchPattern,
                item.excludePaths
              )

              return (
                <div
                  key={item.name}
                  className={cn(
                    'transform transition-all duration-200 ease-in-out',
                    isOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-[-6px] opacity-0'
                  )}
                  style={{
                    transitionDelay: isOpen ? `${itemIndex * 35}ms` : '0ms'
                  }}
                >
                  <SidebarItem
                    name={item.name}
                    icon={item.icon}
                    filledIcon={item.filledIcon}
                    href={item.href || '#'}
                    tooltip={item.tooltip}
                    notificationCount={item.notificationCount}
                    isLocked={item.isLocked}
                    isCollapsed={false}
                    isActive={isActive}
                    isPinned={item.isPinned}
                    onTogglePin={item.onTogglePin}
                    showPinControl={item.showPinControl}
                  />
                </div>
              )
            })}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

export default SidebarGroup
