/** Session + localStorage key for vendor/partner choice during onboarding → sidebar seed. */
export const ONBOARDING_REGISTRATION_MODE_KEY = 'onboarding_registrationMode'

/** Path segment for GET /onboarding/user-view/{id} and related routes: prefer org when present. */
export function getOnboardingViewPathId(
  userId: string,
  orgId?: number | null
): string {
  if (orgId != null && Number.isFinite(Number(orgId))) {
    return String(orgId)
  }
  return userId
}

export function registrationModeToVendorPartner(registrationMode: string): {
  isVendor: boolean
  isPartner: boolean
} {
  if (registrationMode === 'vendor') {
    return { isVendor: true, isPartner: false }
  }
  if (registrationMode === 'partner') {
    return { isVendor: false, isPartner: true }
  }
  return { isVendor: false, isPartner: false }
}
