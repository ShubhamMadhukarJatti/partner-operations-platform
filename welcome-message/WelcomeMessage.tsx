'use client'

import React, { useEffect, useState } from 'react'

interface WelcomeMessageProps {
  subtitle?: string
  variant?: 'large' | 'medium'
  className?: string
}

const CACHE_KEY = 'welcome_message_user_name'
const CACHE_TIMESTAMP_KEY = 'welcome_message_user_name_timestamp'
const CACHE_USER_ID_KEY = 'welcome_message_user_id'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

const WelcomeMessage = ({
  subtitle = 'Welcome to Sharkdom training, your one stop shop for partner training modules',
  variant = 'large',
  className = ''
}: WelcomeMessageProps) => {
  const [userName, setUserName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // Check cache first
        if (typeof window !== 'undefined') {
          const cachedName = sessionStorage.getItem(CACHE_KEY)
          const cachedTimestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY)
          const cachedUserId = sessionStorage.getItem(CACHE_USER_ID_KEY)

          if (cachedName && cachedTimestamp && cachedUserId) {
            const timestamp = parseInt(cachedTimestamp, 10)
            const now = Date.now()

            // Check if cache is still valid and user hasn't changed
            if (now - timestamp < CACHE_DURATION) {
              // Verify user ID matches
              const response = await fetch('/api/auth/me')
              if (response.ok) {
                const data = await response.json()
                if (data.user?.uid === cachedUserId) {
                  setUserName(cachedName)
                  setLoading(false)
                  return
                }
              }
            }
          }
        }

        setLoading(true)
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            const currentUserId = data.user.uid

            // Try to get full user profile for name
            try {
              const userProfileResponse = await fetch(
                `/api/user/${currentUserId}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              )
              if (userProfileResponse.ok) {
                const userProfile = await userProfileResponse.json()
                const name =
                  userProfile.name ||
                  userProfile.username ||
                  userProfile.displayName ||
                  data.user.displayName ||
                  data.user.email?.split('@')[0] ||
                  'User'
                setUserName(name)

                // Cache the result
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem(CACHE_KEY, name)
                  sessionStorage.setItem(
                    CACHE_TIMESTAMP_KEY,
                    Date.now().toString()
                  )
                  sessionStorage.setItem(CACHE_USER_ID_KEY, currentUserId)
                }
              } else {
                const name =
                  data.user.displayName ||
                  data.user.email?.split('@')[0] ||
                  'User'
                setUserName(name)

                // Cache the result
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem(CACHE_KEY, name)
                  sessionStorage.setItem(
                    CACHE_TIMESTAMP_KEY,
                    Date.now().toString()
                  )
                  sessionStorage.setItem(CACHE_USER_ID_KEY, currentUserId)
                }
              }
            } catch {
              const name =
                data.user.displayName ||
                data.user.email?.split('@')[0] ||
                'User'
              setUserName(name)

              // Cache the result
              if (typeof window !== 'undefined') {
                sessionStorage.setItem(CACHE_KEY, name)
                sessionStorage.setItem(
                  CACHE_TIMESTAMP_KEY,
                  Date.now().toString()
                )
                sessionStorage.setItem(CACHE_USER_ID_KEY, currentUserId)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error)
        setUserName('User')
      } finally {
        setLoading(false)
      }
    }

    fetchUserName()
  }, [])

  if (variant === 'medium') {
    return (
      <div className={`relative z-10 space-y-2 ${className}`}>
        <h1 className='flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white'>
          {loading ? (
            'Welcome Back...'
          ) : (
            <>
              Welcome Back, {userName} <span className='animate-wave'>👋</span>
            </>
          )}
        </h1>
        {/* {subtitle && <p className='text-gray-500'>{subtitle}</p>} */}
      </div>
    )
  }

  return (
    <div className={`relative z-10 flex flex-col gap-2 ${className}`}>
      <div className='flex items-center gap-3 text-4xl font-bold text-gray-900 dark:text-white'>
        <h1>{loading ? 'Welcome Back...' : `Welcome Back, ${userName}`}</h1>
        <span className='inline-block origin-[70%_70%] animate-wave text-4xl'>
          👋
        </span>
      </div>
      {/* {subtitle && (
        <p className='text-lg text-gray-600'>{subtitle}</p>
      )} */}
    </div>
  )
}

export default WelcomeMessage
