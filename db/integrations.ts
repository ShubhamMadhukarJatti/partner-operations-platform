'use server'

import { fetcher } from '../server'
import { getCurrentOrganization } from './organization'

type Params = {
  integrationType: string
  refreshToken: string
}

export const saveIntegrationRefreshToken = async ({
  integrationType,
  refreshToken
}: Params) => {
  const response = await getCurrentOrganization()
  if (!response?.id) {
    throw new Error('org id not found')
  }
  const jsonData = await fetcher<unknown>('/organization/integration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: {
      organizationId: response.id,
      refreshToken,
      integrationType
    }
  })
  return jsonData
}

/**
 * Maps frontend integration id to backend disconnect API enum when they differ.
 * Backend enums: HUBSPOT, ZOHO, G_CALENDAR, G_SHEET, G_MEET, DOCUSIGN, SLACK, STRIPE,
 * RAZORPAY, BANK, TYPEFORM, MAILCHIMP, DISCORD, ZOOM, CALENDLY, PIPEDRIVE, G_FORM,
 * SALESFORCE, CLOSE_APP, TRELLO
 */
const DISCONNECT_INTEGRATION_TYPE_MAP: Record<string, string> = {
  CLOSE: 'CLOSE_APP'
}

export const disconnectIntegration = async (integrationType: string) => {
  try {
    const apiIntegrationType =
      DISCONNECT_INTEGRATION_TYPE_MAP[integrationType] ?? integrationType
    await fetcher<unknown>(`/integration/disconnect/${apiIntegrationType}`, {
      method: 'POST',
      headers: { Accept: 'application/hal+json' }
    })
    return {
      success: true,
      message: 'Integration disconnected successfully!'
    }
  } catch (error: any) {
    const status = error?.response?.status
    const data = error?.response?.data
    return Promise.reject({
      success: false,
      message: data?.message ?? error?.message ?? 'Disconnect failed',
      error: data ?? error
    })
  }
}

export const reconnectIntegration = async ({
  integrationType,
  refreshToken
}: Params) => {
  try {
    const response = await getCurrentOrganization()
    if (!response?.id) {
      throw new Error('org id not found')
    }
    await fetcher<unknown>('/organization/integration', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      data: {
        organizationId: response.id,
        integrationType,
        refreshToken
      }
    })
    return {
      success: true,
      message: 'Integration Connected successfully!'
    }
  } catch (error: any) {
    const data = error?.response?.data
    return Promise.reject({
      success: false,
      message: data?.message ?? error?.message ?? 'Reconnect failed',
      error: data ?? error
    })
  }
}

export const sendDiscordInvite = async ({
  discordLink,
  orgId
}: {
  discordLink: string
  orgId: any
}) => {
  try {
    const queryParams = new URLSearchParams({
      partnerOrganizationId: orgId.toString(),
      discordLink
    })
    await fetcher<unknown>(`/email/discord/invite?${queryParams.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    return {
      success: true,
      message: 'Discord invite sent successfully!'
    }
  } catch (error: any) {
    const data = error?.response?.data
    return Promise.reject({
      success: false,
      message:
        data?.message ?? error?.message ?? 'Failed to send Discord invite',
      error: data ?? error
    })
  }
}
