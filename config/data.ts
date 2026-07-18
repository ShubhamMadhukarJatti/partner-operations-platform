// Videos
import { StaticImageData } from 'next/image'
import introductingPartnerValve from '@/../public/images/resources/introducing-partner-valve.jpg'
import makingStartupSustainableP1 from '@/../public/images/resources/making-startup-sustainable-part-1.jpeg'
import makingStartupSustainableP2 from '@/../public/images/resources/making-startup-sustainable-part-2.jpeg'
import makingStartupSustainableP3 from '@/../public/images/resources/making-startup-sustainable-part-3.jpeg'
import makingStartupSustainableP4 from '@/../public/images/resources/making-startup-sustainable-part-4.jpeg'

import Animesh from '../../public/images/team/animesh.jpg'
import Ashish from '../../public/images/team/ashish-sharma.jpg'
import Kingshuk from '../../public/images/team/kingshuk.png'
import Rishi from '../../public/images/team/rishi-kasyap.jpg'
import Rohit from '../../public/images/team/rohit-sharma.jpg'
import Sahil from '../../public/images/team/sahil-sharma.jpg'
import Subhash from '../../public/images/team/subhash.png'
import Vatsal from '../../public/images/team/vatsal.jpg'
import Vikas from '../../public/images/team/vikas-bajaj.jpg'

export const backgroundColorMappingPartnership: any = {
  A: 'bg-[#B1E5FC]',
  B: 'bg-[#CABDFF]',
  C: 'bg-[#FFBC99]'
}

export const configSectors = [
  {
    id: 45,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'EDUCATION',
    value: 'A',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 46,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'MEDICAL',
    value: 'B',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 47,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'TECH',
    value: 'C',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 48,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'AGRICULTURE',
    value: 'D',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 49,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'RESTAURANTS',
    value: 'E',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 50,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'SOFTWARE',
    value: 'F',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 51,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'MARKETING',
    value: 'G',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 52,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'BUSINESS',
    value: 'H',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 53,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'FINANCE',
    value: 'I',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 54,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'HEALTHTECH',
    value: 'J',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 55,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'MANUFACTURING',
    value: 'K',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 56,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'PROPERTY',
    value: 'L',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 57,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'MEDIA',
    value: 'M',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 58,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'FASHION ',
    value: 'N',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 59,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'TRANSPORTATION',
    value: 'O',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 60,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'FOOD',
    value: 'P',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 61,
    creationTimestamp: '2023-09-11T23:30:27.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:27.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'ENTERTAINMENT',
    value: 'Q',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 62,
    creationTimestamp: '2023-09-11T23:30:27.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:27.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'OTHERS',
    value: 'R',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  }
]

export const configPartnership = [
  {
    id: 121,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'A',
    value: 'STRATEGIC',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 122,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'B',
    value: 'TECHNOLOGY',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 123,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'C',
    value: 'CO-MARKETING',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 124,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'D',
    value: 'COMMUNITY',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 125,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'E',
    value: 'BRAND_LICENSING',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 126,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'F',
    value: 'SALES',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 127,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'G',
    value: 'SOCIAL',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  }
]

export const configSubSector = [
  {
    id: 169,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'A',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 170,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'B',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 171,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'C',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 172,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'D',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 173,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'E',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 174,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'F',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 175,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'G',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 176,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'H',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 177,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'I',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 178,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'J',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 179,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'K',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 180,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'L',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 181,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'M',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 182,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'N',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 183,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'O',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 184,
    creationTimestamp: '2024-06-06T14:40:21.938+00:00',
    lastUpdatedTimestamp: '2024-06-06T14:40:21.938+00:00',
    type: 'PREFERRED_SUB_SECTORS',
    key: 'TECH',
    value: 'P',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  }
]

