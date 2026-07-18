'use client'

import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  colors,
  icons,
  navigationItems
} from '@/lib/constants/subscription-constants'

interface SidebarNavigationProps {
  className?: string
  onTabChange?: (tab: string) => void
  currentTab?: string
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  className = '',
  onTabChange,
  currentTab
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['profile'])
  )
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const handleSubmenuClick = (subItemId: string) => {
    // Handle navigation to different pages
    if (subItemId === 'partnership-details') {
      router.push('/settings/partner-details')
      return
    }

    if (subItemId === 'subscription-billing') {
      router.push('/settings/subscription-billing')
      return
    }

    if (subItemId === 'company-details') {
      router.push('/settings/company-details')
      return
    }

    if (subItemId === 'notifications') {
      router.push('/settings/notifications')
      return
    }

    if (subItemId === 'all-members') {
      router.push('/settings/team')
      return
    }

    if (subItemId === 'pending-sign-in') {
      router.push('/settings/team?tab=pending-invites')
      return
    }

    // Handle any other tab changes
    if (onTabChange) {
      onTabChange(subItemId)
    }
  }

  return (
    <div
      className={`h-screen w-80 ${className}`}
      style={{ backgroundColor: colors.sidebar.background }}
    >
      {/* Back to Dashboard */}
      <div className='p-6 pb-4'>
        <div
          className='flex cursor-pointer items-center gap-2 text-sm transition-colors hover:opacity-80'
          style={{ color: colors.sidebar.text }}
          onClick={() => router.push('/explore')}
        >
          <icons.ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className='space-y-1 px-6'>
        {navigationItems.map((item) => {
          if (item.isHeader) {
            return (
              <div key={item.id} className='pb-2 pt-4'>
                <span
                  className='text-xs font-medium uppercase tracking-wide'
                  style={{ color: colors.sidebar.textLight }}
                >
                  {item.label}
                </span>
              </div>
            )
          }

          const IconComponent = item.icon
          const SecondaryIconComponent = item.secondaryIcon

          // Check if this main item is active
          let isMainItemActive = false
          if (isClient && !item.hasSubmenu) {
            if (item.id === 'notifications') {
              isMainItemActive = pathname === '/settings/notifications'
            } else if (item.id === 'all-members') {
              isMainItemActive =
                pathname === '/settings/team' &&
                searchParams.get('tab') !== 'pending-invites'
            } else if (item.id === 'pending-sign-in') {
              isMainItemActive =
                pathname === '/settings/team' &&
                searchParams.get('tab') === 'pending-invites'
            }
          }

          return (
            <div key={item.id}>
              <div
                className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors ${
                  isMainItemActive
                    ? 'font-medium'
                    : 'hover:bg-gray-100 dark:bg-white/10'
                }`}
                style={{
                  backgroundColor: isMainItemActive
                    ? colors.sidebar.activeBackground
                    : 'transparent'
                }}
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleExpanded(item.id)
                  } else {
                    handleSubmenuClick(item.id)
                  }
                }}
              >
                <div className='flex items-center gap-3'>
                  {IconComponent && (
                    <IconComponent
                      size={16}
                      style={{
                        color: isMainItemActive
                          ? colors.sidebar.activeText
                          : colors.sidebar.text
                      }}
                    />
                  )}
                  <span
                    className='text-sm font-medium'
                    style={{
                      color: isMainItemActive
                        ? colors.sidebar.activeText
                        : colors.sidebar.text
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  {SecondaryIconComponent && (
                    <SecondaryIconComponent
                      size={14}
                      style={{ color: colors.sidebar.text }}
                    />
                  )}
                  {item.hasSubmenu && (
                    <icons.ChevronDown
                      size={14}
                      style={{ color: colors.sidebar.text }}
                      className={`transition-transform ${expandedItems.has(item.id) ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>
              </div>

              {/* Submenu */}
              {item.hasSubmenu &&
                item.submenu &&
                expandedItems.has(item.id) && (
                  <div className='ml-6 mt-1 space-y-1'>
                    {item.submenu.map((subItem) => {
                      // Handle active state for different pages
                      let isActive = false
                      if (isClient) {
                        if (subItem.id === 'partnership-details') {
                          // Check if we're on the partner-details page
                          isActive = pathname === '/settings/partner-details'
                        } else if (subItem.id === 'subscription-billing') {
                          // Check if we're on the subscription-billing page
                          isActive =
                            pathname === '/settings/subscription-billing'
                        } else if (subItem.id === 'company-details') {
                          // Check if we're on the company-details page
                          isActive = pathname === '/settings/company-details'
                        } else {
                          // Handle any other tab-based navigation
                          const tabMapping: { [key: string]: string } = {
                            'company-details': 'COMPANY_DETAILS'
                          }

                          const tabValue = tabMapping[subItem.id]

                          // If we're on a dedicated page, don't show any other tab as active
                          const isOnDedicatedPage =
                            pathname === '/settings/partner-details' ||
                            pathname === '/settings/subscription-billing' ||
                            pathname === '/settings/company-details' ||
                            pathname === '/settings/notifications'

                          if (isOnDedicatedPage) {
                            isActive = false
                          } else {
                            isActive =
                              currentTab === tabValue ||
                              (subItem.isActive ?? false)
                          }
                        }
                      } else {
                        // During SSR, use the default active state
                        isActive = subItem.isActive ?? false
                      }

                      return (
                        <div
                          key={subItem.id}
                          className={`cursor-pointer rounded px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? 'font-medium'
                              : 'hover:bg-gray-100 dark:bg-white/10'
                          }`}
                          style={{
                            backgroundColor: isActive
                              ? colors.sidebar.activeBackground
                              : 'transparent',
                            color: isActive
                              ? colors.sidebar.activeText
                              : colors.sidebar.text
                          }}
                          onClick={() => handleSubmenuClick(subItem.id)}
                        >
                          {subItem.label}
                        </div>
                      )
                    })}
                  </div>
                )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SidebarNavigation
