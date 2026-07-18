import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { useOverlapRecordVersions } from '@/http-hooks/persona-versions'
import { RootState } from '@/redux/store'
import { EyeSlash, Share } from 'iconsax-react'
import {
  ArrowUpNarrowWide,
  ChevronDown,
  Clock,
  Database,
  Sparkles
} from 'lucide-react'
import {
  ChartIllustrationIcon,
  DownloadIcon,
  EyeSlashcon,
  HubSpotIcon,
  SalesforceIcon,
  ShareIcon,
  ZohoIcon
} from 'public/icons/SvgIcons'
import { useSelector } from 'react-redux'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import { formatDate } from '@/lib/dates'
import { Button } from '@/components/ui/button'

const crmIcons = [
  { icon: <HubSpotIcon />, label: 'HubSpot' },
  { icon: <SalesforceIcon />, label: 'Salesforce' },
  { icon: <ZohoIcon />, label: 'Zoho CRM' }
]

const features = [
  {
    icon: (
      <div className='flex items-center justify-center rounded-full bg-[#FEF9DB] p-3'>
        <Clock className='h-5 w-5 text-[#B58900]' />
      </div>
    ),
    stat: '200+',
    title: 'Vendors',
    desc: 'Overlap in the marketplace once you connect your CRM'
  },
  {
    icon: (
      <div className='flex items-center justify-center rounded-full bg-[#FEF9DB] p-3'>
        <Clock className='h-5 w-5 text-[#B58900]' />
      </div>
    ),
    stat: '4x',
    title: 'Faster Responses',
    desc: 'AI-powered insights help you respond to partners instantly with contextual data'
  },
  {
    icon: (
      <div className='flex items-center justify-center rounded-full bg-[#DCFCE7] p-3'>
        <ArrowUpNarrowWide className='h-5 w-5 text-[#22C55E]' />
      </div>
    ),
    stat: '75%',
    title: 'Higher Success Rate',
    desc: 'Data-driven matching increases successful partnerships significantly'
  },
  {
    icon: (
      <div className='flex items-center justify-center rounded-full bg-[#e7e4fcaf] p-3'>
        <Sparkles className='h-5 w-5 text-[#5B4BDB]' />
      </div>
    ),
    stat: '90%',
    title: 'Smart Recommendations',
    desc: 'Get AI-curated partner suggestions based on your customer patterns'
  }
]

