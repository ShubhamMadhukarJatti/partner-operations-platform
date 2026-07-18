import {
  BookOpen,
  GraduationCap,
  LayoutGrid,
  MailOpen,
  Send,
  Tag,
  UserRoundCog,
  Users2Icon,
  UsersIcon
} from 'lucide-react'

import { DiscoverIcon, LayoutGridIcon } from '@/components/icons/icons'
import {
  AiIcon,
  DealPipelineIcon,
  DweepIcon,
  integrationProgramIcon,
  integrationsIcon,
  NewLinkSharingIcon,
  PartnerMappingIcon,
  partnervalveIcon,
  ProgramAnalyticsFilledIcon,
  ProgramAnalyticsIcon,
  ResellIcon,
  TierFilledIcon,
  TierIcon
} from '@/app/(app)/(dashboard-pages)/_components/layout/sidebar-icons'
import type { IconComponent } from '@/app/(app)/(dashboard-pages)/_components/layout/sidebar-item'

export type DashboardMenuItem = {
  name: string
  icon: IconComponent
  filledIcon: IconComponent
  href?: string
  notificationCount?: number
  isLocked?: boolean
  tooltip?: string
  matchPattern?: string
  excludePaths?: string[]
}

export type DashboardMenuSection = {
  title: string
  id: string
  href?: string
  icon: IconComponent
  filledIcon: IconComponent
  tooltip?: string
  items?: DashboardMenuItem[]
}

/** Unique hrefs from main dashboard nav sections (top-level links + nested items). */
export function collectDashboardMenuHrefs(
  sections: DashboardMenuSection[]
): string[] {
  const hrefs: string[] = []
  for (const section of sections) {
    if (section.href) hrefs.push(section.href)
    section.items?.forEach((item) => {
      if (item.href) hrefs.push(item.href)
    })
  }
  return [...new Set(hrefs)]
}

function dweepSection(isDev: boolean): DashboardMenuSection[] {
  return [
    {
      id: 'dweep-ai',
      title: 'Dweep Agentic Scouting',
      icon: DweepIcon,
      filledIcon: DweepIcon,
      href: '/dweep-ai',
      tooltip: 'Dweep Agentic Scouting'
    }
  ]
}

/** Current combined navigation (default when API has no role flags). */
export function buildLegacyDashboardMenu(
  isDev: boolean
): DashboardMenuSection[] {
  return [
    {
      id: 'getting-started',
      title: 'Quick Start',
      icon: DiscoverIcon,
      filledIcon: DiscoverIcon,
      href: '/getting-started',
      tooltip:
        'Promote your existing partner program as secondary onboarding workflow'
    },
    {
      id: 'partners',
      title: 'Partners',
      icon: UsersIcon,
      filledIcon: UsersIcon,
      tooltip: 'Onboarding your ideal partners using minimal workflow',
      items: [
        {
          name: 'Discover',
          icon: DiscoverIcon,
          filledIcon: DiscoverIcon,
          href: '/explore',
          tooltip:
            'Search for companies which are open for partnerships using our smart filtering'
        },
        {
          name: 'My Partners',
          icon: Users2Icon,
          filledIcon: Users2Icon,
          href: '/dashboard',
          tooltip:
            'View your partnership enquiries and keep track of your partner lifecycle'
        },
        {
          name: 'External Partners',
          icon: UserRoundCog,
          filledIcon: UserRoundCog,
          href: '/offline-partners',
          tooltip:
            'Import your existing partners who may or may not be on sharkdom'
        }
      ]
    },
    {
      id: 'partner-program',
      title: 'Partner Program',
      icon: LayoutGridIcon,
      filledIcon: LayoutGridIcon,
      tooltip: 'Manage your partner programs',
      items: [
        {
          name: 'Create Program',
          icon: integrationsIcon,
          filledIcon: integrationsIcon,
          href: '/home/partner-program',
          tooltip: 'Create and setup a new partner program'
        },
        {
          name: 'Partner Training',
          icon: GraduationCap,
          filledIcon: GraduationCap,
          href: '/partner-training-setup',
          tooltip: 'Setup training for partners'
        },
        {
          name: 'Program Analytics',
          icon: ProgramAnalyticsIcon,
          filledIcon: ProgramAnalyticsFilledIcon,
          href: '/home/partner-program-stats',
          tooltip: 'Keep track of submissions via your promoted partner program'
        },
        {
          name: 'Tier',
          icon: TierIcon,
          filledIcon: TierFilledIcon,
          href: '/tiers'
        }
      ]
    },
    {
      id: 'deals',
      title: 'Deals',
      icon: Tag,
      filledIcon: Tag,
      tooltip:
        'Register and keep track of your deal lifecycle with your partners',
      items: [
        {
          name: 'Cosell',
          icon: DealPipelineIcon,
          filledIcon: DealPipelineIcon,
          href: '/deal-pipeline/start',
          tooltip: 'Co-selling deal registration workflow',
          matchPattern: '/deal-pipeline',
          excludePaths: ['/deal-pipeline/resell']
        },
        {
          name: 'Resell',
          icon: ResellIcon,
          filledIcon: ResellIcon,
          href: '/deal-pipeline/resell',
          tooltip: 'Reseller deal registration workflow'
        },
        {
          name: 'Partner Mapping',
          icon: PartnerMappingIcon,
          filledIcon: PartnerMappingIcon,
          href: '/partner-mapping/start',
          tooltip:
            'View and take actions on the overlaps with your active partners',
          matchPattern: '/partner-mapping'
        },
        {
          name: 'Partner Access',
          icon: integrationProgramIcon,
          filledIcon: integrationProgramIcon,
          href: '/api-listing',
          tooltip:
            "Add API's you are willing to offer to your partners for faster partner approvals"
        }
      ]
    },
    {
      id: 'outreach',
      title: 'Outreach',
      icon: Send,
      filledIcon: Send,
      items: [
        {
          name: 'Outreach Email',
          icon: MailOpen,
          filledIcon: MailOpen,
          href: '/outreach-email',
          tooltip: 'Connect with email..'
        },
        {
          name: 'Partner Space',
          icon: partnervalveIcon,
          filledIcon: partnervalveIcon,
          href: '/partner-space',
          tooltip: 'Communicate with your partner teams for smoother activities'
        },
        {
          name: 'Link Sharing',
          icon: NewLinkSharingIcon,
          filledIcon: NewLinkSharingIcon,
          href: '/partner-programs',
          tooltip: 'share link for commission tracking'
        }
      ]
    }
  ]
}

