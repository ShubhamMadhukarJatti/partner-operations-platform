'use client'

import * as React from 'react'
import {
  User as FirebaseUser,
  IdTokenResult,
  onIdTokenChanged
} from 'firebase/auth'
import { filterStandardClaims } from 'next-firebase-auth-edge/lib/auth/claims'

import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'

import { AuthContext, User } from './context'

export interface AuthProviderProps {
  serverUser: User | null
  serverToken: string | null
  children: React.ReactNode
}

function toUser(user: FirebaseUser, idTokenResult: IdTokenResult): User {
  return {
    ...user,
    customClaims: filterStandardClaims(idTokenResult.claims)
  }
}

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
  serverUser,
  serverToken,
  children
}) => {
  const [user, setUser] = React.useState(serverUser)
  const [token, setToken] = React.useState(serverToken)

  const handleIdTokenChanged = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const idTokenResult = await firebaseUser.getIdTokenResult()

      // Sets authenticated user cookies
      await fetch('/api/login', {
        headers: {
          Authorization: `Bearer ${idTokenResult.token}`
        }
      })

      setUser(toUser(firebaseUser, idTokenResult))
      setToken(idTokenResult.token)
      return
    }

    // Removes authenticated user cookies
    // await fetch('/api/logout')

    setUser(null)
    setToken(null)
  }

  React.useEffect(() => {
    return onIdTokenChanged(getFirebaseAuth(), handleIdTokenChanged)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
