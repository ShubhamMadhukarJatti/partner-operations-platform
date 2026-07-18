import type { ReactNode } from 'react'
import { cookies } from 'next/headers'

import { PartnerSessionProvider } from './_components/PartnerSessionContext'

export default function PartnerProgramPortalAppLayout({
  children
}: {
  children: ReactNode
}) {
  const cookieStore = cookies()
  const token = cookieStore.get('partnerAccessToken')?.value || null
  const userCookie = cookieStore.get('user')?.value
  let user = null
  if (userCookie) {
    try {
      user = JSON.parse(userCookie)
    } catch (e) {
      console.error('PartnerProgramPortalAppLayout JSON parse error:', e)
    }
  }

  return (
    <PartnerSessionProvider initialToken={token} initialUser={user}>
      {children}
    </PartnerSessionProvider>
  )
}
