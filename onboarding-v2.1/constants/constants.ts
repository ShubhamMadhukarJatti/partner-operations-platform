import { number } from 'zod'

import {
  B2B2CIcon,
  B2BIcon,
  B2CIcon,
  CommunityIcon,
  CommunityLastIcon,
  CosellingIcon,
  CurrentPartnerIcon,
  CXOIcon,
  JustExploreIcon,
  LargeTeamIcon,
  MediumTeamIcon,
  NewPartnerIcon,
  OtherIcon,
  PartnerChanelIcon,
  PartnershipIcon,
  SalesIcon,
  SmallTeamIcon,
  StretgicIcon,
  TechnologyIcon,
  ZeroUserIcon
} from '../components/icons/icons'

export const step5 = [
  {
    name: 'Partnership Team',
    id: '1',
    details: 'ex. partnership manager, head of partnership',
    isSelected: false,
    needToIcon: true,
    // iconActivePath: '/images/onboarding/partnership_active.png',
    // iconInactivePath: '/images/onboarding/partnership_active.png'
    Icon: PartnershipIcon
  },
  {
    name: 'Sales Team',
    id: '2',
    details: 'ex. VP of Sales, Channel Sales Manager',
    isSelected: false,
    needToIcon: true,
    Icon: SalesIcon
    // iconActivePath: '/images/onboarding/sales_active.png',
    // iconInactivePath: '/images/onboarding/sales_inactive.png'
  },
  {
    name: 'GTM Team',
    id: '3',
    details: 'ex. GTM specialist manager',
    isSelected: false,
    needToIcon: true,
    Icon: CXOIcon
    // iconActivePath: '/images/onboarding/cxo_active.png',
    // iconInactivePath: '/images/onboarding/cxo_inactive.png'
  },
  {
    name: 'Other',
    id: '4',
    details: 'ex. Head of Revenue, revops',
    isSelected: false,
    needToIcon: true,
    // iconActivePath: '/images/onboarding/other_active.png',
    // iconInactivePath: '/images/onboarding/other_inactive.png'
    Icon: OtherIcon
  }
]

export const step6 = [
  {
    name: 'B2B',
    id: '1',
    isSelected: false,
    details: 'Business to Business - Selling to other businesses',
    Icon: B2BIcon,
    needToIcon: true
  },
  {
    name: 'B2B2C',
    id: '2',
    isSelected: false,
    details:
      'Business to Business to Consumer - Through business partners to end consumers',
    Icon: B2B2CIcon,
    needToIcon: true
  },
  {
    name: 'B2C',
    id: '3',
    isSelected: false,
    details: 'Business to Consumer - Selling directly to end consumers',
    Icon: B2CIcon,
    needToIcon: true
  }
]

export const step7 = [
  {
    name: 'Yes',
    id: '1',
    isSelected: true,
    needToIcon: true,
    iconActivePath: '/images/onboarding/yes_active.png',
    iconInactivePath: '/images/onboarding/yes_inactive.png'
  },
  {
    name: 'No',
    id: '2',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/images/onboarding/no_active.png',
    iconInactivePath: '/images/onboarding/no_inactive.png'
  }
]

export const step8 = [
  {
    name: 'Just me (0)',
    id: '1',
    isSelected: false,
    apiValue: 'ZERO',
    details: 'I handle partnerships individually',
    Icon: ZeroUserIcon,
    needToIcon: true
  },
  {
    name: 'Small team (1-4)',
    id: '2',
    isSelected: false,
    apiValue: 'LESS_THAN_5',
    details: 'A small, focused partnership team',
    Icon: SmallTeamIcon,
    needToIcon: true
  },
  {
    name: 'Medium team (5-20)',
    id: '3',
    isSelected: false,
    apiValue: 'BETWEEN_5_AND_20',
    details: 'Established partnership department',
    Icon: MediumTeamIcon,
    needToIcon: true
  },
  {
    name: 'Large team (20+)',
    id: '4',
    isSelected: false,
    apiValue: 'MORE_THAN_20',
    details: 'Enterprise-scale partnership organization',
    Icon: LargeTeamIcon,
    needToIcon: true
  }
]

export const step9 = [
  {
    name: 'Just me (0)',
    id: '1',
    isSelected: false,
    details: 'I handle partnerships individually',
    number: '0'
  },
  {
    name: 'Small team (1-4)',
    id: '2',
    isSelected: false,
    details: 'A small, focused partnership team',
    number: '<10'
  },
  {
    name: 'Medium team (5-20)',
    id: '3',
    isSelected: false,
    details: 'Established partnership department',
    number: '10+'
  },
  {
    name: 'Large team (20+)',
    id: '4',
    isSelected: false,
    details: 'Enterprise-scale partnership organization',
    number: '25+'
  }
]

export const step10 = [
  {
    name: 'Discover new partners',
    id: '1',
    isSelected: false,
    details:
      "Use Sharkdom's AI-powered discovery engine to find ideal partners",
    Icon: NewPartnerIcon,
    needToIcon: true
  },
  {
    name: 'Partner channel marketing',
    id: '2',
    isSelected: false,
    details:
      'Market your product through partner channels using our marketing tools',
    Icon: PartnerChanelIcon,
    needToIcon: true
  },
  {
    name: 'Manage current partnerships',
    id: '3',
    isSelected: false,
    details:
      'Use Sharkdom PRM to organize and track your existing partnerships',
    Icon: CurrentPartnerIcon,
    needToIcon: true
  },

  {
    name: 'Just exploring',
    id: '4',
    isSelected: false,
    details: "I'm learning about partnership platforms and exploring options",
    Icon: JustExploreIcon,
    needToIcon: true
  }
]

