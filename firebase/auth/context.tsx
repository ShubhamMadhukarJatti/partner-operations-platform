'use client'

import { createContext, useContext } from 'react'
import type { UserInfo } from 'firebase/auth'
import { Claims } from 'next-firebase-auth-edge/lib/auth/claims'

export interface User extends Omit<UserInfo, 'providerId'> {
  emailVerified: boolean
  customClaims: Claims
}

export interface AuthContextValue {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  setUser: () => {}
})

export const useAuth = () => useContext(AuthContext)
