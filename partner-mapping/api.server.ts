'use server'

import { fetcher, getServerUser, getValidToken } from '@/lib/server'

import type {
  JointPitchData,
  JointPitchGetApiResponse,
  SaveJointPitchPayload,
  SaveJointPitchResult
} from './joint-pitch.types'
import type {
  SharedAccount,
  SharedAccountsApiResponse,
  SharedAccountsData,
  SharedAccountsParams
} from './shared-accounts-list.types'
import type {
  AccountMappingUploadResponse,
  CoSellHealthPayload,
  CoSellHealthResponse,
  CreateSharedAssetResult,
  DealOwnerDetails,
  GenerateIntroPayload,
  GenerateIntroResponse,
  GenerateIntroResult,
  IntroTrackerResponse,
  SendNotificationPayload,
  SendNotificationResult,
  SharedAsset,
  SharedAssetMutationApiResponse,
  SharedAssetsApiResponse
} from './shared-assets.types'

function isNextRedirectError(e: unknown): boolean {
  return (
    typeof e === 'object' &&
    e !== null &&
    'digest' in e &&
    String((e as { digest?: unknown }).digest).includes('NEXT_REDIRECT')
  )
}

function toStr(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return ''
}

function mapSharedAccountRow(row: unknown, fallbackKey: string): SharedAccount {
  if (!row || typeof row !== 'object') {
    return {
      accountId: fallbackKey,
      name: '',
      domain: '',
      overlapType: 'LOW_PRIORITY',
      opportunityScore: 0,
      yourStage: 'DISCOVERY',
      partnerStage: 'DISCOVERY',
      estimatedACV: 0,
      recommendedAction: 'MONITOR'
    }
  }

  const o = row as Record<string, unknown>
  const accountId =
    toStr(
      o.accountId ??
        o.id ??
        o.sharedAccountId ??
        o.account_id ??
        o.organizationId
    ) || fallbackKey

  let domain = toStr(
    o.domain ?? o.website ?? o.companyDomain ?? o.company_domain
  )
  domain = domain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '')

  const opportunityScore =
    Number(o.opportunityScore ?? o.score ?? o.opportunity_score ?? 0) || 0
  const estimatedACV =
    Number(o.estimatedACV ?? o.estimatedAcv ?? o.acv ?? o.estimated_acv ?? 0) ||
    0

  return {
    accountId,
    name: toStr(
      o.name ??
        o.companyName ??
        o.accountName ??
        o.company_name ??
        o.account_name
    ),
    domain,
    overlapType:
      toStr(o.overlapType ?? o.overlap_type ?? 'LOW_PRIORITY') ||
      'LOW_PRIORITY',
    opportunityScore,
    yourStage: toStr(o.yourStage ?? o.your_stage ?? 'DISCOVERY') || 'DISCOVERY',
    partnerStage:
      toStr(o.partnerStage ?? o.partner_stage ?? 'DISCOVERY') || 'DISCOVERY',
    estimatedACV,
    recommendedAction: toStr(
      o.recommendedAction ?? o.recommended_action ?? o.action ?? 'MONITOR'
    ) as SharedAccount['recommendedAction'],
    targetPartnerDealId: toStr(
      o.targetPartnerDealId ??
        o.target_partner_deal_id ??
        o.targetPartnerDeal ??
        o.target_partner_deal ??
        o.targetDealId ??
        o.target_deal_id ??
        o.hubspotDealId ??
        o.salesforceDealId ??
        o.zohoDealId ??
        o.pipedriveDealId ??
        o.dealId
    ),
    currentPartnerDealId: toStr(
      o.currentPartnerDealId ??
        o.current_partner_deal_id ??
        o.currentPartnerDeal ??
        o.current_partner_deal ??
        o.currentDealId ??
        o.current_deal_id ??
        o.hubspotDealId ??
        o.salesforceDealId ??
        o.zohoDealId ??
        o.pipedriveDealId ??
        o.dealId
    )
  }
}

