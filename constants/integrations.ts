export const INTEGRATION_STATUS = {
  COMING_SOON: 'coming-soon',
  CONNECTED: 'connected',
  NOT_CONNECTED: 'not-connected',
  IN_ACTIVE: 'inactive'
}

export const INTEGRATIONS = {
  HUBSPOT_OUTREACH: 'HUBSPOT',
  SHARKDOM_MEET: 'S_MEET',
  GOOGLE_MEET: 'G_CALENDAR',
  GOOGLE_SHEET: 'G_SHEET',
  GOOGLE_FORM: 'G_FORM',
  ZOHO_CRM: 'ZOHO',
  SALESFORCE_CRM: 'SALESFORCE',
  HUBSPOT_MEET: 'H_MEET',
  MAILCHIMP: 'MAILCHIMP',
  SLACK: 'SLACK',
  STRIPE: 'STRIPE',
  DISCORD: 'DISCORD',
  ZOOM: 'ZOOM',
  CALENDLY: 'CALENDLY',
  PIPEDRIVE: 'PIPEDRIVE',
  CLOSE_CRM: 'CLOSE',
  TRELLO: 'TRELLO'
}

export const ALL_INTEGRATIONS = [
  {
    name: 'HubSpot',
    logo: '/icons/hubspot-rounded-logo.svg',
    cardImgWidth: 42,
    cardImgHeight: 42,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://hubspot.com',
    description:
      'Sync partner contacts and company data bidirectionally, no manual CRM updates ever.',
    isNew: false,
    isMain: true,
    id: INTEGRATIONS.HUBSPOT_OUTREACH,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '5 min',
    availableOn: 'Enterprise',
    useCases: [
      'Sync partner contacts and company data bidirectionally, no manual CRM updates ever',
      'Auto-create HubSpot deals when a partner registers a lead in Sharkdom',
      'Map partner attribution directly to HubSpot pipeline stages for accurate co-sell reporting',
      'Pull customer lists into Sharkdom for account overlap and partner matching via Dweep AI',
      'Trigger HubSpot sequences when a partner reaches a new activation milestone'
    ]
  },
  {
    name: 'Sharkdom Meet',
    logo: '/icons/sharkdom-meet-rounded-logo.svg',
    cardImgWidth: 42,
    cardImgHeight: 42,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://meet.sharkdom.com',
    description:
      'Schedule partner onboarding calls directly from the partner portal without leaving Sharkdom.',
    isNew: true,
    isMain: false,
    id: INTEGRATIONS.SHARKDOM_MEET,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '2 min',
    availableOn: 'Enterprise',
    useCases: [
      'Schedule partner onboarding calls directly from the partner portal without leaving Sharkdom',
      "Auto-log meeting notes and outcomes against the partner's activity timeline",
      'Send automated meeting reminders to partners before scheduled activation calls',
      'Create deal review meetings linked to specific registered deals in the pipeline'
    ]
  },
  {
    name: 'Google Sheets',
    logo: '/icons/google-sheets-rounded-logo.svg',
    cardImgWidth: 42,
    cardImgHeight: 42,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://sheets.google.com',
    description:
      'Export your full partner pipeline to Sheets for offline reporting and board decks.',
    isNew: false,
    isMain: true,
    id: INTEGRATIONS.GOOGLE_SHEET,
    authType: 'OAuth 2.0',
    syncFrequency: 'Live sync',
    setupTime: '3 min',
    availableOn: 'Enterprise',
    useCases: [
      'Export your full partner pipeline to Sheets for offline reporting and board decks',
      'Import bulk partner contact lists from Sheets to onboard multiple partners simultaneously',
      'Sync deal registration data to a live Sheet your leadership team can monitor',
      'Build custom attribution dashboards in Sheets pulling Sharkdom deal and revenue data'
    ]
  },
  {
    name: 'Zoho CRM',
    logo: '/icons/zoho-rounded-logo.svg',
    cardImgWidth: 42,
    cardImgHeight: 42,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://www.zoho.com/crm/',
    description:
      'Sync Sharkdom partner-sourced leads directly into Zoho as contacts or leads.',
    isNew: false,
    isMain: true,
    id: INTEGRATIONS.ZOHO_CRM,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '5 min',
    availableOn: 'Enterprise',
    useCases: [
      'Sync Sharkdom partner-sourced leads directly into Zoho as contacts or leads',
      'Map Zoho deal stages to Sharkdom pipeline so both teams see the same status',
      'Pull Zoho customer data for account overlap identification and co-sell targeting',
      'Auto-update Zoho partner records when deal registration status changes in Sharkdom'
    ]
  },
  {
    name: 'Salesforce CRM',
    logo: '/salesforce.jpeg',
    cardImgWidth: 42,
    cardImgHeight: 42,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://salesforce.com',
    description:
      'Push registered partner deals into Salesforce opportunities with partner attribution intact.',
    isNew: false,
    isMain: true,
    id: INTEGRATIONS.SALESFORCE_CRM,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '5 min',
    availableOn: 'Enterprise',
    useCases: [
      'Push registered partner deals into Salesforce opportunities with partner attribution intact',
      'Pull Salesforce account lists into Dweep AI for intelligent partner-to-account matching',
      'Bidirectional stage sync Salesforce opportunity updates reflect in Sharkdom pipeline instantly',
      'Auto-assign channel managers in Salesforce when a partner submits a deal in Sharkdom'
    ]
  },
  {
    name: 'Google Meet',
    logo: '/icons/google-meet-rounded-logo.svg',
    cardImgWidth: 42,
    cardImgHeight: 34.75,
    drawerImgWidth: 58,
    drawerImgHeight: 47.85,
    url: 'https://meet.google.com',
    description:
      'Build automated meeting with your Partner and track meeting status directly via google meet.',
    isNew: true,
    isMain: true,

    id: INTEGRATIONS.GOOGLE_MEET,
    overview:
      'The Slack integration for Sharkdom allows you to be notified on your Slack channels and be aware of your partner activities, have your team join the partnership journey from Slack.',
    configuration:
      'You can configure the integration on single or multiple public spaces by navigating to the integrations in sub-navigation or org settings. You will then have to provide Slack channel to finish the configuration.',
    permissions: [
      {
        name: 'view',
        description: 'view properties of calendars.'
      },

      {
        name: 'modify',
        description: 'modify calendar setting for meeting schedules.'
      },
      {
        name: 'events:manage',
        description: 'Manage events'
      }
    ],
    isConfigRequired: false,
    useCases: [
      'Generate and share Google Meet links directly from partner deal conversations',
      'Schedule co-sell strategy calls between your AE and partner rep from Sharkdom',
      'Auto-attach meeting recordings to partner profiles for CS team reference',
      'Trigger Google Meet invites when a deal moves to a specific pipeline stage'
    ]
  },
  {
    name: 'Slack',
    logo: '/icons/slack.svg',
    cardImgWidth: 48,
    cardImgHeight: 48,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://slack.com',
    description:
      'Get instant Slack notifications when a partner submits a new deal for registration.',
    isNew: false,
    isMain: true,
    id: INTEGRATIONS.SLACK,
    authType: 'OAuth 2.0',
    syncFrequency: 'Instant',
    setupTime: '2 min',
    availableOn: 'Enterprise',
    useCases: [
      'Get instant Slack notifications when a partner submits a new deal for registration',
      'Create a dedicated Slack channel per partner for real-time co-sell communication',
      'Alert the right AE in Slack the moment a partner lead needs a follow-up',
      'Post weekly partner pipeline summaries automatically to your partnerships Slack channel',
      'Notify CS team via Slack when a partner account is at risk of going dormant'
    ]
  },
  {
    name: 'Stripe',
    logo: '/icons/stripe.svg',
    cardImgWidth: 101,
    cardImgHeight: 42,
    drawerImgWidth: 139,
    drawerImgHeight: 58,
    url: 'https://stripe.com',
    description:
      'Automate partner commission payouts directly via Stripe when deals close in Sharkdom.',
    isNew: false,
    isMain: true,
    id: INTEGRATIONS.STRIPE,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '5 min',
    availableOn: 'Enterprise',
    useCases: [
      'Automate partner commission payouts directly via Stripe when deals close in Sharkdom',
      'Track revenue attribution per partner and trigger Stripe payment on confirmation',
      'Set tiered commission structures in Sharkdom that Stripe executes automatically on payout',
      'Reconcile partner payments against deal records without manual invoice matching'
    ]
  },
  {
    name: 'Discord',
    logo: '/icons/discord-icon.svg',
    cardImgWidth: 47,
    cardImgHeight: 27,
    drawerImgWidth: 88,
    drawerImgHeight: 58,
    url: 'https://discord.com',
    description:
      'Build a private Sharkdom partner community server with channels per partner tier.',
    isNew: true,
    isMain: false,
    id: INTEGRATIONS.DISCORD,
    authType: 'OAuth 2.0',
    syncFrequency: 'Instant',
    setupTime: '3 min',
    availableOn: 'Enterprise',
    useCases: [
      'Build a private Sharkdom partner community server with channels per partner tier',
      'Post automated deal status updates to partner-specific Discord channels',
      'Send partner enablement resources and product updates directly in Discord',
      'Alert active community partners in Discord when new co-sell opportunities are available'
    ]
  },
  {
    name: 'Mailchimp',
    logo: '/icons/mailchimp-rounded-logo.svg',
    cardImgWidth: 42,
    cardImgHeight: 42,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://mailchimp.com',
    description:
      'Use partner data to create co-marketing campaigns and automate your marketing campaigns in Mailchimp.',
    isNew: false,
    isMain: false,
    id: INTEGRATIONS.MAILCHIMP,
    authType: 'OAuth 2.0',
    syncFrequency: 'Scheduled',
    setupTime: '4 min',
    availableOn: 'Enterprise',
    useCases: [
      'Build partner nurture and co-marketing campaigns using synced data from Sharkdom',
      'Trigger Mailchimp journeys when a partner reaches a new onboarding or activation milestone',
      'Keep partner segments updated for targeted communication and enablement campaigns',
      'Use Sharkdom pipeline and partner data to personalize campaign outreach'
    ]
  },
  {
    name: 'Calendly',
    logo: '/icons/calendly.png',
    cardImgWidth: 42,
    cardImgHeight: 42,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://calendly.com/',
    description:
      'Schedule partner meetings and activation calls with fewer back-and-forth messages.',
    isNew: true,
    isMain: false,
    id: INTEGRATIONS.CALENDLY,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '3 min',
    availableOn: 'Enterprise',
    useCases: [
      'Schedule partner onboarding and activation calls from Sharkdom using Calendly availability',
      'Route meeting bookings to the right owner based on partner stage or workflow',
      'Track scheduled meetings as part of the partner activity journey',
      'Reduce manual scheduling effort for reviews, activations, and follow-ups'
    ]
  },
  {
    name: 'Zoom',
    logo: '/icons/zoom-icon.svg',
    cardImgWidth: 47,
    cardImgHeight: 27,
    drawerImgWidth: 88,
    drawerImgHeight: 58,
    url: 'https://www.zoom.com/',
    description:
      'Run partner calls and reviews through Zoom while keeping activity tied to your Sharkdom workflows.',
    isNew: true,
    isMain: false,
    id: INTEGRATIONS.ZOOM,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '3 min',
    availableOn: 'Enterprise',
    useCases: [
      'Create Zoom meetings for onboarding, deal reviews, and partner syncs directly from Sharkdom',
      'Associate scheduled calls with partner workflows and activity history',
      'Reduce context switching for channel teams managing partner communications',
      'Keep meeting operations aligned with the partner lifecycle'
    ]
  },
  {
    name: 'Pipedrive',
    logo: '/icons/pipedrive.png',
    cardImgWidth: 42,
    cardImgHeight: 42,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://www.pipedrive.com',
    description:
      'Push Sharkdom partner-sourced deals into Pipedrive with partner attribution automatically.',
    isNew: false,
    isMain: true,
    id: INTEGRATIONS.PIPEDRIVE,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '5 min',
    availableOn: 'Enterprise',
    useCases: [
      'Push Sharkdom partner-sourced deals into Pipedrive with partner attribution automatically',
      'Sync Pipedrive deal stage changes back into Sharkdom for real-time pipeline visibility',
      'Pull Pipedrive contact data into Sharkdom for account overlap and co-sell matching',
      'Auto-assign deal owner in Pipedrive when a partner registers a lead in Sharkdom'
    ]
  },
  {
    name: 'Close CRM',
    logo: '/icons/close-crm.svg',
    cardImgWidth: 42,
    cardImgHeight: 42,
    drawerImgWidth: 58,
    drawerImgHeight: 58,
    url: 'https://close.com',
    description:
      'Sync Sharkdom partner leads into Close as new opportunities with source attribution.',
    isNew: false,
    isMain: true,
    id: INTEGRATIONS.CLOSE_CRM,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '5 min',
    availableOn: 'Enterprise',
    useCases: [
      'Sync Sharkdom partner leads into Close as new opportunities with source attribution',
      'Bidirectional status updates, Close deal changes reflect instantly in Sharkdom pipeline',
      'Pull Close contact and company data for Dweep AI partner-to-account matching',
      'Trigger Close sequences when a partner deal stalls beyond a defined SLA window'
    ]
  },
  {
    name: 'Trello',
    logo: '/icons/trello-icon.svg',
    cardImgWidth: 48,
    cardImgHeight: 48,
    drawerImgWidth: 88,
    drawerImgHeight: 58,
    url: 'https://trello.com',
    description:
      'Create Trello cards automatically when a new partner deal is registered in Sharkdom.',
    isNew: true,
    isMain: true,
    id: INTEGRATIONS.TRELLO,
    authType: 'OAuth 2.0',
    syncFrequency: 'Real-time',
    setupTime: '3 min',
    availableOn: 'Enterprise',
    useCases: [
      'Create Trello cards automatically when a new partner deal is registered in Sharkdom',
      'Move Trello cards across boards as partner deal stages progress in Sharkdom',
      'Build a partner onboarding Trello board that updates as partners complete activation steps',
      'Assign Trello cards to the right AE when a partner lead needs immediate follow-up'
    ]
  }
]

export const COMING_SOON_INTEGRATIONS = new Set([INTEGRATIONS.SHARKDOM_MEET])
