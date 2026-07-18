import { useMemo } from 'react'
import { fetchconnectedApps } from '@/services/organizations'
import { useQuery } from '@tanstack/react-query'

import {
  ALL_INTEGRATIONS,
  COMING_SOON_INTEGRATIONS,
  INTEGRATION_STATUS,
  INTEGRATIONS
} from '@/lib/constants/integrations'
import { isDummyFlow } from '@/lib/dummy-flow'

type IntegrationFilter =
  | 'All'
  | 'CRM'
  | 'Communication'
  | 'Productivity'
  | 'Payments'
  | 'Connected'

const getIntegrationCategory = (integrationId: string) => {
  switch (integrationId) {
    case INTEGRATIONS.HUBSPOT_OUTREACH:
    case INTEGRATIONS.ZOHO_CRM:
    case INTEGRATIONS.SALESFORCE_CRM:
    case INTEGRATIONS.PIPEDRIVE:
    case INTEGRATIONS.CLOSE_CRM:
      return 'CRM'

    case INTEGRATIONS.SLACK:
    case INTEGRATIONS.DISCORD:
    case INTEGRATIONS.ZOOM:
    case INTEGRATIONS.GOOGLE_MEET:
    case INTEGRATIONS.HUBSPOT_MEET:
    case INTEGRATIONS.SHARKDOM_MEET:
    case INTEGRATIONS.CALENDLY:
      return 'Communication'

    case INTEGRATIONS.GOOGLE_SHEET:
    case INTEGRATIONS.GOOGLE_FORM:
    case INTEGRATIONS.TRELLO:
      return 'Productivity'

    case INTEGRATIONS.STRIPE:
      return 'Payments'

    default:
      return 'All'
  }
}

const applyIntegrationFilters = (
  integrations: any[],
  activeFilter: IntegrationFilter,
  searchQuery: string
) => {
  const normalizedSearch = searchQuery.trim().toLowerCase()

  return integrations.filter((integration) => {
    const matchesSearch =
      !normalizedSearch ||
      integration.name?.toLowerCase().includes(normalizedSearch) ||
      integration.description?.toLowerCase().includes(normalizedSearch)

    const matchesFilter =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Connected'
          ? integration.status === INTEGRATION_STATUS.CONNECTED
          : getIntegrationCategory(integration.id) === activeFilter

    return matchesSearch && matchesFilter
  })
}

type UseIntegrationAppsParams = {
  activeFilter?: IntegrationFilter
  searchQuery?: string
}

export const useIntegrationApps = ({
  activeFilter = 'All',
  searchQuery = ''
}: UseIntegrationAppsParams = {}) => {
  const inDummyFlow = isDummyFlow()

  const {
    data: rawConnectedApps,
    error,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['connected-apps'],
    queryFn: () => fetchconnectedApps(),
    retry: false,
    enabled: !inDummyFlow
  })

  const hubspotConnectionRecord = rawConnectedApps?.find(
    (app: any) => app.integrationType === INTEGRATIONS.HUBSPOT_OUTREACH
  )
  const hasStoredHubspotConnection = Boolean(
    hubspotConnectionRecord?.refreshToken
  )

  const { data: hubspotValidation, isLoading: isHubspotValidationLoading } =
    useQuery({
      queryKey: [
        'integration-validation',
        INTEGRATIONS.HUBSPOT_OUTREACH,
        hasStoredHubspotConnection,
        hubspotConnectionRecord?.refreshToken?.slice(-8) ?? null
      ],
      queryFn: async () => {
        const response = await fetch('/api/integrations/hubspot/validate', {
          method: 'GET',
          cache: 'no-store'
        })

        if (!response.ok) {
          throw new Error('Failed to validate HubSpot connection')
        }

        return response.json() as Promise<{ usable?: boolean }>
      },
      retry: false,
      enabled: !inDummyFlow && hasStoredHubspotConnection
    })

  const integrations = useMemo(() => {
    const connectedApps = new Set(
      (rawConnectedApps ?? [])
        .filter((app: any) => app.refreshToken)
        .map((app: any) => app.integrationType)
    )

    const disconnectedApps = new Set(
      (rawConnectedApps ?? [])
        .filter((app: any) => !app.refreshToken)
        .map((app: any) => app.integrationType)
    )

    const hubspotIsUsable = hasStoredHubspotConnection
      ? Boolean(hubspotValidation?.usable)
      : false

    const integrationsWithStatus = ALL_INTEGRATIONS.map((integration) => {
      let status = COMING_SOON_INTEGRATIONS.has(integration.id)
        ? INTEGRATION_STATUS.COMING_SOON
        : connectedApps.has(integration.id)
          ? INTEGRATION_STATUS.CONNECTED
          : disconnectedApps.has(integration.id)
            ? INTEGRATION_STATUS.IN_ACTIVE
            : INTEGRATION_STATUS.NOT_CONNECTED

      if (
        integration.id === INTEGRATIONS.HUBSPOT_OUTREACH &&
        hasStoredHubspotConnection &&
        !isHubspotValidationLoading &&
        !hubspotIsUsable
      ) {
        status = INTEGRATION_STATUS.NOT_CONNECTED
      }

      return {
        ...integration,
        status
      }
    })

    return applyIntegrationFilters(
      integrationsWithStatus,
      activeFilter,
      searchQuery
    )
  }, [
    activeFilter,
    hasStoredHubspotConnection,
    hubspotValidation?.usable,
    isHubspotValidationLoading,
    rawConnectedApps,
    searchQuery
  ])

  if (inDummyFlow) {
    const mockData = ALL_INTEGRATIONS.map((integration) => ({
      ...integration,
      status:
        integration.id === 'TRELLO'
          ? INTEGRATION_STATUS.CONNECTED
          : INTEGRATION_STATUS.NOT_CONNECTED
    }))

    return {
      integrations: applyIntegrationFilters(
        mockData,
        activeFilter,
        searchQuery
      ),
      rawConnectedApps: [],
      error: null,
      isLoading: false,
      refetch: () => {}
    }
  }

  return {
    integrations: integrations || [],
    rawConnectedApps: rawConnectedApps || [],
    error,
    isLoading: isLoading || isHubspotValidationLoading,
    refetch
  }
}
