'use client'

import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { query } from 'firebase/firestore'
import { useSelector } from 'react-redux'

import { getAllUserMappingsByOrgid } from '@/lib/db/user-mapping'

export const useFetchCurrentOrganisation = () => {
  const query = useQuery<OrganizationType>({
    queryKey: ['current-organization'],
    queryFn: async () => {
      const response = await fetch('/api/organization/current')
      if (!response.ok) {
        throw new Error('Failed to fetch current organization')
      }
      return await response.json()
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  })

  return query
}

export const useGetAllUserMappingsByOrgId = () => {
  // Use memoized selector to prevent unnecessary re-renders
  const organizationId = useSelector(
    (state: RootState) => state.currentOrg?.organization?.id
  )

  const query = useQuery<any>({
    queryKey: ['all-user', organizationId],
    queryFn: async () => await getAllUserMappingsByOrgid(organizationId),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  })
  return query
}

export const useGetTeamSection = (organizationId?: number) => {
  // Use memoized selector to prevent unnecessary re-renders
  const organizationIdFromStore = useSelector(
    (state: RootState) => state.currentOrg?.organization?.id
  )
  const orgId = organizationId || organizationIdFromStore

  const query = useQuery<any>({
    queryKey: ['team-section', orgId],
    queryFn: async () => {
      const response = await fetch(
        `/api/orgUserMapping/team/section?organizationId=${orgId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch team section data')
      }
      return await response.json()
    },
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  })
  return query
}
