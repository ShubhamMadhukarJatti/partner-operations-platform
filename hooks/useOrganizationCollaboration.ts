'use client'

import { useEffect, useState } from 'react'

import { getServerUser } from '@/lib/server'

export interface OrganizationCollaboration {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  senderOrganizationId: number
  receiverOrganizationId: number
  senderOrganizationName: string
  receiverOrganizationName: string
  senderUserId: string
  acceptorUserId: string
  status: string
  senderUrlsJson: string | null
  receiverUrlsJson: string | null
  chatAccessAllowed: boolean
  contactPersonUserId: string
  collaborationCategory: string | null
  partnershipMouVersions: Array<{
    id: number
    creationTimestamp: string
    lastUpdatedTimestamp: string
    organizationCollaborationId: number
    senderOrgSigner: string | null
    receiverOrgSigner: string | null
    senderOrgcontactPerson: string
    receiverOrgcontactPerson: string | null
    status: string
    version: number
    filePath: string | null
    senderBenefits: Array<{
      id: number
      creationTimestamp: string
      lastUpdatedTimestamp: string
      benefit: string
      description: string
      activeConversation: boolean
      status: string
    }>
    receiverBenefits: Array<{
      id: number
      creationTimestamp: string
      lastUpdatedTimestamp: string
      benefit: string
      description: string
      activeConversation: boolean
      status: string
    }>
    senderSignedOn: string | null
    receiverSignedOn: string | null
    senderOrgmodifiedByUserId: string | null
    receiverOrgmodifiedByUserId: string | null
    emailOpened: boolean
    emailClicked: boolean
    viewed: boolean
  }>
  meetingDetails: Array<any>
  senderLogo: string
  receiverLogo: string
  senderPersonaCreated: boolean
  activation: boolean
  outcome: boolean
  onboarding: boolean
}

export const useOrganizationCollaboration = (id: string | number) => {
  const [data, setData] = useState<OrganizationCollaboration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollaboration = async () => {
      try {
        setLoading(true)
        setError(null)
        const { token } = await getServerUser()

        const response = await fetch(
          `/api/organizationCollaboration/id?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log('collaboration response', { response })
        if (!response.ok) {
          throw new Error(
            `Failed to fetch collaboration: ${response.statusText}`
          )
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching organization collaboration:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCollaboration()
    }
  }, [id])

  return { data, loading, error }
}