export const team_members = [
  {
    name: 'Rohit Sharma',
    role: 'Chief Executive Officer',
    linkedIn: 'https://www.linkedin.com/in/rohit-sharma-97262128b',
    mail: 'ceo@sharkdom.com',
    image: Rohit
  },
  {
    name: 'Sahil Sharma',
    role: 'Chief Financial Officer',
    linkedIn: 'https://www.linkedin.com/in/sahil-sharma-2b342327b/',
    image: Sahil
  },
  {
    name: 'Rishi Kasyap',
    role: 'Chief Product Officer',
    linkedIn: 'https://www.linkedin.com/in/rishikasyap',
    mail: 'rishi@sharkdom.com',
    image: Rishi
  },
  {
    name: 'Ashish Sharma',
    role: 'Chief Operations Officer',
    linkedIn: 'https://www.linkedin.com/in/ashish-sharma-013475114',
    image: Ashish
  },
  {
    name: 'Vatsal Baranwal',
    role: 'Growth Partnerhsips Manager',
    linkedIn: 'https://www.linkedin.com/in/vatsalbaran/',
    mail: 'vatsal.baranawal@sharkdom.com',
    image: Vatsal
  },
  {
    name: 'Vikas Bajaj',
    role: 'Chief Design Officer',
    linkedIn: 'https://www.linkedin.com/in/vikas-bajaj-4476261b1',
    image: Vikas
  },
  {
    name: 'Animesh Gaur',
    role: 'Head of Design',
    linkedIn: 'https://www.linkedin.com/in/anniee110/',
    image: Animesh
  },
  {
    name: 'Kingshuk Banerjee',
    role: 'Brand Strategist',
    linkedIn: 'https://www.linkedin.com/in/kingshuk-banerjee-/',
    image: Kingshuk
  },
  {
    name: 'Subhash Chandra Shukla',
    role: 'Flutter Mobile Operations',
    linkedIn: 'https://www.linkedin.com/in/subhashcs',
    image: Subhash
  }
]

export type PricingPlanType = {
  title:
    | 'Basic'
    | 'Standard'
    | 'Premium'
    | 'Elite'
    | 'STANDARD'
    | 'PREMIUM'
    | 'ELITE'
    | 'FREE'
  price: number
  description: string
  longDescription: string
  highlights: string[]
  extraFeatures: string[]
  featured: boolean
  features: string[]
  notIncluded?: string[]
  cta: string
  disabled?: boolean
  status: 'Active' | 'Inactive' | 'Contact'
}

export const pricing_plans: PricingPlanType[] = [
  {
    title: 'FREE',
    price: 0,
    featured: false,
    description: 'Best for early traction startups',
    longDescription: '',
    features: [
      'Upto 1 partnerships',
      'Upto 1 Smart AI proposals',
      'Personalized Recommendations'
    ],
    highlights: [],
    extraFeatures: [],
    cta: 'Free Plan',
    status: 'Active'
  },
  {
    title: 'STANDARD',
    price: 649,
    description: 'Best for early stage startups',
    longDescription:
      'for mid stage companies with one or more member taking care of partnership with expertise',
    featured: false,
    features: [
      'Upto 2 partnerships',
      'Upto 2 Smart AI proposals',
      'Personalized Recommendations'
    ],
    highlights: [
      '2 AI proposal generator',
      'Personalized recommendation',
      '24x email support'
    ],
    extraFeatures: ['-', '-', '-', '-', '-'],
    //notIncluded: ['Priority partnerships', 'Personalised recommendations'],
    cta: 'Buy standard plan',
    status: 'Active'
  },

  {
    title: 'PREMIUM',
    price: 2499,
    description: 'Best for scaling stage startups in initial phase',
    longDescription:
      'for early and mid stage companies with no or more then 1 member taking care of partnership',
    featured: true,
    features: [
      'Upto 5 partnerships',
      'Upto 5 Smart AI proposals',
      'Partnership navigator bot (Limited access)',
      'Partner valve room',
      'Customized reports',
      'Book premium meetings with partners',
      'Premium resources'
    ],
    highlights: [
      '5 AI proposal generator',
      'Personalized recommendation',
      'Quick 24x support'
    ],
    extraFeatures: [
      'Unrestricted access to Partner Valve Room',
      'Premium meet scheduling tools with your partner',
      'Partnership navigator bot(voice chat)',
      'Integration portal tools access',
      '-'
    ],
    //notIncluded: ['Dedicated Alliance Manager'],
    cta: 'Buy premium plan',
    status: 'Active'
  },
  {
    title: 'ELITE',
    price: 4799,
    description: 'Best for scaling stage startups.',
    longDescription:
      'for early and mid stage companies with no or more then 1 member taking care of partnership',
    featured: false,
    features: [
      'Unlimited partnerships',
      'Upto 20 Smart AI proposals',
      'Partnership navigator bot',
      'Quarterly check-ins',
      'Access to compatible partner network'
    ],
    highlights: [
      '20 AI proposal generator',
      'Personalized recommendation',
      'Quick 24x support'
    ],
    extraFeatures: [
      'Unrestricted access to Partner Valve Room',
      'Premium meet scheduling tools with your partner',
      'Partnership navigator bot(voice chat)',
      'All Integration portal tools access',
      'Quaterly Check-ins'
    ],
    cta: 'Buy elite plan',
    status: 'Active'
  }
]

