import {
  createProject,
  createVersion,
  deploy,
  updateProject
} from '@/services/ppi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { showCustomToast } from '@/components/custom-toast'

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      return await createProject(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] })
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.errorMessage ?? 'Error Creating Project',
        'error',
        5000
      )
    }
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      return await updateProject(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] })
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.errorMessage ?? 'Error Updating Project',
        'error',
        5000
      )
    }
  })
}

export const useCreateVersion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      return await createVersion(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] })
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.errorMessage ?? 'Error Updating Project',
        'error',
        5000
      )
    }
  })
}

export const useDeploy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => {
      return await deploy(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] })
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.errorMessage ?? 'Error Updating Project',
        'error',
        5000
      )
    }
  })
}
