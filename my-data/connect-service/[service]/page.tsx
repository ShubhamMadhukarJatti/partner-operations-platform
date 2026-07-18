// Modified File *(latest)*

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { signIn } from 'next-auth/react'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import { connectCrm, isCrmOAuthType } from '@/lib/crm-oauth'
import { Button } from '@/components/ui/button'
import ConsentStep from '@/components/shared/ConsentStep'

import { SHEET_SCOPES } from '../../../integrations/_components/integration-drawer'

const MY_DATA_GOOGLE_SHEET_URL_KEY = 'my_data_connect_google_sheet_url'

const SERVICE_CONFIG = {
  'google-sheets': {
    id: INTEGRATIONS.GOOGLE_SHEET,
    title: 'Connect Google Sheets',
    description:
      'Utilize the power of platform via customer persona syncing directly from your Google Sheet.',
    logo: '/icons/google-sheets-icon.svg',
    installText: 'Install',
    connectedText: 'Google Sheets has been successfully connected!'
  },
  hubspot: {
    id: INTEGRATIONS.HUBSPOT_OUTREACH,
    title: 'Connect HubSpot',
    description:
      'Sync your customer data directly from HubSpot for seamless integration.',
    logo: '/icons/hubspot-icon.svg',
    installText: 'Connect',
    connectedText: 'HubSpot has been successfully connected!'
  },
  zoho: {
    id: INTEGRATIONS.ZOHO_CRM,
    title: 'Connect Zoho',
    description:
      'Sync your customer data directly from Zoho CRM for seamless integration.',
    logo: '/icons/zoho-crm-icon.svg',
    installText: 'Connect',
    connectedText: 'Zoho CRM has been successfully connected!'
  },
  salesforce: {
    id: INTEGRATIONS.SALESFORCE_CRM,
    title: 'Connect Salesforce',
    description:
      'Sync your customer data directly from Salesforce CRM for seamless integration.',
    logo: '/salesforce.jpeg',
    installText: 'Connect',
    connectedText: 'Salesforce CRM has been successfully connected!'
  },
  pipedrive: {
    id: INTEGRATIONS.PIPEDRIVE,
    title: 'Connect Pipedrive',
    description:
      'Sync your customer data directly from Pipedrive for seamless integration.',
    logo: '/icons/pipedrive.png',
    installText: 'Connect',
    connectedText: 'Pipedrive has been successfully connected!'
  }
}

