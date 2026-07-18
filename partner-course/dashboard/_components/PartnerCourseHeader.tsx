'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { BookOpen, ChevronDown, Home, LogOut } from 'lucide-react'

import { stopTokenRefreshOnLogout } from '@/lib/auth/token-refresh'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { FullLogo } from '@/components/icons/logo'

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface PartnerCourseHeaderProps {
  activeTab?: 'home' | 'courses'
  onTabChange?: (tab: 'home' | 'courses') => void
  courseTitle?: string
}

const PartnerCourseHeader = ({
  activeTab = 'home',
  onTabChange,
  courseTitle
}: PartnerCourseHeaderProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = useCallback(async () => {
    // Stop token refresh system immediately to prevent auto-login
    stopTokenRefreshOnLogout()

    // Clear all React Query cache to prevent using stale auth data
    queryClient.clear()

    // Call logout API to clear cookies
    await fetch('/api/logout', {
      method: 'GET'
    })

    // Clear all localStorage items
    localStorage.clear()

    // Clear all sessionStorage items
    sessionStorage.clear()

    // Use hard redirect to ensure cookies are cleared and page reloads
    // This prevents middleware from seeing stale cookies
    window.location.href = '/partner-course/login'
  }, [queryClient])

  const handleTabClick = (tab: 'home' | 'courses') => {
    if (onTabChange) {
      onTabChange(tab)
    } else {
      // Default behavior: navigate to dashboard
      router.push('/partner-course/dashboard')
    }
  }

  // Get user display name or email
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  // Get user initial for avatar
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <header className='border-b border-gray-200 bg-white'>
      <div className='px-6 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo and Navigation */}
          <div className='flex items-center gap-4'>
            <FullLogo className='h-8 w-auto text-blue-600' />
            {courseTitle && (
              <h1 className='text-lg font-semibold text-gray-900'>
                {courseTitle}
              </h1>
            )}
            {/* Navigation */}
            <nav className='flex items-center gap-6'>
              <button
                onClick={() => handleTabClick('home')}
                className={`flex items-center gap-2 px-2 py-1 text-sm font-medium transition-colors ${
                  activeTab === 'home'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Home size={16} />
                Home
              </button>
              <button
                onClick={() => handleTabClick('courses')}
                className={`flex items-center gap-2 px-2 py-1 text-sm font-medium transition-colors ${
                  activeTab === 'courses'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen size={16} />
                Courses
              </button>
            </nav>
          </div>

          {/* Right Actions - User Menu */}
          <div className='flex items-center gap-4'>
            {loading ? (
              <div className='flex items-center gap-2'>
                <Skeleton className='h-8 w-8 rounded-full' />
                <div className='hidden flex-col gap-1 md:flex'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-3 w-32' />
                </div>
                <Skeleton className='h-4 w-4' />
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white'>
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={userName}
                          className='h-full w-full rounded-full object-cover'
                        />
                      ) : (
                        userInitial
                      )}
                    </div>
                    <div className='hidden flex-col md:flex'>
                      <span className='text-sm font-medium text-gray-900'>
                        {userName}
                      </span>
                      <span className='text-xs text-gray-500'>{userEmail}</span>
                    </div>
                    <ChevronDown className='h-4 w-4 text-gray-500' />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <div className='px-2 py-1.5'>
                    <p className='text-sm font-medium text-gray-900'>
                      {userName}
                    </p>
                    <p className='text-xs text-gray-500'>{userEmail}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default PartnerCourseHeader
