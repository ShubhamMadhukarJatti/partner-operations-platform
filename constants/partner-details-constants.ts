import { Briefcase, Edit, Link } from 'lucide-react'

// Dropdown options for Product Market fields
export const marketSegmentOptions = [
  { value: 'B2C', label: 'B2C' },
  { value: 'B2B', label: 'B2B' },
  { value: 'B2B2C', label: 'B2B2C' }
]

export const targetAudienceOptions = [
  { value: 'Startup Founders', label: 'Startup Founders' },
  { value: 'Enterprise Leaders', label: 'Enterprise Leaders' },
  { value: 'SMB Owners', label: 'SMB Owners' },
  { value: 'Developers', label: 'Developers' },
  { value: 'Marketing Teams', label: 'Marketing Teams' }
]

export const registrationTypeOptions = [
  { value: 'Company Registration', label: 'Company Registration' },
  { value: 'Individual Registration', label: 'Individual Registration' },
  { value: 'Partnership Registration', label: 'Partnership Registration' }
]

export const inHousePartnershipTeamOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
]

export const numberOfPartnersOptions = [
  { value: '1-5', label: '1-5' },
  { value: '6-10', label: '6-10' },
  { value: '11-20', label: '11-20' },
  { value: '>20', label: '>20' }
]

export const gtmTeamOptions = [
  { value: 'LESS_THAN_5', label: 'Small Team (1-5)' },
  { value: 'BETWEEN_5_AND_20', label: 'Medium Team (5-20)' },
  { value: 'MORE_THAN_20', label: 'Large Team (20+)' }
]

export const lookingPartnersInSectorsOptions = [
  { value: 'Telecom', label: 'Telecom' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Fintech', label: 'Fintech' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'EdTech', label: 'EdTech' },
  { value: 'Manufacturing', label: 'Manufacturing' }
]

export const goalWithSharkdomOptions = [
  { value: 'Discover New Partners', label: 'Discover New Partners' },
  { value: 'Partner Channel Marketing', label: 'Partner Channel Marketing' },
  {
    value: 'Manage Current Partnerships',
    label: 'Manage Current Partnerships'
  },
  { value: 'Just exploring', label: 'Just exploring' }
  // { value: 'Increase Revenue', label: 'Increase Revenue' }
]

export const preferredRegionsOptions = [
  { value: 'APAC', label: 'APAC' },
  { value: 'NORTH_AMERICA', label: 'North America' },
  { value: 'EUROPE', label: 'Europe' },
  { value: 'MENA', label: 'MENA' }
]

export const partnershipTypesOptions = [
  { value: 'Strategic', label: 'Strategic' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Co-Selling', label: 'Co-Selling' },
  { value: 'Community', label: 'Community' },
  { value: 'Social', label: 'Social' }
  // { value: 'Integration', label: 'Integration' },
]

// Sample data structure for Product Market
export const productMarketData = {
  marketSegment: 'B2C',
  targetAudience: 'Startup Founders',
  registrationType: 'Company Registration',
  inHousePartnershipTeam: 'Yes',
  numberOfPartners: '>20',
  gtmTeam: 'Medium Team (5-20)',
  lookingPartnersInSectors: 'Telecom',
  goalWithSharkdom: [
    'Discover New Partners',
    'Partner Channel Marketing',
    'Manage Current Partnerships'
  ],
  preferredRegionsForPartnership: ['APAC', 'North America', 'Europe', 'MENA'],
  interestInPartnershipTypes: ['Technology', 'Co-Selling', 'Community']
}

// Sample data structure for IPP Details
export const ippDetailsData = {
  companyBrandingPageLink: 'https://flowfull/branding/',
  activePartnerPrograms: 'https://flowfull/partner-program/',
  currentNumberOfPartners: '50'
}

// Color constants matching existing design system
export const colors = {
  text: '#2A3241',
  textLight: '#6B7280',
  primary: '#6863FB',
  background: '#FFFFFF',
  border: '#E5E7EB',
  hover: '#F9FAFB'
}

// Icons
export const icons = {
  Briefcase,
  Edit,
  Link
}
