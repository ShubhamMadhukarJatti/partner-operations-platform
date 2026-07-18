export type ResourceDraft = {
  id: string
  resourceId?: string
  title: string
  type: string
  source: string
  url: string
}

export type CertificationDraft = {
  id: string
  title: string
  logoUrl?: string
  verificationUrl: string
  status: 'verified' | 'pending' | 'rejected'
}

export type CertificationComposerDraft = {
  title: string
  logoUrl?: string
  verificationUrl: string
}

export type CertificationOption = {
  id: string
  title: string
  logoUrl?: string
}

export type PartnerProgramDraft = {
  referralProgram: boolean
  programName: string
  programUrl: string
  benefits: [string, string, string]
}

export const RESOURCE_TYPE_OPTIONS = [
  'Video',
  'Deck',
  'Case Study',
  'Demo',
  'Website',
  'Document'
]

export const DEFAULT_PROGRAM_BENEFITS: [string, string, string] = [
  'Up to 25% revenue share',
  'Co-marketing opportunities',
  'Dedicated partner success manager'
]

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function createEmptyResource(
  overrides?: Partial<ResourceDraft>
): ResourceDraft {
  return {
    id: createId('resource'),
    resourceId: undefined,
    title: '',
    type: '',
    source: '',
    url: '',
    ...overrides
  }
}

export function createCertificationDraft(
  title: string,
  status: 'verified' | 'pending' | 'rejected' = 'pending',
  verificationUrl = '',
  overrides?: Partial<CertificationDraft>
): CertificationDraft {
  return {
    id: createId('certification'),
    title,
    verificationUrl,
    status,
    ...overrides
  }
}

export function createCertificationComposerDraft(): CertificationComposerDraft {
  return {
    title: '',
    logoUrl: '',
    verificationUrl: ''
  }
}

export function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function extractCertificationContent(response: any): any[] {
  if (Array.isArray(response?.data?.certifications))
    return response.data.certifications
  if (Array.isArray(response?.data?.content)) return response.data.content
  if (Array.isArray(response?.content)) return response.content
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response)) return response
  if (response?.data && typeof response.data === 'object')
    return [response.data]
  if (response && typeof response === 'object') return [response]
  return []
}

export function mapOrganizationCertificationStatus(
  value: unknown
): CertificationDraft['status'] {
  const normalized =
    typeof value === 'string' ? value.trim().toUpperCase() : 'PENDING'

  if (normalized === 'VERIFIED') return 'verified'
  if (normalized === 'REJECTED') return 'rejected'
  return 'pending'
}

export function mapOrganizationCertificationRecords(response: unknown) {
  return extractCertificationContent(response)
    .map((item: any) =>
      createCertificationDraft(
        typeof item?.certificationName === 'string'
          ? item.certificationName.trim()
          : '',
        mapOrganizationCertificationStatus(item?.status),
        typeof item?.verificationUrl === 'string'
          ? item.verificationUrl.trim()
          : '',
        {
          id:
            item?.id === null || item?.id === undefined
              ? createId('certification')
              : String(item.id),
          logoUrl:
            typeof item?.logoUrl === 'string' && item.logoUrl.trim()
              ? item.logoUrl.trim()
              : undefined
        }
      )
    )
    .filter((item) => item.title)
}

export function mapAdminCertificationOptions(
  response: unknown
): CertificationOption[] {
  return extractCertificationContent(response)
    .map((item: any) => ({
      id:
        item?.id === null || item?.id === undefined
          ? createId('cert-option')
          : String(item.id),
      title:
        typeof item?.certificationName === 'string'
          ? item.certificationName.trim()
          : '',
      logoUrl:
        typeof item?.logoUrl === 'string' && item.logoUrl.trim()
          ? item.logoUrl.trim()
          : undefined
    }))
    .filter((item) => item.title)
}

export function normalizeResourceType(value?: string | null) {
  const normalized = (value || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')

  switch (normalized) {
    case 'video':
      return 'Video'
    case 'deck':
    case 'presentation':
      return 'Deck'
    case 'case study':
    case 'casestudy':
      return 'Case Study'
    case 'demo':
      return 'Demo'
    case 'website':
      return 'Website'
    case 'document':
    case 'doc':
    case 'pdf':
    case 'whitepaper':
      return 'Document'
    default:
      return value?.trim() || ''
  }
}

export function mapResourceRecordsToDrafts(resources: any[]) {
  const drafts = resources.map((item) =>
    createEmptyResource({
      resourceId:
        item.id === null || item.id === undefined ? undefined : String(item.id),
      title: item.title || '',
      type: normalizeResourceType(item.type),
      source: item.source || '',
      url: item.url || ''
    })
  )

  return drafts.length > 0 ? drafts : [createEmptyResource()]
}

export function isResourceDraftEmpty(resource: ResourceDraft) {
  return ![resource.title, resource.type, resource.source, resource.url].some(
    (value) => value.trim()
  )
}

export function deriveProgramBenefits(
  value?: string | string[] | null
): [string, string, string] {
  if (!value) return DEFAULT_PROGRAM_BENEFITS

  if (Array.isArray(value)) {
    const tokens = value.map((item) => item.trim()).filter(Boolean)

    return [
      tokens[0] || DEFAULT_PROGRAM_BENEFITS[0],
      tokens[1] || DEFAULT_PROGRAM_BENEFITS[1],
      tokens[2] || DEFAULT_PROGRAM_BENEFITS[2]
    ]
  }

  const tokens = value
    .split(/\n|,|\||;/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (tokens.length < 2) return DEFAULT_PROGRAM_BENEFITS

  return [
    tokens[0] || DEFAULT_PROGRAM_BENEFITS[0],
    tokens[1] || DEFAULT_PROGRAM_BENEFITS[1],
    tokens[2] || DEFAULT_PROGRAM_BENEFITS[2]
  ]
}

export function buildPartnerProgramDraft(
  value: any,
  companyName?: string
): PartnerProgramDraft {
  return {
    referralProgram: Boolean(value?.isActive),
    programName:
      (typeof value?.programName === 'string' && value.programName.trim()) ||
      `${companyName || 'Your company'} Partner Program`,
    programUrl:
      typeof value?.programUrl === 'string' ? value.programUrl.trim() : '',
    benefits: deriveProgramBenefits(value?.benefits)
  }
}