export const CORE_PRM_FEATURES = {
  ACTIVE_PARTNERS: 'Active Partners',
  CONNECTED_SEARCH: 'Connected Search',
  OFFLINE_SEARCH: 'Offline Search',
  PLAYGROUND_PROPOSAL: 'Playground Proposal',
  REPORTING: 'Reporting',
  AI_COPILOT: 'AI Copilot',
  PARTNER_ALERT: 'Partner Alert',
  AUTOMATED_PROPOSALS: 'Automated Proposals',
  SEATS: 'Seats',
  CUSTOMER_PERSONA: 'Customer Persona',
  CUSTOMER_SUPPORT: 'Customer Support',
  REFERRAL_PROGRAM: 'Referral Program',
  PARTNER_ENABLEMENT: 'Partner Enablement',
  PARTNER_TIMELINE: 'Partner Timeline',
  DISCOVERABLE: 'Discoverable'
}

export const CORE_PRM_FEATURES_LIST = [
  CORE_PRM_FEATURES.ACTIVE_PARTNERS,
  CORE_PRM_FEATURES.CONNECTED_SEARCH,
  CORE_PRM_FEATURES.OFFLINE_SEARCH,
  CORE_PRM_FEATURES.PLAYGROUND_PROPOSAL,
  CORE_PRM_FEATURES.REPORTING,
  CORE_PRM_FEATURES.AI_COPILOT,
  CORE_PRM_FEATURES.PARTNER_ALERT,
  CORE_PRM_FEATURES.AUTOMATED_PROPOSALS,
  CORE_PRM_FEATURES.SEATS,
  CORE_PRM_FEATURES.CUSTOMER_PERSONA,
  CORE_PRM_FEATURES.CUSTOMER_SUPPORT,
  CORE_PRM_FEATURES.REFERRAL_PROGRAM,
  CORE_PRM_FEATURES.PARTNER_ENABLEMENT,
  CORE_PRM_FEATURES.PARTNER_TIMELINE,
  CORE_PRM_FEATURES.DISCOVERABLE
]

export const PLAN_TYPES = {
  FREE: 'Free',
  STARTUP: 'Standard',
  MIDSTAGE_COMAPNIES: 'Premium',
  ENTERPRICES: 'Elite'
}