/** Accepts Spring page JSON, HAL `_embedded`, or slightly different field names */
function normalizeSharedAccountsResponse(
  raw: unknown
): SharedAccountsApiResponse {
  const empty: SharedAccountsData = {
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  }

  if (!raw || typeof raw !== 'object') {
    return {
      success: false,
      message: 'Invalid shared accounts response',
      data: empty
    }
  }

  const r = raw as Record<string, unknown>
  const success = r.success !== false
  const message = toStr(r.message)

  let container: Record<string, unknown> | null = null
  if (r.data && typeof r.data === 'object') {
    container = r.data as Record<string, unknown>
  } else if (Array.isArray(r.content)) {
    container = r as Record<string, unknown>
  }

  if (!container) {
    return { success, message, data: empty }
  }

  let rows: unknown[] = []
  if (Array.isArray(container.content)) {
    rows = container.content
  } else if (container._embedded && typeof container._embedded === 'object') {
    const emb = container._embedded as Record<string, unknown>
    const embeddedList = Object.values(emb).find((v) => Array.isArray(v))
    if (Array.isArray(embeddedList)) rows = embeddedList
  }

  const content = rows.map((row, i) =>
    mapSharedAccountRow(row, `shared-account-${i}`)
  )

  const page = Number(container.page ?? container.number ?? 0) || 0
  const size = Number(container.size ?? 10) || 10
  const totalElements =
    Number(
      container.totalElements ?? container.total_elements ?? content.length
    ) || content.length
  const totalPages =
    Number(container.totalPages ?? container.total_pages ?? 1) || 1
  const last = container.last !== undefined ? Boolean(container.last) : true

  return {
    success,
    message,
    data: { content, page, size, totalElements, totalPages, last }
  }
}

