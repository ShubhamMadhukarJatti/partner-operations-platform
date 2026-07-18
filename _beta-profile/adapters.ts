import { OrganizationType } from '@/types'

import type {
  BetaCertification,
  BetaNavItem,
  BetaResourceItem,
  ExploreBetaTab,
  OrganizationResourceRecord,
  PartnerProfileHeroViewModel,
  PartnerProfileRailViewModel,
  PartnerProgramSummaryViewModel,
  PricingCatalogueViewModel,
  ProfileBetaSection,
  ProfileBetaSectionState,
  ProfileCompletionStatusViewModel,
  PublicOrganization
} from './types'

export const exploreBetaTabs: BetaNavItem<ExploreBetaTab>[] = [
  {
    value: 'overview',
    label: 'Overview',
    description: 'Story, fit, partner signals, and company context.'
  },
  {
    value: 'resources',
    label: 'Resources',
    description: 'Public links, assets, and reference material.'
  },
  {
    value: 'pricing',
    label: 'Pricing',
    description: 'Pricing and tier visibility when catalogue data exists.'
  }
]

export const profileBetaSections: ProfileBetaSectionState[] = [
  {
    key: 'basic-info',
    title: 'Basic info',
    description: 'Core company profile, positioning, and contact details.',
    writable: true
  },
  // {
  //   key: 'services',
  //   title: 'Services',
  //   description: 'What you offer and how partners should understand it.',
  //   writable: true
  // },
  {
    key: 'certifications',
    title: 'Certifications',
    description: 'Manage certifications and submit verification links.',
    writable: true
  },
  {
    key: 'resources',
    title: 'Resources',
    description: 'Manage the links and assets shown to potential partners.',
    writable: true
  },
  {
    key: 'partner-program',
    title: 'Partner program',
    description: 'Use backed fields only and disable unsupported controls.',
    writable: true
  }
  // {
  //   key: 'pricing',
  //   title: 'Pricing',
  //   description: 'Reuse the existing pricing and partner tier catalogue flows.',
  //   writable: true
  // }
]

export const getExploreBetaTab = (value?: string | null): ExploreBetaTab => {
  return exploreBetaTabs.some((item) => item.value === value)
    ? (value as ExploreBetaTab)
    : 'overview'
}

export const getProfileBetaSection = (
  value?: string | null
): ProfileBetaSection => {
  return profileBetaSections.some((item) => item.key === value)
    ? (value as ProfileBetaSection)
    : 'basic-info'
}

export const buildPartnerProfileHeroViewModel = ({
  org,
  currentOrg,
  collaborationStatus,
  personaMatch
}: {
  org: PublicOrganization | null | undefined
  currentOrg: OrganizationType | null | undefined
  collaborationStatus?: string | null
  personaMatch?: any
}): PartnerProfileHeroViewModel => {
  const matchValue =
    typeof personaMatch?.personaMatch === 'number'
      ? `${Math.round(personaMatch.personaMatch)}% audience fit`
      : currentOrg?.id
        ? 'Audience fit pending'
        : 'Sign in to compare'

  const tags = [
    org?.sector,
    org?.companyType,
    org?.targetMarket,
    ...(Array.isArray(org?.preferredPartnershipTypes)
      ? org.preferredPartnershipTypes
          .slice(0, 2)
          .map((item: any) => item?.area)
          .filter(Boolean)
      : [])
  ].filter(Boolean) as string[]

  return {
    name: org?.name || 'Organization profile',
    description:
      org?.briefDescription ||
      org?.about ||
      'This organization has not added a public summary yet.',
    location: formatLocation(org),
    hqLocation: org?.address || 'HQ location not provided',
    logoUrl:
      org?.logoUrl ||
      'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png',
    bannerUrl:
      typeof org?.coverImageUrl === 'string' && org.coverImageUrl.trim()
        ? org.coverImageUrl.trim()
        : undefined,
    website: getSafeUrl(org?.website),
    tags,
    matchLabel: matchValue,
    collaborationLabel: collaborationStatus || 'No active collaboration',
    partnerProgramLabel: org?.referralProgram
      ? 'Partner program available'
      : 'No public partner program summary',
    pricingLabel: hasEmbeddedPricing(org)
      ? 'Pricing catalogue available'
      : 'No public pricing summary'
  }
}

