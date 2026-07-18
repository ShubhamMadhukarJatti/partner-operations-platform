'use server'

import { Pageable, SearchResponse, Sort } from '@/types'

import { fetcher } from '@/lib/server'

import { getCurrentOrganization } from './organization'

export interface Sector {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  area: string
}

export interface Credits {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  playgroundCredits: number
  aiProposalCredits: number
}

export interface SocialMedias {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  name: string
  url: string
  showOnUi: boolean
}

export interface Organization {
  rating: number
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  services: any[] // Define the type for services accordingly
  socialMedias: SocialMedias[]
  code: string
  name: string
  about: string
  logoUrl: string
  briefDescription: string
  inceptionYear: string | null
  registrationType: string | null
  sector: string
  stage: string
  dateOfIncorporation: string | null
  verificationApplicationStatus: string | null
  city: string
  state: string
  additionalDetails: string | null
  primaryEmail: string | null
  primaryEmailVerified: boolean | null
  domain: string | null
  domainVerified: boolean | null
  website: string | null
  status: string
  verified: boolean
  verifiedBy: string | null
  verifiedOn: string | null
  address: string | null
  trialPeriodProcured: boolean
  companyType: string | null
  legalName: string | null
  contactNumber: string | null

  targetMarket: string | null
  funding: string | null
  preferredPartnershipTypes: any[] // Define the type for preferredPartnershipTypes accordingly
  partnershipRestrictions: string | null
  cin: string | null
  lastActivityAtTimestamp: string | null
  verificationResponse: string | null
  source: string
  incorporationDate: string | null
  preferredSectors: Sector[]
  signatories: any[] // Define the type for signatories accordingly
  openForPartnership: boolean
  credits: Credits
  schedules: any[] // Define the type for schedules accordingly
  subscribed: boolean
}

