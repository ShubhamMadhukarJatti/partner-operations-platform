/**
 * Maps the unified partner application form to legacy API bodies.
 * Tier CHAMPION → company partner applications API.
 * Tier REFERRAL → consultant partner applications API.
 */

export const LEGACY_APPLICATION_ID = 9007199254740991

export const LINKEDIN_URL_REGEX =
  /^https?:\/\/([a-zA-Z0-9-]+\.)?linkedin\.com\/.+/i

export type PartnershipTier = 'CHAMPION' | 'REFERRAL'

export type PartnerApplicationFormValues = {
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
}

function buildProseBlock(v: PartnerApplicationFormValues): string {
  const lines: string[] = []
  if (v.geography.trim()) lines.push(`Geography: ${v.geography.trim()}`)
  if (v.companiesAdvise.trim())
    lines.push(`Companies you advise: ${v.companiesAdvise.trim()}`)
  if (v.gtmFocus.length)
    lines.push(`Primary GTM focus: ${v.gtmFocus.join(', ')}`)
  if (v.hearAbout.trim())
    lines.push(`How they heard about the program: ${v.hearAbout.trim()}`)
  if (v.networkNotes.trim())
    lines.push(`About their network: ${v.networkNotes.trim()}`)
  return lines.join('\n')
}

/** Heuristic: map free-text geography to consultant API enum. */
export function mapCountry(
  geography: string
): 'INDIA' | 'UNITED_STATES' | 'UNITED_KINGDOM' | 'OTHER' {
  const g = geography.toLowerCase()
  if (
    g.includes('india') ||
    g === 'in' ||
    g.includes('bangalore') ||
    g.includes('mumbai')
  )
    return 'INDIA'
  if (
    g.includes('united states') ||
    g.includes('usa') ||
    g.includes('u.s.') ||
    /\bus\b/.test(g)
  )
    return 'UNITED_STATES'
  if (
    g.includes('united kingdom') ||
    g.includes('uk') ||
    g.includes('england') ||
    g.includes('london')
  )
    return 'UNITED_KINGDOM'
  return 'OTHER'
}

/** Heuristic: map “how did you hear” to consultant leadSource enum. */
export function mapLeadSource(
  hearAbout: string
): 'REFERRAL' | 'LINKEDIN' | 'CONFERENCE' | 'OTHER' {
  const h = hearAbout.toLowerCase()
  if (h.includes('linkedin')) return 'LINKEDIN'
  if (h.includes('conference') || h.includes('event')) return 'CONFERENCE'
  if (h.includes('referral') || h.includes('friend') || h.includes('colleague'))
    return 'REFERRAL'
  return 'OTHER'
}

/**
 * Company name: optional field; backend requires non-empty.
 * @see product review if “Independent” is preferred over name suffix.
 */
function companyNameFromForm(v: PartnerApplicationFormValues): string {
  const c = v.companyPractice.trim()
  if (c) return c
  return `${v.fullName.trim()} — Partner application`
}

function companyWebsiteFromForm(v: PartnerApplicationFormValues): string {
  const li = v.linkedinProfileUrl.trim()
  if (li.startsWith('http://') || li.startsWith('https://')) return li
  return `https://${li.replace(/^\/+/, '')}`
}

export function buildCompanyPayload(v: PartnerApplicationFormValues) {
  const prose = buildProseBlock(v)
  return {
    id: LEGACY_APPLICATION_ID,
    companyName: companyNameFromForm(v),
    companyWebsite: companyWebsiteFromForm(v),
    primaryContactName: v.fullName.trim(),
    contactEmail: v.email.trim(),
    companySize: 'SIZE_1_50' as const,
    partnerType: 'TECHNOLOGY_PARTNER' as const,
    icpFitExplanation: prose || 'Partner program application (unified form).',
    maturity: 'EARLY_STAGE' as const,
    hasExistingRelationship: true,
    informationConfirmed: true,
    agreedToTerms: true,
    status: 'PENDING' as const,
    reviewComments: ''
  }
}

export function buildConsultantPayload(v: PartnerApplicationFormValues) {
  const prose = buildProseBlock(v)
  return {
    id: LEGACY_APPLICATION_ID,
    fullName: v.fullName.trim(),
    linkedinProfileUrl: v.linkedinProfileUrl.trim(),
    email: v.email.trim(),
    country: mapCountry(v.geography),
    /** Backend enum (see consultant-partner-applications validation). */
    roleDescription: 'GTM_PARTNERSHIP_CONSULTANT_ADVISOR' as const,
    advisoryCount: 'RANGE_1_5' as const,
    arrRange: 'BELOW_100K' as const,
    typicalClientArrRange: 'BELOW_100K' as const,
    partnerProgramStatus: 'NOT_SURE' as const,
    leadSource: mapLeadSource(v.hearAbout),
    useDweepBot: true,
    acceptCommissionTerms: true,
    agreeToTerms: true,
    /** Backend may ignore; included for ops visibility. Retried without if 400. */
    applicationDetails: prose || undefined
  }
}

export type ConsultantPayload = ReturnType<typeof buildConsultantPayload>

export function buildUnifiedPayload(
  v: PartnerApplicationFormValues,
  userId?: string
) {
  const payload: any = {
    fullName: v.fullName.trim(),
    email: v.email.trim(),
    linkedInProfileUrl: v.linkedinProfileUrl.trim(),
    companyName: v.companyPractice.trim() || v.fullName.trim(),
    geography: v.geography.trim(),
    companiesAdvised: v.companiesAdvise.trim(),
    primaryGtmFocus: v.gtmFocus.map((focus) =>
      focus.toUpperCase().replace(/\s+/g, '_')
    ),
    howDidYouHearAboutProgram: v.hearAbout.trim(),
    partnershipTier:
      v.tier === 'CHAMPION' ? 'CHAMPION_PARTNER' : 'REFERRAL_PARTNER',
    networkDescription: v.networkNotes.trim(),
    referCode: '',
    active: true,
    userId: userId || null
  }

  return payload
}
