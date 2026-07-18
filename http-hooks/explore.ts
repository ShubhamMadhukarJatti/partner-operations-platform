import { RootState } from '@/redux/store'
import {
  getOrganizationById,
  updatePreferences
} from '@/services/organizations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { showCustomToast } from '@/components/custom-toast'
import { PreferenceType } from '@/app/(app)/(dashboard-pages)/explore/_components/preference-setting/PreferenceDialog'

export const useGetOrgById = (id: number) => {
  const query = useQuery({
    queryKey: ['orgData', id],
    queryFn: async () => await getOrganizationById(id),
    enabled: !!id
  })

  return query
}

export const useSetPreferences = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: PreferenceType) => {
      return await updatePreferences(params, organization?.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
      showCustomToast('Success', 'Preference Updated', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to update preferences',
        'error',
        5000
      )
    }
  })
}