export const buildPartnerProfileRailViewModel = (
  org: PublicOrganization | null | undefined
): PartnerProfileRailViewModel => {
  return {
    quickFacts: [
      {
        label: 'Website',
        value: org?.website ? 'Public link available' : 'Not provided'
      },
      {
        label: 'Member since',
        value: formatDate(org?.creationTimestamp)
      },
      {
        label: 'Location',
        value: formatLocation(org)
      },
      {
        label: 'Founded',
        value:
          org?.inceptionYear?.toString() ||
          formatYear(org?.dateOfIncorporation) ||
          'Not provided'
      }
    ],
    signals: [
      {
        label: 'Active partnerships',
        value: formatMetric(org?.activePartnerships)
      },
      {
        label: 'Pipeline partnerships',
        value: formatMetric(org?.pipelinePartnerships)
      },
      {
        label: 'Meeting success rate',
        value:
          typeof org?.meetingSuccessRate === 'number'
            ? `${org.meetingSuccessRate}%`
            : 'Not available'
      },
      {
        label: 'Acknowledgement time',
        value:
          typeof org?.acknowledgmentTime === 'number'
            ? `${org.acknowledgmentTime} hr`
            : 'Not available'
      },
      {
        label: 'Accessible APIs',
        value: formatMetric(org?.accessibleApisVisible)
      }
    ]
  }
}

export const buildCertificationPlaceholders = (
  org?: PublicOrganization | null
): BetaCertification[] => {
  const issuer = org?.name || 'Partner profile beta'

  return [
    {
      id: 'security-posture',
      title: 'Security review',
      issuer,
      year: 'Pending',
      note: 'Certification persistence is not wired in this rollout.',
      state: 'placeholder'
    },
    {
      id: 'compliance-badge',
      title: 'Compliance badge',
      issuer,
      year: 'Pending',
      note: 'Showing a beta placeholder until organization-level data exists.',
      state: 'placeholder'
    },
    {
      id: 'delivery-standard',
      title: 'Delivery standard',
      issuer,
      year: 'Pending',
      note: 'Use the read-only beta state until editing is supported.',
      state: 'placeholder'
    }
  ]
}

export function extractOrganizationCertificationContent(response: any): any[] {
  if (Array.isArray(response?.data?.content)) return response.data.content
  if (Array.isArray(response?.content)) return response.content
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response)) return response
  if (response?.data && typeof response.data === 'object')
    return [response.data]
  if (response && typeof response === 'object') return [response]
  return []
}

export const mapOrganizationCertificationsResponse = (
  response: unknown
): BetaCertification[] => {
  return extractOrganizationCertificationContent(response)
    .map((item: any, index: number) => {
      const title =
        typeof item?.certificationName === 'string'
          ? item.certificationName.trim()
          : ''
      const status =
        typeof item?.status === 'string' ? item.status.trim().toUpperCase() : ''
      const verificationUrl =
        typeof item?.verificationUrl === 'string'
          ? item.verificationUrl.trim()
          : ''

      return {
        id: String(item?.id ?? `certification-${index}`),
        title,
        issuer: 'Sharkdom verified',
        year: status || 'VERIFIED',
        note: verificationUrl,
        logoUrl:
          typeof item?.logoUrl === 'string' && item.logoUrl.trim()
            ? item.logoUrl.trim()
            : undefined,
        state: 'verified' as const
      }
    })
    .filter((item) => item.title)
}

export const buildPublicResources = (
  org: PublicOrganization | null | undefined
): BetaResourceItem[] => {
  const resources: BetaResourceItem[] = []
  const website = getSafeUrl(org?.website)

  if (website) {
    resources.push({
      id: 'website',
      title: 'Primary website',
      description: 'Visit the organization website.',
      kind: 'website',
      href: website,
      meta: trimUrl(website)
    })
  }

  if (Array.isArray(org?.socialMedias)) {
    org.socialMedias.forEach((item: any, index: number) => {
      const href = getSafeUrl(item?.url)
      if (!href || item?.showOnUi === false) return
      resources.push({
        id: `social-${item?.name || index}`,
        title: item?.name || 'Social link',
        description: 'Public company profile or community link.',
        kind: 'social',
        href,
        meta: trimUrl(href)
      })
    })
  }

  if (org?.brandResources !== undefined) {
    resources.push({
      id: 'brand-resources',
      title: 'Brand resources',
      description: org.brandResources
        ? 'This organization indicates brand resources are available on request.'
        : 'No public brand resource availability has been shared.',
      kind: 'availability',
      meta: org.brandResources ? 'Available on request' : 'Not available'
    })
  }

  return resources
}

