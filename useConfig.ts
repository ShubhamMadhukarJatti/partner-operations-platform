import { useMemo } from 'react'
import { useQueries, useQueryClient } from '@tanstack/react-query'

import { getConfigByType } from './db/configuration'

type ConfigType =
  | 'PREFERRED_SECTORS'
  | 'PREFERRED_PARTNERSHIPS'
  | 'PREFERRED_SUB_SECTORS'
  | 'PLAYGROUND'
  | 'PLAYGROUND_HINT'
  | 'TRENDING_STARTUP'
  | 'USER_DESIGNATION'
  | 'BENEFITS'
  | 'ACCESS_CONTROL'
  | 'NEW_PRICING'
  | 'TRIAL_PRICING'
  | 'RESTRICTED_INDUSTRY'
  | 'GEOGRAPHY_DD'
  | 'MARKETING_CHANNELS'
  | 'COMPLIANCE'

type ConfigKey = {
  key: ConfigType
  queryKey: [string]
}

type ConfigData = {
  preferredSectors: any
  preferredPartnerships: any
  preferredSubSectors: any
  playgroundOptions: any
  playgroundOptionHints: any
  trendingStartup: any
  userDesignation: any
  benefits: any
  accessControl: any
  newPricing: any
  trialPricing: any
  restrictedIndustry: any
  geography: any
  marketingChannels: any
  compliance: any
}

const CONFIG_KEYS: ConfigKey[] = [
  { key: 'PREFERRED_SECTORS', queryKey: ['preferredSectors'] },
  { key: 'PREFERRED_PARTNERSHIPS', queryKey: ['preferredPartnerships'] },
  { key: 'PREFERRED_SUB_SECTORS', queryKey: ['preferredSubSectors'] },
  { key: 'PLAYGROUND', queryKey: ['playgroundOptions'] },
  { key: 'PLAYGROUND_HINT', queryKey: ['playgroundOptionHints'] },
  { key: 'TRENDING_STARTUP', queryKey: ['trendingStartup'] },
  { key: 'USER_DESIGNATION', queryKey: ['userDesignation'] },
  { key: 'BENEFITS', queryKey: ['benefits'] },
  { key: 'ACCESS_CONTROL', queryKey: ['accessControl'] },
  { key: 'NEW_PRICING', queryKey: ['newPricing'] },
  { key: 'TRIAL_PRICING', queryKey: ['trialPricing'] },
  { key: 'RESTRICTED_INDUSTRY', queryKey: ['restrictedIndustry'] },
  { key: 'GEOGRAPHY_DD', queryKey: ['geography'] },
  { key: 'MARKETING_CHANNELS', queryKey: ['marketingChannels'] },
  { key: 'COMPLIANCE', queryKey: ['compliance'] }
]

// Memoize the fetch function to prevent recreation on each render
const fetchConfigByType = async (type: ConfigType) => {
  const response = await getConfigByType(type)
  return response
}

export const useConfigData = () => {
  const queryClient = useQueryClient()

  // Memoize the queries configuration to prevent recreation on each render
  const queries = useMemo(
    () =>
      CONFIG_KEYS.map(({ key, queryKey }) => ({
        queryKey,
        queryFn: () => fetchConfigByType(key),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false, // Prevent refetching when window regains focus
        refetchOnMount: false // Prevent refetching on component mount if data is already in cache
      })),
    []
  )

  const results = useQueries({
    queries
  })

  const isLoading = results.some((result) => result.isLoading)
  const isError = results.some((result) => result.isError)

  // Memoize the config data to prevent unnecessary recalculations
  const configData = useMemo(
    () =>
      results.reduce<Partial<ConfigData>>((acc, result, index) => {
        const key = CONFIG_KEYS[index].queryKey[0] as keyof ConfigData
        acc[key] = result.data
        return acc
      }, {}),
    [results]
  )

  return {
    isLoading,
    isError,
    ...configData
  }
}
export const useSpecificConfigData = (configsArray: ConfigType[]) => {
  // const queryClient = useQueryClient()
  const selectedConfig = CONFIG_KEYS.filter((config) =>
    configsArray.includes(config.key)
  )
  // Memoize the queries configuration to prevent recreation on each render
  const queries = useMemo(
    () =>
      selectedConfig.map(({ key, queryKey }) => ({
        queryKey,
        queryFn: () => fetchConfigByType(key),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false, // Prevent refetching when window regains focus
        refetchOnMount: false // Prevent refetching on component mount if data is already in cache
      })),
    [selectedConfig]
  )

  const results = useQueries({
    queries
  })

  const isLoading = results.some((result) => result.isLoading)
  const isError = results.some((result) => result.isError)

  // Memoize the config data to prevent unnecessary recalculations
  const configData = useMemo(
    () =>
      results.reduce<Partial<ConfigData>>((acc, result, index) => {
        const key = selectedConfig[index].queryKey[0] as keyof ConfigData
        acc[key] = result.data
        return acc
      }, {}),
    [results, selectedConfig]
  )

  return {
    isLoading,
    isError,
    ...configData
  }
}
