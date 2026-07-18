export type SharedAsset = {
  id: number
  title: string
  fileUrl: string
  sharedBy: string
  dealId: string
}

export type SharedAssetsApiResponse = {
  success: boolean
  message: string
  data: SharedAsset[]
}

/** POST /api/account-mapping/upload — response data wrapper */
export type AccountMappingUploadResponse = {
  success: boolean
  message?: string
  data: { fileUrl: string }
}

/** POST /api/account-mapping/shared-assets — single asset in data */
export type SharedAssetMutationApiResponse = {
  success: boolean
  message: string
  data: SharedAsset
}

export type CreateSharedAssetPayload = {
  partnerOrgId: number
  title: string
  fileUrl: string
  username: string
  dealId: string
}

export type CreateSharedAssetResult =
  | { ok: true; asset: SharedAsset }
  | { ok: false; message: string }

export type DealOwnerDetails = {
  dealId: string
  dealName: string
  dealOwner: string
  amountAcv: string
  dealStage: string
  pipeline: string
  dealType: string
  creationDate: string
  closeDate: string
  companyName: string
  domain: string
  website: string
  industry: string
  companySize: string
  annualRevenue: string
  country: string
  city: string
  companyPhone: string
  linkedinUrl: string
  description: string
  firstName: string
  lastName: string
  contactEmail: string
  jobTitle: string
  contactPhone: string
  contactLinkedinUrl: string
  leadStatus: string
  contactOwner: string
  lastActivityDate: string
  owner: {
    email: string
    firstName: string
    lastName: string
  }
}

export interface GenerateIntroPayload {
  type: 'vendor-to-partner' | string
  data: {
    sender_name: string
    sender_title: string
    sender_company: string
    sender_company_description: string
    partner_contact_name: string
    partner_contact_title: string
    partner_company: string
    target_contact_name: string
    target_contact_title: string
    target_account_name: string
    your_deal_stage: string
    partner_relationship_type: string
    partner_relationship_duration: string
    relevance_reason: string
    prior_context: string
    why_meeting_preferred: string
    meeting_duration: string
    meeting_agenda: string
    available_slots: string
    why_suggesting: string
    endorsement_strength: string
    target_contact_linkedin: string
    linkedin_intro_format: string
    partner_contact_linkedin: string
    linkedin_connection_type: string
    relevance_to_target: string
    relationship_tone: string
    why_making_intro: string
  }
}

export interface GenerateIntroResponse {
  success: boolean
  message: string
  data: {
    subject: string
    body: string
    word_count: number
    input_tokens: number
    output_tokens: number
  }
}

export type GenerateIntroResult =
  | { ok: true; data: GenerateIntroResponse['data'] }
  | { ok: false; message: string }

export interface CoSellActivity {
  title: string
  description: string
  date: string
  actor: string
  type: string
  dealId: string
}

export interface CoSellActivityResponse {
  success: boolean
  message: string
  data: CoSellActivity[]
}

export interface SendNotificationPayload {
  body: string
  subject: string
  receiverEmail: string
  receiverName: string
  scheduled: boolean
  scheduleTime: string
  data?: Record<string, any>
}

export interface SendNotificationResult {
  success: boolean
  message: string
  data?: string
}

export interface CoSellHealthPayload {
  dealStage: string
  dealSize: number
  icpMatched: boolean
  stakeholderContacts: number
  championEngaged: boolean
  competitiveThreat: boolean
  budgetConfirmed: boolean
  partnerCloseRateWithCompany: number
  partnerGeneralCloseRate: number
  contactCount: number
  signedAgreement: boolean
  lastUpdateDaysAgo: number
  avgResponseHours: number
  activitiesLast7Days: number
  commissionAllocated: boolean
  mdfAllocated: boolean
  partnerStage: string
  committeeFormed: boolean
  projectedCloseDateDifferenceDays: number
  daysToClose: number
  stakeholderVelocity: string
  currentBudgetCycle: boolean
  momentum: string
  procurementRisk: string
  competitorMentioned: boolean
  legalReviewRequired: boolean
  accelerating: boolean
  contractFirmCloseDate: boolean
}

export interface CoSellHealthResponse {
  coSellWinProbability: number
  coSellWinPoints: number
  directWinProbability: number
  directWinPoints: number
  partnerResponsivenessPoints: number
  stageAlignmentPoints: number
  timelineRiskPoints: number
  projectedCloseDate: string
  finalScore: number
  healthStatus: string
}

export interface IntroTrackerStage {
  stageName: string
  completed: boolean
  active: boolean
}

export interface IntroTrackerResponseMonitor {
  emailDelivered: boolean
  replyReceived: boolean
  emailOpened: boolean
  emailOpenedAt: string
  responseDeadline: string
  timeRemaining: string
  lastChecked: string
}

export interface IntroTrackerResponse {
  currentStage: string
  stages: IntroTrackerStage[]
  responseMonitor: IntroTrackerResponseMonitor
}
