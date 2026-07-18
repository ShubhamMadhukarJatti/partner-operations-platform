import type { PartnershipTier } from './build-payload'

export const GTM_FOCUS_OPTIONS = [
  'Partnerships',
  'Channel Sales',
  'RevOps',
  'Product GTM',
  'Alliances',
  'Other'
] as const

export const DRAFT_STORAGE_KEY = 'sharkdom-partner-application-draft-v1'

/** Set only after successful API submit; thank-you page requires this (same tab / sessionStorage). */
export const SUBMIT_SUCCESS_SESSION_KEY =
  'sharkdom-partner-application-submitted-ok-v1'

export const SUBMIT_SUCCESS_SESSION_VALUE = '1'

/** Applicant email after successful submit; used on `/set-password` welcome line. */
export const PARTNER_APPLY_EMAIL_SESSION_KEY =
  'sharkdom-partner-application-email-v1'

export type PartnerApplicationDraft = {
  fullName: string
  email: string
  linkedinProfileUrl: string
  companyPractice: string
  geography: string
  companiesAdvise: string
  gtmFocus: string[]
  hearAbout: string
  tier: PartnershipTier
  networkNotes: string
  savedAt: string
}

export function normalizeTierParam(
  raw: string | null | undefined
): PartnershipTier | null {
  if (!raw) return null
  const t = raw.toLowerCase()
  if (t === 'champion' || t === 'tier1' || t === 'tier-1') return 'CHAMPION'
  if (t === 'referral' || t === 'tier2' || t === 'tier-2') return 'REFERRAL'
  return null
}
