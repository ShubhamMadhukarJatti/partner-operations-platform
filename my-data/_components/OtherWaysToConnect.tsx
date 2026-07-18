import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { useDisconnectPersonaCrm } from '@/http-hooks/partner-match'
import { useOverlapRecordVersions } from '@/http-hooks/persona-versions'
import { RootState } from '@/redux/store'
import { EyeSlash, Refresh, Share } from 'iconsax-react'
import { UserSearch } from 'lucide-react'
import { useSelector } from 'react-redux'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import { showCustomToast } from '@/components/custom-toast'
import { UserViewFinderIcon } from '@/components/icons/icons'

import ActionPopover from './ActionPopover'

// ─── Disconnect button + confirm dialog for a single record type ───────────────
const DisconnectButton: React.FC<{
  recordType: 'PROSPECT' | 'OPPORTUNITY'
  data: any[] // array of persona-preview records for this record type
  /** Resolved active CRM (persona mode or first connected integration), not only preview row */
  crmMode?: string
}> = ({ recordType, data, crmMode }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const disconnectMutation = useDisconnectPersonaCrm()
  const isDisconnecting = disconnectMutation.isPending

  // Keep order aligned with customer-insights `getLogoForMode` for consistent icons.
  const getLogoForMode = (mode?: string) => {
    if (!mode) return '/icons/sharkdom-meet-rounded-logo.svg'
    const m = String(mode).toLowerCase()
    if (m.includes('hubspot')) return '/icons/hubspot-rounded-logo.svg'
    if (m.includes('zoho')) return '/icons/zoho-rounded-logo.svg'
    if (m.includes('salesforce')) return '/icons/salesforce-rounded-logo.svg'
    if (m.includes('mailchimp')) return '/icons/mailchimp-rounded-logo.svg'
    if (m.includes('slack')) return '/icons/slack.svg'
    if (m.includes('zoom')) return '/icons/sharkdom-meet-rounded-logo.svg'
    if (m.includes('pipedrive')) return '/icons/pipedrive-rounded-logo.svg'
    return '/icons/sharkdom-meet-rounded-logo.svg'
  }

  // Prefer org active CRM (crmMode) over per-row preview source/mode — rows can be
  // stale (e.g. still "HUBSPOT" after switching to Salesforce).
  const integrationType = useMemo(() => {
    const fromPersona =
      crmMode != null &&
      String(crmMode).trim() !== '' &&
      String(crmMode).trim().toUpperCase() !== 'CSV'
        ? String(crmMode).trim()
        : null
    const raw = fromPersona ?? data?.[0]?.source ?? data?.[0]?.mode
    if (raw == null || String(raw).trim() === '') return undefined
    return String(raw).trim().toUpperCase().replace(/\s+/g, '_')
  }, [data, crmMode])

  const handleDisconnect = () => {
    // Same endpoint as customer-insights full CRM disconnect, but with PROSPECT |
    // OPPORTUNITY the hook only removes that record type and refetches preview —
    // CUSTOMER OAuth / connected-apps stay intact (see useDisconnectPersonaCrm).
    disconnectMutation.mutate(
      {
        integrationType: integrationType ?? 'NONE',
        recordType
      },
      {
        onSuccess: () => {
          showCustomToast(
            'Success',
            `${recordType === 'PROSPECT' ? 'Prospects' : 'Opportunities'} disconnected successfully`,
            'success',
            4000
          )
          setShowConfirm(false)
        }
      }
    )
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDisconnecting}
        className='w-max rounded-lg border border-[#3E50F7] bg-transparent px-4 py-2 text-sm text-[#3E50F7] transition-colors hover:bg-[#3E50F7] hover:text-white disabled:cursor-not-allowed disabled:opacity-60'
      >
        <div className='flex items-center gap-3'>
          {isDisconnecting ? (
            <>
              <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#3E50F7] border-t-transparent group-hover:border-white' />
              Disconnecting...
            </>
          ) : (
            <>
              <Image
                src={getLogoForMode(integrationType ?? crmMode)}
                alt={integrationType ?? crmMode ?? 'integration'}
                width={20}
                height={20}
                className='rounded-full'
              />
              Disconnect
            </>
          )}
        </div>
      </button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className='max-w-md'>
          <div className='p-4'>
            <DialogTitle className='text-lg font-semibold'>
              Confirm disconnect
            </DialogTitle>
            <DialogDescription asChild>
              <p className='mt-2 text-sm text-gray-600'>
                Are you sure you want to remove your{' '}
                {recordType === 'PROSPECT' ? 'prospects' : 'opportunities'}{' '}
                data? You can re-add it later.
              </p>
            </DialogDescription>
            <div className='mt-4 flex justify-end gap-2'>
              <Button variant='ghost' onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant='destructiveSolid'
                onClick={handleDisconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? 'Disconnecting…' : 'Disconnect'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

const OtherWaysToConnect = React.memo(
  ({
    personaData,
    locked,
    basePath
  }: {
    personaData: any
    locked: any
    basePath?: string
  }) => {
    const router = useRouter()

    // Mirror ConnectYourCRM's exact isConnected logic so both components stay in sync.
    const { integrations } = useIntegrationApps()
    // Match customer-insights `disconnectIntegrationType` so disconnect + logo use the
    // real connected CRM (v2 can omit `personaData.mode` even when OAuth is active).
    const activeCrmMode = useMemo(() => {
      if (personaData?.mode && personaData.mode !== 'CSV') {
        return String(personaData.mode).trim()
      }
      const connected = integrations.find(
        (app: any) => app.status === INTEGRATION_STATUS.CONNECTED
      )
      return connected?.id ? String(connected.id).trim() : undefined
    }, [personaData?.mode, integrations])
    const saved = useSelector((state: RootState) => state.currentOrg)
    const orgId = saved?.organization?.id
    const { data: versionsData } = useOverlapRecordVersions(
      orgId,
      !!orgId,
      'CUSTOMER'
    )
    const hasCustomerVersions = (versionsData?.data?.length ?? 0) > 0

    // CRM source still connected? (same logic as ConnectYourCRM)
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
      return integrations.find(
        (app: any) =>
          app.status === INTEGRATION_STATUS.CONNECTED &&
          [
            INTEGRATIONS.HUBSPOT_OUTREACH,
            INTEGRATIONS.ZOHO_CRM,
            INTEGRATIONS.SALESFORCE_CRM,
            INTEGRATIONS.PIPEDRIVE,
            INTEGRATIONS.CLOSE_CRM
          ].includes(app.id)
      )
    }, [integrations])

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

    // Pending Actions should ONLY show when data exists AND the source is still connected.
    // This mirrors ConnectYourCRM's isConnected exactly so both flip together.
    const isConnected = useMemo(
      () =>
        !forceReconnect &&
        isCurrentSourceConnected &&
        (hasCustomerVersions ||
          (!!personaData?.personaStatus &&
            personaData.personaStatus !== 'NONE')),
      [
        forceReconnect,
        hasCustomerVersions,
        personaData?.personaStatus,
        isCurrentSourceConnected
      ]
    )

    // Use the locked prop (v1 API) — production-matching approach.
    // The v1 /persona/overlap/my-records API DOES clear PROSPECT/OPPORTUNITY rows
    // when the backend deletes their versioned records.
    const isProspectInArray = useMemo(
      () => locked?.some((record: any) => record.recordType === 'PROSPECT'),
      [locked]
    )

    const isOpportunityInArray = useMemo(
      () => locked?.some((record: any) => record.recordType === 'OPPORTUNITY'),
      [locked]
    )

    const prospectData = useMemo(
      () => locked?.filter((record: any) => record.recordType === 'PROSPECT'),
      [locked]
    )

    const opportunityData = useMemo(
      () =>
        locked?.filter((record: any) => record.recordType === 'OPPORTUNITY'),
      [locked]
    )

    const handleAddProspects = useCallback(() => {
      // Persist so the recordType survives the full connect-crm → connect-service → field-mapping chain
      sessionStorage.setItem('pending_recordType', 'PROSPECT')
      router.push(
        basePath
          ? `${basePath}/connect-crm?recordType=PROSPECT`
          : '/my-data/connect-crm?recordType=PROSPECT'
      )
    }, [router, basePath])

    const handleAddOpportunities = useCallback(() => {
      // Persist so the recordType survives the full connect-crm → connect-service → field-mapping chain
      sessionStorage.setItem('pending_recordType', 'OPPORTUNITY')
      router.push(
        basePath
          ? `${basePath}/connect-crm?recordType=OPPORTUNITY`
          : '/my-data/connect-crm?recordType=OPPORTUNITY'
      )
    }, [router, basePath])

    // Resolve the CRM source string for field-mapping URL params.
    // activeCrmMode comes from personaData.mode or the first connected integration.
    const resolvedSource = useMemo(() => {
      if (!activeCrmMode) return 'CSV'
      const m = activeCrmMode.toUpperCase().replace(/\s+/g, '_')
      if (m.includes('HUBSPOT')) return 'HUBSPOT'
      if (m.includes('SALESFORCE')) return 'SALESFORCE'
      if (m.includes('ZOHO')) return 'ZOHO'
      if (m.includes('PIPEDRIVE')) return 'PIPEDRIVE'
      if (m.includes('GOOGLE_SHEET')) return 'GOOGLE_SHEET'
      return m
    }, [activeCrmMode])

    const handleMapProspects = useCallback(() => {
      sessionStorage.setItem('pending_recordType', 'PROSPECT')
      const params = new URLSearchParams({
        source: resolvedSource,
        recordType: 'PROSPECT'
      })
      router.push(
        basePath
          ? `${basePath}/field-mapping?${params.toString()}`
          : `/my-data/field-mapping?${params.toString()}`
      )
    }, [router, basePath, resolvedSource])

    const handleMapOpportunities = useCallback(() => {
      sessionStorage.setItem('pending_recordType', 'OPPORTUNITY')
      const params = new URLSearchParams({
        source: resolvedSource,
        recordType: 'OPPORTUNITY'
      })
      router.push(
        basePath
          ? `${basePath}/field-mapping?${params.toString()}`
          : `/my-data/field-mapping?${params.toString()}`
      )
    }, [router, basePath, resolvedSource])

    // We no longer show "Pending Actions" in this view.
    return null
  }
)

OtherWaysToConnect.displayName = 'OtherWaysToConnect'

export default OtherWaysToConnect