export const pricingData = [
  {
    plan: PLAN_TYPES.FREE,
    price: '$0',
    priceInRupee: '0',
    priceInDollar: '0',
    features: {
      activePartners: 4,
      connectedSearch: false,
      offlinePartners: 5,
      playgroundProposal: 3,
      reporting: false,
      aiCopilot: false,
      partnerMarketMaker: false,
      partnerAlert: false,
      automatedProposals: true,
      seats: 1,
      customerPersona: 2,
      customerSupport: false,
      referralProgram: 4,
      partnerEnablement: false,
      partnerTimeline: false,
      discoverable: false
    }
  },
  {
    plan: PLAN_TYPES.STARTUP,
    price: '$7.99/team',
    priceInRupee: '849',
    priceInDollar: '20',
    features: {
      activePartners: 4,
      connectedSearch: true,
      offlinePartners: 5,
      playgroundProposal: 5,
      reporting: false,
      aiCopilot: true,
      partnerMarketMaker: false,
      partnerAlert: true,
      automatedProposals: true,
      seats: 1,
      customerPersona: 2,
      customerSupport: '24×7',
      referralProgram: 4,
      partnerEnablement: true,
      partnerTimeline: true,
      discoverable: true
    }
  },
  {
    plan: PLAN_TYPES.MIDSTAGE_COMAPNIES,
    price: '$19.99/team',
    priceInRupee: '1649',
    priceInDollar: '32',
    features: {
      activePartners: 10,
      connectedSearch: true,
      offlinePartners: 10,
      playgroundProposal: 9,
      reporting: true,
      aiCopilot: true,
      partnerMarketMaker: false,
      partnerAlert: true,
      automatedProposals: true,
      seats: 1,
      customerPersona: 4,
      customerSupport: '24×7',
      referralProgram: 10,
      partnerEnablement: true,
      partnerTimeline: true,
      discoverable: true
    }
  },
  {
    plan: PLAN_TYPES.ENTERPRICES,
    price: '$49.99/team',
    priceInRupee: '4599',
    priceInDollar: '75',
    features: {
      activePartners: 'Unlimited',
      connectedSearch: true,
      offlinePartners: 50,
      playgroundProposal: 'Unlimited',
      reporting: true,
      aiCopilot: true,
      partnerMarketMaker: true,
      partnerAlert: true,
      automatedProposals: true,
      seats: 1,
      customerPersona: 6,
      customerSupport: '24×7',
      referralProgram: 50,
      partnerEnablement: true,
      partnerTimeline: true,
      discoverable: true
    }
  }
]

export const integrationsData = [
  {
    plan: PLAN_TYPES.FREE,
    price: '$0',
    priceInRupee: '0',
    priceInDollar: '0',
    features: {
      nativeIntegrations: 4,
      docusign: false,
      mailchimp: false,
      googleMeet: false,
      zohoCRM: true,
      pandaDoc: false,
      googleSheet: true,
      calendarSync: true,
      meetingReminders: true,
      aiLeadSummaries: false,
      mobileApp: false,
      customFields: false,
      customActivityTypes: 2
    }
  },
  {
    plan: PLAN_TYPES.STARTUP,
    price: '$7.99/team',
    priceInRupee: '849',
    priceInDollar: '20',
    features: {
      nativeIntegrations: 7,
      docusign: true,
      mailchimp: true,
      googleMeet: true,
      zohoCRM: true,
      pandaDoc: true,
      googleSheet: true,
      calendarSync: true,
      meetingReminders: true,
      aiLeadSummaries: false,
      mobileApp: true,
      customFields: true,
      customActivityTypes: 10
    }
  },
  {
    plan: PLAN_TYPES.MIDSTAGE_COMAPNIES,
    price: '$19.99/team',
    priceInRupee: '1649',
    priceInDollar: '32',
    features: {
      nativeIntegrations: '9+',
      docusign: true,
      mailchimp: true,
      googleMeet: true,
      zohoCRM: true,
      pandaDoc: true,
      googleSheet: true,
      calendarSync: true,
      meetingReminders: true,
      aiLeadSummaries: true,
      mobileApp: true,
      customFields: true,
      customActivityTypes: 200
    }
  },
  {
    plan: PLAN_TYPES.ENTERPRICES,
    price: '$49.99/team',
    priceInRupee: '4599',
    priceInDollar: '75',
    features: {
      nativeIntegrations: 'Unlimited',
      docusign: true,
      mailchimp: true,
      googleMeet: true,
      zohoCRM: true,
      pandaDoc: true,
      googleSheet: true,
      calendarSync: true,
      meetingReminders: true,
      aiLeadSummaries: true,
      mobileApp: true,
      customFields: true,
      customActivityTypes: 200
    }
  }
]

