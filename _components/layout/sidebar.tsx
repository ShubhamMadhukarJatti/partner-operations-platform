'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { usePricingModal } from '@/contexts/pricing-modal-context'
import { useSidebarView } from '@/contexts/sidebar-view-context'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Check,
  ChevronDown,
  GraduationCap,
  LayoutGrid,
  MailOpen,
  Repeat,
  Send,
  Tag,
  User,
  UserRoundCog,
  Users,
  Users2Icon,
  UsersIcon
} from 'lucide-react'
import { useSelector } from 'react-redux'

import {
  buildDashboardMenuByKind,
  collectDashboardMenuHrefs,
  type DashboardMenuSection
} from '@/lib/dashboard-sidebar-menu'
import { getSubscription } from '@/lib/db/subscription'
import { useDevOnly } from '@/lib/devOnly'
import { getServerUser } from '@/lib/server'
import {
  clearOnboardingRegistrationModeFromStorage,
  fetchSidebarConfigWithRoleHints,
  hasSidebarConfigData,
  postSidebarConfig,
  resolveSidebarRoleHints
} from '@/lib/sidebar-config-client'
import {
  resolveSidebarMenuKind,
  type SidebarConfigApiData,
  type SidebarConfigApiResponse
} from '@/lib/sidebar-config-types'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SheetClose } from '@/components/ui/sheet'
import { FullLogo } from '@/components/icons/logo'
import { SettingsSidebarContent } from '@/app/(app)/(account-settings)/settings/_components/SettingsSidebar'

import { dataIcon, integrationsIcon, SidebarIcon } from './sidebar-icons'
import { IconComponent, SidebarItem } from './sidebar-item'
import SidebarGroup from './SidebarGroup'
import TutorialPopup from './tutorial/TutorialPopup'

type MenuItem = {
  name: string
  icon: IconComponent
  filledIcon: IconComponent
  href?: string
  notificationCount?: number
  isLocked?: boolean
  tooltip?: string
  matchPattern?: string
  excludePaths?: string[]
}

type PinnableItem = {
  name: string
  icon: IconComponent
  filledIcon: IconComponent
  href: string
  tooltip?: string
  notificationCount?: number
  isLocked?: boolean
  matchPattern?: string
  excludePaths?: string[]
}

const SIDEBAR_UI_STORAGE_KEY = 'dashboard.sidebar.ui.v2'
const DEFAULT_PINNED_ITEMS: string[] = []
const SIDEBAR_COLLAPSED_WIDTH = 56
const SIDEBAR_EXPANDED_WIDTH = 272
const SIDEBAR_ANIMATION_DURATION = 0.9

type PersistedSidebarUiState = {
  pinnedItemHrefs: string[]
  openSectionIds: Record<string, boolean>
}

const DEFAULT_SIDEBAR_UI_STATE: PersistedSidebarUiState = {
  pinnedItemHrefs: DEFAULT_PINNED_ITEMS,
  openSectionIds: {}
}

function filterPinnedFromMenuSections(
  sections: DashboardMenuSection[],
  pinned: string[]
): DashboardMenuSection[] {
  const pinnedSet = new Set(pinned)

  return sections
    .map((section) => {
      if (section.href && pinnedSet.has(section.href)) return null

      if (!section.items?.length) {
        return section
      }

      const items = section.items.filter(
        (i) => i.href && !pinnedSet.has(i.href)
      )

      if (items.length === 0) return null

      return { ...section, items }
    })
    .filter((s): s is DashboardMenuSection => s != null)
}

const navBottomLinks: {
  name: string
  icon?: IconComponent
  filledIcon?: IconComponent
  href: string
  tooltip?: string
}[] = [
  {
    name: 'Integration',
    icon: integrationsIcon,
    filledIcon: integrationsIcon,
    href: '/integrations',
    tooltip: 'Configure third party apps to navigate b/w various apps'
  },
  {
    name: 'Data Pipeline',
    icon: dataIcon,
    filledIcon: dataIcon,
    href: '/my-data',
    tooltip:
      'Link your data source CRM to access full potential of your partners with one time setup'
  }
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  isViewAnimating?: boolean
  toggleSidebar: () => void
  isSettings: boolean
  onCollapsedFromServer?: (collapsed: boolean) => void
}

