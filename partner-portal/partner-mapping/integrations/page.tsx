'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

const PARTNER_MAPPING_BASE = '/partner-portal/partner-mapping'

/** Ensures no double slashes in URL (e.g. https://host//path -> https://host/path). */
function normalizeRedirectUrl(url: string): string {
  return url.replace(/(?<!:)\/\/+/g, '/').replace(/\/+$/, '')
}

function getPartnerPortalHubSpotRedirectUri(): string {
  const explicit =
    process.env.NEXT_PUBLIC_HUBSPOT_PARTNER_PORTAL_REDIRECTION_URL
  if (explicit) return normalizeRedirectUrl(explicit) || explicit
  const base = normalizeRedirectUrl(process.env.NEXT_PUBLIC_BASE_URL || '')
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const root = base || origin
  const path = '/partner-portal/partner-mapping/integrations'
  return root ? normalizeRedirectUrl(`${root}${path}`) : ''
}

export default function PartnerPortalIntegrationsCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState<string>('')
  const handledRef = useRef(false)

  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const errorParam = searchParams.get('error')

  const handleHubSpotCallback = useCallback(async () => {
    if (!code) {
      setStatus('error')
      setMessage('Missing authorization code')
      return
    }

    const redirectUri = getPartnerPortalHubSpotRedirectUri()
    const clientId = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      setStatus('error')
      setMessage('HubSpot configuration missing')
      return
    }

    try {
      const tokenRes = await fetch('/api/hubapi-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code
        }).toString()
      })

      const tokenData = await tokenRes.json()

      if (!tokenData?.refresh_token) {
        setStatus('error')
        setMessage(tokenData?.message || 'Failed to get tokens from HubSpot')
        return
      }

      const meRes = await fetch('/api/auth/me', { credentials: 'include' })
      const meData = await meRes.json().catch(() => ({}))
      const userId = meData?.user?.uid ?? ''

      const saveRes = await fetch('/api/no/auth/organization/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          organizationId: null,
          refreshToken: tokenData.refresh_token,
          integrationType: 'HUBSPOT',
          isConnected: true,
          userId,
          connectedId: (tokenData.hub_id ?? tokenData.hubId ?? '').toString(),
          publishableKey: ''
        })
      })

      const saveData = await saveRes.json().catch(() => ({}))

      if (!saveRes.ok) {
        setStatus('error')
        setMessage(saveData?.message || 'Failed to save integration')
        return
      }

      showCustomToast(
        'Success',
        'HubSpot connected successfully!',
        'success',
        5000
      )
      setStatus('success')
      setMessage('HubSpot connected successfully.')
      setTimeout(() => {
        router.push(`${PARTNER_MAPPING_BASE}/connect-service/hubspot`)
      }, 1500)
    } catch (err) {
      console.error('HubSpot callback error:', err)
      setStatus('error')
      setMessage(
        err instanceof Error ? err.message : 'Failed to connect HubSpot'
      )
    }
  }, [code, router])

  useEffect(() => {
    if (errorParam) {
      setStatus('error')
      setMessage(errorParam === 'access_denied' ? 'Access denied' : errorParam)
      return
    }

    if (code && !handledRef.current) {
      handledRef.current = true
      handleHubSpotCallback()
      return
    }

    if (!code && !errorParam) {
      setStatus('error')
      setMessage('No authorization code received')
    }
  }, [code, state, errorParam, handleHubSpotCallback])

  if (status === 'loading') {
    return (
      <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4'>
        <div className='h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#3E50F7]' />
        <p className='text-sm text-gray-600'>Connecting your integration...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4'>
        <p className='text-center text-sm font-medium text-red-600'>
          {message}
        </p>
        <div className='flex gap-3'>
          <Button
            asChild
            variant='outline'
            className='rounded-lg border-[#3E50F7] text-[#3E50F7]'
          >
            <Link href={`${PARTNER_MAPPING_BASE}/connect-crm`}>
              Back to Connect CRM
            </Link>
          </Button>
          <Button asChild className='rounded-lg bg-[#3E50F7] text-white'>
            <Link href={`${PARTNER_MAPPING_BASE}/connect-service/hubspot`}>
              Try again
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4'>
      <p className='text-center text-sm font-medium text-green-600'>
        {message}
      </p>
      <p className='text-sm text-gray-500'>Redirecting...</p>
    </div>
  )
}
