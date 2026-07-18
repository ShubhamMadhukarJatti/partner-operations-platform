import { PlanID } from '@/redux/reducers/planCode'

export interface GetStartedDetailsResponse {
  profileSetup: {
    status: boolean
    value: number
  }
  inviteMemberSetup: {
    status: boolean
    value: number
  }
  customerPersonaSetup: {
    status: boolean
    value: number
  }
  proposalSetup: {
    status: boolean
    value: number
  }
  preferredMeetSetup: {
    status: boolean
    value: number
  }
  addPartnersSetup: {
    status: boolean
    value: number
  }
  pendingCollaborations: PendingCollaborationsTypes[]
  slackConnected: boolean
  proposalSent: boolean
  integrationProgramCreated: boolean
  inHouseTeam: string
  apiProgram: string
}

export type PendingCollaborationsTypes = {
  organizationName: string
  organizationCollaborationId: number
  logo_url?: string
}

export type CONFIGURATION_TYPE =
  | 'PLAYGROUND'
  | 'PLAYGROUND_HINT'
  | 'PREFERRED_SECTORS'
  | 'TRENDING_STARTUP'
  | 'USER_DESIGNATION'
  | 'BENEFITS'
  | 'PREFERRED_PARTNERSHIPS'
  | 'ACCESS_CONTROL'

// standard config api type
export interface ConfigType {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  type: string
  key: string
  value: string
  webApplicable: boolean
  appApplicable: boolean
  backendApplicable: boolean
  active: boolean
}

// Organization Types
export interface OrganizationType {
  rating: any
  id: number
  logoUrl: string
  country: any
  creationTimestamp: string
  lastUpdatedTimestamp: string
  brandResources: boolean
  referralProgram: boolean
  organizationCollaborations: {
    organizationId: number
    organizationName: string
  }[]
  credits: {
    aiProposalAllocated: number
    aiProposalLeft: number
    collaborationsAllocated: number
    collaborationsLeft: number
    creationTimestamp: string
    id: number
    lastUpdatedTimestamp: string
    playgroundAllocated: number
    playgroundLeft: number
  }
  code: string
  name: string
  about: string
  briefDescription: string
  inceptionYear: number
  registrationType: string
  sector: string
  stage: string
  city: string
  state: string
  additionalDetails: string
  primaryEmail: string
  primaryEmailVerified: string
  domain: string
  domainVerified: string
  website: string
  status: string
  verified: boolean
  verifiedBy: string
  verifiedOn: string
  address: string
  trialPeriodProcured: boolean
  companyType: string
  legalName: string
  contactNumber: string
  targetMarket: string
  funding: string
  acknowledgmentTime: number
  activePartnerships: number
  meetingSuccessRate: number
  pipelinePartnerships: number
  preferredPartnershipTypes: Array<{
    id: number
    creationTimestamp: string
    lastUpdatedTimestamp: string
    area: string
  }>
  partnershipRestrictions: string
  cin: string
  lastActivityAtTimestamp: string
  dateOfIncorporation: string
  services: Array<{
    id: number
    creationTimestamp: string
    lastUpdatedTimestamp: string
    service: string
  }>
  socialMedias: Array<{
    id: number
    creationTimestamp: string
    lastUpdatedTimestamp: string
    name: string
    url: string
    showOnUi: boolean
  }>
  preferredSectors: Array<{
    id: number
    creationTimestamp: string
    lastUpdatedTimestamp: string
    area: string
  }>
  open_for_partnership: boolean
  referralCode: string
  planCode: PlanID
  subscribed: boolean
  accessibleApisVisible: number
}

export type Credits = {
  organziationId: number
  aiProposalCredits: number
  playgroundCredits: number
  collaborationAccepted: number
  collaborationSent: number
}

// User Types
interface Role {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  role: string
}

interface WorkExperience {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  designation: string
  companyName: string
  startDate: string
  endDate: string
  description: string
  currentCompany: boolean
}

interface InterestArea {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  area: string
}

interface AdditionalDetail {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  dataKey: string
  dataValue: string
}

export interface UserType {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  userId: string
  username: string
  name: string
  gender: string
  mobile: string
  email: string
  briefDescription: string
  about: string
  emailVerified: boolean
  userType: string
  riskAppetite: number
  mint: number
  status: string
  deviceId: string
  tags: string
  city: string
  state: string
  canCollaborate: boolean
  website: string
  trialPeriodProcured: boolean
  sector: string
  roles: Role[]
  workExperiences: WorkExperience[]
  interestAreas: InterestArea[]
  additionalDetails: AdditionalDetail[]
}

export interface OrganizationCollaborationType {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  senderOrganizationId: number
  receiverOrganizationId: number
  senderUserId: string
  acceptorUserId: string
  receiverBenefitJson: string
  senderBenefitJson: string
  status: string
  senderUrlsJson: string
  receiverUrlsJson: string
  chatAccessAllowed: boolean
  contactPersonUserId: string
}

