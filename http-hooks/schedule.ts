import { RootState } from '@/redux/store'
import {
  changeSetting,
  createEvent,
  fetchAllEvents,
  fetchOrgSettings
} from '@/services/schedule'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { showCustomToast } from '@/components/custom-toast'
import { eventDuration } from '@/app/(app)/(dashboard-pages)/my-schedule/_components/FilterDropdown'

export const useGetAllEvents = (duration: eventDuration) => {
  const query = useQuery({
    queryKey: ['events', duration],
    queryFn: async () => await fetchAllEvents(duration),
    enabled: !!duration
  })

  return query
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      return await createEvent(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })

      showCustomToast(
        'Success',
        'Meeting Created Successfully',
        'success',
        5000
      )
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.errorMessage ?? 'Error Creating Meeting',
        'error',
        5000
      )
    }
  })
}

export const useSetEventSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      return await changeSetting(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleSettings'] })

      showCustomToast(
        'Success',
        'Settings Updated Successfully',
        'success',
        5000
      )
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.errorMessage ?? 'Error updating setting',
        'error',
        5000
      )
    }
  })
}

export const useGetScheduleSettings = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)

  const { organization } = saved

  const query = useQuery({
    queryKey: ['scheduleSettings', organization?.id],
    queryFn: async () => await fetchOrgSettings(organization?.id),
    enabled: !!organization.id
  })

  return query
}
