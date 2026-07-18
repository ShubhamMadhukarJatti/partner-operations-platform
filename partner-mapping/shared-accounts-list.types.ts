/** Shared-accounts API list types (shared accounts table + server normalization). */

export type OverlapType = 'HOT' | 'COSELL_READY' | string

export type DealStage =
  | 'PROPOSAL_SENT'
  | 'DISCOVERY'
  | 'CLOSED_CUSTOMER'
  | 'CLOSED_WON'
  | 'CLOSED_LOST'
  | string

export type RecommendedAction = 'START_COSELL' | 'REQUEST_INTRO' | string

export type SharedAccount = {
  accountId: string
  name: string
  domain: string
  overlapType: OverlapType
  opportunityScore: number
  yourStage: DealStage
  partnerStage: DealStage
  estimatedACV: number
  recommendedAction: RecommendedAction
  targetPartnerDealId?: string | null
  currentPartnerDealId?: string | null
}

export type SharedAccountsData = {
  content: SharedAccount[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
  /** Present when API echoes the partner org for this listing (optional). */
  partnerOrganizationId?: number | string
  partnerOrgId?: number | string
  partnerId?: number | string
}

export type SharedAccountsApiResponse = {
  success: boolean
  message: string
  data: SharedAccountsData
}

export type SharedAccountsParams = {
  page?: number
  size?: number
  sort?: string
  filter?: string
  partnerOrgId?: number | string
}