const ConnectYourCRM = React.memo(
  ({ personaData, basePath }: { personaData: any; basePath?: string }) => {
    const { integrations, rawConnectedApps } = useIntegrationApps()
    const saved = useSelector((state: RootState) => state.currentOrg)
    const orgId = saved?.organization?.id
    const [fieldsExpanded, setFieldsExpanded] = useState(true)

    const { data: versionsData } = useOverlapRecordVersions(
      orgId,
      !!orgId,
      'CUSTOMER'
    )
    const hasCustomerVersions = (versionsData?.data?.length ?? 0) > 0

    const isCurrentSourceConnected = useMemo(() => {
      if (!personaData?.mode || personaData.mode === 'CSV') return true
      const modeId =
        personaData.mode === 'GOOGLE_SHEET' ? 'G_SHEET' : personaData.mode
      const activeIntegration = integrations.find(
        (app: any) => app.id === modeId
      )
      return activeIntegration?.status === INTEGRATION_STATUS.CONNECTED
    }, [personaData?.mode, integrations])

    const connectedCrm = useMemo(() => {
      const crmIntegrationIds = [
        INTEGRATIONS.HUBSPOT_OUTREACH,
        INTEGRATIONS.ZOHO_CRM,
        INTEGRATIONS.SALESFORCE_CRM,
        INTEGRATIONS.PIPEDRIVE,
        INTEGRATIONS.CLOSE_CRM,
        INTEGRATIONS.GOOGLE_SHEET
      ]

      const connectedCrms = integrations.filter(
        (app: any) =>
          app.status === INTEGRATION_STATUS.CONNECTED &&
          crmIntegrationIds.includes(app.id)
      )

      if (connectedCrms.length === 0) return undefined
      if (connectedCrms.length === 1) return connectedCrms[0]

      // If multiple CRMs are connected, we want the most recently connected one.
      // We can determine this by sorting rawConnectedApps by lastUpdatedTimestamp, creationTimestamp, or id.
      if (rawConnectedApps && rawConnectedApps.length > 0) {
        const sortedRaw = [...rawConnectedApps].sort((a: any, b: any) => {
          if (a.lastUpdatedTimestamp && b.lastUpdatedTimestamp) {
            return (
              new Date(b.lastUpdatedTimestamp).getTime() -
              new Date(a.lastUpdatedTimestamp).getTime()
            )
          }
          if (a.creationTimestamp && b.creationTimestamp) {
            return (
              new Date(b.creationTimestamp).getTime() -
              new Date(a.creationTimestamp).getTime()
            )
          }
          if (a.id && b.id) {
            return b.id - a.id
          }
          return 0
        })

        // Find the first raw app that is a valid connected CRM
        for (const rawApp of sortedRaw) {
          if (
            rawApp.refreshToken &&
            crmIntegrationIds.includes(rawApp.integrationType)
          ) {
            const found = connectedCrms.find(
              (c: any) => c.id === rawApp.integrationType
            )
            if (found) return found
          }
        }
      }

      return connectedCrms[0]
    }, [integrations, rawConnectedApps])

    const [forceReconnect, setForceReconnect] = useState(() => {
      return (
        typeof window !== 'undefined' &&
        localStorage.getItem('crm_force_reconnect') === 'true'
      )
    })

    useEffect(() => {
      if (connectedCrm) {
        localStorage.removeItem('crm_force_reconnect')
        setForceReconnect(false)
      }
    }, [connectedCrm])

    const router = useRouter()

    const handleConnectCRM = useCallback(() => {
      sessionStorage.setItem('pending_recordType', 'CUSTOMER')
      router.push(
        basePath
          ? `${basePath}/connect-crm?recordType=CUSTOMER`
          : '/my-data/connect-crm?recordType=CUSTOMER'
      )
    }, [router, basePath])

    const handleDownloadTemplate = useCallback(() => {
      const csvContent = `name,website,ticket_size($),country,industry,contact_email,creation_date
Katylyst,[https://katylyst.com](https://katylyst.com),23900,IN,Internet & Technology,[karti@katylyst.com](mailto:karti@katylyst.com),2025-09-14`

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', 'Sharkdom_Customer_Opportunity_format.csv')
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, [])

    const isDataPipelineActive = useMemo(() => {
      // If the CRM was disconnected, the pipeline is no longer active
      if (!isCurrentSourceConnected) return false

      // If there's a connected CRM but its mode doesn't match the persona's current mode,
      // the user connected a new CRM but hasn't submitted field mapping yet.
      if (connectedCrm) {
        const crmIdNormalized =
          connectedCrm.id === 'G_SHEET' ? 'GOOGLE_SHEET' : connectedCrm.id
        if (personaData?.mode !== crmIdNormalized) return false
      }

      // NONE means no persona has been created at all → not active
      if (personaData?.personaStatus === 'NONE') return false

      // INITIATED / PENDING / COMPLETED all mean the user HAS submitted mapping.
      // INITIATED = pipeline just started, PENDING = syncing, COMPLETED = done.
      // All three should show "View Data Source".
      return (
        hasCustomerVersions ||
        (!!personaData?.personaStatus &&
          ['INITIATED', 'PENDING', 'COMPLETED'].includes(
            personaData.personaStatus
          ))
      )
    }, [
      hasCustomerVersions,
      personaData?.personaStatus,
      personaData?.mode,
      connectedCrm,
      isCurrentSourceConnected
    ])

    const isCrmAuthenticatedOnly = useMemo(() => {
      // CRM is connected via OAuth but the pipeline is not yet active for it.
      return !!connectedCrm && !isDataPipelineActive
    }, [connectedCrm, isDataPipelineActive])

    const viewDataSourceHref = useMemo(() => {
      // First, check if there's a connected CRM that still needs mapping
      const crmIdNormalized = connectedCrm
        ? connectedCrm.id === 'G_SHEET'
          ? 'GOOGLE_SHEET'
          : connectedCrm.id
        : null
      if (
        connectedCrm &&
        (!isDataPipelineActive || personaData?.mode !== crmIdNormalized)
      ) {
        const slug =
          connectedCrm.id === INTEGRATIONS.HUBSPOT_OUTREACH
            ? 'hubspot'
            : connectedCrm.id === INTEGRATIONS.SALESFORCE_CRM
              ? 'salesforce'
              : connectedCrm.id === INTEGRATIONS.ZOHO_CRM
                ? 'zoho'
                : connectedCrm.id === INTEGRATIONS.PIPEDRIVE
                  ? 'pipedrive'
                  : connectedCrm.id === INTEGRATIONS.GOOGLE_SHEET
                    ? 'google-sheets'
                    : connectedCrm.id.toLowerCase()
        return `/my-data/connect-service/${slug}?recordType=CUSTOMER`
      }

      // If we have actual customer versions synced, we can go to insights
      if (
        hasCustomerVersions ||
        (!!personaData?.personaStatus && personaData.personaStatus !== 'NONE')
      ) {
        return basePath
          ? basePath
          : '/my-data/customer-insights?recordType=CUSTOMER'
      }

      return basePath
        ? basePath
        : '/my-data/customer-insights?recordType=CUSTOMER'
    }, [
      basePath,
      hasCustomerVersions,
      personaData,
      connectedCrm,
      isDataPipelineActive
    ])

    const isConnected = useMemo(
      () => !forceReconnect && (isDataPipelineActive || isCrmAuthenticatedOnly),
      [forceReconnect, isDataPipelineActive, isCrmAuthenticatedOnly]
    )

    return (
      <div className='bg-[linear-gradient(180deg,#D0ECF7_0%,#E7F4F9_20%,#F9FAFB_45%)] px-8 pb-7 pt-7 dark:bg-transparent dark:bg-none lg:px-9'>
        <div className='flex flex-col gap-7'>
          <div className='flex flex-col gap-8 md:flex-row md:items-start md:justify-between'>
            <div className='max-w-[620px] pt-1'>
              <h2 className='mb-3 mt-5 text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#393939] dark:text-white'>
                {isDataPipelineActive
                  ? 'Customer Data Connected'
                  : isCrmAuthenticatedOnly
                    ? 'Complete CRM Connection'
                    : 'Connect Your CRM to Get Started'}
              </h2>
              <p className='mb-8 max-w-[700px] text-[18px] leading-[1.55] text-[#57575F] dark:text-gray-300'>
                {isCrmAuthenticatedOnly
                  ? 'You have successfully linked your CRM. Map your fields to complete the setup and activate your data pipeline.'
                  : isDataPipelineActive
                    ? `User connected their data on ${
                        personaData?.creationTimestamp
                          ? formatDate(personaData.creationTimestamp)
                          : 'recently'
                      }. Your data pipeline is active.`
                    : 'Unlock AI-powered partnership analytics, smart recommendations, and accelerate your growth. Your data stays private and secure.'}
              </p>
              <Button
                variant='primary'
                className='inline-flex h-[48px] items-center gap-2 rounded-[8px] border border-brandPrimary bg-brandPrimary px-7 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(107,79,187,0.18)] hover:bg-brandPrimary-hover'
                onClick={
                  isDataPipelineActive || isCrmAuthenticatedOnly
                    ? () => router.push(viewDataSourceHref)
                    : handleConnectCRM
                }
              >
                <Database className='h-4 w-4' />
                {isCrmAuthenticatedOnly
                  ? 'Map Fields'
                  : isDataPipelineActive
                    ? 'View Data Source'
                    : 'Connect CRM'}
              </Button>
            </div>

            <div className='relative hidden h-[210px] w-[360px] shrink-0 md:block'>
              <div className='absolute left-[30px] top-[30px] z-10 grid grid-cols-2 gap-3'>
                {crmIcons.map((c, i) => (
                  <div
                    key={i}
                    title={c.label}
                    className='flex h-[65px] w-[65px] items-center justify-center rounded-[8px] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.07)] dark:bg-card'
                  >
                    {c.icon}
                  </div>
                ))}
              </div>
              <div className='absolute bottom-0 right-0 h-[190px]'>
                <ChartIllustrationIcon />
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {features.map((f, i) => (
              <div
                key={i}
                className='flex min-h-[268px] flex-col items-center rounded-[18px] border border-[#E4E7EE] bg-white px-7 pb-8 pt-10 text-center dark:border-border dark:bg-card'
              >
                <div className='mb-5'>{f.icon}</div>
                <div className='mb-2 font-sans text-[24px] font-bold leading-none text-[#0F172A] dark:text-white'>
                  {f.stat}
                </div>
                <div className='mb-5 text-[16px] font-semibold leading-[1.35] text-[#0F172A] dark:text-white'>
                  {f.title}
                </div>
                <div className='max-w-[185px] text-[14px] leading-[1.45] text-[#9FA6B1] dark:text-gray-400'>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>

          <div className='rounded-[12px] bg-[#F1F5FF] shadow-[0_1px_3px_rgba(15,23,42,0.03)] dark:border dark:border-border dark:bg-card'>
            <button
              type='button'
              onClick={() => setFieldsExpanded((v) => !v)}
              aria-expanded={fieldsExpanded}
              aria-controls='recommended-fields-panel'
              className='flex w-full items-center justify-between px-5 py-5 text-left sm:px-6'
            >
              <span className='text-[18px] font-medium text-[#2A3241] dark:text-white'>
                Recommended fields for better results
              </span>
              <span
                aria-hidden='true'
                style={{
                  display: 'inline-flex',
                  transition: 'transform 300ms cubic-bezier(0.16,1,0.3,1)',
                  transform: fieldsExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <ChevronDown className='h-6 w-6 text-[#262626] dark:text-white' />
              </span>
            </button>

            <div
              id='recommended-fields-panel'
              role='region'
              aria-labelledby='recommended-fields-btn'
              style={{
                display: 'grid',
                gridTemplateRows: fieldsExpanded ? '1fr' : '0fr',
                transition:
                  'grid-template-rows 300ms cubic-bezier(0.16,1,0.3,1)'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div className='flex flex-col gap-4 px-5 pb-5 pt-1 sm:px-6 lg:flex-row lg:items-end lg:justify-between'>
                  <div className='flex flex-col gap-2.5'>
                    <div className='flex items-center gap-2.5 text-[15px] text-[#2D3340]'>
                      <span
                        className='
                          relative
                          inline-flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-[6px]
                          border border-[#0E9F1A]
                          bg-gradient-to-b from-[#42D450] to-[#00B800]
                          text-[11px]
                          font-bold
                          text-white
                          shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.25)]
                        '
                      >
                        ✓
                      </span>
                      <span>
                        <span className='font-semibold text-[#2A3241] dark:text-white'>
                          Mandatory:
                        </span>{' '}
                        <span className='font-medium text-[#4D5C78] dark:text-gray-300'>
                          Name, Website
                        </span>
                      </span>
                    </div>

                    <div className='flex items-center gap-2.5 text-[15px] text-[#2D3340]'>
                      <span
                        className='
                          relative
                          inline-flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-full
                          border border-[#D9A300]
                          bg-gradient-to-b from-[#FFF27A] via-[#FFE600] to-[#FACC15]
                          text-[10px]
                          text-[#FACC15]
                          shadow-[inset_0_2px_3px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.18)]
                        '
                      >
                        <span className='absolute left-[10%] top-0 h-[40%] w-[80%] rounded-full bg-white/45 blur-[1px]' />
                      </span>
                      <span>
                        <span className='font-semibold text-[#2A3241] dark:text-white'>
                          Nice-to-have
                        </span>{' '}
                        <span className='font-semibold italic text-[#2A3241] dark:text-white'>
                          (Optional though)
                        </span>
                        <span className='font-semibold text-[#2A3241] dark:text-white'>
                          :
                        </span>{' '}
                        <span className='font-medium text-[#4D5C78] dark:text-gray-300'>
                          Industry, Contact Number
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    type='button'
                    onClick={handleDownloadTemplate}
                    className='inline-flex items-center gap-2 self-start text-[15px] font-medium text-brandPrimary transition-colors hover:text-brandPrimary-hover lg:self-auto'
                  >
                    <DownloadIcon />
                    Download template
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-[8px] border border-[#E4E7EE] bg-white px-4 py-4 dark:border-border dark:bg-card sm:px-3'>
            <div className='flex flex-col gap-7'>
              <div className='flex items-start gap-2'>
                <div className='flex h-9 w-9 shrink-0 items-start justify-center rounded-full'>
                  <ShareIcon />
                </div>
                <div>
                  <p className='mt-0.5 text-[16px] font-medium leading-none text-[#2A3241] dark:text-white'>
                    Connect Effortlessly
                  </p>
                  <p className='mt-1 text-[14px] font-normal leading-[1.55] text-[#657795] dark:text-gray-400'>
                    Sharkdom lets you securely connect your marketing data in
                    couple of minutes.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-2'>
                <div className='flex h-9 w-9 shrink-0 items-start justify-center rounded-full'>
                  <EyeSlashcon />
                </div>
                <div>
                  <p className='mt-0.5 text-[16px] font-medium leading-none text-[#2A3241] dark:text-white'>
                    Your data belongs to you
                  </p>
                  <p className='mt-1 text-[14px] font-normal leading-[1.55] text-[#657795] dark:text-gray-400'>
                    Sharkdom doesn&apos;t sell personal info, and will only use
                    it with your permission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ConnectYourCRM.displayName = 'ConnectYourCRM'
export default ConnectYourCRM
