'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { RootState } from '@/redux/store'
import { useQueryClient } from '@tanstack/react-query'
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Moon,
  Settings,
  Users,
  Zap
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSelector } from 'react-redux'

import { stopTokenRefreshOnLogout } from '@/lib/auth/token-refresh'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'

const AccountPopover = React.memo(function AccountPopover() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])
  const saved = useSelector((state: RootState) => state.currentOrg)

  const { loading: orgLoading, organization: currentOrganization } = saved
  const handleLogout = useCallback(async () => {
    setOpen(false) // Close the popover

    // Stop token refresh system immediately to prevent auto-login
    stopTokenRefreshOnLogout()

    // Clear all React Query cache to prevent using stale auth data
    queryClient.clear()

    // const auth = getFirebaseAuth()
    // await signOut(auth)
    await fetch('/api/logout', {
      method: 'GET'
    })

    // Clear localStorage
    localStorage.removeItem('dialogShown')
    localStorage.removeItem('FormShown')
    localStorage.removeItem('email')

    // Use hard redirect to ensure cookies are cleared and page reloads
    // This prevents middleware from seeing stale cookies
    window.location.href = '/login'
  }, [queryClient])

  // Smooth navigation without query params causing re-renders
  const handleSettingsClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setOpen(false)
      router.push('/settings/company-details')
    },
    [router]
  )

  const handleTeamClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setOpen(false)
      router.push('/settings/team/members')
    },
    [router]
  )

  const handleSupportClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    window.open('https://help.sharkdom.com', '_blank')
  }, [])

  const handleBillingClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setOpen(false)
      router.push('/settings/subscription-billing')
    },
    [router]
  )

  const authData = queryClient.getQueryData<any>(['auth-data'])
  const userProfile = authData?.userProfile

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className='cursor-pointer'>
        {orgLoading === 'pending' ? (
          <>
            <Skeleton className='h-8 w-8 rounded-md' />
            <div className='hidden flex-col items-start gap-1 lg:flex'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-3 w-32' />
            </div>
          </>
        ) : (
          <Button
            variant='ghost'
            className='flex items-center justify-start gap-0 rounded-md bg-[#F1F1F1] px-2 py-1 hover:bg-text-20 dark:bg-card dark:hover:bg-accent lg:gap-2'
          >
            <Image
              src={
                currentOrganization?.logoUrl
                  ? currentOrganization.logoUrl
                  : 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
              }
              width={32}
              height={32}
              className='rounded-md'
              alt='org-logo'
            />

            <div className='hidden flex-col items-start gap-0 lg:flex'>
              <span className='text-sm font-semibold dark:text-white'>
                {userProfile?.name ||
                  localStorage.getItem('user_name') ||
                  currentOrganization?.name ||
                  'My Account'}
              </span>
              <span className='mt-0 text-xs font-medium text-[#21272A] dark:text-gray-300'>
                {userProfile?.email ||
                  localStorage.getItem('user_email') ||
                  currentOrganization?.primaryEmail}
              </span>
            </div>
            <ChevronDown
              className='mx-auto text-[#001430] dark:text-white'
              strokeWidth={1.13}
              size={16}
            />
          </Button>
        )}
        {/* <span className='flex items-center'>
          <Setting2 size={16} color='#4D5C78' />
          
        </span> */}
      </PopoverTrigger>
      <PopoverContent className='mr-5 w-[294px] rounded-xl border border-border p-0 shadow-lg'>
        {/* Header */}
        <div className='px-4 py-3'>
          <p className='text-base font-semibold text-[#2A3241] dark:text-white'>
            My Account
          </p>
        </div>

        <div className='h-px bg-border' />

        {/* Billing & Settings */}
        <div className='px-2 py-2'>
          <button
            onClick={handleBillingClick}
            className='flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-muted'
          >
            <div className='flex items-center gap-2'>
              <CreditCard
                className='h-5 w-5 text-[#2A3241] dark:text-white'
                strokeWidth={2.5}
              />
              <span className='dark:text-white'>Billing</span>
            </div>
            <span className='text-xs text-muted-foreground dark:text-gray-300'>
              ⌘ ⇧
            </span>
          </button>

          <button
            onClick={handleSettingsClick}
            className='flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-muted'
          >
            <div className='flex items-center gap-2'>
              <Settings
                className='h-5 w-5 text-[#2A3241] dark:text-white'
                strokeWidth={2.5}
              />
              <span className='dark:text-white'>Settings</span>
            </div>
            <span className='text-xs text-muted-foreground dark:text-gray-300'>
              ⌘ ⇧
            </span>
          </button>

          {mounted && (
            <div className='flex w-full cursor-default items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-muted'>
              <div className='flex items-center gap-2'>
                <Moon
                  className='h-5 w-5 text-[#2A3241] dark:text-white'
                  strokeWidth={2.5}
                />
                <span className='dark:text-white'>Dark mode</span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) =>
                  setTheme(checked ? 'dark' : 'light')
                }
              />
            </div>
          )}
        </div>

        <div className='h-px bg-border' />

        {/* Team & Support */}
        <div className='px-2 py-2'>
          <button
            onClick={handleTeamClick}
            className='flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted'
          >
            <Users
              className='h-5 w-5 text-[#2A3241] dark:text-white'
              strokeWidth={2.5}
            />
            <span className='dark:text-white'>Team</span>
          </button>

          <button
            onClick={handleSupportClick}
            className='flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted'
          >
            <Zap
              className='h-5 w-5 text-[#2A3241] dark:text-white'
              strokeWidth={2.5}
            />
            <span className='dark:text-white'>Support</span>
          </button>
        </div>

        <div className='h-px bg-border' />

        {/* Logout */}
        <div
          onClick={handleLogout}
          className='cursor-pointer rounded-b-xl px-4 py-3 text-sm font-medium hover:bg-muted'
        >
          <div className='flex items-center gap-2'>
            <LogOut
              className='h-5 w-5 text-[#2A3241] dark:text-white'
              strokeWidth={2.5}
            />
            <span className='dark:text-white'>Log out</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
})

export default AccountPopover