const RESOURCE_KIND_BY_TYPE: Record<string, BetaResourceItem['kind']> = {
  website: 'website',
  social: 'social',
  linkedin: 'social',
  twitter: 'social',
  youtube: 'video',
  video: 'video',
  demo: 'demo',
  deck: 'deck',
  presentation: 'deck',
  'case study': 'case-study',
  'case-study': 'case-study',
  casestudy: 'case-study',
  document: 'document',
  pdf: 'document',
  doc: 'document',
  whitepaper: 'document'
}

const isOrganizationResourceRecord = (
  value: unknown
): value is OrganizationResourceRecord => {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Record<string, unknown>
  return ['id', 'title', 'type', 'source', 'url', 'description'].some(
    (key) => key in candidate
  )
}

const normalizeOrganizationResourceText = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : ''
}

const extractOrganizationResourceRecords = (
  payload: unknown
): OrganizationResourceRecord[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isOrganizationResourceRecord)
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  if (isOrganizationResourceRecord(payload)) {
    return [payload]
  }

  const candidate = payload as Record<string, unknown>

  for (const key of ['data', 'content', 'items', 'results']) {
    const nested = extractOrganizationResourceRecords(candidate[key])
    if (nested.length > 0) return nested
  }

  const embedded = candidate._embedded
  if (embedded && typeof embedded === 'object') {
    for (const value of Object.values(embedded as Record<string, unknown>)) {
      const nested = extractOrganizationResourceRecords(value)
      if (nested.length > 0) return nested
    }
  }

  return []
}

const mapOrganizationResourceKind = (
  type: string
): BetaResourceItem['kind'] => {
  const normalized = type.toLowerCase().trim()
  return RESOURCE_KIND_BY_TYPE[normalized] || 'resource'
}

const buildResourceDescription = (
  kind: BetaResourceItem['kind'],
  readableType: string
) => {
  switch (kind) {
    case 'website':
      return 'Visit the organization website.'
    case 'social':
      return 'Public company profile or community link.'
    case 'video':
    case 'demo':
      return 'Preview this resource in a browser tab.'
    case 'deck':
    case 'case-study':
    case 'document':
    case 'resource':
      return readableType
        ? `Open this ${readableType.toLowerCase()}.`
        : 'Open this public resource.'
    case 'availability':
      return 'Resource availability is shared separately.'
    default:
      return 'Open this public resource.'
  }
}

export const mapOrganizationResourceRecordsResponse = (
  response: unknown
): OrganizationResourceRecord[] => {
  return extractOrganizationResourceRecords(response)
}

export const mapOrganizationResourcesResponse = (
  response: unknown
): BetaResourceItem[] => {
  return mapOrganizationResourceRecordsResponse(response)
    .map((resource, index) => {
      const rawType = normalizeOrganizationResourceText(resource.type)
      const readableType = rawType || 'Resource'
      const href = getSafeUrl(normalizeOrganizationResourceText(resource.url))
      const source = normalizeOrganizationResourceText(resource.source)
      const description =
        normalizeOrganizationResourceText(resource.description) ||
        buildResourceDescription(
          mapOrganizationResourceKind(rawType),
          readableType
        )
      const kind = mapOrganizationResourceKind(rawType)
      const title =
        normalizeOrganizationResourceText(resource.title) ||
        readableType ||
        `Resource ${index + 1}`

      const meta =
        kind === 'website'
          ? href
            ? trimUrl(href)
            : source || readableType
          : source || readableType || (href ? trimUrl(href) : '')

      return {
        id: String(resource.id ?? `${kind}-${index}`),
        title,
        description,
        kind,
        href,
        meta
      }
    })
    .filter((resource) =>
      Boolean(resource.title && (resource.href || resource.meta))
    )
}

