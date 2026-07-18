'use client'

import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'

import { stopTokenRefreshOnLogout } from '@/lib/auth/token-refresh'
import { useAuth } from '@/lib/firebase/auth/context'
import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
import { Button, ButtonProps } from '@/components/ui/button'

interface LogoutButtonProps extends ButtonProps {
  isAdmin: boolean
}

export const LogoutButton = ({ isAdmin, ...props }: LogoutButtonProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  // const { user } = useAuth()
  const handleLogout = async () => {
    // Stop token refresh system immediately to prevent auto-login
    stopTokenRefreshOnLogout()

    // Clear all React Query cache to prevent using stale auth data
    queryClient.clear()

    // const auth = getFirebaseAuth()
    // await signOut(auth)
    await fetch('/api/logout', {
      method: 'GET'
    })

    // Use hard redirect to ensure cookies are cleared and page reloads
    // This prevents middleware from seeing stale cookies
    window.location.href = '/login'
  }
  // if (!user) {
  //   return null
  // }
  return (
    <Button
      variant='secondary'
      onClick={() => handleLogout()}
      {...props}
      size='sm'
    >
      Logout
    </Button>
  )
}
