'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { buildHubSpotOAuthUrl } from '@/lib/crm-oauth'

export default function ExternalButton({ isNew }: any) {
  const redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL || ''
  const authUrl = buildHubSpotOAuthUrl({
    redirectUri,
    source: 'integration-hub-external-button'
  })
  const handleClick = () => {
    window.open(authUrl)
  }
  return (
    <Link href='' onClick={() => handleClick()}>
      {isNew ? 'Set up app' : 'View Leads'}{' '}
      <ArrowRight className='ml-1 h-4 w-4 ' />
    </Link>
  )
}