export const buildPartnerProgramSummary = ({
  programs,
  details,
  org
}: {
  programs?: any
  details?: any
  org?: PublicOrganization | null
}): PartnerProgramSummaryViewModel => {
  const campaignDetails = Array.isArray(programs?.campaignDetails)
    ? programs.campaignDetails
    : Array.isArray(programs)
      ? programs
      : []

  if (campaignDetails.length > 0 || details?.activePartnerProgram) {
    const activeProgram = campaignDetails[0]
    return {
      title:
        activeProgram?.programName ||
        details?.activePartnerProgram ||
        'Partner program live',
      description:
        activeProgram?.description ||
        'This organization has an active partner-program surface available today.',
      state: 'available',
      ctaLabel: activeProgram?.urlRef ? 'Open program link' : undefined,
      ctaHref: getSafeUrl(activeProgram?.urlRef),
      metrics: [
        {
          label: 'Program count',
          value: campaignDetails.length.toString()
        },
        {
          label: 'Current partners',
          value: formatMetric(details?.currentPartnerCount)
        },
        {
          label: 'Branding page',
          value: details?.brandingPage ? 'Configured' : 'Not shared'
        }
      ]
    }
  }

  return {
    title: 'Partner program not shared yet',
    description:
      org?.referralProgram === false
        ? 'This organization has not published a partner-program summary.'
        : 'Partner-program data is not available on the current public surface.',
    state: 'empty',
    metrics: [
      {
        label: 'Program count',
        value: '0'
      },
      {
        label: 'Current partners',
        value: 'Not available'
      }
    ]
  }
}

export const mapCatalogueResponse = (
  response: any
): PricingCatalogueViewModel => {
  const rawData = response?.data || response
  const pricingTiers = Array.isArray(rawData?.pricingTiers?.content)
    ? rawData.pricingTiers.content
    : Array.isArray(rawData?.pricingTiers)
      ? rawData.pricingTiers
      : []
  const partnerTiers = Array.isArray(rawData?.partnerTiers?.content)
    ? rawData.partnerTiers.content
    : Array.isArray(rawData?.partnerTiers)
      ? rawData.partnerTiers
      : []

  const mappedPricing = pricingTiers.map((tier: any) => ({
    id: String(tier?.id ?? tier?.tierName ?? Math.random()),
    name: tier?.tierName || tier?.name || 'Pricing tier',
    price:
      tier?.price !== undefined && tier?.price !== null
        ? `${tier?.currency === 'USD' ? '$' : tier?.currency || '$'} ${tier.price}`
        : tier?.price || 'Custom',
    features: Array.isArray(tier?.features) ? tier.features : [],
    color: tier?.colorCode || tier?.color || '#3E50F7'
  }))

  const mappedPartner = partnerTiers.map((tier: any) => ({
    id: String(tier?.id ?? tier?.tierName ?? Math.random()),
    name: tier?.tierName || tier?.name || 'Partner tier',
    price:
      tier?.price !== undefined && tier?.price !== null
        ? `${tier?.currency === 'USD' ? '$' : tier?.currency || '$'} ${tier.price}`
        : tier?.price || 'Custom',
    seats:
      tier?.seatLower !== undefined && tier?.seatUpper !== undefined
        ? `${tier.seatLower} - ${tier.seatUpper}`
        : tier?.seats || 'Custom',
    discount:
      tier?.discountPercent !== undefined
        ? `${tier.discountPercent}%`
        : tier?.discount || 'Custom',
    region: tier?.region || 'Global',
    color: tier?.colorCode || tier?.color || '#0F766E',
    active: tier?.active ?? true
  }))

  return {
    hasExistingData:
      Boolean(rawData?.hasData) ||
      mappedPricing.length > 0 ||
      mappedPartner.length > 0,
    pricingTiers: mappedPricing,
    partnerTiers: mappedPartner
  }
}

