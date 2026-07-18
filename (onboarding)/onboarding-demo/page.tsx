import { Metadata } from 'next'

import { getConfigByType } from '@/lib/db/configuration'

import { CreateOrganizationForm } from '../_components/create-organization-form'
import Stepper from '../_components/stepper'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Sharkdom Onboarding | Demo | Modern day partner ops platform`,
  description:
    'Grow your brand using Go-To-Market platform. Register at Sharkdom today and find out how easy it is to find Ideal Partners for your businessess using AI'
}

export default async function OnboardingJoinPage() {
  // const { token } = await getServerUser()

  const [sectorData] = await Promise.all([
    // getConfigByType('USER_DESIGNATION'),
    getConfigByType('PREFERRED_SECTORS')
  ])

  // const designations = designationData.map((designation) => ({
  //   value: designation.key,
  //   label: designation.value
  // }))

  const sectors = sectorData.map((sector) => ({
    value: sector.value,
    label: sector.key
  }))

  return (
    <main className='container flex h-full flex-1 flex-col items-center justify-center gap-12 '>
      <Stepper demo={true} />
      <CreateOrganizationForm
        demo={true}
        // designations={designations}
        // sectors={sectors}
        // token={token!}
      />
    </main>
  )
}
