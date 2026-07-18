interface moduleType {
  monthly: {
    priceINR: number
    priceUSD: number
    moduleName: string
  }
  yearly: {
    priceINR: number
    priceUSD: number
    moduleName: string
  }
}

export interface ModuleItem {
  stripeID: string
  name: string
  module: moduleType
  features: string[]
}

export type ApiProduct = {
  id: number
  productId: string
  productName: string
  priceINR: number
  priceUSD: number
}

export const MODULES: ModuleItem[] = [
  {
    stripeID: 'partner-onboarding',
    name: 'Partner Onboarding',
    module: {
      monthly: {
        priceINR: 1499,
        priceUSD: 18,
        moduleName: 'PARTNER_ONBOARDING_MONTHLY'
      },
      yearly: {
        priceINR: 14990,
        priceUSD: 180,
        moduleName: 'PARTNER_ONBOARDING_YEARLY'
      }
    },
    features: [
      'Bring offline & online partners into single workspace',
      'Verification flows',
      'Partner profile builder',
      'Custom forms',
      'Access Control'
    ]
  },
  {
    stripeID: 'partner-management',
    name: 'Partner Management',
    module: {
      monthly: {
        priceINR: 2299,
        priceUSD: 28,
        moduleName: 'PARTNER_MANAGEMENT_MONTHLY'
      },
      yearly: {
        priceINR: 22990,
        priceUSD: 280,
        moduleName: 'PARTNER_MANAGEMENT_YEARLY'
      }
    },
    features: [
      'Roles, dashboards & performance governance.',
      'Partner scorecard',
      'Incentive rules',
      'Access logs',
      'Steering committee view'
    ]
  },
  {
    stripeID: 'deal-registration',
    name: 'Deal Registration',
    module: {
      monthly: {
        priceINR: 799,
        priceUSD: 10,
        moduleName: 'DEAL_REGISTRATION_MONTHLY'
      },
      yearly: {
        priceINR: 7990,
        priceUSD: 100,
        moduleName: 'DEAL_REGISTRATION_YEARLY'
      }
    },
    features: [
      'Let partners submit deals → auto-sync to CRM.',
      'Deal workflows',
      'CRM sync',
      'Review panel',
      'Fraud prevention'
    ]
  },
  {
    stripeID: 'partner-mapping',
    name: 'Partner Mapping',
    module: {
      monthly: {
        priceINR: 799,
        priceUSD: 10,
        moduleName: 'PARTNER_MAPPING_MONTHLY'
      },
      yearly: {
        priceINR: 7990,
        priceUSD: 100,
        moduleName: 'PARTNER_MAPPING_YEARLY'
      }
    },
    features: [
      'Reveal co-sell opportunities across partners.',
      'Account comparison',
      'Lookalike matching',
      'Opportunity scoring'
    ]
  },
  {
    stripeID: 'joint-gtm-board',
    name: 'Joint GTM Board',
    module: {
      monthly: {
        priceINR: 999,
        priceUSD: 12,
        moduleName: 'JOINT_GTM_BOARD_MONTHLY'
      },
      yearly: {
        priceINR: 9990,
        priceUSD: 120,
        moduleName: 'JOINT_GTM_BOARD_YEARLY'
      }
    },
    features: [
      'Shared Trello/Notion-style space for GTM launches.',
      'Shared GTM tasks',
      'Partner profile builder',
      'Visibility rules',
      'Recurring milestones'
    ]
  },
  {
    stripeID: 'partner-enablement',
    name: 'Partner Enablement',
    module: {
      monthly: {
        priceINR: 999,
        priceUSD: 12,
        moduleName: 'PARTNER_ENABLEMNT_MONTHLY'
      },
      yearly: {
        priceINR: 9990,
        priceUSD: 120,
        moduleName: 'PARTNER_ENABLEMNT_YEARLY'
      }
    },
    features: [
      'Motivate partners via structured rewards tracking',
      'Loyalty based programs for partners',
      'Gamification of partner experience'
    ]
  }
]
