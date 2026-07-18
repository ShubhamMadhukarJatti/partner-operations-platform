import { redirect } from 'next/navigation'

import { getCurrentOrganization } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

import { Playground } from '.'

export const dynamic = 'force-dynamic'

export default async function PlaygroundPage() {
  const { token } = await getServerUser()
  const organization = await getCurrentOrganization()
  if (!token) {
    redirect('/login')
  }
  return <Playground token={token} organization={organization} />
}