export const SidebarContent = ({
  currentOrganization,
  isCollapsed,
  toggleSidebar,
  isInDialog,
  isHovered = false,
  isSettings = false,
  onCollapsedFromServer
}: {
  currentOrganization: OrganizationType
  isCollapsed: boolean
  toggleSidebar: () => void
  isInDialog?: boolean
  isHovered?: boolean
  isSettings?: boolean
  onCollapsedFromServer?: (collapsed: boolean) => void
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const isDev = useDevOnly()
  const { openPricingModal } = usePricingModal()
  const [isClient, setIsClient] = useState(false)
  const [sidebarRoleHint, setSidebarRoleHint] = useState<{
    isVendorView: boolean
    isPartnerView: boolean
  } | null>(null)

  const {
    appViewKind,
    setAppView,
    isViewChangePending,
    isReady: sidebarViewReady,
    userId: sidebarUserId
  } = useSidebarView()
  const showChangeView = Boolean(
    sidebarUserId && sidebarViewReady && !isSettings
  )

  const configHydratedRef = React.useRef(false)
  const sidebarBootstrapRef = React.useRef(false)
  const latestRemoteConfigRef = React.useRef<SidebarConfigApiData | null>(null)
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { data: authUser } = useQuery({
    queryKey: ['sidebar-view-auth-user'],
    queryFn: async () => {
      const { user } = await getServerUser()
      return user
    },
    enabled: isClient && !isSettings,
    staleTime: 5 * 60 * 1000,
    retry: false
  })

  const userId = authUser?.uid ?? null

  const { data: sidebarConfigResponse, isFetched: sidebarConfigFetched } =
    useQuery({
      queryKey: ['sidebar-config', userId],
      queryFn: () => fetchSidebarConfigWithRoleHints(userId!),
      enabled: Boolean(userId) && !isSettings,
      staleTime: 60 * 1000,
      refetchOnMount: 'always',
      retry: false
    })

  const { data: subscription, isLoading: subscriptionLoading } = useQuery<any>({
    queryKey: ['get-subscription-data'],
    queryFn: () => getSubscription(),
    enabled: isClient
  })

  const isActiveSubscription = subscription?.status === 'ACTIVE'
  const [isTrialCardMinimized, setIsTrialCardMinimized] = useState(false)

  const [sidebarUiState, setSidebarUiState] = useState<PersistedSidebarUiState>(
    DEFAULT_SIDEBAR_UI_STATE
  )

  const isActiveFor = useMemo(() => {
    return (href: string, matchPattern?: string, excludePaths?: string[]) => {
      if (matchPattern) {
        const patternBase = matchPattern.replace(/\/$/, '')
        const matchesPattern =
          pathname === patternBase || pathname?.startsWith(`${patternBase}/`)

        if (matchesPattern && excludePaths) {
          return !excludePaths.some((excludePath) =>
            pathname?.startsWith(excludePath)
          )
        }

        return matchesPattern
      }

      return pathname === href || pathname?.startsWith(`${href}/`)
    }
  }, [pathname])

  const shouldShowExpandedContent = !isCollapsed || isHovered
  const collapsedOnly = isCollapsed && !isHovered

  const menuKind = useMemo(() => {
    if (isSettings) return 'legacy' as const

    if (sidebarConfigResponse?.data) {
      return resolveSidebarMenuKind(sidebarConfigResponse.data)
    }

    if (sidebarRoleHint) {
      return resolveSidebarMenuKind(sidebarRoleHint)
    }

    return 'vendor' as const
  }, [isSettings, sidebarConfigResponse?.data, sidebarRoleHint])

  const menuSections: DashboardMenuSection[] = useMemo(
    () => buildDashboardMenuByKind(menuKind, isDev),
    [menuKind, isDev]
  )

  const visibleMenuSections = useMemo(
    () =>
      filterPinnedFromMenuSections(
        menuSections,
        sidebarUiState.pinnedItemHrefs
      ),
    [menuSections, sidebarUiState.pinnedItemHrefs]
  )

  const queueSidebarConfigSave = useCallback(
    (next: PersistedSidebarUiState, collapsed: boolean) => {
      if (!userId || isSettings || !configHydratedRef.current) return

      const remote = latestRemoteConfigRef.current

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)

      saveTimerRef.current = setTimeout(() => {
        const body: SidebarConfigApiData = {
          userId,
          pinnedItemHrefs: next.pinnedItemHrefs,
          openNestedItems: next.openSectionIds,
          isCollapsed: collapsed,
          isPartnerView: remote?.isPartnerView ?? false,
          isVendorView: remote?.isVendorView ?? false,
          sidebarItemHrefs: collectDashboardMenuHrefs(menuSections)
        }

        fetch('/api/sidebar-config', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).catch(() => {})
      }, 600)
    },
    [userId, isSettings, menuSections]
  )

  useEffect(() => {
    if (typeof window === 'undefined' || userId || isSettings) return

    try {
      const raw = localStorage.getItem(SIDEBAR_UI_STORAGE_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw)

      setSidebarUiState({
        pinnedItemHrefs: Array.isArray(parsed?.pinnedItemHrefs)
          ? parsed.pinnedItemHrefs.filter(
              (value: unknown) => typeof value === 'string'
            )
          : DEFAULT_PINNED_ITEMS,
        openSectionIds:
          parsed?.openSectionIds && typeof parsed.openSectionIds === 'object'
            ? parsed.openSectionIds
            : typeof parsed?.openSections === 'object' && parsed.openSections
              ? parsed.openSections
              : {}
      })
    } catch {
      setSidebarUiState(DEFAULT_SIDEBAR_UI_STATE)
    }
  }, [userId, isSettings])

  useEffect(() => {
    if (typeof window === 'undefined' || userId || isSettings) return
    localStorage.setItem(SIDEBAR_UI_STORAGE_KEY, JSON.stringify(sidebarUiState))
  }, [sidebarUiState, userId, isSettings])

  useEffect(() => {
    configHydratedRef.current = false
    sidebarBootstrapRef.current = false
    setSidebarRoleHint(null)
  }, [userId])

  useEffect(() => {
    if (
      !userId ||
      isSettings ||
      configHydratedRef.current ||
      !sidebarConfigFetched
    ) {
      return
    }

    const cfg = sidebarConfigResponse as SidebarConfigApiResponse | null
    if (!hasSidebarConfigData(cfg)) return

    configHydratedRef.current = true
    const data = cfg!.data!
    latestRemoteConfigRef.current = data

    setSidebarUiState({
      pinnedItemHrefs: Array.isArray(data.pinnedItemHrefs)
        ? data.pinnedItemHrefs.filter((h: unknown) => typeof h === 'string')
        : [],
      openSectionIds:
        data.openNestedItems && typeof data.openNestedItems === 'object'
          ? data.openNestedItems
          : {}
    })

    onCollapsedFromServer?.(Boolean(data.isCollapsed))
  }, [
    userId,
    isSettings,
    sidebarConfigFetched,
    sidebarConfigResponse,
    onCollapsedFromServer
  ])

  useEffect(() => {
    if (
      !userId ||
      isSettings ||
      !sidebarConfigFetched ||
      sidebarBootstrapRef.current
    ) {
      return
    }

    if (hasSidebarConfigData(sidebarConfigResponse)) return

    sidebarBootstrapRef.current = true
    let cancelled = false

    ;(async () => {
      try {
        const hints = await resolveSidebarRoleHints(userId)
        const isVendorView = hints.isVendor
        const isPartnerView = hints.isPartner

        if (cancelled) return

        setSidebarRoleHint({ isVendorView, isPartnerView })

        const kind = resolveSidebarMenuKind({ isVendorView, isPartnerView })
        const sections = buildDashboardMenuByKind(kind, isDev)
        const sidebarItemHrefs = collectDashboardMenuHrefs(sections)

        const body: SidebarConfigApiData = {
          userId,
          pinnedItemHrefs: [],
          openNestedItems: {},
          isCollapsed: false,
          isPartnerView,
          isVendorView,
          sidebarItemHrefs
        }

        const postResult = await postSidebarConfig(body)
        if (cancelled) return

        if (postResult) {
          clearOnboardingRegistrationModeFromStorage()

          await queryClient.invalidateQueries({
            queryKey: ['sidebar-config', userId]
          })

          await queryClient.refetchQueries({
            queryKey: ['sidebar-config', userId]
          })

          const after = queryClient.getQueryData([
            'sidebar-config',
            userId
          ]) as SidebarConfigApiResponse | null

          if (!hasSidebarConfigData(after)) {
            configHydratedRef.current = true
          }
        } else {
          configHydratedRef.current = true
        }
      } catch {
        if (!cancelled) configHydratedRef.current = true
      }
    })()

    return () => {
      cancelled = true
    }
  }, [
    userId,
    isSettings,
    isDev,
    sidebarConfigFetched,
    sidebarConfigResponse,
    queryClient
  ])

  useEffect(() => {
    const d = sidebarConfigResponse?.data
    if (d) latestRemoteConfigRef.current = d
  }, [sidebarConfigResponse])

  useEffect(() => {
    setSidebarUiState((prev) => {
      const nextOpen = { ...prev.openSectionIds }
      let changed = false

      menuSections.forEach((section) => {
        if (!section.items?.length) return
        if (section.id in nextOpen) return

        const hasActiveItem = section.items.some(
          (item) =>
            item.href &&
            isActiveFor(item.href, item.matchPattern, item.excludePaths)
        )

        if (hasActiveItem) {
          nextOpen[section.id] = true
          changed = true
        }
      })

      return changed
        ? {
            ...prev,
            openSectionIds: nextOpen
          }
        : prev
    })
  }, [menuSections, pathname, isActiveFor])

  const pinnedItemHrefs = sidebarUiState.pinnedItemHrefs
  const openSectionIds = sidebarUiState.openSectionIds

  const isPinnedHref = useCallback(
    (href?: string) => Boolean(href && pinnedItemHrefs.includes(href)),
    [pinnedItemHrefs]
  )

  const handleTogglePin = useCallback(
    (href: string) => {
      setSidebarUiState((prev) => {
        const next = {
          ...prev,
          pinnedItemHrefs: prev.pinnedItemHrefs.includes(href)
            ? prev.pinnedItemHrefs.filter((itemHref) => itemHref !== href)
            : [...prev.pinnedItemHrefs, href]
        }

        queueSidebarConfigSave(next, isCollapsed)
        return next
      })
    },
    [queueSidebarConfigSave, isCollapsed]
  )

  const handleToggleSection = useCallback(
    (sectionId: string) => {
      setSidebarUiState((prev) => {
        const next = {
          ...prev,
          openSectionIds: {
            ...prev.openSectionIds,
            [sectionId]: !prev.openSectionIds[sectionId]
          }
        }

        queueSidebarConfigSave(next, isCollapsed)
        return next
      })
    },
    [queueSidebarConfigSave, isCollapsed]
  )

  const sidebarStateRef = React.useRef(sidebarUiState)
  sidebarStateRef.current = sidebarUiState

  useEffect(() => {
    if (!userId || isSettings || !configHydratedRef.current) return
    queueSidebarConfigSave(sidebarStateRef.current, isCollapsed)
  }, [isCollapsed, userId, isSettings, queueSidebarConfigSave])

  const pinnableItems = useMemo((): PinnableItem[] => {
    const items: PinnableItem[] = []

    menuSections.forEach((section) => {
      if (section.href) {
        items.push({
          name: section.title,
          icon: section.icon,
          filledIcon: section.filledIcon,
          href: section.href,
          tooltip: section.tooltip
        })
      }

      section.items?.forEach((item) => {
        if (item.href) {
          items.push({
            name: item.name,
            icon: item.icon,
            filledIcon: item.filledIcon,
            href: item.href,
            tooltip: item.tooltip,
            notificationCount: item.notificationCount,
            isLocked: item.isLocked,
            matchPattern: item.matchPattern,
            excludePaths: item.excludePaths
          })
        }
      })
    })

    return items.filter((item) => pinnedItemHrefs.includes(item.href))
  }, [menuSections, pinnedItemHrefs])

  const renderSidebarItem = (
    name: string,
    icon: IconComponent,
    filledIcon: IconComponent,
    href: string,
    tooltip?: string,
    notificationCount?: number,
    isLocked?: boolean,
    matchPattern?: string,
    excludePaths?: string[],
    pinHref?: string
  ) => {
    return (
      <SidebarItem
        name={collapsedOnly ? '' : name}
        icon={icon}
        filledIcon={filledIcon}
        href={href}
        notificationCount={notificationCount}
        isLocked={isLocked}
        isCollapsed={collapsedOnly}
        tooltip={tooltip}
        isActive={isActiveFor(href, matchPattern, excludePaths)}
        isPinned={isPinnedHref(pinHref)}
        showPinControl={shouldShowExpandedContent && Boolean(pinHref)}
        onTogglePin={pinHref ? () => handleTogglePin(pinHref) : undefined}
      />
    )
  }

  useEffect(() => {
    const criticalRoutes = [
      '/getting-started',
      '/dashboard',
      '/my-data',
      '/explore',
      '/home',
      '/integrations'
    ]

    const prefetchRoutes = () => {
      criticalRoutes.forEach((route) => {
        router.prefetch(route)
      })
    }

    if (typeof window === 'undefined') return

    if ('requestIdleCallback' in window) {
      requestIdleCallback(prefetchRoutes)
    } else {
      setTimeout(prefetchRoutes, 0)
    }
  }, [router])

  return (
    <div className='flex h-full flex-col bg-white dark:bg-[#090640]'>
      <div
        className={cn('shrink-0', collapsedOnly ? 'px-0 py-3' : 'px-0 py-2')}
      >
        <div className='flex items-center justify-center'>
          <div className='relative h-[52px] w-full'>
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center transition-opacity duration-150',
                shouldShowExpandedContent
                  ? 'pointer-events-none opacity-0'
                  : 'opacity-100'
              )}
            >
              <Image
                src='/logo.svg'
                alt='Sharkdom Logo'
                width={28}
                height={28}
              />
            </div>

            <div
              className={cn(
                'absolute inset-0 flex items-center justify-between px-4 py-1 transition-opacity duration-150',
                shouldShowExpandedContent
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0'
              )}
            >
              <FullLogo className='w-[138px]' />
              <button
                onClick={toggleSidebar}
                className='ml-2 flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[#EEF2FA]'
              >
                <SidebarIcon color='#ADB8CB' size={16} />
              </button>
            </div>
          </div>
        </div>

        {showChangeView && (
          <div
            className={cn(
              'flex justify-center px-3 pb-1',
              collapsedOnly ? 'pt-4' : 'pt-2'
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type='button'
                  disabled={isViewChangePending}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#D5D5F9] bg-[#F1F1FE] transition-colors hover:bg-[#E5E5FD] disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:bg-card dark:hover:bg-accent',
                    collapsedOnly
                      ? 'h-10 w-10 justify-center p-0'
                      : 'px-3 py-2.5'
                  )}
                >
                  {collapsedOnly ? (
                    appViewKind === 'partner' ? (
                      <Users
                        className='h-5 w-5 text-[#7F00FF]'
                        strokeWidth={1.5}
                      />
                    ) : (
                      <User
                        className='h-5 w-5 text-[#7F00FF]'
                        strokeWidth={1.5}
                      />
                    )
                  ) : (
                    <>
                      <div className='flex items-center gap-3'>
                        {appViewKind === 'partner' ? (
                          <Users
                            className='h-6 w-6 text-[#7F00FF]'
                            strokeWidth={1.5}
                          />
                        ) : (
                          <User
                            className='h-6 w-6 text-[#7F00FF]'
                            strokeWidth={1.5}
                          />
                        )}
                        <div className='flex flex-col items-start'>
                          <span className='text-[10px] font-bold tracking-wider text-[#9199A6] dark:text-muted-foreground'>
                            ROLE
                          </span>
                          <span className='text-base font-medium leading-none text-[#334155] dark:text-foreground'>
                            {appViewKind === 'partner' ? 'Partner' : 'Vendor'}
                          </span>
                        </div>
                      </div>
                      <Repeat className='h-4 w-4 text-[#7F00FF] transition-transform duration-200 group-hover:rotate-180' />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                side={collapsedOnly ? 'right' : 'bottom'}
                sideOffset={collapsedOnly ? 16 : 8}
                className='w-full min-w-[220px] rounded-xl border-[#D5D5F9] p-2 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]'
              >
                <DropdownMenuItem
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors',
                    appViewKind === 'vendor'
                      ? 'bg-[#F1F1FE] dark:bg-card'
                      : 'hover:bg-[#F9FAFB] dark:hover:bg-accent'
                  )}
                  onClick={() => void setAppView('vendor')}
                >
                  <div className='flex items-center gap-2'>
                    <User
                      className={cn(
                        'h-5 w-5',
                        appViewKind === 'vendor'
                          ? 'text-[#7F00FF]'
                          : 'text-[#64748B] dark:text-muted-foreground'
                      )}
                      strokeWidth={1.5}
                    />
                    <span
                      className={cn(
                        'text-base font-medium',
                        appViewKind === 'vendor'
                          ? 'text-[#7F00FF]'
                          : 'text-[#334155] dark:text-foreground'
                      )}
                    >
                      Vendor
                    </span>
                  </div>
                  {appViewKind === 'vendor' && (
                    <Check
                      className='h-4 w-4 text-[#7F00FF]'
                      strokeWidth={2.5}
                    />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors',
                    appViewKind === 'partner'
                      ? 'bg-[#F1F1FE] dark:bg-card'
                      : 'hover:bg-[#F9FAFB] dark:hover:bg-accent'
                  )}
                  onClick={() => void setAppView('partner')}
                >
                  <div className='flex items-center gap-2'>
                    <Users
                      className={cn(
                        'h-5 w-5',
                        appViewKind === 'partner'
                          ? 'text-[#7F00FF]'
                          : 'text-[#64748B] dark:text-muted-foreground'
                      )}
                      strokeWidth={1.5}
                    />
                    <span
                      className={cn(
                        'text-base font-medium',
                        appViewKind === 'partner'
                          ? 'text-[#7F00FF]'
                          : 'text-[#334155] dark:text-foreground'
                      )}
                    >
                      Partner
                    </span>
                  </div>
                  {appViewKind === 'partner' && (
                    <Check
                      className='h-4 w-4 text-[#7F00FF]'
                      strokeWidth={2.5}
                    />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <nav
        className={cn(
          'flex-1 overflow-y-auto',
          collapsedOnly ? 'px-0' : 'px-3'
        )}
      >
        <div
          className={cn(
            collapsedOnly ? 'flex flex-col items-center' : 'space-y-1.5'
          )}
        >
          {shouldShowExpandedContent && pinnableItems.length > 0 && (
            <div className='px-1 pb-1 pt-1'>
              <h3 className='text-[10px] font-medium uppercase tracking-[0.08em] text-[#92A0B9]'>
                Pinned
              </h3>
            </div>
          )}

          {pinnableItems.map((item) => (
            <div
              key={`pinned-${item.href}`}
              className={cn(collapsedOnly ? 'contents' : 'space-y-0.5')}
            >
              {renderSidebarItem(
                item.name,
                item.icon,
                item.filledIcon,
                item.href,
                item.tooltip,
                item.notificationCount,
                item.isLocked,
                item.matchPattern,
                item.excludePaths,
                item.href
              )}
            </div>
          ))}

          {shouldShowExpandedContent && pinnableItems.length > 0 && (
            <div className='px-1 py-2'>
              <div className='border-b border-[#E4E7EC]' />
            </div>
          )}

          {collapsedOnly && pinnableItems.length > 0 && (
            <div className='my-1 h-px w-8 bg-[#EAECF0]' />
          )}

          {visibleMenuSections.map((section, index) => (
            <React.Fragment key={section.id}>
              <div className={cn(collapsedOnly ? 'contents' : 'space-y-1')}>
                {section.href ? (
                  renderSidebarItem(
                    section.title,
                    section.icon,
                    section.filledIcon,
                    section.href,
                    section.tooltip,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    section.href
                  )
                ) : (
                  <SidebarGroup
                    section={{
                      title: section.title,
                      icon: section.icon,
                      filledIcon: section.filledIcon,
                      tooltip: section.tooltip,
                      items: section.items?.map((item) => ({
                        ...item,
                        isPinned: isPinnedHref(item.href),
                        onTogglePin: item.href
                          ? () => handleTogglePin(item.href as string)
                          : undefined,
                        showPinControl:
                          shouldShowExpandedContent && Boolean(item.href)
                      }))
                    }}
                    isOpen={Boolean(openSectionIds[section.id])}
                    onToggle={() => handleToggleSection(section.id)}
                    isCollapsed={collapsedOnly}
                  />
                )}
              </div>

              {collapsedOnly && index !== visibleMenuSections.length - 1 && (
                <div className='my-1 h-px w-8 bg-[#EAECF0]' />
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>

      <div
        className={cn(
          'mt-auto border-t border-[#E4E7EC] bg-white dark:border-border dark:bg-[#090640]',
          collapsedOnly ? 'px-0 py-3' : 'px-3 py-4'
        )}
      >
        {!collapsedOnly && !subscriptionLoading && !isActiveSubscription && (
          <div
            className={cn(
              'relative mb-4 overflow-hidden rounded-[6px] text-white transition-all',
              isTrialCardMinimized ? 'px-3 py-2' : 'p-4'
            )}
          >
            <div
              className='pointer-events-none absolute inset-0'
              style={{
                background: `
                  radial-gradient(120% 140% at 0% 0%, rgba(167, 139, 250, 0.95) 0%, rgba(127, 86, 217, 0.75) 18%, rgba(54, 65, 83, 0) 42%),
                  radial-gradient(95% 120% at 20% 10%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 22%, rgba(255,255,255,0) 23%),
                  radial-gradient(110% 135% at 20% 10%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 32%, rgba(255,255,255,0) 33%),
                  radial-gradient(130% 155% at 20% 10%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 42%, rgba(255,255,255,0) 43%),
                  linear-gradient(180deg, #44506A 0%, #364153 100%)
                `
              }}
            />

            <div
              className={cn(
                'relative z-10',
                isTrialCardMinimized ? 'pr-7' : 'pr-8'
              )}
            >
              <button
                type='button'
                aria-label={
                  isTrialCardMinimized
                    ? 'Expand trial card'
                    : 'Minimize trial card'
                }
                onClick={() => setIsTrialCardMinimized((prev) => !prev)}
                className='absolute right-0 top-0 inline-flex h-6 w-6 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white'
              >
                <ChevronDown
                  size={14}
                  className={cn(
                    'transition-transform duration-200',
                    isTrialCardMinimized ? 'rotate-180' : 'rotate-0'
                  )}
                />
              </button>

              {!isTrialCardMinimized && (
                <>
                  <div className='text-[22px] font-bold leading-[1.05] tracking-[-0.04em]'>
                    Find partners.
                    <br />
                    Grow faster.
                  </div>

                  <div className='mt-[4px] text-[11px] font-semibold leading-4 tracking-[-0.04em] text-white/90'>
                    All features unlocked.
                    <br />
                    Start free today.
                  </div>
                </>
              )}

              {isInDialog ? (
                <SheetClose asChild>
                  <button
                    type='button'
                    onClick={() =>
                      window.setTimeout(() => openPricingModal(), 0)
                    }
                    className={cn(
                      'rounded-[6px] bg-white text-[12px] font-medium text-[#344054]',
                      isTrialCardMinimized
                        ? 'mt-0 px-3 py-2'
                        : 'mt-[13px] px-4 py-2.5'
                    )}
                  >
                    Start free trial
                  </button>
                </SheetClose>
              ) : (
                <button
                  type='button'
                  onClick={() => openPricingModal()}
                  className={cn(
                    'rounded-[6px] bg-white text-[12px] font-medium text-[#344054]',
                    isTrialCardMinimized
                      ? 'mt-0 px-3 py-2'
                      : 'mt-[13px] px-4 py-2.5'
                  )}
                >
                  Start free trial
                </button>
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            collapsedOnly ? 'flex flex-col items-center gap-1.5' : 'space-y-1'
          )}
        >
          {navBottomLinks.map((item, idx) => {
            const matchPattern =
              item.name === 'Data Pipeline'
                ? '/my-data'
                : item.name === 'Integration'
                  ? '/integrations'
                  : undefined

            return (
              <div key={idx} className={cn(collapsedOnly ? 'contents' : '')}>
                <SidebarItem
                  {...item}
                  name={collapsedOnly ? '' : item.name}
                  isCollapsed={collapsedOnly}
                  tooltip={item.tooltip}
                  isActive={isActiveFor(item.href, matchPattern)}
                  showPinControl={false}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function Sidebar({
  className,
  isCollapsed,
  isViewAnimating = false,
  toggleSidebar,
  isSettings,
  onCollapsedFromServer
}: SidebarProps) {
  const organizationData = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const [open, setOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const canHoverExpand = isCollapsed && !isViewAnimating
  const effectiveHovered = canHoverExpand && isHovered

  const animatedWidth = !isCollapsed
    ? SIDEBAR_EXPANDED_WIDTH
    : effectiveHovered
      ? SIDEBAR_EXPANDED_WIDTH
      : SIDEBAR_COLLAPSED_WIDTH

  const reservedWidth = isCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_EXPANDED_WIDTH

  const handleMouseEnter = () => {
    if (!canHoverExpand) return
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleToggleSidebar = () => {
    setIsHovered(false)
    toggleSidebar()
  }

  return (
    <>
      <TutorialPopup open={open} setOpen={setOpen} />

      <div
        className={cn('relative hidden h-full shrink-0 lg:block', className)}
        style={{ width: reservedWidth }}
      >
        <motion.aside
          className='absolute left-0 top-0 z-40 h-full overflow-hidden border-r border-[#E4E7EC] bg-white dark:border-white/10 dark:bg-[#090640]'
          initial={false}
          animate={{
            width: animatedWidth,
            boxShadow:
              effectiveHovered || isViewAnimating
                ? '0 8px 24px rgba(16, 24, 40, 0.12)'
                : '0 0 0 rgba(16, 24, 40, 0)'
          }}
          transition={{
            width: {
              duration: SIDEBAR_ANIMATION_DURATION,
              ease: [0.22, 1, 0.36, 1]
            },
            boxShadow: {
              duration: 0.2
            }
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className='flex h-full w-full'>
            <div
              className={`h-full w-full ${isSettings ? 'bg-transparent dark:bg-transparent' : 'bg-white dark:bg-[#090640]'}`}
            >
              {isSettings ? (
                <SettingsSidebarContent />
              ) : (
                <SidebarContent
                  currentOrganization={organizationData}
                  isCollapsed={isCollapsed}
                  toggleSidebar={handleToggleSidebar}
                  isHovered={effectiveHovered}
                  isSettings={isSettings}
                  onCollapsedFromServer={onCollapsedFromServer}
                />
              )}
            </div>
          </div>
        </motion.aside>
      </div>
    </>
  )
}
