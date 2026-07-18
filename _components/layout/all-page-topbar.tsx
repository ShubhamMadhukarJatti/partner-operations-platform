'use client'

import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { usePricingModal } from '@/contexts/pricing-modal-context'
import { useSidebarView } from '@/contexts/sidebar-view-context'
import {
  fetchNotifications,
  notificationAction
} from '@/redux/reducers/notification'
import { AppDispatch, RootState } from '@/redux/store'
import { useUIStore } from '@/store/uiStore'
import { useQuery } from '@tanstack/react-query'
import { HambergerMenu, NotificationBing } from 'iconsax-react'
import { Book, ChevronDown, Trophy } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { getSubscription } from '@/lib/db/subscription'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { FullLogo, Logo } from '@/components/icons/logo'
import { mapProfileCompletionStatusResponse } from '@/app/(app)/_beta-profile/adapters'

import VerifyLogic from '../../explore-2/_components/verify-email'
import NotificationsDrawer from '../NotificationsDrawer'
import InsideTour from './inside-tour/InsideTour'
import { SidebarContent } from './sidebar'

const AccountPopover = dynamic(() => import('./account-popover'), {
  ssr: false,
  loading: () => (
    <>
      <Skeleton className='h-8 w-8 rounded-md' />
      <div className='hidden flex-col items-start gap-1 lg:flex'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-3 w-32' />
      </div>
    </>
  )
})

const AllPageTopbar = React.memo(function AllPageTopbar({
  className,
  isSettings
}: any) {
  const dispatch = useDispatch<AppDispatch>()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isVibrating, setIsVibrating] = useState(false)
  const [openNotifications, setOpenNotifications] = useState<boolean>(false)
  const [openTour, setOpenTour] = useState(false)
  const [hasOpenedFromUrl, setHasOpenedFromUrl] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(false)
  // Pricing modal hook
  const { openPricingModal } = usePricingModal()

  const {
    data: subscription,
    isLoading: subscriptionLoading,
    error: subscriptionError
  } = useQuery<any>({
    queryKey: ['get-subscription-data'],
    queryFn: () => getSubscription(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false // Prevent refetch on remount
  })

  const saved = useSelector((state: RootState) => state.currentOrg)

  const { loading: orgLoading, organization: currentOrganization } = saved

  const { newNotification } = notificationAction

  const { unreadCount } = useSelector((state: RootState) => state.notification)

  // Check if current route is a proposal route
  const isProposalRoute = pathname.startsWith('/proposal')
  const exploreBetaMatch = pathname.match(/^\/explore-beta\/(\d+)$/)
  const exploreBetaOrgId = exploreBetaMatch ? Number(exploreBetaMatch[1]) : null
  const showOwnProfileCompletionBar = Boolean(
    currentOrganization?.id &&
      exploreBetaOrgId &&
      currentOrganization.id === exploreBetaOrgId
  )
  const ownProfileCompletionQuery = useQuery({
    queryKey: ['topbar-profile-completion', exploreBetaOrgId],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/current?profileCompletionOrgId=${exploreBetaOrgId}`,
        {
          credentials: 'include',
          cache: 'no-store'
        }
      )
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null)
        const message =
          (typeof errorPayload?.error === 'string' && errorPayload.error) ||
          (typeof errorPayload?.message === 'string' && errorPayload.message) ||
          'Failed to fetch profile completion status'

        throw new Error(message)
      }
      return response.json()
    },
    enabled: showOwnProfileCompletionBar && Boolean(exploreBetaOrgId),
    retry: false
  })
  const ownProfileCompletion = useMemo(
    () => mapProfileCompletionStatusResponse(ownProfileCompletionQuery.data),
    [ownProfileCompletionQuery.data]
  )
  const ownProfileCompletionPercent =
    ownProfileCompletion?.completionPercentage ?? null

  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  const {
    appViewKind,
    setAppView,
    isViewChangePending,
    isReady: sidebarViewReady,
    userId: sidebarUserId
  } = useSidebarView()
  const showChangeView = Boolean(sidebarUserId && sidebarViewReady)

  const viewTriggerLabel = useMemo(() => {
    if (appViewKind === 'partner') return 'Partner'
    return 'Vendor'
  }, [appViewKind])

  // Memoize organization ID to prevent unnecessary effect triggers
  const organizationId = useMemo(
    () => currentOrganization?.id,
    [currentOrganization?.id]
  )

  useEffect(() => {
    if (organizationId) {
      // Only fetch notifications once per organization ID
      dispatch(fetchNotifications({ organizationId }))

      const webSocket = new WebSocket(
        `wss://dev.sharkdomapi.com/ws?organizationId=${organizationId}`
      )

      setSocket(webSocket)

      // Listen for messages
      webSocket.onmessage = (event) => {
        if (event.data !== 'ping') {
          dispatch(newNotification(JSON.parse(event.data)))
          triggerVibration()
        }
      }

      return () => {
        webSocket.close()
      }
    }
  }, [organizationId, dispatch, newNotification])

  useEffect(() => {
    if (subscription) {
      // New API returns { status: 'ACTIVE' | 'INACTIVE', activeSuites: [...], ... }
      if (subscription?.status === 'ACTIVE') {
        setUpdateTrigger(true)
      } else {
        setUpdateTrigger(false)
      }
    }
  }, [subscription])

  const triggerVibration = () => {
    setIsVibrating(true)
    setTimeout(() => setIsVibrating(false), 2500) // Reset vibration after 500ms
  }

  useEffect(() => {
    if (unreadCount > 0) {
      triggerVibration() // Trigger vibration when unreadCount is updated
    }
  }, [unreadCount])

  useEffect(() => {
    const hasCompleted = localStorage.getItem('hasCompletedTheTour') === 'true'
    setOpenTour(!hasCompleted)
    // Removed redundant fetchCurrentOrgRedux - layout already handles this
    // This was causing duplicate organization fetches
  }, [])

  // Check for avail_code=free_trial in URL and open pricing modal
  useEffect(() => {
    const availCode = searchParams.get('avail_code')
    if (availCode === 'free_trial' && !hasOpenedFromUrl) {
      setHasOpenedFromUrl(true)
      openPricingModal()
    } else if (availCode !== 'free_trial') {
      // Reset the flag if the URL parameter is removed
      setHasOpenedFromUrl(false)
    }
  }, [searchParams, openPricingModal, hasOpenedFromUrl])

  const handleOpenProfileCompletion = () => {
    window.dispatchEvent(
      new CustomEvent('explore-beta-scroll-profile-completion')
    )
  }

  return (
    <div
      className={cn(
        showOwnProfileCompletionBar
          ? 'flex h-14 items-center justify-between border-b border-text-20 bg-white px-6 dark:border-[#1A1C3B] dark:bg-[#090640]'
          : 'flex h-14 items-center justify-between border-b border-text-20 bg-white px-6 dark:border-[#1A1C3B] dark:bg-[#090640]',
        className
      )}
    >
      <div className='flex min-w-0 flex-1 items-center gap-4'>
        {showOwnProfileCompletionBar ? (
          <div className='hidden w-[364px] max-w-[364px] lg:block'>
            <ExploreBetaCompletionBar
              percent={ownProfileCompletionPercent}
              isLoading={ownProfileCompletionQuery.isLoading}
              isUnavailable={
                !ownProfileCompletionQuery.isLoading && !ownProfileCompletion
              }
              onViewDetails={handleOpenProfileCompletion}
            />
          </div>
        ) : (
          <>
            {isProposalRoute && <FullLogo className='h-6 w-auto' />}
            {!sidebarOpen && <Logo className='h-24 w-24' />}
          </>
        )}
      </div>
      <div className='hidden shrink-0 items-center gap-4 lg:flex'>
        {/* {!isProposalRoute && (
          <InsideTour open={openTour} setOpen={setOpenTour} />
        )} */}

        <div
          className='relative mr-2 flex items-center'
          onClick={() => setOpenNotifications(true)}
        >
          <NotificationBing
            className={cn('', {
              'animate-vibrate': isVibrating
            })}
            color='#4D5C78'
            size={18}
          />
          {unreadCount > 0 && (
            <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-semantic-danger text-shark-xs font-medium text-white'>
              {unreadCount}
            </span>
          )}
        </div>

        <AccountPopover />

        {/* {orgLoading !== 'succeeded' ? (
          <>
            <Skeleton className='h-8 w-8 rounded-md' />
            <div className='hidden flex-col items-start gap-1 lg:flex'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-3 w-32' />
            </div>
          </>
        ) : (
          <div className='flex items-center justify-start gap-0 rounded-md bg-[#F1F1F1]  px-2 py-1 hover:bg-text-20 lg:gap-2'>
            <Image
              src={
                currentOrganization?.logoUrl
                  ? `${currentOrganization?.logoUrl}?t=${new Date().getTime()}`
                  : 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
              }
              width={32}
              height={32}
              className='rounded-md'
              alt='org-logo'
            />

            <div className='hidden flex-col items-start gap-0 lg:flex'>
              <span className='text-sm font-semibold'>
                {currentOrganization?.name}
              </span>
              <span className='mt-0 text-xs font-medium text-[#21272A]'>
                {currentOrganization?.primaryEmail}
              </span>
            </div>
          </div>
        )} */}
      </div>
      <VerifyLogic currentOrganization={currentOrganization} />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' className=' border-none lg:hidden'>
            <HambergerMenu size={28} />
          </Button>
        </SheetTrigger>
        <SheetContent side='right' className='w-[80%] p-0'>
          <SidebarContent
            currentOrganization={currentOrganization}
            isCollapsed={false}
            toggleSidebar={() => console.log(`sidebar`)}
            isInDialog={true}
          />
        </SheetContent>
      </Sheet>
      {/* </div> */}
      <NotificationsDrawer
        open={openNotifications}
        setOpen={setOpenNotifications}
      />
    </div>
  )
})

