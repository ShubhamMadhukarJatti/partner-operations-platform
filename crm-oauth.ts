/**
 * Unified CRM OAuth config and URL builder.
 * Single source of truth for HubSpot, Zoho, Pipedrive, Salesforce, Close CRM connect flows.
 */

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { getZohoAccountsBase } from '@/lib/zoho'

export type CrmOAuthType =
  | typeof INTEGRATIONS.HUBSPOT_OUTREACH
  | typeof INTEGRATIONS.ZOHO_CRM
  | typeof INTEGRATIONS.PIPEDRIVE
  | typeof INTEGRATIONS.SALESFORCE_CRM
  | typeof INTEGRATIONS.CLOSE_CRM

const CRM_OAUTH_TYPES: CrmOAuthType[] = [
  INTEGRATIONS.HUBSPOT_OUTREACH,
  INTEGRATIONS.ZOHO_CRM,
  INTEGRATIONS.PIPEDRIVE,
  INTEGRATIONS.SALESFORCE_CRM,
  INTEGRATIONS.CLOSE_CRM
]

export function isCrmOAuthType(
  integrationId: string
): integrationId is CrmOAuthType {
  return CRM_OAUTH_TYPES.includes(integrationId as CrmOAuthType)
}

export type CrmOAuthFlow = 'default' | 'partner-portal'

export const HUBSPOT_REQUIRED_SCOPES = [
  'crm.objects.companies.read',
  'crm.objects.contacts.read',
  'crm.objects.contacts.write',
  'crm.objects.deals.read',
  'crm.objects.deals.write',
  'crm.schemas.deals.read',
  'crm.schemas.deals.write',
  'forms',
  'oauth'
] as const

function dedupeScopes(scopes: string[]): string[] {
  return Array.from(new Set(scopes.filter(Boolean)))
}