export const mapPricingTierListResponse = (
  response: any
): PricingCatalogueViewModel => {
  const rawData = response?.data || response
  const planCollection = rawData?.plans || rawData?.pricingTiers || rawData
  const pricingTiers = Array.isArray(planCollection?.content)
    ? planCollection.content
    : Array.isArray(planCollection)
      ? planCollection
      : []

  return {
    hasExistingData: Boolean(rawData?.hasData) || pricingTiers.length > 0,
    pricingTiers: pricingTiers.map((tier: any) => ({
      id: String(tier?.id ?? tier?.tierName ?? Math.random()),
      name: tier?.tierName || tier?.name || 'Pricing tier',
      price:
        tier?.price !== undefined && tier?.price !== null
          ? `${tier?.currency === 'USD' ? '$' : tier?.currency || '$'} ${tier.price}`
          : tier?.price || 'Custom',
      features: Array.isArray(tier?.features) ? tier.features : [],
      color: tier?.colorCode || tier?.color || '#3E50F7'
    })),
    partnerTiers: []
  }
}

export const mapOrganizationInsightsResponse = (
  response: any,
  org?: PublicOrganization | null
) => {
  const rawData = response?.data || response || {}
  const marketSegments = Array.isArray(rawData?.marketSegment)
    ? rawData.marketSegment
        .map((item: unknown) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
    : []
  const keywords = Array.isArray(rawData?.labels)
    ? rawData.labels
        .map((label: any) =>
          typeof label?.name === 'string' ? label.name.trim() : ''
        )
        .filter(Boolean)
    : []
  const searchCount =
    typeof rawData?.searchCount === 'number' ? rawData.searchCount : null

  const segment =
    marketSegments[0] ||
    org?.sector ||
    org?.companyType ||
    'Enterprise Automation'

  const trendLabel =
    marketSegments.length > 1
      ? `+${marketSegments.length - 1} related segments`
      : keywords.length > 0
        ? `${keywords.length} tagged interests`
        : 'AI signal available'

  return {
    segment,
    trendLabel,
    activeSearches:
      searchCount !== null
        ? new Intl.NumberFormat('en-US').format(searchCount)
        : '847',
    activeSearchesDescription: 'looking for similar solutions',
    keywords:
      keywords.slice(0, 3).length > 0
        ? keywords.slice(0, 3)
        : ['API', 'Automation', 'AWS']
  }
}

export const mapProfileCompletionStatusResponse = (
  response: any
): ProfileCompletionStatusViewModel | null => {
  const rawData = response?.data || response
  if (!rawData || typeof rawData !== 'object') {
    return null
  }

  const hasKnownField =
    typeof rawData?.partnerProgramPublished === 'boolean' ||
    typeof rawData?.dataSourceConnected === 'boolean' ||
    typeof rawData?.profileCompleted === 'boolean' ||
    typeof rawData?.completionPercentage === 'number'

  if (!hasKnownField) {
    return null
  }

  return {
    partnerProgramPublished:
      typeof rawData?.partnerProgramPublished === 'boolean'
        ? rawData.partnerProgramPublished
        : null,
    dataSourceConnected:
      typeof rawData?.dataSourceConnected === 'boolean'
        ? rawData.dataSourceConnected
        : null,
    profileCompleted:
      typeof rawData?.profileCompleted === 'boolean'
        ? rawData.profileCompleted
        : null,
    completionPercentage:
      typeof rawData?.completionPercentage === 'number'
        ? Math.max(0, Math.min(100, Math.round(rawData.completionPercentage)))
        : null
  }
}

export const mapRecommendationsResponse = (response: any) => {
  const rawData = response?.data || response
  const content = Array.isArray(rawData?.content)
    ? rawData.content
    : Array.isArray(rawData?.data?.content)
      ? rawData.data.content
      : []

  return content
    .map((item: any, index: number) => {
      const filters = Array.isArray(item?.filters)
        ? item.filters
            .map((value: unknown) =>
              typeof value === 'string' ? value.trim() : ''
            )
            .filter(Boolean)
            .slice(0, 2)
        : []
      const preferredSectors = Array.isArray(item?.preferredSectors)
        ? item.preferredSectors
            .map((value: unknown) =>
              typeof value === 'string' ? value.trim() : ''
            )
            .filter(Boolean)
            .slice(0, 2)
        : []

      const metricLabel =
        typeof item?.meetingSuccessRate === 'number'
          ? 'Success rate'
          : typeof item?.activePartnerships === 'number'
            ? 'Active partnerships'
            : typeof item?.acknowledgmentTime === 'number'
              ? 'Acknowledgement'
              : 'Recommended'

      const metricValue =
        typeof item?.meetingSuccessRate === 'number'
          ? `${item.meetingSuccessRate}%`
          : typeof item?.activePartnerships === 'number'
            ? String(item.activePartnerships)
            : typeof item?.acknowledgmentTime === 'number'
              ? `${item.acknowledgmentTime} hr`
              : 'Yes'

      return {
        id: String(item?.id ?? index),
        name:
          (typeof item?.name === 'string' && item.name.trim()) ||
          'Recommended organization',
        description:
          (typeof item?.briefDescription === 'string' &&
            item.briefDescription.trim()) ||
          (typeof item?.about === 'string' && item.about.trim()) ||
          'Potentially relevant partner profile.',
        tags: filters.length > 0 ? filters : preferredSectors,
        logoUrl:
          typeof item?.logoUrl === 'string' && item.logoUrl.trim()
            ? item.logoUrl.trim()
            : undefined,
        website: getSafeUrl(item?.website),
        metricLabel,
        metricValue
      }
    })
    .filter((item: any) => Boolean(item.name))
}

export const buildOrganizationUpdatePayload = ({
  org,
  overrides
}: {
  org: OrganizationType
  overrides?: Record<string, any>
}) => {
  const services =
    overrides?.services ??
    (Array.isArray(org?.services)
      ? org.services.map((service) => ({
          id: service.id,
          creationTimestamp: service.creationTimestamp,
          lastUpdatedTimestamp: service.lastUpdatedTimestamp,
          service: service.service
        }))
      : [])

  const partnershipTypes =
    overrides?.preferedPartnershipTypes ??
    (Array.isArray(org?.preferredPartnershipTypes)
      ? org.preferredPartnershipTypes.map((item) => ({
          label: item.area,
          value: item.area
        }))
      : [])

  return {
    id: org.id,
    startupName: overrides?.startupName ?? org.name ?? '',
    briefDescription: overrides?.briefDescription ?? org.briefDescription ?? '',
    about: overrides?.about ?? org.about ?? '',
    website: overrides?.website ?? org.website ?? '',
    registrationType: overrides?.registrationType ?? org.registrationType ?? '',
    city: overrides?.city ?? org.city ?? '',
    state: overrides?.state ?? org.state ?? '',
    companyType: overrides?.companyType ?? org.companyType ?? '',
    preferedPartnershipTypes: partnershipTypes,
    targetMarket: overrides?.targetMarket ?? org.targetMarket ?? '',
    referralProgram: overrides?.referralProgram ?? Boolean(org.referralProgram),
    legalName: overrides?.legalName ?? org.legalName ?? '',
    inHousePartnership: overrides?.inHousePartnership ?? '',
    brandingPage: overrides?.brandingPage ?? '',
    activePartnerProgram: overrides?.activePartnerProgram ?? '',
    currentPartnerCount: overrides?.currentPartnerCount ?? '',
    dateOfIncorporation:
      overrides?.dateOfIncorporation ?? org.dateOfIncorporation ?? '',
    code: overrides?.code ?? org.code ?? '',
    country: overrides?.country ?? org.country ?? '',
    address: overrides?.address ?? org.address ?? '',
    contactNumber: overrides?.contactNumber ?? org.contactNumber ?? '',
    services
  }
}

export const hasEmbeddedPricing = (
  org: PublicOrganization | null | undefined
) => {
  return Boolean(
    org &&
      (Array.isArray(org?.pricingTiers) ||
        Array.isArray(org?.partnerTiers) ||
        Array.isArray(org?.catalogues))
  )
}

export const formatLocation = (org: PublicOrganization | null | undefined) => {
  const parts = [org?.city, org?.state, org?.country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'Location not provided'
}

export const formatDate = (value?: string | null) => {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not provided'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatYear = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return String(date.getFullYear())
}

export const formatMetric = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  return String(value)
}

export const getSafeUrl = (value?: string | null) => {
  if (!value) return undefined
  const normalized = value.startsWith('http') ? value : `https://${value}`
  try {
    return new URL(normalized).toString()
  } catch {
    return undefined
  }
}

export const trimUrl = (value: string) => {
  return value.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
