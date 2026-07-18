'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

interface OrganizationContextType {
  organization: any
  isLoading: boolean
  isReady: boolean
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  isLoading: true,
  isReady: false
})

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider'
    )
  }
  return context
}

interface OrganizationProviderProps {
  children: React.ReactNode
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({
  children
}) => {
  const currentOrg = useSelector((state: RootState) => state.currentOrg)
  const organizationData = useSelector((state: RootState) => state.organization)

  // Get organization from either location
  const organization = currentOrg.organization?.id
    ? currentOrg.organization
    : organizationData.organizationData
  const loading = currentOrg.loading
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    console.log('OrganizationProvider - Complete State:', {
      currentOrg: currentOrg.organization,
      organizationData: organizationData.organizationData,
      selectedOrganization: organization,
      organizationId: organization?.id,
      loading,
      isReady,
      currentOrgLoading: currentOrg.loading,
      organizationDataLoading: organizationData.lastFetched
    })

    // Mark as ready when we have organization data from either source
    if (organization?.id) {
      setIsReady(true)
    } else if (loading === 'failed' || loading === 'idle') {
      // If loading failed or is idle, mark as ready to show error states
      setIsReady(true)
    }
  }, [organization, loading, isReady, currentOrg, organizationData])

  const value = {
    organization,
    isLoading: loading === 'pending',
    isReady
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}
