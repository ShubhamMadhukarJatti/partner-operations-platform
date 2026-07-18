import { Profile2User, Sms } from 'iconsax-react'

import { CAMPAIGN_TYPE, CampaignStatus, ITemplateData } from './interfaces'

export const campaignListData = [
  {
    id: 1,
    status: CampaignStatus.NotSet,
    since: 'since October 11,2024',
    title: 'Partner Feedback/Satisfaction Surveys',
    type: CAMPAIGN_TYPE.FEEDBACK,
    subtitle: 'Monthly(1-month) or quarterly(3 months) performance review.',
    purposeText:
      'Request feedback from partners on their experience and the partnership process, Asking partners to rate them to increase their visibility at Sharkdom.',
    frequency: 'Regular intervals, like monthly or quarterly.',

    templateWorkFlow: {
      nodes: [
        {
          id: '1',
          type: 'custom',
          data: {
            title: 'Partner Feedback',
            icon: Profile2User
          },
          position: { x: 350, y: 50 }
        },
        {
          id: '2',
          type: 'custom',

          data: {
            title: 'Create an Email',
            subtitle: 'Start sending re-engagement email',
            icon: Sms,
            borderColor: '#FCAA3F',
            allowAddingCondition: true
          },
          position: { x: 200, y: 150 }
        },
        {
          id: '3',
          type: 'custom',

          data: {
            title: 'Create an Email',
            subtitle: 'Start sending re-engagement email',
            icon: Sms,
            borderColor: '#FCAA3F',
            allowAddingCondition: true
          },
          position: { x: 455, y: 250 }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          data: { label: 'Yes' },
          target: '2',
          type: 'custom',
          animated: true
        },
        {
          id: 'e1-3',
          source: '1',
          target: '3',
          data: { label: 'No' },
          type: 'custom',
          animated: true
        }
      ],
      conditions: [
        {
          conditionLabel: 'Yes',
          templateId: 7,
          delay: 2,
          activefor: 3,
          nodeIdsUnderCondition: [2, 3]
        },
        {
          conditionLabel: 'No',
          nodeIdsUnderCondition: [3]
        }
      ]
    }
  },
  {
    id: 2,
    status: CampaignStatus.NotSet,
    since: 'since October 11,2024',
    title: 'Welcome/Onboarding Emails',
    type: CAMPAIGN_TYPE.OFFLINE_PARTNER_ONBOARDED,
    subtitle: 'When a new partner is added to the platform.',
    purposeText:
      'Introduce the partner to the platform and guide them through the initial steps of working together. You can include a quick-start guide or video tutorial.',
    frequency: 'One Time',
    templateWorkFlow: {
      nodes: [
        {
          id: '1',
          type: 'custom',
          data: {
            title: 'Partner Onboarded',
            icon: Profile2User
          },
          position: { x: 350, y: 50 }
        },
        {
          id: '2',
          type: 'custom',

          data: {
            title: 'Create an Email',
            subtitle: 'Start sending re-engagement email',
            icon: Sms,
            borderColor: '#FCAA3F',
            allowAddingCondition: true
          },
          position: { x: 200, y: 150 }
        },
        {
          id: '3',
          type: 'custom',

          data: {
            title: 'Create an Email',
            subtitle: 'Start sending re-engagement email',
            icon: Sms,
            borderColor: '#FCAA3F',
            allowAddingCondition: true
          },
          position: { x: 455, y: 250 }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          data: { label: 'Yes' },
          target: '2',
          type: 'custom',
          animated: true
        },
        {
          id: 'e1-3',
          source: '1',
          target: '3',
          data: { label: 'No' },
          type: 'custom',
          animated: true
        }
      ],
      conditions: [
        {
          conditionLabel: 'Yes',
          nodeIdsUnderCondition: [2]
        },
        {
          conditionLabel: 'No',
          nodeIdsUnderCondition: [3]
        }
      ]
    }
  },
  {
    id: 3,
    status: CampaignStatus.NotSet,
    since: 'since October 11,2024',
    title: 'Milestone Emails',
    type: CAMPAIGN_TYPE.MILESTONE,
    subtitle:
      'When a partner achieves a key milestone (e.g referral program shared, referral program setup completed on the receiver end, first lead capture in referral program, partner portal guidance for best results).',
    purposeText:
      'Celebrate accomplishments to strengthen relationships, and motivate the partner to continue performing well.',
    frequency: 'Not Fixed',
    templateWorkFlow: {
      nodes: [
        {
          id: '1',
          type: 'custom',
          data: {
            title: 'Partner Anniversary',
            icon: Profile2User
          },
          position: { x: 350, y: 50 }
        },
        {
          id: '2',
          type: 'custom',

          data: {
            title: 'Create an Email',
            subtitle: 'Start sending re-engagement email',
            icon: Sms,
            borderColor: '#FCAA3F',
            allowAddingCondition: true
          },
          position: { x: 350, y: 250 }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          type: 'custom',
          animated: true
        }
      ],
      conditions: [
        {
          conditionLabel: 'Yes',
          nodeIdsUnderCondition: [2]
        }
      ]
    }
  },
  {
    id: 4,
    status: CampaignStatus.NotSet,
    since: 'since October 11,2024',
    title: 'Inactive Partner Re-engagement',
    type: CAMPAIGN_TYPE.INACTIVE_REENGAGEMENT,
    subtitle:
      'Lack of activity or engagement from the partner for a set period.',
    purposeText:
      'Re-engage dormant partners by highlighting partnership benefits, performance reviews, or upcoming opportunities they may have missed.',
    frequency: 'After X days/weeks of inactivity.',
    templateWorkFlow: {
      nodes: [
        {
          id: '1',
          type: 'custom',
          data: {
            title: 'Partner Engagement',
            icon: Profile2User
          },
          position: { x: 350, y: 50 }
        },
        {
          id: '2',
          type: 'custom',

          data: {
            title: 'Create an Email',
            subtitle: 'Start sending re-engagement email',
            icon: Sms,
            borderColor: '#FCAA3F',
            allowAddingCondition: true
          },
          position: { x: 200, y: 280 }
        },
        {
          id: '3',
          type: 'custom',

          data: {
            title: 'Create an Email',
            subtitle: 'Start sending re-engagement email',
            icon: Sms,
            borderColor: '#FCAA3F',
            allowAddingCondition: true
          },
          position: { x: 500, y: 280 }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          data: { label: 'Yes' },
          target: '2',
          type: 'custom',
          animated: true
        },
        {
          id: 'e1-3',
          source: '1',
          target: '3',
          data: { label: 'No' },
          type: 'custom',
          animated: true
        }
      ],
      conditions: [
        {
          conditionLabel: 'Yes',
          nodeIdsUnderCondition: [2]
        },
        {
          conditionLabel: 'No',
          nodeIdsUnderCondition: [3]
        }
      ]
    }
  },
  {
    id: 5,
    status: CampaignStatus.NotSet,
    since: 'since October 11,2024',
    title: 'New Feature/Product Updates',
    type: CAMPAIGN_TYPE.PRODUCT_UPDATE,
    subtitle: 'When new platform features, products, or updates are released.',
    purposeText:
      'Inform partners about new tools or features on the platform that can enhance their experience or provide more value. Include guides or tutorials for how to use these features.',
    frequency: 'As updates are rolled out.',
    templateWorkFlow: {
      nodes: [
        {
          id: '1',
          type: 'custom',
          data: {
            title: 'Notify feature Update',
            icon: Profile2User
          },
          position: { x: 350, y: 50 }
        },
        {
          id: '3',
          type: 'custom',

          data: {
            title: 'Create an Email',
            subtitle: 'Start sending re-engagement email',
            icon: Sms,
            borderColor: '#FCAA3F',
            allowAddingCondition: true
          },
          position: { x: 365, y: 250 }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          target: '3',
          type: 'custom',
          animated: true
        }
      ],
      conditions: []
    }
  }
] as ITemplateData[]
