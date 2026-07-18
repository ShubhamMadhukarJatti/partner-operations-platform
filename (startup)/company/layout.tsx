'use client'

import { useEffect } from 'react'
import { storeOrganizationData } from '@/redux/reducers/organization'
import { useDispatch } from 'react-redux'

import { getCurrentOrganization } from '@/lib/db/organization'
import { ReduxProviders } from '@/app/providers'

export default function StartupInfoLayout({
  children
}: {
  children: React.ReactNode
}) {
  const dispatch: any = useDispatch()

  const protectedRouteLayoutConditions = async () => {
    const currentOrganization = await getCurrentOrganization()

    dispatch(storeOrganizationData({ currentOrganization }))
  }

  useEffect(() => {
    protectedRouteLayoutConditions()
  }, [])

  return <ReduxProviders>{children}</ReduxProviders>
}