export async function fetchSharedAccounts(
  params: SharedAccountsParams
): Promise<SharedAccountsApiResponse> {
  const token = await getValidToken()

  if (!token) throw new Error('Unauthorized')

  const searchParams = new URLSearchParams({
    page: String(params.page ?? 1),
    size: String(params.size ?? 10),
    sort: params.sort ?? 'score',
    filter: params.filter ?? 'all'
  })

  const res = await fetch(
    `${process.env.SHARKDOM_API_URL}/api/account-mapping/shared-accounts/${params.partnerOrgId}?${searchParams}`,
    {
      headers: {
        accept: 'application/hal+json',
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!res.ok) throw new Error(`Failed to fetch shared accounts: ${res.status}`)

  const raw: unknown = await res.json()
  return normalizeSharedAccountsResponse(raw)
}

/**
 * GET shared files/docs for a partner org (co-sell workspace Assets tab).
 */
export async function fetchSharedAssets(
  partnerOrgId: number,
  dealId?: string | null
): Promise<SharedAsset[]> {
  if (!dealId) return []
  const token = await getValidToken()
  if (!token) throw new Error('Unauthorized')

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL || ''}/api/account-mapping/shared-assets/${partnerOrgId}/deal/${encodeURIComponent(dealId)}`,
      {
        headers: {
          accept: 'application/hal+json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      console.warn(`Failed to fetch shared assets: ${res.status}`)
      return []
    }

    const json = await res.json()
    if (json && json.success && Array.isArray(json.data)) {
      return json.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        fileUrl: item.fileUrl,
        sharedBy: item.sharedBy || 'Anonymous',
        dealId: item.dealId
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching shared assets:', error)
    return []
  }
}

/**
 * Fetch detailed owner and pipeline information for a specific deal.
 */
export async function fetchDealOwnerDetails(
  organizationId: number,
  dealId: string
): Promise<DealOwnerDetails | null> {
  const token = await getValidToken()
  if (!token) throw new Error('Unauthorized')

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL || ''}/api/account-mapping/deal-owner-details/deal/${encodeURIComponent(dealId)}?organizationId=${organizationId}`,
      {
        headers: {
          accept: 'application/hal+json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (res.ok) {
      const data = (await res.json()) as DealOwnerDetails
      return data
    }
    return null
  } catch (err) {
    console.error('[fetchDealOwnerDetails] Failed to fetch:', err)
    return null
  }
}

export async function generateIntro(
  payload: GenerateIntroPayload
): Promise<GenerateIntroResult> {
  const token = await getValidToken()
  if (!token) throw new Error('Unauthorized')

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL || ''}/api/account-mapping/generate-intro`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    )

    if (res.ok) {
      const result = (await res.json()) as GenerateIntroResponse
      return { ok: true, data: result.data }
    }

    const errData = await res.json().catch(() => ({}))
    return { ok: false, message: errData.message || 'Failed to generate intro' }
  } catch (err) {
    console.error('[generateIntro] Error:', err)
    return { ok: false, message: 'Internal error' }
  }
}
function usernameFromServerUser(user: unknown): string {
  if (!user || typeof user !== 'object') return 'User'
  const u = user as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  if (str(u.username)) return str(u.username)
  if (str(u.displayName)) return str(u.displayName)
  if (str(u.name)) return str(u.name)
  const email = str(u.email)
  if (email && email.includes('@')) return email.split('@')[0] || 'User'
  return 'User'
}

/**
 * Upload file to S3 via account-mapping upload, then persist shared asset row.
 */
export async function uploadSharedAssetFile(
  formData: FormData
): Promise<CreateSharedAssetResult> {
  try {
    const rawFile = formData.get('file')
    if (!(rawFile instanceof File) || rawFile.size === 0) {
      return { ok: false, message: 'Please choose a valid file.' }
    }

    const partnerRaw = formData.get('partnerOrgId')
    const partnerOrgId = Number(
      typeof partnerRaw === 'string' ? partnerRaw : String(partnerRaw ?? '')
    )
    if (!Number.isFinite(partnerOrgId) || partnerOrgId <= 0) {
      return { ok: false, message: 'Invalid partner organization.' }
    }

    const titleRaw = formData.get('title')
    const titleFromForm = typeof titleRaw === 'string' ? titleRaw.trim() : ''
    if (!titleFromForm) {
      return { ok: false, message: 'Display name is required.' }
    }
    const dealIdRaw = formData.get('dealId')
    const dealId = typeof dealIdRaw === 'string' ? dealIdRaw.trim() : ''
    // dealId might be optional depending on UI context, but here we expect it for scoping.

    const { user } = await getServerUser()
    const username = usernameFromServerUser(user)

    const upstream = new FormData()
    upstream.append('file', rawFile, rawFile.name)

    const uploadJson = await fetcher<AccountMappingUploadResponse>(
      `/api/account-mapping/upload?folder=${encodeURIComponent('shared-assets')}`,
      {
        method: 'POST',
        data: upstream,
        timeout: 120000
      }
    )

    const fileUrl =
      typeof uploadJson?.data?.fileUrl === 'string'
        ? uploadJson.data.fileUrl.trim()
        : ''
    if (!fileUrl) {
      return { ok: false, message: 'Upload did not return a file URL.' }
    }

    const createJson = await fetcher<SharedAssetMutationApiResponse>(
      `/api/account-mapping/shared-assets`,
      {
        method: 'POST',
        data: {
          partnerOrgId,
          title: titleFromForm,
          fileUrl,
          username,
          dealId
        }
      }
    )

    const created = (createJson?.data ?? {}) as any
    const finalFileUrl = String(
      created.fileUrl || created.url || created.s3Url || fileUrl || ''
    ).trim()

    const asset: SharedAsset = {
      id: Number(created.id),
      title: String(created.title ?? titleFromForm),
      fileUrl: finalFileUrl,
      sharedBy: String(created.sharedBy ?? username),
      dealId: String(created.dealId ?? dealId)
    }

    return { ok: true, asset }
  } catch (err: unknown) {
    if (isNextRedirectError(err)) throw err
    const message =
      err instanceof Error && err.message.trim()
        ? err.message
        : 'Failed to share asset.'
    console.error('[uploadSharedAssetFile]', message, err)
    return { ok: false, message }
  }
}

function normalizeJointPitchFromApiData(
  data: JointPitchData | null | undefined
) {
  if (!data) return null
  const pitch = typeof data.pitch === 'string' ? data.pitch.trim() : ''
  if (!pitch) return null
  return {
    ...data,
    pitch,
    lastEditedBy: data.lastEditedBy ?? null,
    lastEditedAt: data.lastEditedAt ?? null
  } satisfies JointPitchData
}

export async function testZohoWebhook(payload: any) {
  try {
    const token = await getValidToken()
    const baseUrl = (
      process.env.SHARKDOM_API_URL ||
      process.env.NEXT_PUBLIC_SHARKDOM_API_URL ||
      ''
    ).replace(/\/$/, '')
    const url = `${baseUrl}/api/zoho/crm/publish`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      return {
        ok: false,
        message: errorText || 'Failed to trigger webhook test.'
      }
    }

    const data = await res.json().catch(() => ({}))
    return { ok: true, data }
  } catch (err: unknown) {
    if (isNextRedirectError(err)) throw err
    const message =
      err instanceof Error && err.message.trim()
        ? err.message
        : 'Failed to test Zoho webhook.'
    console.error('[testZohoWebhook]', message, err)
    return { ok: false, message }
  }
}

/**
 * GET Zoho webhook payload validation status
 */
export async function getZohoWebhookValidation(orgId: number) {
  try {
    const token = await getValidToken()
    const baseUrl = (
      process.env.SHARKDOM_API_URL ||
      process.env.NEXT_PUBLIC_SHARKDOM_API_URL ||
      ''
    ).replace(/\/$/, '')
    const url = `${baseUrl}/api/webhooks/zoho/payload/validation/${orgId}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      return {
        ok: false,
        message: errorText || 'Failed to fetch webhook validation.'
      }
    }

    const data = await res.json().catch(() => ({}))
    return { ok: true, data }
  } catch (err: unknown) {
    if (isNextRedirectError(err)) throw err
    const message =
      err instanceof Error && err.message.trim()
        ? err.message
        : 'Failed to fetch webhook validation.'
    console.error('[getZohoWebhookValidation]', message, err)
    return { ok: false, message }
  }
}