export function getNormalizedHubSpotScopes(
  rawScopes: string | undefined = process.env.NEXT_PUBLIC_HUBSPOT_SCOPES
): string {
  const fallbackScopes = [...HUBSPOT_REQUIRED_SCOPES]

  if (!rawScopes?.trim()) {
    return fallbackScopes.join(' ')
  }

  let decodedScopes = rawScopes.trim()

  try {
    decodedScopes = decodeURIComponent(decodedScopes)
  } catch {
    // Keep the raw value when it is not URI-encoded.
  }

  const normalizedScopes = decodedScopes
    .replace(/[,+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')

  return dedupeScopes([...fallbackScopes, ...normalizedScopes]).join(' ')
}

export function buildHubSpotOAuthUrl(options: {
  clientId?: string
  redirectUri: string
  source?: string
  prompt?: 'login' | 'consent'
}): string {
  const clientId =
    options.clientId ?? (process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID as string)
  const url = new URL('https://app.hubspot.com/oauth/authorize')

  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', options.redirectUri)
  url.searchParams.set('scope', getNormalizedHubSpotScopes())
  url.searchParams.set('prompt', options.prompt ?? 'login')

  if (options.source && options.source !== 'integration-drawer') {
    url.searchParams.set('state', options.source)
  }

  return url.toString()
}

/**
 * Build OAuth URL for the given CRM. Returns the URL string.
 * For Zoho, resolves the accounts base URL asynchronously.
 */
export async function getCrmOAuthUrl(
  crmType: CrmOAuthType,
  source: string = 'integration-drawer',
  flow: CrmOAuthFlow = 'default'
): Promise<string> {
  const statePayload = {
    timestamp: Date.now(),
    source
  }

  switch (crmType) {
    case INTEGRATIONS.HUBSPOT_OUTREACH: {
      let redirectUri: string
      if (flow === 'partner-portal') {
        const explicit =
          process.env.NEXT_PUBLIC_HUBSPOT_PARTNER_PORTAL_REDIRECTION_URL
        if (explicit) {
          redirectUri =
            explicit.replace(/(?<!:)\/\/+/g, '/').replace(/\/+$/, '') ||
            explicit
        } else {
          const base = (process.env.NEXT_PUBLIC_BASE_URL || '')
            .replace(/(?<!:)\/\/+/g, '/')
            .replace(/\/+$/, '')
          const root =
            base ||
            (typeof window !== 'undefined' ? window.location.origin : '')
          redirectUri = root
            ? `${root}/partner-portal/partner-mapping/integrations`
                .replace(/(?<!:)\/\/+/g, '/')
                .replace(/\/+$/, '')
            : ''
        }
      } else {
        redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL as string
      }
      return buildHubSpotOAuthUrl({
        redirectUri,
        source,
        prompt: 'login'
      })
    }

    case INTEGRATIONS.ZOHO_CRM: {
      const zohoId =
        (process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID as string)
          ?.trim()
          .replace(/\+/g, '') ?? ''
      const redirectUri = process.env.NEXT_PUBLIC_ZOHO_REDIRECTION_URL as string
      const zohoScopes = process.env.NEXT_PUBLIC_ZOHO_SCOPES as string
      const state = JSON.stringify(statePayload)
      const zohoAccountsBase = await getZohoAccountsBase()
      return (
        `${zohoAccountsBase}/oauth/v2/auth` +
        `?scope=${encodeURIComponent(zohoScopes)}` +
        `&client_id=${zohoId}` +
        `&state=${encodeURIComponent(state)}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&access_type=offline` +
        `&prompt=consent`
      )
    }

    case INTEGRATIONS.PIPEDRIVE: {
      const pipedriveId = process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID as string
      const redirectUri = process.env
        .NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL as string
      const pipedriveScopes =
        (process.env.NEXT_PUBLIC_PIPEDRIVE_SCOPES as string) || ''
      const state = JSON.stringify(statePayload)
      const scopeParam = pipedriveScopes
        ? `&scope=${encodeURIComponent(pipedriveScopes)}`
        : ''
      return `https://oauth.pipedrive.com/oauth/authorize?client_id=${pipedriveId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&response_type=code&access_type=offline&prompt=consent${scopeParam}`
    }

    case INTEGRATIONS.SALESFORCE_CRM: {
      const clientId =
        flow === 'partner-portal'
          ? (process.env.NEXT_PUBLIC_EXTERNAL_SALESFORCE_CLIENT_ID as string)
          : (process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID as string)
      const redirectUri =
        flow === 'partner-portal'
          ? (process.env.NEXT_PUBLIC_EXTERNAL_SALESFORCE_REDIRECT_URL as string)
          : (process.env.NEXT_PUBLIC_SALESFORCE_REDIRECT_URL as string)
      const scopes =
        flow === 'partner-portal'
          ? (process.env.NEXT_PUBLIC_EXTERNAL_SALESFORCE_SCOPES as string)
          : (process.env.NEXT_PUBLIC_SALESFORCE_SCOPES as string)
      const state = JSON.stringify(statePayload)
      return `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state)}&prompt=login`
    }

    case INTEGRATIONS.CLOSE_CRM: {
      const closeClientId = process.env.NEXT_PUBLIC_CLOSE_CLIENT_ID as string
      const redirectUri = process.env.NEXT_PUBLIC_CLOSE_REDIRECT_URI as string
      const bytes = new Uint8Array(16)
      crypto.getRandomValues(bytes)
      const state = Array.from(bytes, (b) =>
        b.toString(16).padStart(2, '0')
      ).join('')
      const url = new URL('https://app.close.com/oauth2/authorize/')
      url.searchParams.set('client_id', closeClientId)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('redirect_uri', redirectUri)
      url.searchParams.set('state', state)
      return url.toString()
    }

    default:
      throw new Error(`Unsupported CRM type: ${crmType}`)
  }
}

/**
 * Connect CRM - opens OAuth URL. Use window.open for drawer/cards, window.location.href for full-page flows.
 */
export async function connectCrm(
  crmType: CrmOAuthType,
  options: { source?: string; useRedirect?: boolean; flow?: CrmOAuthFlow } = {}
): Promise<void> {
  const source = options.source ?? 'integration-drawer'
  const useRedirect = options.useRedirect ?? false
  const flow = options.flow ?? 'default'
  const url = await getCrmOAuthUrl(crmType, source, flow)
  if (useRedirect) {
    window.location.href = url
  } else {
    window.open(url)
  }
}