// Organization User Mapping Types
export interface OrgUserMappingType {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  organizationId: number
  userId: string
  designation: string
  role: string
  status: 'ACTIVE' | 'UNAPPROVED' | 'DELETED' | 'REJECTED'
  approvedByUserFk: number
  signatoryId: number
}

export interface OrganizationMappingsByUserId {
  organizationUserMapping: OrgUserMappingType
  organization: OrganizationType
}
export interface UserMappingsByOrgId {
  user: UserType
  organizationUserMapping: OrgUserMappingType
}

export interface Pageable {
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
}

export interface SearchOrganizationResponse {
  name: string
  id: number
  state: string
  inceptionYear: number
  sector: string
  stage: string
  city: string
  code: string
  about: string
  briefDescription: string
  verified: boolean
  targetMarket: string
  preferredSectors: InterestArea[]
  preferredPartnershipTypes: InterestArea[]
  services: {
    id: number
    creationTimestamp: string
    lastUpdatedTimestamp: string
    service: string
  }[]
}

export interface Sort {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

export interface SearchResponse {
  content: SearchOrganizationResponse[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface EmailStatisticsPaginatedResponse {
  content: EmailStatisticsResponse[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface EmailStatisticsResponse {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  eventType: string
  email: string
  templateCode: string
  subject: string
  openedAt: string
  clickedAt: string
  clickedLink: string
  env: string
  sentAt: string
}

export interface OrganizationFollowerType {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  organizationId: number
  followerOrganizationId: number
  followingFor: string | null
  followedByUserId: string
}

export interface FollowedOrganizationsResponse {
  content: OrganizationFollowerType[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface NotificationType {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  subject: string
  body: string
  additionalDataMap: string
  sendEmail: boolean
  userId: string
  forMobile: boolean
  forWeb: boolean
  mobileDeviceId: string
  mobileSentStatus: string
  read: boolean
}

export interface NotificationResponse {
  content: NotificationType[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface CollaborationType {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  senderOrganizationId: number
  senderOrganizationName: string
  receiverOrganizationId: number
  receiverOrganizationName: string
  senderUserId: string
  acceptorUserId: string
  receiverBenefitJson: string
  senderBenefitJson: string
  status: string
  senderUrlsJson: string
  receiverUrlsJson: string
  chatAccessAllowed: boolean
  contactPersonUserId: string
  partnershipMouVersions: MouVersionsType[]
}

export interface CollabarationResponse {
  content: CollaborationType[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface Partner {
  content: CollaborationTypeUpdated[]
  pageable: Pageable
  sort: Sort
  last: boolean
  totalElements: number
  totalPages: number
  first: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
}

export interface CollaborationTypeUpdated {
  id: number
  organizationId: number
  status: string
  type: string
  creationTimestamp: string
  name: string
  description: string
  logoUrl: string
}

export interface CollaborationResponseUpdated {
  credits: {
    id: number
    creationTimestamp: string
    lastUpdatedTimestamp: string
    playgroundLeft: number
    playgroundAllocated: number
    aiProposalLeft: number
    aiProposalAllocated: number
    collaborationsLeft: number
    collaborationsAllocated: number
  }
  partners: Partner
}

export interface Benefit {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  benefit: string
  description: string
}

export interface MouVersionsType {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  organizationCollaborationId: number
  senderOrgSigner: string
  receiverOrgSigner: string
  senderOrgcontactPerson: string
  receiverOrgcontactPerson: string
  status: string
  version: number
  filePath: string
  senderBenefits: Benefit[]
  receiverBenefits: Benefit[]
  senderSignedOn: string
  receiverSignedOn: string
  senderOrgmodifiedByUserId: string
  receiverOrgmodifiedByUserId: string
}

export interface MouVersionsResponse {
  content: MouVersionsType[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: Sort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface templateExpectationsResp {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  benefit: string
  description: string
}

export interface templateOfferingssResp {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  benefit: string
  description: string
}

export interface TemplateResponse {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  templateId: number
  title: string
  used: number
  saved: number
  succcessRate: number
  templateExpectations: templateExpectationsResp[]
  templateOfferings: templateOfferingssResp[]
}

export interface ResourcesResponse {
  coverImage: string
  _id: string
  title: string
  slug: string
  video: string
  time: string
  _updatedAt: string
}

export type PartnerGroup = {
  id: string
  name: string
  description: string
  type:
    | 'RELIABLE_PARTNER'
    | 'STEADY_PARTNER'
    | 'LOW_IMPACT_PARTNER'
    | 'INACTIVE_PARTNER'
}

export type AddToGroupPayload = {
  organizationId: number
  emails: string[]
  partnerGroup: PartnerGroup['type']
}

export type DeleteOfflinePartnersParams = {
  organizationId: number
  email: string
}
