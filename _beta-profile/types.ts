import { OrganizationType } from '@/types'

export type ExploreBetaTab = 'overview' | 'resources' | 'pricing'

export type ProfileBetaSection =
  | 'basic-info'
  | 'services'
  | 'certifications'
  | 'resources'
  | 'partner-program'
  | 'pricing'

export interface BetaNavItem<TValue extends string> {
  value: TValue
  label: string
  description: string
}

export interface BetaCertification {
  id: string
  title: string
  issuer: string
  year: string
  note: string
  logoUrl?: string
  state: 'verified' | 'placeholder'
}

export interface BetaResourceItem {
  id: string
  title: string
  description: string
  kind:
    | 'website'
    | 'social'
    | 'availability'
    | 'video'
    | 'demo'
    | 'deck'
    | 'case-study'
    | 'document'
    | 'resource'
  href?: string
  meta?: string
}

export interface OrganizationResourceRecord {
  id?: number | string | null
  title?: string | null
  type?: string | null
  source?: string | null
  url?: string | null
  description?: string | null
}

export interface PartnerProfileHeroViewModel {
  name: string
  description: string
  location: string
  hqLocation: string
  logoUrl: string
  bannerUrl?: string
  website?: string
  tags: string[]
  matchLabel: string
  collaborationLabel: string
  partnerProgramLabel: string
  pricingLabel: string
}

export interface PartnerProfileRailViewModel {
  quickFacts: Array<{
    label: string
    value: string
  }>
  signals: Array<{
    label: string
    value: string
  }>
}

export interface PartnerProgramSummaryViewModel {
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  state: 'available' | 'empty'
  metrics: Array<{
    label: string
    value: string
  }>
}

export interface BetaPricingTier {
  id: string
  name: string
  price: string
  features: string[]
  color: string
}

export interface BetaPartnerTier {
  id: string
  name: string
  price: string
  seats: string
  discount: string
  region: string
  color: string
  active: boolean
}

export interface PricingCatalogueViewModel {
  hasExistingData: boolean
  pricingTiers: BetaPricingTier[]
  partnerTiers: BetaPartnerTier[]
}

export interface ProfileCompletionStatusViewModel {
  partnerProgramPublished: boolean | null
  dataSourceConnected: boolean | null
  profileCompleted: boolean | null
  completionPercentage: number | null
}

export interface ProfileBetaSectionState {
  key: ProfileBetaSection
  title: string
  description: string
  writable: boolean
}

export type PublicOrganization = OrganizationType & Record<string, any>