export type VideoProps = {
  image: StaticImageData
  title: string
  description: string
  slug: string
  embedId: string
  ogImage: string
  featured?: boolean
}

export const video_posts: VideoProps[] = [
  {
    image: makingStartupSustainableP1,
    title: 'Making Startup Sustainable - Part 1',
    description:
      'This is video powered by Sharkdom addressing the young age startup the art of sustaining as with patience the vision of a startup is cleared and not just addressing the issue but explaining what the solution is what is covered in this 3 part video covered by Mr. Kartik Kataria, CMO of SharkDom.',
    slug: 'making-startup-sustainable-part-1',
    embedId: 'BU52FuU-8SM',
    ogImage: '/images/resources/making-startup-sustainable-part-1.jpeg'
  },
  {
    image: makingStartupSustainableP2,
    title: 'Making Startup Sustainable - Part 2',
    description:
      'This is video powered by Sharkdom addressing the startups the need of partnering for mutual benefits covered by Mr. Kartik Kataria, CMO of SharkDom where our platform acts as Facilitator, Mediator and Negotiator to make sure both abide by agreement in less awakward way then traditional partnerships are.',
    slug: 'making-startup-sustainable-part-2',
    embedId: 'I0wJmUIbMhA',
    ogImage: '/images/resources/making-startup-sustainable-part-2.jpeg'
  },
  {
    image: makingStartupSustainableP3,
    title: 'Making Startup Sustainable - Part 3',
    description:
      'Our series is almost completed regarding setbacks and need of partnerships especially for early stage startups which is direly consider as stage where partnership are not taken seriously due to unfamiliar brand name but proving this wrong is covered in these 4 part series.',
    slug: 'making-startup-sustainable-part-3',
    embedId: 'O3ETW0J5KqA',
    ogImage: '/images/resources/making-startup-sustainable-part-3.jpeg'
  },
  {
    image: makingStartupSustainableP4,
    title: 'Making Startup Sustainable - Part 4',
    description:
      'Our series is almost completed regarding setbacks and need of partnerships especially for early stage startups which is direly consider as stage where partnership are not taken seriously due to unfamiliar brand name but proving this wrong is covered in these 4 part series.',
    slug: 'making-startup-sustainable-part-4',
    embedId: 'Co2ouuFGQt4',
    ogImage: '/images/resources/making-startup-sustainable-part-4.jpeg'
  },
  {
    image: introductingPartnerValve,
    title: 'Introducing Partner Valve',
    description:
      'Partner Valve helps you manage multiple Partner Channels all at one place with dedicated dashboard only for your startup',
    slug: 'introducing-partner-valve',
    embedId: 'IuHR_p1Nx_c ',
    ogImage: '/images/resources/introducing-partner-valve.jpg',
    featured: true
  }
]

export type MentorshipVideoProps = {
  image: StaticImageData
  title: string
  slug: string
  featured?: boolean
  videoUrl: string
}

