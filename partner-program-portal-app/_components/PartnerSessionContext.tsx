'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  getPartnerProfileInfoAction,
  getPartnerSessionAction
} from '@/app/(partner-application)/set-password/_components/actions'

export interface PartnerProfile {
  fullName: string
  partnershipTier: string
  email: string
}

export interface PartnerSessionContextValue {
  token: string | null
  user: { uid: string; email: string } | null
  profile: PartnerProfile | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const PartnerSessionContext = createContext<PartnerSessionContextValue>({
  token: null,
  user: null,
  profile: null,
  isLoading: true,
  refreshProfile: async () => {}
})

export interface PartnerSessionProviderProps {
  children: React.ReactNode
  initialToken?: string | null
  initialUser?: { uid: string; email: string } | null
}

export function PartnerSessionProvider({
  children,
  initialToken = null,
  initialUser = null
}: PartnerSessionProviderProps) {
  const [token, setToken] = useState<string | null>(initialToken)
  const [user, setUser] = useState<{ uid: string; email: string } | null>(
    initialUser
  )
  const [profile, setProfile] = useState<PartnerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async (activeToken: string) => {
    try {
      const url = '/api/api/v1/partner/me/tier-info'
      const authHeaderValue = activeToken.startsWith('Bearer ')
        ? activeToken
        : `Bearer ${activeToken}`

      console.log(
        'PartnerSessionContext: Relative client-side fetch initiated.'
      )
      console.log('PartnerSessionContext: Target URL:', url)
      console.log(
        'PartnerSessionContext: Authorization Header:',
        authHeaderValue.slice(0, 20) + '...'
      )

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/hal+json',
          Authorization: authHeaderValue
        }
      })

      console.log('PartnerSessionContext: Response status code:', res.status)

      if (res.ok) {
        const json = await res.json()
        console.log('PartnerSessionContext: Received JSON data:', json)
        if (json.success && json.data) {
          setProfile(json.data)
        } else {
          console.warn(
            'PartnerSessionContext: Response success flag is false:',
            json
          )
        }
      } else {
        const text = await res.text().catch(() => '')
        console.error(
          `PartnerSessionContext: Request failed with status ${res.status}:`,
          text
        )
      }
    } catch (err) {
      console.error('PartnerSessionContext: Fetch exception caught:', err)
    }
  }, [])

  const loadSessionAndProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      // Always call getPartnerSessionAction to get a fresh token.
      // This triggers server-side JWT expiry checking and automatic refresh
      // of partnerAccessToken using partnerRefreshToken if needed.
      console.log(
        'PartnerSessionContext: Fetching token from session cookies...'
      )
      const sess = await getPartnerSessionAction()
      console.log(
        'PartnerSessionContext: getPartnerSessionAction returned token:',
        sess.token ? 'found' : 'null'
      )

      let activeToken = sess.token
      let activeUser = sess.user

      // Fall back to client storage only if server-side session returned nothing
      if (!activeToken && typeof window !== 'undefined') {
        console.log(
          'PartnerSessionContext: Token not in cookies, checking client storage...'
        )
        activeToken =
          localStorage.getItem('partner_access_token') ||
          sessionStorage.getItem('sharkdom-partner-portal-accessToken')
      }

      setToken(activeToken)
      setUser(activeUser)

      if (activeToken) {
        await fetchProfile(activeToken)
      } else {
        console.warn(
          'PartnerSessionContext: No token found in session cookies or client storage!'
        )
      }
    } catch (err) {
      console.error('Failed to load partner session:', err)
    } finally {
      setIsLoading(false)
    }
  }, [fetchProfile])

  useEffect(() => {
    loadSessionAndProfile()
  }, [loadSessionAndProfile])

  const refreshProfile = useCallback(async () => {
    if (token) {
      await fetchProfile(token)
    }
  }, [token, fetchProfile])

  return (
    <PartnerSessionContext.Provider
      value={{
        token,
        user,
        profile,
        isLoading,
        refreshProfile
      }}
    >
      {children}
    </PartnerSessionContext.Provider>
  )
}

export const usePartnerSession = () => useContext(PartnerSessionContext)