export function buildVendorDashboardMenu(
  isDev: boolean
): DashboardMenuSection[] {
  return [
    {
      id: 'getting-started',
      title: 'Quick Start',
      icon: DiscoverIcon,
      filledIcon: DiscoverIcon,
      href: '/getting-started',
      tooltip:
        'Promote your existing partner program as secondary onboarding workflow'
    },
    ...dweepSection(isDev),
    {
      id: 'partners',
      title: 'Partner Onboarding',
      icon: UsersIcon,
      filledIcon: UsersIcon,
      tooltip: 'Onboarding your ideal partners using minimal workflow',
      items: [
        {
          name: 'Discover',
          icon: DiscoverIcon,
          filledIcon: DiscoverIcon,
          href: '/explore',
          tooltip:
            'Search for companies which are open for partnerships using our smart filtering'
        },
        {
          name: 'My Partners',
          icon: Users2Icon,
          filledIcon: Users2Icon,
          href: '/dashboard',
          tooltip:
            'View your partnership enquiries and keep track of your partner lifecycle'
        },
        {
          name: 'External Partners',
          icon: UserRoundCog,
          filledIcon: UserRoundCog,
          href: '/offline-partners',
          tooltip:
            'Import your existing partners who may or may not be on sharkdom'
        }
      ]
    },
    {
      id: 'partner-program',
      title: 'Partner Program',
      icon: LayoutGridIcon,
      filledIcon: LayoutGridIcon,
      tooltip: 'Manage your partner programs',
      items: [
        {
          name: 'Create Program',
          icon: integrationsIcon,
          filledIcon: integrationsIcon,
          href: '/home/partner-program',
          tooltip: 'Create and setup a new partner program'
        },
        {
          name: 'Program Analytics',
          icon: ProgramAnalyticsIcon,
          filledIcon: ProgramAnalyticsFilledIcon,
          href: '/home/partner-program-stats',
          tooltip: 'Keep track of submissions via your promoted partner program'
        },
        {
          name: 'Tiers',
          icon: TierIcon,
          filledIcon: TierFilledIcon,
          href: '/tiers'
        }
      ]
    },
    {
      id: 'partner-enablement',
      title: 'Partner Enablement',
      icon: GraduationCap,
      filledIcon: GraduationCap,
      tooltip: 'Training and enablement',
      items: [
        {
          name: 'Partner Training',
          icon: GraduationCap,
          filledIcon: GraduationCap,
          href: '/partner-training-setup',
          tooltip: 'Setup training for partners'
        }
      ]
    },
    {
      id: 'deals',
      title: 'Deals',
      icon: Tag,
      filledIcon: Tag,
      tooltip:
        'Register and keep track of your deal lifecycle with your partners',
      items: [
        {
          name: 'Cosell',
          icon: DealPipelineIcon,
          filledIcon: DealPipelineIcon,
          href: '/deal-pipeline/start',
          tooltip: 'Co-selling deal registration workflow',
          matchPattern: '/deal-pipeline',
          excludePaths: ['/deal-pipeline/resell']
        },
        {
          name: 'Resell',
          icon: ResellIcon,
          filledIcon: ResellIcon,
          href: '/deal-pipeline/resell',
          tooltip: 'Reseller deal registration workflow'
        },
        {
          name: 'Partner Mapping',
          icon: PartnerMappingIcon,
          filledIcon: PartnerMappingIcon,
          href: '/partner-mapping/start',
          tooltip:
            'View and take actions on the overlaps with your active partners',
          matchPattern: '/partner-mapping'
        },
        {
          name: 'Partner Connect',
          icon: integrationProgramIcon,
          filledIcon: integrationProgramIcon,
          href: '/api-listing',
          tooltip:
            "Add API's you are willing to offer to your partners for faster partner approvals"
        }
      ]
    },
    {
      id: 'outreach',
      title: 'Outreach',
      icon: Send,
      filledIcon: Send,
      items: [
        {
          name: 'Outreach Email',
          icon: MailOpen,
          filledIcon: MailOpen,
          href: '/outreach-email',
          tooltip: 'Connect with email..'
        },
        {
          name: 'Partner Space',
          icon: partnervalveIcon,
          filledIcon: partnervalveIcon,
          href: '/partner-space',
          tooltip: 'Communicate with your partner teams for smoother activities'
        },
        {
          name: 'Link Sharing',
          icon: NewLinkSharingIcon,
          filledIcon: NewLinkSharingIcon,
          href: '/partner-programs',
          tooltip: 'share link for commission tracking'
        }
      ]
    }
  ]
}