export const step11 = [
  {
    name: 'APAC',
    id: '1',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/onBoarding-v2.1/APACActive.svg',
    iconInactivePath: '/onBoarding-v2.1/APACInactive.svg',
    apiValue: 'APAC',
    details: 'Asia-Pacific region including China, Japan, India, Australia'
  },
  {
    name: 'North America',
    id: '2',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/onBoarding-v2.1/NorthAmericActive.svg',
    iconInactivePath: '/onBoarding-v2.1/NorthAmericInactive.svg',
    apiValue: 'NORTH_AMERICA',
    details: 'United States, Canada, and Mexico'
  },
  {
    name: 'Europe',
    id: '3',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/onBoarding-v2.1/EuropeActive.svg',
    iconInactivePath: '/onBoarding-v2.1/EuropeInactive.svg',
    apiValue: 'EUROPE',
    details: 'European Union and surrounding countries'
  },
  {
    name: 'MENA',
    id: '4',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/onBoarding-v2.1/MeenaActive.svg',
    iconInactivePath: '/onBoarding-v2.1/MeenaInactive.svg',
    apiValue: 'MENA',
    details: 'Middle East and North Africa'
  }
]

export const step12 = [
  {
    name: 'Yes',
    id: '1',
    isSelected: true,
    needToIcon: true,
    iconActivePath: '/images/onboarding/yes_active.png',
    iconInactivePath: '/images/onboarding/yes_inactive.png'
  },
  {
    name: 'No',
    id: '2',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/images/onboarding/no_active.png',
    iconInactivePath: '/images/onboarding/no_inactive.png'
  }
]

export const step13 = [
  {
    name: 'Co-selling',
    id: '1',
    isSelected: false,
    needToIcon: true,
    // iconActivePath: '/images/onboarding/strategic_active.png',
    // iconInactivePath: '/images/onboarding/strategic_inactive.png',
    details:
      "Use Sharkdom's AI-powered discovery engine to find ideal partners",
    Icon: StretgicIcon
  },
  {
    name: 'Reselling',
    id: '2',
    isSelected: false,
    needToIcon: true,
    // iconActivePath: '/images/onboarding/technology_active.png',
    // iconInactivePath: '/images/onboarding/technology_inactive.png',
    details:
      'Market your product through partner channels using our marketing tools',
    Icon: TechnologyIcon
  },
  {
    name: 'Co-Marketing',
    id: '3',
    isSelected: false,
    needToIcon: true,
    // iconActivePath: '/images/onboarding/coSelling_active.png',
    // iconInactivePath: '/images/onboarding/coSelling_inactive.png',
    details:
      'Use Sharkdom PRM to organize and track your existing partnerships',
    Icon: CosellingIcon
  },
  {
    name: 'Affiliates & Referrals',
    id: '4',
    isSelected: false,
    needToIcon: true,
    // iconActivePath: '/images/onboarding/community_active.png',
    // iconInactivePath: '/images/onboarding/community_inactive.png',
    details: "I'm learning about partnership platforms and exploring options",
    Icon: CommunityIcon
  },
  {
    name: 'All of the Above',
    id: '5',
    isSelected: false,
    needToIcon: true,
    // iconActivePath: '/images/onboarding/social_active.png',
    // iconInactivePath: '/images/onboarding/social_inactive.png',
    details: "I'm learning about partnership platforms and exploring options",
    Icon: CommunityLastIcon
  }
]

export const step14 = [
  {
    name: 'Partnership Manager',
    id: '1',
    isSelected: false
  },
  {
    name: 'Partner Success/ Enablement',
    id: '2',
    isSelected: false
  },
  {
    name: 'Partner Marketing',
    id: '3',
    isSelected: false
  },
  {
    name: 'Partner Ops/ System',
    id: '4',
    isSelected: false
  },
  {
    name: 'BD/Strategic Partnerships',
    id: '5',
    isSelected: false
  },
  {
    name: 'Other',
    id: '6',
    isSelected: false
  }
]

export const step15 = [
  {
    name: 'Enterprise',
    id: '1',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/images/onboarding/enterprise_active.png',
    iconInactivePath: '/images/onboarding/enterprise_inactive.png',
    apiValue: 'ENTERPRISE'
  },
  {
    name: "SMB's",
    id: '2',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/images/onboarding/smb_active.png',
    iconInactivePath: '/images/onboarding/smb_inactive.png',
    apiValue: 'SMBs'
  },
  {
    name: 'Small Companies',
    id: '3',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/images/onboarding/smallCompany_active.png',
    iconInactivePath: '/images/onboarding/smallCompany_inactive.png',
    apiValue: 'SMALL_COMPANIES'
  },
  {
    name: 'Startup',
    id: '4',
    isSelected: false,
    needToIcon: true,
    iconActivePath: '/images/onboarding/startup_active.png',
    iconInactivePath: '/images/onboarding/startup_inactive.png',
    apiValue: 'STARTUP'
  }
]

export const step16 = [
  {
    name: '1-10',
    id: '1',
    isSelected: false
  },
  {
    name: '11-50',
    id: '2',
    isSelected: false
  },
  {
    name: '51-100',
    id: '3',
    isSelected: false
  },
  {
    name: '101-1000',
    id: '4',
    isSelected: false
  },
  {
    name: '1000+',
    id: '5',
    isSelected: false
  }
]
