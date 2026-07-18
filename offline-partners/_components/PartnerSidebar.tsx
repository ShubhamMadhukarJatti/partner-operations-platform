'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import {
  useAllOfflinePartners,
  useOfflinePartnerAssignment,
  useSaveOfflinePartnerAssignment
} from '@/http-hooks/offline-partners'
import { useGetTeamSection } from '@/http-hooks/orgUserMapping'
import { IconDots, IconRefresh } from '@tabler/icons-react'
import { Call, Copy, Global, Location, Profile, Sms } from 'iconsax-react'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { showCustomToast } from '@/components/custom-toast'
import { EditIcon } from '@/components/icons/icons'

type Props = {
  data: any
  isLoading?: boolean
  inDummyFlow?: boolean
  partnerId?: string | number
}

type NormalizedTeamMember = {
  userId: string
  name: string
  email?: string
  roles?: string[]
}

const getInitials = (name?: string | null) => {
  if (!name) return 'PM'
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length === 0) return 'PM'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const PartnerSidebar = ({
  data,
  isLoading = false,
  inDummyFlow = false,
  partnerId
}: Props) => {
  console.log('profileData', { data })

  const handleDummyAction = () => {
    showCustomToast(
      'Info',
      'No edit access for this dummy account',
      'info',
      5000
    )
  }

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  // Fetch integration apps to check Trello connection status
  const { integrations, isLoading: isIntegrationsLoading } =
    useIntegrationApps()

  // Check if Trello is connected (in dummy flow, simulate as connected)
  const isTrelloConnected = useMemo(() => {
    if (inDummyFlow) return true // Simulate connected in dummy flow
    const trelloIntegration = integrations?.find(
      (integration: any) => integration.id === INTEGRATIONS.TRELLO
    )
    return trelloIntegration?.status === INTEGRATION_STATUS.CONNECTED
  }, [integrations, inDummyFlow])

  const {
    data: teamSection,
    isLoading: isTeamLoading,
    isFetching: isTeamFetching
  } = useGetTeamSection()

  const {
    data: offlinePartnersResponse,
    isLoading: isPartnersLoading,
    isFetching: isPartnersFetching
  } = useAllOfflinePartners({ enabled: Boolean(data) })

  const assignMutation = useSaveOfflinePartnerAssignment()

  const teamMembers = useMemo<NormalizedTeamMember[]>(() => {
    if (!Array.isArray(teamSection)) return []

    return teamSection
      .map((member: any) => {
        const inviteStatus =
          member?.inviteTeamMemberStatus ??
          member?.status ??
          member?.user?.inviteTeamMemberStatus ??
          member?.user?.status

        if (
          !inviteStatus ||
          typeof inviteStatus !== 'string' ||
          inviteStatus.toUpperCase() !== 'ACTIVE'
        ) {
          return null
        }

        const candidateId =
          member?.userId ??
          member?.user?.id ??
          member?.user?.userId ??
          member?.id

        if (!candidateId) {
          return null
        }

        return {
          userId: String(candidateId),
          name:
            member?.name ??
            member?.user?.name ??
            member?.email ??
            member?.user?.email ??
            'Team member',
          email: member?.email ?? member?.user?.email ?? undefined,
          roles: Array.isArray(member?.roles) ? member.roles : []
        } as NormalizedTeamMember
      })
      .filter(Boolean) as NormalizedTeamMember[]
  }, [teamSection])

  const offlinePartners = useMemo<any[]>(() => {
    const payload: any = offlinePartnersResponse

    if (Array.isArray(payload)) {
      return payload
    }

    if (payload?.content && Array.isArray(payload.content)) {
      return payload.content as any[]
    }

    return []
  }, [offlinePartnersResponse])

  const currentPartnerRecord = useMemo(() => {
    if (!data || !offlinePartners.length) return undefined

    const targetEmail =
      typeof data?.email === 'string'
        ? data.email.trim().toLowerCase()
        : undefined
    const targetId =
      typeof data?.id !== 'undefined' ? Number(data.id) : undefined
    const targetPartnerOrgId = [
      data?.partnerOrgId,
      data?.partnerOrganizationId,
      data?.organizationCollaborationId,
      Array.isArray(data?.partnerOrgIds) ? data.partnerOrgIds[0] : undefined
    ]
      .map((candidate) =>
        candidate !== undefined && candidate !== null
          ? Number(candidate)
          : undefined
      )
      .find((candidate) => candidate && !Number.isNaN(candidate))

    return offlinePartners.find((partner: any) => {
      const partnerEmail =
        typeof partner?.email === 'string'
          ? partner.email.trim().toLowerCase()
          : undefined
      const partnerId =
        typeof partner?.id !== 'undefined' ? Number(partner.id) : undefined
      const partnerOrgId = [
        partner?.partnerOrgId,
        partner?.partnerOrganizationId,
        partner?.organizationCollaborationId
      ]
        .map((candidate) =>
          candidate !== undefined && candidate !== null
            ? Number(candidate)
            : undefined
        )
        .find((candidate) => candidate && !Number.isNaN(candidate))

      if (
        targetPartnerOrgId &&
        partnerOrgId &&
        Number(partnerOrgId) === Number(targetPartnerOrgId)
      ) {
        return true
      }

      if (targetId && partnerId && partnerId === targetId) {
        return true
      }

      if (targetEmail && partnerEmail && partnerEmail === targetEmail) {
        return true
      }

      return false
    })
  }, [data, offlinePartners])

  const derivedPartnerOrgId = useMemo(() => {
    const candidateSources: Array<any> = [
      currentPartnerRecord?.partnerOrgId,
      currentPartnerRecord?.partnerOrganizationId,
      currentPartnerRecord?.organizationCollaborationId,
      currentPartnerRecord?.organizationId,
      currentPartnerRecord?.id,
      data?.partnerOrgId,
      data?.partnerOrganizationId,
      data?.organizationCollaborationId,
      data?.organizationId,
      Array.isArray(data?.partnerOrgIds) ? data.partnerOrgIds[0] : undefined,
      data?.id
    ]

    for (const candidate of candidateSources) {
      if (candidate === undefined || candidate === null) continue
      const numericValue = Number(candidate)
      if (!Number.isNaN(numericValue) && numericValue > 0) {
        return numericValue
      }
    }

    return undefined
  }, [currentPartnerRecord, data])

  const {
    data: partnerAssignment,
    isLoading: isAssignmentQueryLoading,
    isFetching: isAssignmentQueryFetching
  } = useOfflinePartnerAssignment(derivedPartnerOrgId, {
    enabled: Boolean(derivedPartnerOrgId)
  })

  const assignmentUserId = useMemo(() => {
    if (!partnerAssignment) return undefined

    const candidates: Array<string | number | undefined | null> = [
      partnerAssignment?.userId,
      partnerAssignment?.user?.id,
      partnerAssignment?.user?.userId
    ]

    const candidate = candidates.find(
      (value) =>
        value !== undefined && value !== null && String(value).trim().length > 0
    )

    return candidate !== undefined && candidate !== null
      ? String(candidate)
      : undefined
  }, [partnerAssignment])

  const assignedMember = useMemo(() => {
    if (assignmentUserId) {
      const fromAssignment = teamMembers.find(
        (member) => member.userId === assignmentUserId
      )
      if (fromAssignment) {
        return fromAssignment
      }
    }

    if (!currentPartnerRecord || !teamMembers.length) return undefined

    const assignmentCandidates = [
      currentPartnerRecord?.userId,
      currentPartnerRecord?.user?.id,
      currentPartnerRecord?.user?.userId,
      currentPartnerRecord?.assignedUserId,
      currentPartnerRecord?.assignedToUserId
    ]
      .map((candidate) =>
        candidate !== undefined && candidate !== null ? String(candidate) : null
      )
      .filter(Boolean) as string[]

    const matchById = assignmentCandidates.find((candidate) =>
      teamMembers.some((member) => member.userId === candidate)
    )

    if (matchById) {
      return teamMembers.find((member) => member.userId === matchById)
    }

    const assignedEmail =
      typeof currentPartnerRecord?.userEmail === 'string'
        ? currentPartnerRecord.userEmail.trim().toLowerCase()
        : undefined

    if (assignedEmail) {
      return teamMembers.find(
        (member) =>
          member.email && member.email.trim().toLowerCase() === assignedEmail
      )
    }

    return undefined
  }, [assignmentUserId, currentPartnerRecord, teamMembers])

  useEffect(() => {
    if (assignmentUserId) {
      setSelectedMemberId(assignmentUserId)
      return
    }

    if (assignedMember?.userId) {
      setSelectedMemberId(assignedMember.userId)
      return
    }

    setSelectedMemberId(null)
  }, [assignmentUserId, assignedMember])

  const handleMemberSelection = (value?: string) => {
    if (inDummyFlow) {
      handleDummyAction()
      return
    }

    if (!value || value === selectedMemberId) return

    if (!derivedPartnerOrgId) {
      showCustomToast(
        'Error',
        'Partner organization details missing. Please try again.',
        'error',
        5000
      )
      return
    }

    const member = teamMembers.find((item) => item.userId === value)

    if (!member) {
      showCustomToast(
        'Error',
        'Unable to identify the selected member.',
        'error',
        5000
      )
      return
    }

    const previousMemberId = selectedMemberId
    setSelectedMemberId(value)

    assignMutation.mutate(
      {
        userId: member.userId,
        partnerOrgId: derivedPartnerOrgId
      },
      {
        onError: () => {
          setSelectedMemberId(previousMemberId ?? null)
        }
      }
    )
  }

  const handleConnectTrello = () => {
    if (inDummyFlow) {
      handleDummyAction()
      return
    }
    const partnerIdValue = derivedPartnerOrgId || data?.id
    const trelloAuthUrl = `/api/trello?source=partnership&partnerId=${partnerIdValue}`
    window.location.href = trelloAuthUrl
  }

  const isAssignmentLoading =
    isTeamLoading ||
    isTeamFetching ||
    isPartnersLoading ||
    isPartnersFetching ||
    isAssignmentQueryLoading ||
    isAssignmentQueryFetching

  return (
    <aside className='h-full w-full shrink-0 lg:w-[300px]'>
      <div className='flex h-full w-full flex-col gap-6 lg:max-w-[360px]'>
        {!data || isLoading ? (
          <div className='flex animate-pulse flex-col gap-4 rounded-xl border bg-white p-4'>
            <div className='h-4 w-1/2 rounded bg-gray-200' />
            <div className='h-3 w-3/4 rounded bg-gray-200' />
            <div className='h-3 w-2/3 rounded bg-gray-200' />
          </div>
        ) : (
          <div className='min-h-full rounded-xl border bg-white py-4'>
            {/* Primary Information Section */}
            <div className='flex flex-col gap-4 px-4 pb-4'>
              <div className='flex items-center justify-between'>
                <span className='text-base font-bold text-text-100'>
                  Primary Information
                </span>
                <button
                  className='text-text-60 hover:text-text-100'
                  onClick={(e) => {
                    if (inDummyFlow) {
                      e.preventDefault()
                      handleDummyAction()
                    }
                  }}
                >
                  <EditIcon />
                </button>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-1.5'>
                  <span className='text-sm font-medium text-text-100'>
                    {data?.name ||
                      data?.partnerName ||
                      data?.contactName ||
                      'N.A.'}
                  </span>
                  {data?.contactTitle && (
                    <span className='text-xs text-text-60'>
                      {data.contactTitle}
                    </span>
                  )}
                </div>

                <div className='flex items-center gap-1'>
                  <Sms size='20' color='#7688A8' />
                  <span className='text-sm font-medium text-primary-light-blue'>
                    {data?.email || 'N.A'}
                  </span>
                  <button
                    className='border-none bg-transparent outline-none'
                    onClick={() =>
                      data?.email && navigator.clipboard.writeText(data.email)
                    }
                  >
                    <Copy size='20' color='#7688A8' />
                  </button>
                </div>

                {data?.phone && (
                  <div className='flex items-center gap-1'>
                    <Call size='20' color='#7688A8' />
                    <span className='text-sm font-medium text-text-100'>
                      {data.phone}
                    </span>
                    <button
                      className='border-none bg-transparent outline-none'
                      onClick={() => navigator.clipboard.writeText(data.phone)}
                    >
                      <Copy size='20' color='#7688A8' />
                    </button>
                  </div>
                )}

                {data?.website && (
                  <div className='flex items-center gap-1'>
                    <Global size='20' color='#7688A8' />
                    <Link href={data.website} target='_blank'>
                      <span className='text-sm font-medium text-primary-light-blue'>
                        {data.website}
                      </span>
                    </Link>
                  </div>
                )}

                {data?.location && (
                  <div className='flex items-center gap-1'>
                    <Location size='20' color='#7688A8' />
                    <span className='text-sm font-medium capitalize text-text-100'>
                      {data.location}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Tags Section */}
            <div className='flex flex-col gap-4 px-4 pt-4'>
              <span className='text-base font-bold text-text-100'>Tags</span>

              <div className='flex flex-wrap gap-2'>
                {data?.tags &&
                Array.isArray(data.tags) &&
                data.tags.length > 0 ? (
                  data.tags.map((tag: string, index: number) => (
                    <span
                      key={`${tag}-${index}`}
                      className='rounded-full bg-primary-blue px-3 py-1 text-xs font-medium text-white'
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <>
                    <span className='rounded-full border border-blue-400 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'>
                      B2B
                    </span>
                    <span className='rounded-full border border-blue-400 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'>
                      Fintech
                    </span>
                    <span className='rounded-full border border-blue-400 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'>
                      India
                    </span>
                  </>
                )}
              </div>

              {data?.matchPercentage && (
                <div className='mt-2'>
                  <span className='rounded-full border border-green-400 bg-green-50 px-3 py-1 text-xs font-medium text-green-600'>
                    {data.matchPercentage}% Match
                  </span>
                </div>
              )}
            </div>

            <Separator className='mt-4' />

            {/* Partner Managers Section */}
            <div className='flex flex-col gap-4 px-4 pt-4'>
              <div className='flex items-center justify-between'>
                <span className='text-base font-bold text-text-100'>
                  Partner Managers
                </span>
                <Select
                  value={selectedMemberId ?? undefined}
                  onValueChange={handleMemberSelection}
                  disabled={
                    inDummyFlow ||
                    isAssignmentLoading ||
                    assignMutation.isPending ||
                    !teamMembers.length
                  }
                >
                  <SelectTrigger className='h-9 w-40 text-xs font-medium'>
                    <SelectValue
                      placeholder={
                        isAssignmentLoading ? 'Loading...' : 'Assign manager'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className='max-h-60'>
                    {isAssignmentLoading ? (
                      <div className='px-3 py-2 text-xs text-text-60'>
                        Loading members...
                      </div>
                    ) : teamMembers.length ? (
                      teamMembers.map((member) => (
                        <SelectItem
                          key={member.userId}
                          value={member.userId}
                          className='text-sm'
                        >
                          <div className='flex flex-col'>
                            <span className='font-medium text-text-100'>
                              {member.name}
                            </span>
                            {member.email && (
                              <span className='text-xs text-text-60'>
                                {member.email}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className='px-3 py-2 text-xs text-text-60'>
                        No team members found.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className='rounded-lg border border-dashed border-text-40 bg-text-10 p-3'>
                {assignMutation.isPending ? (
                  <div className='flex h-12 items-center justify-center gap-2 text-sm text-text-60'>
                    <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-light-blue border-t-transparent' />
                    Saving assignment...
                  </div>
                ) : assignedMember ? (
                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary-light-blue/10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold uppercase text-primary-light-blue'>
                        {getInitials(assignedMember.name)}
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium text-text-100'>
                          {assignedMember.name}
                        </span>
                        {assignedMember.email && (
                          <span className='text-xs text-text-60'>
                            {assignedMember.email}
                          </span>
                        )}
                      </div>
                    </div>
                    {assignedMember.roles?.length ? (
                      <span className='bg-primary-blue/10 rounded-full px-3 py-1 text-xs font-medium text-primary-blue'>
                        {assignedMember.roles[0]}
                      </span>
                    ) : (
                      <Profile size='20' color='#7688A8' />
                    )}
                  </div>
                ) : isAssignmentLoading ? (
                  <div className='flex h-12 items-center justify-center gap-2 text-sm text-text-60'>
                    <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-light-blue border-t-transparent' />
                    Fetching assignment...
                  </div>
                ) : (
                  <p className='text-sm text-text-60'>
                    No partner manager assigned yet. Select a team member to
                    assign.
                  </p>
                )}
              </div> */}
            </div>

            {(data?.briefDescription || data?.sector || data?.companyType) && (
              <>
                <Separator className='mt-4' />

                <div className='flex flex-col gap-4 px-4 pt-4'>
                  <div className='grid grid-cols-1 gap-2'>
                    {data?.briefDescription && (
                      <div className='grid grid-cols-1'>
                        <p className='text-xs font-medium text-[#7688A8]'>
                          Description
                        </p>
                        <p className='text-xs font-normal text-[#2A3241]'>
                          {data.briefDescription}
                        </p>
                      </div>
                    )}

                    {data?.sector && (
                      <div className='grid grid-cols-1'>
                        <p className='text-xs font-medium text-[#7688A8]'>
                          Sector
                        </p>
                        <p className='text-xs font-bold text-[#2A3241]'>
                          {data.sector}
                        </p>
                      </div>
                    )}

                    {data?.companyType && (
                      <div className='grid grid-cols-1'>
                        <p className='text-xs font-medium text-[#7688A8]'>
                          Company Type
                        </p>
                        <p className='text-xs font-bold text-[#2A3241]'>
                          {data.companyType}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator className='mt-4' />

            {/* Integrations */}
            <div className='flex flex-col gap-4 px-4 pt-4'>
              <div className='flex items-center justify-between'>
                <span className='text-base font-bold text-text-100'>
                  Integrations
                </span>
                <button className='flex items-center gap-1 text-xs font-medium text-primary-light-blue hover:underline'>
                  <IconDots size={16} color='#000000' />
                </button>
              </div>

              {isIntegrationsLoading ? (
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-text-60'>
                    Checking connection...
                  </span>
                </div>
              ) : isTrelloConnected ? (
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-text-100'>
                    Connected to
                  </span>
                  <div className='flex items-center gap-2'>
                    <Image
                      src='/icons/trello-icon.svg'
                      alt='Trello'
                      width={20}
                      height={20}
                    />
                    <span className='text-sm font-medium text-text-100'>
                      Trello
                    </span>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-text-60'>
                      Not connected to
                    </span>
                    <div className='flex items-center gap-2'>
                      <Image
                        src='/icons/trello-icon.svg'
                        alt='Trello'
                        width={20}
                        height={20}
                      />
                      <span className='text-sm font-medium text-text-60'>
                        Trello
                      </span>
                    </div>
                  </div>
                  <Button
                    variant='primary'
                    size='sm'
                    onClick={handleConnectTrello}
                    className='w-fit text-xs font-medium text-white hover:text-white'
                  >
                    Connect Trello
                  </Button>
                </div>
              )}

              {isTrelloConnected && (
                <>
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm font-medium text-text-100'>
                        Auto sync
                      </span>
                      <span className='text-xs text-text-60'>
                        Sync every 2 hours
                      </span>
                    </div>
                    <Switch
                      defaultChecked={true}
                      disabled={inDummyFlow}
                      className='h-5 w-9 data-[state=checked]:bg-green-500'
                      onCheckedChange={(checked) => {
                        if (inDummyFlow) {
                          handleDummyAction()
                        }
                      }}
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-text-100'>
                      Sync now?
                    </span>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-1 text-sm font-medium text-primary-light-blue hover:text-primary-blue'
                      onClick={() => {
                        if (inDummyFlow) {
                          handleDummyAction()
                        }
                      }}
                    >
                      <IconRefresh size={16} />
                      Manual sync
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default PartnerSidebar
