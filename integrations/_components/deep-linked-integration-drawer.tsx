'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import IntegrationDrawer from './integration-drawer'

interface DeepLinkedIntegrationDrawerProps {
  integration: any
  isHubspotLoading?: boolean
  children?: React.ReactNode
}

const DeepLinkedIntegrationDrawer = ({
  integration,
  isHubspotLoading,
  children
}: DeepLinkedIntegrationDrawerProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isMatch = searchParams.get('integration')?.toUpperCase() === integration.id.toUpperCase()
  const [isOpen, setIsOpen] = useState(isMatch)

  useEffect(() => {
    setIsOpen(isMatch)
  }, [isMatch])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      const currentParams = new URLSearchParams(searchParams.toString())
      if (currentParams.has('integration')) {
        currentParams.delete('integration')
        const query = currentParams.toString()
        const target = query ? `${pathname}?${query}` : pathname
        router.replace(target)
      }
    }
  }

  return (
    <IntegrationDrawer
      integration={integration}
      isHubspotLoading={isHubspotLoading}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      {children}
    </IntegrationDrawer>
  )
}

export default DeepLinkedIntegrationDrawer
