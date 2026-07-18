import React from 'react'
import { RootState } from '@/redux/store'
import {
  changePermission,
  createNewPersona,
  createNewPersonaOverlap,
  createPersonaOverlapCustomer,
  createPersonaOverlapRecord,
  deletePreview,
  disconnectPersonaCrm,
  fetchMyPersona,
  fetchPartnerPersona,
  fetchPermission,
  fetchPreview
} from '@/services/partner-match'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { showCustomToast } from '@/components/custom-toast'
import { recordType } from '@/app/(app)/(dashboard-pages)/my-data/_components/Segment'
import PartnershipDialog from '@/app/(startup)/company/_components/CompabilityScoreModal'

export interface personaFields {
  name: string
  companyName: string
  contactEmail: string
  domain: string
  dealStage: string
  creationDate: string
  closeDate: string
  subscribed: string
  ticketSize: string
}

interface PersonaPayload {
  organizationId: number
  sites: string[]
  names: string[]
  frequency: 'WEEKLY' | 'FIFTEEN_DAYS' | 'THIRTY_DAYS' | 'NINETY_DAYS'
  personaName: string
  personaMode: 'CSV' | 'HUBSPOT' | 'GOOGLE_SHEET' | 'ZOHO' | 'PIPEDRIVE'
}

interface PersonaOverlapPayload {
  organizationId: number
  frequency: 'WEEKLY' | 'FIFTEEN_DAYS' | 'THIRTY_DAYS' | 'NINETY_DAYS'
  personaName: string
  source: 'CSV' | 'HUBSPOT' | 'GOOGLE_SHEET' | 'ZOHO' | 'PIPEDRIVE'
  googleSheetLink?: string
  recordType: recordType
  fields: Record<string, string>[]
  fieldToColumnMapping: Record<string, string>
}
interface PermissionPayload {
  organizationId: number
  // accessType: 'FULL_ACCESS' | 'ONLY_COUNT' | 'HIDDEN' | 'PARTIAL',
  collaborationCategory:
    | 'RELIABLE_PARTNER'
    | 'STEADY_PARTNER'
    | 'LOW_IMPACT_PARTNER'
    | 'INACTIVE_PARTNER'
  permissions: {
    CUSTOMER: {
      accessType: 'FULL_ACCESS' | 'ONLY_COUNT' | 'HIDDEN' | 'PARTIAL'
      sharedFields: string[]
    }
    PROSPECT: {
      accessType: 'FULL_ACCESS' | 'ONLY_COUNT' | 'HIDDEN' | 'PARTIAL'
      sharedFields: string[]
    }
    OPPORTUNITY: {
      accessType: 'FULL_ACCESS' | 'ONLY_COUNT' | 'HIDDEN' | 'PARTIAL'
      sharedFields: string[]
    }
  }
}

export const useGetPersona = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['get-persona', organization?.id],
    queryFn: async () => {
      console.log(
        'useGetPersona - Making API call with org ID:',
        organization?.id
      )
      return await fetchMyPersona(organization?.id)
    },
    enabled: !!organization?.id,
    staleTime: 0, // Always fetch fresh — personaStatus changes frequently during sync
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: (query) => {
      const personaStatus = (
        query.state.data as { personaStatus?: string } | undefined
      )?.personaStatus

      return personaStatus === 'INITIATED' || personaStatus === 'PENDING'
        ? 15000
        : false
    }
  })

  // Debug logging
  React.useEffect(() => {
    // console.log('useGetPersona - Hook Status:', {
    //   organizationId: organization?.id,
    //   enabled: !!organization?.id,
    //   isLoading: query.isLoading,
    //   isError: query.isError,
    //   data: !!query.data,
    //   error: query.error
    // })
  }, [
    organization?.id,
    query.isLoading,
    query.isError,
    query.data,
    query.error
  ])

  return query
}

export const useCreatePersona = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PersonaPayload) => {
      return await createNewPersona(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-persona'] })
    },
    onError: (error) => {
      console.error('[useCreatePersona] Failed to create persona:', error)
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
    }
  })
}

export const useCreatePersonaOverlap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    retry: false,
    mutationFn: async (payload: PersonaOverlapPayload) => {
      return await createNewPersonaOverlap(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-persona'] })
    },
    onError: (error) => {
      console.error(
        '[useCreatePersonaOverlap] Failed to create persona:',
        error
      )
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
    }
  })
}

export const useGetPersonPartnerData = (partnerId: number | null) => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['get-partner-persona', partnerId],
    queryFn: async () => await fetchPartnerPersona(organization?.id, partnerId),
    enabled: !!(organization?.id && partnerId)
  })

  return query
}

export { useGetPartnerReport } from './partner-report'

export const useChangePermission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PermissionPayload) => {
      return await changePermission(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-group-permission'] })
      showCustomToast(
        'Success',
        'Permission Changed successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      console.error('[useChangePermission] Failed to change permission:', error)
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
    }
  })
}