export const mentorshipVideos: any[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    videos: [
      {
        id: 1,
        title: 'What does this section covers?',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART01_tuts.mp4',
        progressPoint: 2,
        requiredProgress: 0
      },
      {
        id: 2,
        title: 'Whom is this for?',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART02_tuts.mp4',
        progressPoint: 3,
        requiredProgress: 2
      },
      {
        id: 3,
        title: 'Why Partnerships?',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART01_tuts.mp4',
        progressPoint: 2,
        requiredProgress: 5
      },
      {
        id: 4,
        title: 'Challenges?',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART01_tuts.mp4',
        progressPoint: 3,
        requiredProgress: 7
      }
    ]
  },
  {
    id: 'Proposals',
    title: 'Proposals',
    videos: [
      {
        id: 5,
        title: 'How it works?',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART03_tuts.mp4',
        progressPoint: 5,
        requiredProgress: 10
      },
      {
        id: 6,
        title: 'Some Critical Facts',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART04_tuts.mp4',
        progressPoint: 5,
        requiredProgress: 15
      },
      {
        id: 7,
        title: 'Practices to avoid',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART06_tuts.mp4',
        progressPoint: 5,
        requiredProgress: 20
      }
    ]
  },
  {
    id: 'mou',
    title: 'MOUs',
    videos: [
      {
        id: 8,
        title: 'Types',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART03_tuts.mp4',
        progressPoint: 5,
        requiredProgress: 25
      },
      {
        id: 9,
        title: 'Whose sign’s make MOU enforceable',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART04_tuts.mp4',
        progressPoint: 10,
        requiredProgress: 30
      }
    ]
  },

  {
    id: 'pros',
    title: 'Pros of Partnerships',
    videos: [
      {
        id: 10,
        title: 'Introduction',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART07_tuts.mp4',
        progressPoint: 10,
        requiredProgress: 40
      }
    ]
  },

  {
    id: 'cons',
    title: 'Cons of Partnerships',
    videos: [
      {
        id: 11,
        title: 'Introduction',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART08_tuts.mp4',
        progressPoint: 10,
        requiredProgress: 50
      }
    ]
  },
  {
    id: 'myths',
    title: 'Some Myths',
    videos: [
      {
        id: 12,
        title: 'Right Time to Partner',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART09_tuts.mp4',
        progressPoint: 15,
        requiredProgress: 60
      },
      {
        id: 13,
        title: 'Harships',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART02.mp4',
        progressPoint: 15,
        requiredProgress: 75
      }
    ]
  },

  {
    id: 'case',
    title: 'Case Studies',
    videos: [
      {
        id: 14,
        title: 'Dell x Microsoft',
        url: 'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/sharanagati/uncompressed/PART03.mp4',
        progressPoint: 10,
        requiredProgress: 90
      }
    ]
  }
]

export const CORE_FEATURES_LIST = [
  { label: 'Active Partners', key: 'activePartners' },
  {
    label: 'Connected Search',
    key: 'connectedSearch',
    isBool: true
  },
  { label: 'Offline Partners', key: 'offlinePartners' },
  { label: 'Playground Proposal', key: 'playgroundProposal' },
  { label: 'Reporting', key: 'reporting', isBool: true },
  { label: 'AI Copilot', key: 'aiCopilot', isBool: true },
  {
    label: 'Partner Market Maker(PMM)',
    key: 'partnerMarketMaker',
    isBool: true
  },
  {
    label: 'Automated Proposals',
    key: 'automatedProposals',
    isBool: true
  },
  { label: 'Seats', key: 'seats' },
  { label: 'Customer Persona', key: 'customerPersona' },
  { label: 'Customer Support', key: 'customerSupport' },
  { label: 'Referral Program', key: 'referralProgram' },
  {
    label: 'Partner Enablement',
    key: 'partnerEnablement',
    isBool: true
  },
  {
    label: 'Partner Timeline',
    key: 'partnerTimeline',
    isBool: true
  },
  { label: 'Discoverable', key: 'discoverable', isBool: true }
]

export const INTEGRATIONS_FEATURES_LIST = [
  {
    label: '8+ Native Integrations',
    key: 'nativeIntegrations'
  },
  { label: 'Docusign', key: 'docusign', isBool: true },
  { label: 'Mailchimp', key: 'mailchimp', isBool: true },
  { label: 'Google Meet', key: 'googleMeet', isBool: true },
  { label: 'Zoho CRM', key: 'zohoCRM', isBool: true },
  { label: 'Panda Doc', key: 'pandaDoc', isBool: true },
  { label: 'Google Sheet', key: 'googleSheet', isBool: true },
  {
    label: 'Calendar Sync',
    key: 'calendarSync',
    isBool: true
  },
  {
    label: 'Meeting Reminders',
    key: 'meetingReminders',
    isBool: true
  },
  {
    label: 'AI Lead Summaries',
    key: 'aiLeadSummaries',
    isBool: true
  },
  { label: 'Mobile App', key: 'mobileApp', isBool: true },
  {
    label: 'Custom Fields',
    key: 'customFields',
    isBool: true
  },
  {
    label: 'Custom Activity Types',
    key: 'customActivityTypes'
  }
]
