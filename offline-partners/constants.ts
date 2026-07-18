export const OFFLINE_PARTNERS_TABS = [
  {
    label: 'All',
    value: 'ALL'
  },
  {
    label: 'Invited',
    value: 'INVITE_SENT'
  },
  {
    label: 'Uninvited',
    value: 'INVITE_NOT_SENT'
  },
  {
    label: 'Verified',
    value: 'VERIFIED'
  },
  {
    label: 'Onboarded',
    value: 'ONBOARDED'
  }
]

export const SEATS_TABS = [
  {
    label: 'Team members',

    value: 'TEAM_MEMBERS'
  },
  {
    label: 'Pending invites',

    value: 'PENDING_INVITES'
  }
]

export const SETTINGS_TABS = [
  {
    label: 'Company Details',
    value: 'COMPANY_DETAILS'
  },
  {
    label: 'IPP Details',
    value: 'IPP_DETAILS'
  },
  {
    label: 'Billing Details',
    value: 'BILLING_DETAILS'
  },
  {
    label: 'My Subscription',
    value: 'MY_SUBSCRIPTION'
  },
  {
    label: 'Timezone',
    value: 'TIMEZONE'
  }
]

export const OFFLINE_PARTNER_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  ONBOARDED: 'ONBOARDED',
  UNINVITED: 'UNINVITED',
  SENT: 'SENT'
}

export const OFFLINE_STATUS_BADGE_COMMON_CLASSNAME =
  // 'text-xs font-medium border-none py-2 px-4'
  'w-[80px] h-[23px] min-w-[80px] max-w-[100px] opacity-100 pt-2 pr-3 pb-2 pl-3 rounded-[14px] border border-solid border-[#7688A8] text-[#7688A8]'

export const OFFLINE_STATUS_BADGE_COMMON_CLASSNAME_BLUE =
  // 'text-xs font-medium border-none py-2 px-4'
  'w-[80px] h-[23px] min-w-[80px] max-w-[100px] opacity-100 pt-2 pr-3 pb-2 pl-3 rounded-[14px] border border-solid border-[#3E50F7] text-[#3E50F7]'

export const DUMMY_PARTNERS_DATA = [
  {
    id: 'dummy-1',
    href: '/offline-partners/partnership/dummy-1',
    rowDetails: [
      { id: 'partnerName', value: 'TechCorp Solutions' },
      { id: 'partnerStatus', value: 'VERIFIED' },
      { id: 'partnerEmail', value: 'contact@techcorp.com' },
      { id: 'partnerGroup', value: 'RELIABLE_PARTNER' },
      { id: 'partnerRemarks', value: 'Strong track record in deliveries' }
    ],
    isDummy: true
  },
  {
    id: 'dummy-2',
    href: '/offline-partners/partnership/dummy-2',
    rowDetails: [
      { id: 'partnerName', value: 'InnovateX Labs' },
      { id: 'partnerStatus', value: 'INVITE_SENT' },
      { id: 'partnerEmail', value: 'partnerships@innovatex.com' },
      { id: 'partnerGroup', value: 'STEADY_PARTNER' },
      { id: 'partnerRemarks', value: 'Pending contract negotiations' }
    ],
    isDummy: true
  },
  {
    id: 'dummy-3',
    href: '/offline-partners/partnership/dummy-3',
    rowDetails: [
      { id: 'partnerName', value: 'Global Dynamics' },
      { id: 'partnerStatus', value: 'UNINVITED' },
      { id: 'partnerEmail', value: 'hello@globaldynamics.com' },
      { id: 'partnerGroup', value: 'LOW_IMPACT_PARTNER' },
      { id: 'partnerRemarks', value: 'Requires further evaluation' }
    ],
    isDummy: true
  },
  {
    id: 'dummy-4',
    href: '/offline-partners/partnership/dummy-4',
    rowDetails: [
      { id: 'partnerName', value: 'NextGen Partners' },
      { id: 'partnerStatus', value: 'VERIFIED' },
      { id: 'partnerEmail', value: 'team@nextgenpartners.io' },
      { id: 'partnerGroup', value: 'RELIABLE_PARTNER' },
      { id: 'partnerRemarks', value: 'High compatibility score achieved' }
    ],
    isDummy: true
  },
  {
    id: 'dummy-5',
    href: '/offline-partners/partnership/dummy-5',
    rowDetails: [
      { id: 'partnerName', value: 'CloudScale Systems' },
      { id: 'partnerStatus', value: 'INVITE_NOT_SENT' },
      { id: 'partnerEmail', value: 'info@cloudscale.tech' },
      { id: 'partnerGroup', value: 'INACTIVE_PARTNER' },
      { id: 'partnerRemarks', value: 'Low engagement metrics' }
    ],
    isDummy: true
  }
]
