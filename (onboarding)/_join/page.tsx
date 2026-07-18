import { redirect } from 'next/navigation'

import { getConfigByType } from '@/lib/db/configuration'
import { getServerUser } from '@/lib/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { JoinOrganizationForm } from '../_components/join-organization-form'

export const dynamic = 'force-dynamic'

export default async function OnboardingJoinPage() {
  const designationsConfig = await getConfigByType('USER_DESIGNATION')
  const { token } = await getServerUser()
  if (!token) {
    redirect('/login')
  }
  return (
    <main className='container flex flex-1 items-center justify-center'>
      <Card className='w-full max-w-2xl'>
        <CardHeader className=''>
          <CardTitle className='font-medium'>Join your organization</CardTitle>
          <CardDescription className='text-base font-normal'>
            Enter your organization&apos;s name to join.
          </CardDescription>
        </CardHeader>
        <CardContent className=''>
          <JoinOrganizationForm
            designationsConfig={designationsConfig}
            token={token}
          />
        </CardContent>
      </Card>
    </main>
  )
}