export const useGetPersonPermissionData = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['get-group-permission'],
    queryFn: async () => await fetchPermission(organization?.id),
    enabled: !!organization?.id
  })

  return query
}

export const useGetAllPersonaPreview = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['get-persona', organization?.id],
    queryFn: async () => await fetchPreview(organization?.id),
    enabled: !!organization?.id
  })

  return query
}

export const useGetPersonaPreview = (
  recordType?: 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'
) => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['get-persona-preview', organization?.id, recordType],
    queryFn: async () => {
      console.log(
        'useGetPersonaPreview - Making API call with org ID:',
        organization?.id,
        'recordType:',
        recordType
      )
      return await fetchPreview(organization?.id, recordType)
    },
    enabled: !!organization?.id,
    staleTime: 30 * 1000, // 30 seconds — drives Pending Actions UI so needs to be fresh
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnMount: 'always' // Always refetch when my-data page mounts/re-enters
  })

  // Debug logging
  React.useEffect(() => {
    // console.log('useGetPersonaPreview - Hook Status:', {
    //   organizationId: organization?.id,
    //   recordType,
    //   enabled: !!organization?.id,
    //   isLoading: query.isLoading,
    //   isError: query.isError,
    //   data: !!query.data,
    //   error: query.error
    // })
  }, [
    organization?.id,
    recordType,
    query.isLoading,
    query.isError,
    query.data,
    query.error
  ])

  return query
}

export const useDeletePersona = () => {
  const queryClient = useQueryClient()
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  return useMutation({
    mutationFn: async (recordType: recordType) => {
      return await deletePreview(organization?.id, recordType)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-persona'] })
      showCustomToast('Success', 'Deleted', 'success', 5000)
    },
    onError: (error) => {
      console.error('[useDeletePersona] Failed to delete persona:', error)
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
    }
  })
}

export const useDisconnectPersonaCrm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      integrationType,
      recordType
    }: {
      integrationType: string
      recordType: 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'
    }) => {
      return await disconnectPersonaCrm(integrationType, recordType)
    },
    onSuccess: (_, { integrationType, recordType }) => {
      if (recordType === 'CUSTOMER') {
        // CUSTOMER disconnect: clear the entire persona + CRM connection state.
        queryClient.invalidateQueries({ queryKey: ['get-persona'] })
        queryClient.invalidateQueries({ queryKey: ['persona-versions'] })

        // Optimistically mark the OAuth integration as disconnected so ConnectYourCRM
        // immediately shows "Connect CRM" instead of "Customer Data Connected".
        queryClient.setQueryData(['connected-apps'], (oldData: any[]) => {
          if (!oldData) return oldData
          return oldData.map((app) =>
            app.integrationType === integrationType
              ? { ...app, refreshToken: null }
              : app
          )
        })
        queryClient.invalidateQueries({ queryKey: ['connected-apps'] })
      } else {
        // PROSPECT / OPPORTUNITY disconnect: only remove that record type's versioned data.
        // Do NOT touch connected-apps or get-persona — the CUSTOMER CRM connection must remain intact
        // so the "Customer Data Connected" UI and Pending Actions section stay visible.
        queryClient.refetchQueries({
          queryKey: ['overlap-record-versions'],
          type: 'all'
        })
        queryClient.refetchQueries({
          queryKey: ['get-persona-preview'],
          type: 'all'
        })
      }
    },
    onError: (error) => {
      console.error(
        '[useDisconnectPersonaCrm] Failed to disconnect CRM:',
        error
      )
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
    }
  })
}

export interface PersonaOverlapCustomerPayload {
  organizationId: number
  recordType: string
  fileName: string
  source: string
  frequency: string
  googleSheetLink?: string
  fields: Record<string, string>[]
  fieldToColumnMapping: Record<string, string>
  userId?: string
}

export const useCreatePersonaOverlapCustomer = () => {
  return useMutation({
    retry: false,
    mutationFn: async (payload: PersonaOverlapCustomerPayload) => {
      return await createPersonaOverlapCustomer(payload)
    },
    onError: (error) => {
      console.error(
        '[useCreatePersonaOverlapCustomer] Failed to save customer data:',
        error
      )
      // Don't show toast here — the caller handles user-facing feedback
    }
  })
}

export interface PersonaOverlapRecordPayload {
  organizationId: number
  recordType: 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'
  fileName: string
  source: string
  frequency: string
  googleSheetLink?: string
  fields: Record<string, string | null>[]
  fieldToColumnMapping: Record<string, string>
  userId?: string
}

/**
 * Generic hook — saves overlap records for any record type (CUSTOMER / PROSPECT / OPPORTUNITY).
 * Use this for all new record-saving logic.
 */
export const useCreatePersonaOverlapRecord = () => {
  return useMutation({
    retry: false,
    mutationFn: async (payload: PersonaOverlapRecordPayload) => {
      return await createPersonaOverlapRecord(payload)
    },
    onError: (error) => {
      console.error(
        '[useCreatePersonaOverlapRecord] Failed to save record data:',
        error
      )
    }
  })
}