const ConnectServicePage = ({ params }: { params: { service: string } }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sheetUrl, setSheetUrl] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [justConnected, setJustConnected] = useState(false)
  const [isHubSpotConnectionValidated, setIsHubSpotConnectionValidated] =
    useState(false)
  const [isHubSpotUsable, setIsHubSpotUsable] = useState(false)
  const hasAutoForwardedAfterConnect = useRef(false)
  const {
    integrations,
    isLoading: isButtonLoading,
    refetch
  } = useIntegrationApps()

  const service = params.service || 'google-sheets'
  const config = SERVICE_CONFIG[service as keyof typeof SERVICE_CONFIG]

  // Derive isConnected from React Query (shared cache, invalidated on disconnect)
  const serviceIntegrationId =
    service === 'google-sheets'
      ? INTEGRATIONS.GOOGLE_SHEET
      : service === 'salesforce'
        ? INTEGRATIONS.SALESFORCE_CRM
        : service.toUpperCase()
  const integration = integrations?.find(
    (i: any) => i.id === serviceIntegrationId
  )
  const hasStoredConnection =
    integration?.status === INTEGRATION_STATUS.CONNECTED
  const isConnected =
    service === 'hubspot'
      ? hasStoredConnection && isHubSpotConnectionValidated && isHubSpotUsable
      : hasStoredConnection

  const handleNext = useCallback(() => {
    // Resolve recordType at click-time so sessionStorage is always readable (avoids SSR/hydration timing issues)
    const resolvedRecordType =
      searchParams.get('recordType') ||
      sessionStorage.getItem('pending_recordType') ||
      'CUSTOMER'

    console.log('searchParams', searchParams.get('recordType'))
    console.log('sessionStorage', sessionStorage.getItem('pending_recordType'))
    console.log('resolvedRecordType', resolvedRecordType)

    const params = new URLSearchParams({
      source:
        service === 'google-sheets'
          ? 'GOOGLE_SHEET'
          : service === 'salesforce'
            ? 'SALESFORCE'
            : service.toUpperCase(),
      recordType: resolvedRecordType
    })

    // If Google Sheets, redirect to the new configuration page
    if (service === 'google-sheets') {
      router.push(`/data-pipeline/connect-gsheet?${params.toString()}`)
      return
    }

    console.log('[handleNext] navigating with:', params.toString())
    router.push(`/data-pipeline/connect?${params.toString()}`)
  }, [router, service, searchParams])

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // (Removed sheet URL restoration logic)
  // (Removed old session flag check, integrated into success effect)

  useEffect(() => {
    if (!isClient) return

    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')

    if (success) {
      // Directly refetch and set state instead of relying on sessionStorage + reload
      refetch()
      setJustConnected(true)

      const currentRecordType = urlParams.get('recordType')
      if (currentRecordType) {
        sessionStorage.setItem('pending_recordType', currentRecordType)
      }

      // Clean up URL seamlessly
      const redirectUrl = `/my-data/connect-service/${service}${currentRecordType ? `?recordType=${currentRecordType}` : ''}`
      router.replace(redirectUrl)
    } else {
      // Fallback check for session storage in case of actual reloads
      const flag = sessionStorage.getItem('crm_just_connected')
      if (flag === service) {
        sessionStorage.removeItem('crm_just_connected')
        refetch()
        setJustConnected(true)
      }
    }
  }, [service, isClient, router, refetch])

  useEffect(() => {
    if (!isClient || service !== 'hubspot') return

    if (!hasStoredConnection) {
      setIsHubSpotConnectionValidated(true)
      setIsHubSpotUsable(false)
      setJustConnected(false)
      return
    }

    let cancelled = false

    const validateHubSpotConnection = async () => {
      setIsHubSpotConnectionValidated(false)

      try {
        const response = await fetch('/api/integrations/hubspot/validate', {
          method: 'GET',
          cache: 'no-store'
        })
        const result = await response.json()

        if (cancelled) return

        setIsHubSpotUsable(Boolean(result?.usable))

        if (!result?.usable) {
          setJustConnected(false)
        }

        if (!result?.usable) {
          console.warn(
            'HubSpot has a stored token but failed validation:',
            result?.error
          )
        }
      } catch (error) {
        if (cancelled) return

        console.error('Failed to validate HubSpot connection:', error)
        setIsHubSpotUsable(false)
        setJustConnected(false)
      } finally {
        if (!cancelled) {
          setIsHubSpotConnectionValidated(true)
        }
      }
    }

    void validateHubSpotConnection()

    return () => {
      cancelled = true
    }
  }, [hasStoredConnection, isClient, service])

  useEffect(() => {
    if (!isConnected) {
      setJustConnected(false)
      hasAutoForwardedAfterConnect.current = false
    }
  }, [isConnected])

  useEffect(() => {
    if (!isClient || !isConnected || hasAutoForwardedAfterConnect.current) {
      return
    }

    hasAutoForwardedAfterConnect.current = true
    handleNext()
  }, [isClient, isConnected, handleNext])

  // If service is not supported, show 404 or fallback
  if (!config) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Service not found</h1>
          <Button onClick={() => router.push('/my-data')}>Go Back</Button>
        </div>
      </div>
    )
  }

  const handleInstall = () => {
    if (service === 'google-sheets') {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('success', 'true')
      const relativeUrl =
        window.location.pathname + '?' + searchParams.toString()

      // Update the URL before calling signIn so NextAuth picks it up as the default callbackUrl
      window.history.replaceState({}, '', relativeUrl)

      signIn('google', undefined, {
        scope: `openid ${SHEET_SCOPES}`
      })
    } else if (
      ['hubspot', 'zoho', 'salesforce', 'pipedrive'].includes(service)
    ) {
      const crmMap = {
        hubspot: INTEGRATIONS.HUBSPOT_OUTREACH,
        zoho: INTEGRATIONS.ZOHO_CRM,
        salesforce: INTEGRATIONS.SALESFORCE_CRM,
        pipedrive: INTEGRATIONS.PIPEDRIVE
      } as const
      const crmType = crmMap[service as keyof typeof crmMap]
      if (isCrmOAuthType(crmType)) {
        // Resolve at call-time (avoids SSR/hydration timing issues)
        const installRecordType =
          searchParams.get('recordType') ||
          sessionStorage.getItem('pending_recordType') ||
          'CUSTOMER'
        // Persist so it survives the full-page OAuth redirect
        if (installRecordType !== 'CUSTOMER') {
          sessionStorage.setItem('pending_recordType', installRecordType)
        }
        void connectCrm(crmType, {
          source: 'my-data-flow',
          useRedirect: service !== 'pipedrive'
        })
      }
    }
  }

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className='flex h-[calc(100vh-50px)] flex-col items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
          <p className='mt-2'>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-[calc(100vh-50px)] flex-col'>
      {/* Main Content */}
      <div className='flex flex-1 items-center justify-center'>
        <div className='w-9/12 max-w-4xl'>
          <ConsentStep
            setStep={() => handleNext()}
            onBack={() => router.push('/my-data')}
            sourceIcon={config.logo}
            dataSource={config.title}
            source={
              <div>
                <h1 className='text-xl font-semibold text-gray-700'>
                  {config.title}
                </h1>
              </div>
            }
            setIsOpen={() => {}}
            isUploaded={isConnected}
            isButtonLoading={
              isButtonLoading ||
              (service === 'hubspot' &&
                hasStoredConnection &&
                !isHubSpotConnectionValidated)
            }
            install={handleInstall}
            sheetUrl={sheetUrl}
            setSheetUrl={setSheetUrl}
            initialShowSuccess={false}
            onSuccessContinue={undefined}
          />
        </div>
      </div>
    </div>
  )
}

export default ConnectServicePage