export function buildPartnerDashboardMenu(
  isDev: boolean
): DashboardMenuSection[] {
  return [
    {
      id: 'getting-started',
      title: 'Quick Start',
      icon: DiscoverIcon,
      filledIcon: DiscoverIcon,
      href: '/getting-started',
      tooltip:
        'Promote your existing partner program as secondary onboarding workflow'
    },
    ...dweepSection(isDev),
    {
      id: 'partners',
      title: 'Partner Onboarding',
      icon: UsersIcon,
      filledIcon: UsersIcon,
      tooltip: 'Onboarding your ideal partners using minimal workflow',
      items: [
        {
          name: 'Discover',
          icon: DiscoverIcon,
          filledIcon: DiscoverIcon,
          href: '/explore',
          tooltip:
            'Search for companies which are open for partnerships using our smart filtering'
        },
        {
          name: 'My Partners',
          icon: Users2Icon,
          filledIcon: Users2Icon,
          href: '/dashboard',
          tooltip:
            'View your partnership enquiries and keep track of your partner lifecycle'
        },
        {
          name: 'External Partners',
          icon: UserRoundCog,
          filledIcon: UserRoundCog,
          href: '/offline-partners',
          tooltip:
            'Import your existing partners who may or may not be on sharkdom'
        }
      ]
    },
    {
      id: 'partner-program',
      title: 'Partner Program',
      icon: LayoutGridIcon,
      filledIcon: LayoutGridIcon,
      tooltip: 'Manage your partner programs',
      items: [
        {
          name: 'Program Analytics',
          icon: ProgramAnalyticsIcon,
          filledIcon: ProgramAnalyticsFilledIcon,
          href: '/home/partner-program-stats',
          tooltip: 'Keep track of submissions via your promoted partner program'
        }
      ]
    },
    {
      id: 'partner-enablement',
      title: 'Partner Enablement',
      icon: GraduationCap,
      filledIcon: GraduationCap,
      tooltip: 'Your learning',
      items: [
        {
          name: 'My Courses',
          icon: BookOpen,
          filledIcon: BookOpen,
          href: '/partner-training',
          tooltip: 'View and continue your assigned partner courses'
        }
      ]
    },
    {
      id: 'deals',
      title: 'Deals',
      icon: Tag,
      filledIcon: Tag,
      tooltip:
        'Register and keep track of your deal lifecycle with your partners',
      items: [
        {
          name: 'Cosell',
          icon: DealPipelineIcon,
          filledIcon: DealPipelineIcon,
          href: '/deal-pipeline/start',
          tooltip: 'Co-selling deal registration workflow',
          matchPattern: '/deal-pipeline',
          excludePaths: ['/deal-pipeline/resell']
        },
        {
          name: 'Resell',
          icon: ResellIcon,
          filledIcon: ResellIcon,
          href: '/deal-pipeline/resell',
          tooltip: 'Reseller deal registration workflow'
        },
        {
          name: 'Partner Mapping',
          icon: PartnerMappingIcon,
          filledIcon: PartnerMappingIcon,
          href: '/partner-mapping/start',
          tooltip:
            'View and take actions on the overlaps with your active partners',
          matchPattern: '/partner-mapping'
        }
      ]
    },
    {
      id: 'outreach',
      title: 'Outreach',
      icon: Send,
      filledIcon: Send,
      items: [
        {
          name: 'Outreach Email',
          icon: MailOpen,
          filledIcon: MailOpen,
          href: '/outreach-email',
          tooltip: 'Connect with email..'
        },
        {
          name: 'Partner Space',
          icon: partnervalveIcon,
          filledIcon: partnervalveIcon,
          href: '/partner-space',
          tooltip: 'Communicate with your partner teams for smoother activities'
        }
      ]
    }
  ]
}

export function buildDashboardMenuByKind(
  kind: 'legacy' | 'vendor' | 'partner',
  isDev: boolean
): DashboardMenuSection[] {
  if (kind === 'partner') return buildPartnerDashboardMenu(isDev)
  if (kind === 'vendor') return buildVendorDashboardMenu(isDev)
  return buildLegacyDashboardMenu(isDev)
}
