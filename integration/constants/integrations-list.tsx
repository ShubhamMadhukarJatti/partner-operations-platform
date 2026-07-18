import { Integration } from '@/types/integrations'

export const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    name: 'HubSpot Outreach',
    partnerType: 'integration',
    sharkdomPlan: ['foundation', 'premium', 'enterprise'],
    categories: ['crm'],
    integrationStage: 'fully-released',
    order: 1,
    icon: '/icons/hubspot-icon.svg',
    desc: 'Utilize the power of platform via customer persona syncing directly from your hubspot.'
  },
  {
    name: 'Sharkdom Meet',
    partnerType: 'integration',
    sharkdomPlan: ['foundation', 'premium', 'enterprise'],
    categories: ['meetings', 'communications'],
    integrationStage: 'new',
    order: 6,
    icon: '/icons/sharkdom-meet-icon.svg',
    desc: 'Build automated meeting with your Partner via AI powered transcript for managing minutes of meetings.'
  },
  {
    name: 'Google Meet',
    partnerType: 'integration',
    sharkdomPlan: ['foundation', 'premium', 'enterprise'],
    categories: ['meetings', 'communications'],
    integrationStage: 'fully-released',
    order: 2,
    icon: '/icons/google-meet-icon.svg',
    desc: 'Build automated meeting with your Partner and track meeting status directly via google meet.'
  },
  {
    name: 'Google Sheet',
    partnerType: 'integration',
    sharkdomPlan: ['foundation', 'premium', 'enterprise'],
    categories: [],
    integrationStage: 'fully-released',
    order: 3,
    icon: '/icons/google-sheets-icon.svg',
    desc: 'Utilize the power of platform via customer persona syncing directly from your Google Sheet.'
  },
  {
    name: 'ZohoCRM',
    partnerType: 'integration',
    sharkdomPlan: ['premium', 'enterprise'],
    categories: ['crm'],
    integrationStage: 'fully-released',
    order: 4,
    icon: '/icons/zoho-crm-icon.svg',
    desc: 'Put the power of your ecosystem in the hands of sellers directly with ZohoCRM.'
  },
  {
    name: 'Salesforce CRM',
    partnerType: 'integration',
    sharkdomPlan: ['premium', 'enterprise'],
    categories: ['crm'],
    integrationStage: 'fully-released',
    order: 5,
    icon: '/salesforce.jpeg',
    desc: 'Connect your Salesforce CRM to sync customer data and manage your sales pipeline with partners.'
  },
  {
    name: 'HubSpot Meet',
    partnerType: 'integration',
    sharkdomPlan: ['premium', 'enterprise'],
    categories: ['meetings', 'communications'],
    integrationStage: 'in-pipeline',
    order: 6,
    icon: '/icons/hubspot-icon.svg',
    desc: 'Build automated meeting with your Partner and track meeting status directly via HubSpot Meet.'
  },
  {
    name: 'Panda Doc',
    partnerType: 'solution',
    sharkdomPlan: ['premium', 'enterprise'],
    categories: ['signing-services'],
    integrationStage: 'in-pipeline',
    order: 8,
    icon: '/icons/panda-docs-icon.svg',
    desc: "Manage your MOU's and agreement with your partner all at once place directly via Panda Docs."
  },
  {
    name: 'Docusign',
    partnerType: 'solution',
    sharkdomPlan: ['premium', 'enterprise'],
    categories: ['signing-services'],
    integrationStage: 'in-pipeline',
    order: 9,
    icon: '/icons/docusign-icon.svg',
    desc: "Use Docusign for managing your MOU's and agreement with your partner."
  },
  {
    name: 'Mailchimp',
    partnerType: 'solution',
    sharkdomPlan: ['enterprise'],
    categories: ['email-campaign'],
    integrationStage: 'fully-released',
    order: 10,
    icon: '/icons/mailchimp-icon.svg',
    desc: 'Use partner data to create co-marketing campaigns and automate your email marketing workflows in Mailchimp.'
  },
  {
    name: 'Slack',
    partnerType: 'solution',
    sharkdomPlan: ['foundation', 'premium', 'enterprise'],
    categories: [''],
    integrationStage: 'new',
    order: 11,
    icon: '/icons/slack.svg',
    desc: 'Get notified right in your Slack channel for any activity initiated from your partners.'
  }
]