export default AllPageTopbar

function ExploreBetaCompletionBar({
  percent,
  isLoading,
  isUnavailable,
  onViewDetails
}: {
  percent: number | null
  isLoading: boolean
  isUnavailable: boolean
  onViewDetails: () => void
}) {
  const resolvedPercent = percent ?? 0
  const percentLabel = isLoading
    ? 'Loading...'
    : percent !== null
      ? `${percent}%`
      : '--'
  const ctaLabel = isUnavailable ? 'Unavailable' : 'Complete profile'

  return (
    <div className='bg-transparent px-0 py-0'>
      <div className='flex items-center gap-3'>
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.08)]'>
          <Trophy className='h-4 w-4 text-[#f54900]' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2 text-[14px] font-semibold leading-5 tracking-[-0.15px] text-[#111827]'>
            <span>Profile Completion</span>
            <span className='text-[#f54900]'>{percentLabel}</span>
            <button
              type='button'
              disabled={isUnavailable}
              onClick={onViewDetails}
              className={cn(
                'ml-auto text-[14px] font-semibold',
                isUnavailable
                  ? 'cursor-not-allowed text-[#98a2b3]'
                  : 'text-[#2563eb]'
              )}
            >
              {ctaLabel}
              {!isUnavailable ? '\u2192' : ''}
            </button>
          </div>
          <div className='mt-[6px] h-[6px] overflow-hidden rounded-full bg-[#ececec] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed]'
              style={{ width: `${resolvedPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
