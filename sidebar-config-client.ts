import {
  ONBOARDING_REGISTRATION_MODE_KEY,
  registrationModeToVendorPartner
} from '@/lib/onboarding-user-view'
import type {
  SidebarConfigApiData,
  SidebarConfigApiResponse
} from '@/lib/sidebar-config-types'

export type SidebarRoleHints = { isPartner: boolean; isVendor: boolean }

/** Manual header "Change View" — wins over user-view hints so GET /role uses the chosen menu. */
export const SIDEBAR_VIEW_OVERRIDE_KEY = 'sharkdom_sidebar_view_override'

export type SidebarViewOverride = 'vendor' | 'partner'

export function setSidebarViewOverride(view: SidebarViewOverride | null): void {
  try {
    if (typeof window === 'undefined') return
    if (view == null) {
      localStorage.removeItem(SIDEBAR_VIEW_OVERRIDE_KEY)
    } else {
      localStorage.setItem(SIDEBAR_VIEW_OVERRIDE_KEY, view)
    }
  } catch {
    // ignore
  }
}

function readSidebarViewOverride(): SidebarRoleHints | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(SIDEBAR_VIEW_OVERRIDE_KEY)
    if (raw === 'vendor') return { isVendor: true, isPartner: false }
    if (raw === 'partner') return { isVendor: false, isPartner: true }
  } catch {
    // ignore
  }
  return null
}

/**
 * Resolves vendor/partner flags from onboarding user-view, then onboarding registration mode storage.
 * Same logic as sidebar bootstrap POST seeding.
 */
export async function resolveSidebarRoleHints(
  userId: string
): Promise<SidebarRoleHints> {
  const manual = readSidebarViewOverride()
  if (manual) return manual

  let isVendor = false
  let isPartner = false
  try {
    const uvRes = await fetch(
      `/api/onboarding/user-view/${encodeURIComponent(userId)}`,
      { method: 'GET', credentials: 'include' }
    )
    const uvJson = await uvRes.json().catch(() => ({}))
    const uvData = uvJson?.data
    isVendor = Boolean(uvData?.isVendor ?? uvData?.isVendorView)
    isPartner = Boolean(uvData?.isPartner ?? uvData?.isPartnerView)
  } catch {
    // ignore
  }
  if (!isVendor && !isPartner) {
    let mode = ''
    try {
      if (typeof window !== 'undefined') {
        mode =
          sessionStorage.getItem(ONBOARDING_REGISTRATION_MODE_KEY) ||
          localStorage.getItem(ONBOARDING_REGISTRATION_MODE_KEY) ||
          ''
      }
    } catch {
      // ignore
    }
    const hint = registrationModeToVendorPartner(mode)
    if (hint.isVendor || hint.isPartner) {
      isVendor = hint.isVendor
      isPartner = hint.isPartner
    }
  }
  // Default nav is vendor until API/config defines otherwise (avoids legacy flash).
  if (!isVendor && !isPartner) {
    return { isVendor: true, isPartner: false }
  }
  return { isPartner, isVendor }
}

export function clearOnboardingRegistrationModeFromStorage(): void {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem(ONBOARDING_REGISTRATION_MODE_KEY)
    sessionStorage.removeItem(ONBOARDING_REGISTRATION_MODE_KEY)
  } catch {
    // ignore
  }
}

export function hasSidebarConfigData(
  res: SidebarConfigApiResponse | null | undefined
): boolean {
  if (res == null) return false
  if (res.success === false) return false
  return res.data != null && typeof res.data === 'object'
}

export async function postSidebarConfig(
  body: SidebarConfigApiData
): Promise<SidebarConfigApiResponse | null> {
  const res = await fetch('/api/sidebar-config', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) return null
  return res.json()
}

/** Loads config via GET /api/sidebar-config/role/{userId}?isPartner&isVendor (backend contract). */
export async function fetchSidebarConfigWithRoleHints(
  userId: string
): Promise<SidebarConfigApiResponse | null> {
  const hints = await resolveSidebarRoleHints(userId)
  return fetchSidebarConfigByRole(userId, hints.isPartner, hints.isVendor)
}

export async function fetchSidebarConfigByRole(
  userId: string,
  isPartner: boolean,
  isVendor: boolean
): Promise<SidebarConfigApiResponse | null> {
  const params = new URLSearchParams({
    isPartner: String(isPartner),
    isVendor: String(isVendor)
  })
  const res = await fetch(
    `/api/sidebar-config/role/${encodeURIComponent(userId)}?${params}`,
    { credentials: 'include' }
  )
  if (!res.ok) return null
  return res.json()
}
