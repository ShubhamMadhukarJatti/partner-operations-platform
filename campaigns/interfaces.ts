export enum CAMPAIGN_TYPE {
  OFFLINE_PARTNER_ONBOARDED = 'OFFLINE_PARTNER_ONBOARDED',
  MILESTONE = 'MILESTONE',
  PRODUCT_UPDATE = 'PRODUCT_UPDATE',
  INACTIVE_REENGAGEMENT = 'INACTIVE_REENGAGEMENT',
  FEEDBACK = 'FEEDBACK',
  PARTNERSHIP_ANNIVERSARY = 'PARTNERSHIP_ANNIVERSARY'
}

export enum CampaignStatus {
  Active = 'ACTIVE',
  Draft = 'DRAFT',
  Archived = 'ARCHIVED',
  NotSet = 'NOT SET'
}

export interface ICustomEdge {
  id: string
  source: string
  target: string
  data: {
    label: string
  }
  type: string
  animated: boolean
}
export interface ITemplateWorkFlow {
  nodes: {
    id: string
    type: string
    data: {
      title: string
      icon: any
      subtitle?: string
      borderColor?: string
      allowAddingCondition?: boolean
    }
    position: { x: number; y: number }
  }[]
  edges: ICustomEdge[]
  conditions: {
    conditionLabel: string
    nodeIdsUnderCondition: number[]
  }[]
}
export interface ITemplateData {
  id: number
  status: CampaignStatus
  since: string
  title: string
  subtitle: string
  purposeText: string
  frequency: string
  type: CAMPAIGN_TYPE
  templateWorkFlow: ITemplateWorkFlow
}

export enum PartnerStatusEnum {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED',
  DEACTIVATED = 'DEACTIVATED',
  PENDING = 'PENDING'
}

export interface PartnerI {
  orgEmail: string
  orgId: number
  orgName: string
}

export interface CampaignByIDResponseI {
  campaignName: string
  campaignType: CAMPAIGN_TYPE
  organizationId: number
  sendAll: boolean
  status: CampaignStatus
  assignedPartners: PartnerI[]
  activePartners: PartnerI[]
  triggerFlow: {
    creationTimestamp: string
    id: number
    lastUpdatedTimestamp: string
    nodes: string[]
    edges: string[]
    conditions: {
      activeFor: number
      conditionLabel: string
      creationTimestamp: string
      delay: number
      lastUpdatedTimestamp: string
      main: null
      nodeIds: null | number[]
      templateId: number
    }[]
  }
}

export interface CampaignPipelineI {
  id: number
  organizationId: number
  status: CampaignStatus
  campaignName: string
  campaignType: CAMPAIGN_TYPE
}