export interface SearchOrganizationPaginatedResponse {
  content: Organization[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export type getSearchResultsProps = {
  inceptionYearFrom?: number
  includeUnverified?: boolean
  city?: string
  state?: string
  stages?: string
  sectors?: string
  partnershipType?: string
  queryingOrganizationId?: number
  page?: number
  size?: number
  sectorsCommaSeparated?: any
  partialName?: any
  onlySearch?: boolean
  subSectorsCommaSeparated?: string
  exactMatch?: string
  organizationId: number
  signal?: AbortSignal // Add support for request cancellation
}
export type getDiscoverSearchResultsProps = {
  inceptionYearFrom?: number
  includeUnverified?: boolean
  city?: string
  state?: string
  stages?: string
  sectors?: string
  partnershipType?: string
  queryingOrganizationId?: number
  page?: number
  size?: number
  sectorsCommaSeparated?: any
  partialName?: any
  onlySearch?: boolean
  subSectorsCommaSeparated?: string
  exactMatch?: string
}

export const getSearchResult = async (
  props: getSearchResultsProps
): Promise<any> => {
  const {
    organizationId,
    includeUnverified,
    inceptionYearFrom,
    city,
    state,
    stages,
    queryingOrganizationId,
    page,
    size,
    sectorsCommaSeparated,
    partnershipType,
    partialName,
    subSectorsCommaSeparated,
    onlySearch,
    exactMatch,
    signal // Add support for AbortSignal
  } = props

  // Build minimal query params to reduce URL length
  const queryParams = new URLSearchParams()

  // Only add params that have actual values to reduce query complexity
  const addParam = (key: string, value: string | null | undefined) => {
    if (value && value.toString().trim() !== '') {
      queryParams.append(key, value.toString().trim())
    }
  }

  addParam('inceptionYearFrom', inceptionYearFrom?.toString())
  addParam('includeUnverified', includeUnverified?.toString())
  addParam('sectorsCommaSeparated', sectorsCommaSeparated)
  addParam('subSectorsCommaSeparated', subSectorsCommaSeparated)
  addParam('partnershipTypesCommaSeparated', partnershipType)
  addParam('city', city)
  addParam('state', state)
  addParam('stagesCommaseparated', stages)
  addParam(
    'queryingOrganizationId',
    queryingOrganizationId?.toString() || organizationId?.toString()
  )
  addParam('page', page?.toString())
  addParam('partialName', partialName?.toString())
  addParam('exactMatch', exactMatch)
  addParam('size', size?.toString() || '20') // Keep original page size

  const endpoint = onlySearch
    ? `/organization/search`
    : `/organization/searchPartial`
  return await fetcher(`${endpoint}?${queryParams.toString()}`)
}

// New search function using the searchByFilter endpoint
export const getSearchResultByFilter = async (props: {
  keyword?: string
  filters?: string
  sectorType?: string
  sectors?: string // Added sectors parameter (comma-separated preferredSectors.area)
  partnershipTypes?: string
  subSectorsCommaSeparated?: string
  compliance?: string
  region?: string
  isRecommended?: boolean
  isPopular?: boolean
  isMostActive?: boolean
  isHighMatchPercentage?: boolean
  isLowAcknowledgeTime?: boolean
  isShortlisted?: boolean
  page?: number
  size?: number
  organizationId: number
  queryingOrganizationId?: number
  signal?: AbortSignal
}): Promise<any> => {
  const {
    keyword,
    filters,
    sectorType,
    sectors,
    partnershipTypes,
    subSectorsCommaSeparated,
    compliance,
    region,
    isRecommended,
    isPopular,
    isMostActive,
    isHighMatchPercentage,
    isLowAcknowledgeTime,
    isShortlisted,
    page,
    size,
    organizationId,
    queryingOrganizationId,
    signal
  } = props

  // Build query params for the new searchByFilter endpoint
  const queryParams = new URLSearchParams()

  // Only add params that have actual values
  const addParam = (key: string, value: string | number | null | undefined) => {
    if (
      value !== null &&
      value !== undefined &&
      value.toString().trim() !== ''
    ) {
      queryParams.append(key, value.toString().trim())
    }
  }

  // Add main search parameters
  addParam('keyword', keyword)
  addParam('filters', subSectorsCommaSeparated)
  addParam('sectorType', sectorType)
  addParam('sectors', sectors) // Add sectors parameter (preferredSectors.area)
  addParam('partnershipTypes', partnershipTypes)
  addParam('compliance', compliance)
  addParam('region', region)
  if (isRecommended) addParam('isRecommended', 'true')
  if (isPopular) addParam('isPopular', 'true')
  if (isMostActive) addParam('isMostActive', 'true')
  if (isHighMatchPercentage) addParam('isHighMatchPercentage', 'true')
  if (isLowAcknowledgeTime) addParam('isLowAcknowledgeTime', 'true')
  if (isShortlisted) addParam('isShortlisted', 'true')

  // Add legacy filter parameters (for backward compatibility)
  // addParam('subSectorsCommaSeparated', subSectorsCommaSeparated)

  // Add pagination
  addParam('page', page)
  addParam('size', size || 20)

  // Add organization context
  addParam(
    'queryingOrganizationId',
    queryingOrganizationId?.toString() || organizationId?.toString()
  )

  try {
    const endpoint = `/organization/searchByFilter?${queryParams.toString()}`
    console.log('API endpoint being called:', endpoint)
    console.log('Query params:', queryParams.toString())

    const data = await fetcher(endpoint, {
      signal: signal,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' // 1 min cache, 5 min stale
      }
    })

    console.log('API Response data:', data)
    return data
  } catch (error) {
    console.error('Error fetching search results:', error)

    // Return a default response structure on error
    return {
      content: [],
      totalPages: 1,
      totalElements: 0,
      size: size || 20,
      number: page || 0,
      numberOfElements: 0,
      first: true,
      empty: true,
      pageable: {
        sort: {
          sorted: false,
          unsorted: true,
          empty: true
        },
        offset: 0,
        pageNumber: page || 0,
        pageSize: size || 20,
        paged: true,
        unpaged: false
      },
      last: true,
      sort: {
        sorted: false,
        unsorted: true,
        empty: true
      }
    }
  }
}

/** Discover home - uses /organization/discover/home */
export const getDiscoverHome = async (props: {
  page?: number
  size?: number
  organizationId?: number
  queryingOrganizationId?: number
  signal?: AbortSignal
}): Promise<any> => {
  const {
    page = 0,
    size = 3,
    organizationId,
    queryingOrganizationId,
    signal
  } = props

  const queryParams = new URLSearchParams()
  queryParams.append('page', String(page))
  queryParams.append('size', String(size))
  const orgId = queryingOrganizationId ?? organizationId
  if (orgId != null) {
    queryParams.append('queryingOrganizationId', String(orgId))
    queryParams.append('organizationId', String(orgId))
  }

  const endpoint = `/organization/discover/home?${queryParams.toString()}`
  const data = await fetcher(endpoint, {
    signal,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  })
  return data
}

export const getSearchResultByPartialName = async (
  text: string
): Promise<SearchOrganizationPaginatedResponse> => {
  const path = `/organization/searchByPartialName?partialName=${encodeURIComponent(text)}`
  const data = await fetcher<SearchOrganizationPaginatedResponse>(path, {
    method: 'GET'
  })
  return data
}

export const getSearchResultDiscover = async (
  props: getDiscoverSearchResultsProps
): Promise<SearchResponse> => {
  const {
    includeUnverified,
    inceptionYearFrom,
    city,
    state,
    stages,
    queryingOrganizationId,
    page,
    size,
    sectorsCommaSeparated,
    partnershipType,
    partialName,
    subSectorsCommaSeparated,
    onlySearch
  } = props

  const basePath = onlySearch
    ? '/organization/search'
    : '/organization/searchPartial'
  const params = new URLSearchParams()

  const addParam = (
    key: string,
    value: string | number | boolean | null | undefined
  ) => {
    if (
      value !== null &&
      value !== undefined &&
      value.toString().trim() !== ''
    ) {
      params.append(key, value.toString().trim())
    }
  }

  addParam('inceptionYearFrom', inceptionYearFrom)
  addParam('includeUnverified', includeUnverified)
  addParam('sectorsCommaSeparated', sectorsCommaSeparated)
  addParam('subSectorsCommaSeparated', subSectorsCommaSeparated)
  addParam('partnershipTypesCommaSeparated', partnershipType)
  addParam('city', city)
  addParam('state', state)
  addParam('stagesCommaseparated', stages)
  addParam('page', page)
  addParam('partialName', partialName)
  addParam('size', size || 20)

  const path = params.toString() ? `${basePath}?${params.toString()}` : basePath

  try {
    const data = await fetcher<SearchResponse>(path, {
      method: 'GET',
      timeout: 10000,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
    return data
  } catch (error) {
    // Log the error or handle it appropriately
    console.error('Error fetching discover data:', error)

    // Return a default response structure on error
    return {
      content: [],
      totalPages: 1,
      totalElements: 0,
      size: size || 20,
      number: page || 0,
      numberOfElements: 0,
      first: true,
      empty: true,
      pageable: {
        sort: {
          sorted: false,
          unsorted: true,
          empty: true
        },
        offset: 0,
        pageNumber: page || 0,
        pageSize: size || 20,
        paged: true,
        unpaged: false
      },
      last: true,
      sort: {
        sorted: false,
        unsorted: true,
        empty: true
      }
    }
  }
}