/**
 * GET joint pitch for a partner org. Returns null when no pitch exists yet (HTTP 404
 * or empty pitch). Does not throw on 404.
 */
export async function fetchJointPitch(
  partnerOrgId: string | number,
  dealId?: string | null
): Promise<JointPitchData | null> {
  const token = await getValidToken()

  if (!token) throw new Error('Unauthorized')

  const id =
    typeof partnerOrgId === 'string'
      ? partnerOrgId.trim()
      : String(partnerOrgId)
  if (!id) throw new Error('Invalid partner organization id')

  const apiUrl = (
    process.env.SHARKDOM_API_URL ||
    process.env.NEXT_PUBLIC_SHARKDOM_API_URL ||
    ''
  ).replace(/\/$/, '')
  if (!apiUrl) throw new Error('API URL not configured')

  const dId = String(dealId ?? '').trim()
  const hasValidDeal = dId && dId !== 'null' && dId !== 'undefined'

  const finalPath = hasValidDeal
    ? `${apiUrl}/api/account-mapping/joint-pitch/${encodeURIComponent(id)}/deal/${encodeURIComponent(dId)}`
    : `${apiUrl}/api/account-mapping/joint-pitch/${encodeURIComponent(id)}`

  const res = await fetch(finalPath, {
    headers: {
      accept: 'application/hal+json',
      Authorization: `Bearer ${token}`,
      'x-middleware-bypass': '1'
    }
  })

  if (res.status >= 500 || res.status === 404) {
    // If backend crashes or doesn't find it, just return null so the UI can show "Create"
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch joint pitch: ${res.status}`)
  }

  const json = (await res.json()) as JointPitchGetApiResponse
  return normalizeJointPitchFromApiData(json?.data)
}

export async function saveJointPitch(
  payload: SaveJointPitchPayload
): Promise<SaveJointPitchResult> {
  const dId = String(payload.dealId ?? '').trim()
  const cleanDealId =
    dId && dId !== 'null' && dId !== 'undefined' ? dId : undefined

  const body = {
    partnerOrgId: payload.partnerOrgId,
    pitch: payload.pitch,
    dealId: cleanDealId
  }

  if (process.env.NODE_ENV === 'development') {
    console.info('[saveJointPitch] POST body', JSON.stringify(body))
  }

  try {
    /** Same stack as agreed-next-steps: token refresh, x-middleware-bypass, API error bodies. */
    const data = await fetcher<JointPitchGetApiResponse>(
      `/api/account-mapping/joint-pitch`,
      {
        method: 'POST',
        data: body
      }
    )
    return { ok: true, data }
  } catch (err: unknown) {
    if (isNextRedirectError(err)) throw err

    const message =
      err instanceof Error && err.message.trim()
        ? err.message
        : 'Failed to save joint pitch'

    console.error('[saveJointPitch] failed', {
      payload: body,
      message,
      err
    })

    return { ok: false, message }
  }
}

export async function sendCoSellNotification(
  payload: SendNotificationPayload
): Promise<SendNotificationResult> {
  try {
    const data = await fetcher<SendNotificationResult>(
      `/api/account-mapping/notifications/send`,
      {
        method: 'POST',
        data: payload
      }
    )
    return data
  } catch (err: unknown) {
    if (isNextRedirectError(err)) throw err

    const message =
      err instanceof Error && err.message.trim()
        ? err.message
        : 'Failed to send notification email'

    console.error('[sendCoSellNotification] failed', {
      payload,
      message,
      err
    })

    return { success: false, message }
  }
}

export async function calculateCoSellHealth(
  payload: CoSellHealthPayload
): Promise<CoSellHealthResponse> {
  return fetcher<CoSellHealthResponse>('/api/account-mapping/calculate', {
    method: 'POST',
    data: payload
  })
}

export interface SharedContact {
  id: number
  name: string
  title: string
  source: 'YOUR_CRM' | 'PARTNER_CRM'
  relationship: string
  inCrm: boolean
  dealId: string
}

export async function fetchSharedContacts(
  partnerOrgId: number,
  dealId: string
): Promise<SharedContact[]> {
  const token = await getValidToken()
  if (!token) throw new Error('Unauthorized')

  const baseUrl =
    process.env.SHARKDOM_API_URL ||
    process.env.NEXT_PUBLIC_SHARKDOM_API_URL ||
    ''

  try {
    const res = await fetch(
      `${baseUrl}/api/account-mapping/shared-contacts/${partnerOrgId}/deal/${encodeURIComponent(dealId)}`,
      {
        headers: {
          accept: 'application/hal+json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      console.warn(`Failed to fetch shared contacts: ${res.status}`)
      return []
    }

    const json = await res.json()
    if (json && json.success && Array.isArray(json.data)) {
      return json.data
    }
    return []
  } catch (err) {
    console.error('[fetchSharedContacts] error:', err)
    return []
  }
}

export interface CreateSharedContactPayload {
  partnerOrgId: number
  name: string
  title: string
  source: 'YOUR_CRM' | 'PARTNER_CRM'
  relationship: string
  inCrm: boolean
  dealId: string
}

export async function createSharedContact(
  payload: CreateSharedContactPayload
): Promise<SharedContact | null> {
  const token = await getValidToken()
  if (!token) throw new Error('Unauthorized')

  const baseUrl =
    process.env.SHARKDOM_API_URL ||
    process.env.NEXT_PUBLIC_SHARKDOM_API_URL ||
    ''

  try {
    const res = await fetch(`${baseUrl}/api/account-mapping/shared-contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/hal+json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      console.warn(`Failed to create shared contact: ${res.status}`)
      return null
    }

    const json = await res.json()
    if (json && json.success && json.data) {
      return json.data as SharedContact
    }
    return null
  } catch (err) {
    console.error('[createSharedContact] error:', err)
    return null
  }
}

export async function fetchIntroTracker(
  partnerId: number,
  dealId: string
): Promise<IntroTrackerResponse | null> {
  const token = await getValidToken()
  if (!token) throw new Error('Unauthorized')

  const baseUrl =
    process.env.SHARKDOM_API_URL ||
    process.env.NEXT_PUBLIC_SHARKDOM_API_URL ||
    ''

  try {
    const res = await fetch(
      `${baseUrl}/api/account-mapping/request/intro/tracker/${partnerId}/deal/${encodeURIComponent(dealId)}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/hal+json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      console.warn(`Failed to fetch intro tracker: ${res.status}`)
      return null
    }

    const data = await res.json()
    return data as IntroTrackerResponse
  } catch (err) {
    console.error('[fetchIntroTracker] error:', err)
    return null
  }
}
