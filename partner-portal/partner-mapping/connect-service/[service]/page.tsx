'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { connectCrm, isCrmOAuthType } from '@/lib/crm-oauth'
import { Button } from '@/components/ui/button'
import ConsentStep from '@/components/shared/ConsentStep'
import { SHEET_SCOPES } from '@/app/(app)/(dashboard-pages)/integrations/_components/integration-drawer'

const PARTNER_PORTAL_GOOGLE_SHEET_URL_KEY =
  'partner_portal_connect_google_sheet_url'

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

export default function PartnerPortalConnectServicePage({
  params
}: {
  params: { service: string; vendorOrgId?: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [sheetUrl, setSheetUrl] = useState('')
  const [integrationType, setIntegrationType] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)

  const service = params.service || 'google-sheets'
  const vendorOrgId = params.vendorOrgId
  const PARTNER_MAPPING_BASE = vendorOrgId
    ? `/partner-portal/partner-mapping/${vendorOrgId}`
    : '/partner-portal/partner-mapping'
  const config = SERVICE_CONFIG[service as keyof typeof SERVICE_CONFIG]

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || service !== 'google-sheets') return
    const stored = sessionStorage.getItem(PARTNER_PORTAL_GOOGLE_SHEET_URL_KEY)
    if (stored) {
      setSheetUrl(stored)
    }
  }, [isClient, service])

  useEffect(() => {
    if (!isClient || service !== 'google-sheets') return
    const trimmed = sheetUrl.trim()
    if (trimmed) {
      sessionStorage.setItem(PARTNER_PORTAL_GOOGLE_SHEET_URL_KEY, trimmed)
    }
  }, [isClient, service, sheetUrl])

  // If vendorOrgId is in sessionStorage but not in URL, update URL so it stays in sync
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (vendorOrgId) return
    const stored = sessionStorage.getItem('partnerPortalOrgId')
    if (stored) {
      router.replace(
        `/partner-portal/partner-mapping/${stored}/connect-service/${service}`
      )
    }
  }, [router, service, vendorOrgId])

  const fetchData = async () => {
    setIsButtonLoading(true)
    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' })
      const meData = await meRes.json().catch(() => ({}))
      const userId = meData?.user?.uid

      if (!userId) {
        setIntegrationType([])
        return
      }

      const res = await fetch(
        `/api/no/auth/organization/integration/${encodeURIComponent(userId)}`,
        { credentials: 'include' }
      )
      if (!res.ok) {
        throw new Error('Failed to fetch integrations')
      }
      const apps: any = await res.json()
      const list = Array.isArray(apps) ? apps : (apps?.data ?? [])
      const integrationTypes = list
        .filter(
          (app: any) =>
            (app?.connected === true || app?.refreshToken != null) &&
            app?.integrationType
        )
        .map((app: any) => app.integrationType)
      setIntegrationType(integrationTypes)
    } catch (error) {
      console.error('Error fetching connected apps:', error)
      setIntegrationType([])
    } finally {
      setIsButtonLoading(false)
    }
  }

  useEffect(() => {
    if (!isClient) return
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    const success = urlParams.get('success')
    fetchData()
    if (error) {
      console.error('OAuth error:', error)
    }
    if (success) {
      window.location.href = `${PARTNER_MAPPING_BASE}/connect-service/${service}`
    }
  }, [service, isClient])

  if (!config) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Service not found</h1>
          <Button
            onClick={() => router.push(`${PARTNER_MAPPING_BASE}/connect-crm`)}
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const isConnected = integrationType.includes(
    service === 'google-sheets'
      ? 'G_SHEET'
      : service === 'salesforce'
        ? 'SALESFORCE'
        : service.toUpperCase()
  )

  const handleInstall = () => {
    setIsLoading(true)
    if (service === 'google-sheets') {
      const trimmed = sheetUrl.trim()
      if (trimmed) {
        sessionStorage.setItem(PARTNER_PORTAL_GOOGLE_SHEET_URL_KEY, trimmed)
      }
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
        void connectCrm(crmType, {
          source: 'partner-portal-flow',
          useRedirect: service !== 'pipedrive',
          flow: 'partner-portal'
        })
      }
    }
  }

  const handleBack = () => {
    router.push(`${PARTNER_MAPPING_BASE}/connect-crm`)
  }

  const handleNext = () => {
    const params = new URLSearchParams({
      source:
        service === 'google-sheets'
          ? 'GOOGLE_SHEET'
          : service === 'salesforce'
            ? 'SALESFORCE'
            : service.toUpperCase()
    })
    if (service === 'google-sheets' && sheetUrl) {
      params.append('sheetUrl', sheetUrl)
    }
    router.push(`${PARTNER_MAPPING_BASE}/field-mapping?${params.toString()}`)
  }

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
      <div className='flex flex-1 items-center justify-center'>
        <div className='w-9/12 max-w-4xl'>
          <ConsentStep
            setStep={() => handleNext()}
            onBack={handleBack}
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
            isButtonLoading={isButtonLoading}
            install={handleInstall}
            sheetUrl={sheetUrl}
            setSheetUrl={setSheetUrl}
          />
        </div>
      </div>
    </div>
  )
}
