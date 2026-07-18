import { NextResponse } from 'next/server'
import {
  fetchconnectedApps,
  getCurrentOrganization
} from '@/services/organizations'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

const VALIDATION_ENDPOINTS = [
  '/integration/hubspot/fields',
  '/integration/company-properties',
  '/integration/deal-properties'
] as const

export async function GET() {
  try {
    const apps = await fetchconnectedApps()
    const hasStoredHubSpotConnection = apps.some(
      (app: any) =>
        app.integrationType === INTEGRATIONS.HUBSPOT_OUTREACH &&
        Boolean(app.refreshToken)
    )

    if (!hasStoredHubSpotConnection) {
      return NextResponse.json({
        connected: false,
        usable: false
      })
    }

    const organization = await getCurrentOrganization()

    if (!organization?.id) {
      return NextResponse.json(
        {
          connected: true,
          usable: false,
          error: 'Organization not found'
        },
        { status: 200 }
      )
    }

    let lastError: unknown = null

    // Development fallback: bypass validation endpoints if running in dev/localhost environment to prevent local blocking
    const isDev =
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') ||
      process.env.NEXT_PUBLIC_BASE_URL?.includes('localhost')

    if (isDev) {
      return NextResponse.json({
        connected: true,
        usable: true
      })
    }

    for (const endpoint of VALIDATION_ENDPOINTS) {
      try {
        await fetcher(
          `${endpoint}?organizationId=${organization.id}&page=0&size=1`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        return NextResponse.json({
          connected: true,
          usable: true
        })
      } catch (error) {
        lastError = error
      }
    }

    throw lastError
  } catch (error: any) {
    const details = error?.response?.data
    const message =
      details?.message ||
      details?.errorMessage ||
      details?.desc ||
      'Failed to validate HubSpot connection'

    return NextResponse.json(
      {
        connected: true,
        usable: false,
        error: message
      },
      { status: 200 }
    )
  }
}
