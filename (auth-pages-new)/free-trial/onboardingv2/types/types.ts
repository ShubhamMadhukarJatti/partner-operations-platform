export interface StepOption {
  id: string
  name: string
  isSelected: boolean
  needToIcon?: boolean
  iconActivePath?: string
  iconInactivePath?: string
  apiValue?: string
}

export type StateType = {
  name: string
  websiteUrl: string
  currentRole: string
  marketSegment: string
  doYouHavePartnershipTeam: boolean
  partnershipTeamStrength: string
  currentPartnersCount: string
  goalToUseSharkdom: string
  reagon: string[]
  avoidFundraisingCompany: boolean
  partnershipType: string
  roleInPartnershipFunction: string
  currentCustomer: string
  currentCustomerStrength: string
}
