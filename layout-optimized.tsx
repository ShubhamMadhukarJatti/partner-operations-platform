'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { storeOrganizationData } from '@/redux/reducers/organization'
import { fetchCurrentOrgRedux } from '@/redux/slices/organization'
import { AppDispatch } from '@/redux/store'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'

import { getOrganizationMappingsByUserId } from '@/lib/db/organization'
import { getCurrentUser } from '@/lib/db/user'
import { getServerUser } from '@/lib/server'
import { showCustomToast } from '@/components/custom-toast'
import { Logo } from '@/components/icons/logo'

// Memoized auth hook with optimized queries
const useAuthAndData = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()

  const code = searchParams.get('code')
  const transactionId = searchParams.get('transactionId')

  // Single optimized query that fetches all required data
  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth-data'],
    queryFn: async () => {
      const { token, user } = await getServerUser()
      if (!token) {
        return { user: null, organizationMappings: null, userProfile: null }
      }

      // Parallel fetch instead of sequential
      const [organizationMappings, userProfile] = await Promise.all([
        getOrganizationMappingsByUserId(user.uid),
        getCurrentUser()
      ])

      return { user, organizationMappings, userProfile }
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes - increased cache time
    gcTime: 15 * 60 * 1000 // 15 minutes
  })

  // Memoized routing logic
  const handleRouting = useCallback(() => {
    if (isLoading || !authData) return

    const { user, organizationMappings, userProfile } = authData

    if (!user) {
      if (code && transactionId) {
        router.push(`/verify?transactionId=${transactionId}&code=${code}`)
      } else {
        router.push('/login')
      }
      return
    }

    if (!organizationMappings) {
      showCustomToast(
        'Error',
        'Error fetching data. Redirecting to login',
        'error',
        5000
      )
      router.push('/login')
      return
    }

    const currentOrganization = organizationMappings.find(
      (org) => org.organizationUserMapping.status === 'ACTIVE'
    )?.organization

    const pendingJoin = organizationMappings.find(
      (org) => org.organizationUserMapping.status === 'UNAPPROVED'
    )?.organization

    const rejectedRequests = organizationMappings
      .filter(
        (org) =>
          org.organizationUserMapping.status === 'REJECTED' ||
          org.organizationUserMapping.status === 'DELETED'
      )
      .map((org) => org.organization)

    // Handle routing based on user state
    // if (!userProfile?.id) {
    //   router.push('/drop-off')
    //   return
    // }

    if (!currentOrganization && pendingJoin) {
      router.push('/onboarding/waiting')
      return
    }

    // if (!currentOrganization && rejectedRequests?.length > 0) {
    //   router.push('/drop-off')
    //   return
    // }

    // if (!currentOrganization) {
    //   router.push('/drop-off')
    //   return
    // }

    if (
      currentOrganization &&
      currentOrganization?.primaryEmailVerified === 'false'
    ) {
      if (transactionId && code) {
        router.push(`/verify?transactionId=${transactionId}&code=${code}`)
        return
      }
    }

    // If we get here, user is authenticated and has an active organization
    dispatch(storeOrganizationData({ currentOrganization }))
    dispatch(fetchCurrentOrgRedux({ payload: {} }))
  }, [authData, isLoading, code, transactionId, router, dispatch])

  useEffect(() => {
    handleRouting()
  }, [handleRouting])

  return { isLoading }
}

// Memoized Scripts component
const ExternalScripts = React.memo(() => (
  <>
    <Script
      src='https://checkout.razorpay.com/v1/checkout.js'
      strategy='lazyOnload'
    />
    <Script src='https://js.stripe.com/v3/' strategy='lazyOnload' />
  </>
))

ExternalScripts.displayName = 'ExternalScripts'

export default function ProtectedRoutesLayout(props: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuthAndData()

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Logo className='h-10 w-auto animate-pulse' />
      </div>
    )
  }

  return (
    <div className='h-screen w-full overflow-hidden'>
      <ExternalScripts />
      {props.children}
    </div>
  )
}
