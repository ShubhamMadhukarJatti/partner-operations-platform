import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { OrganizationType } from '@/types'

import { getPersonaDetails } from '@/lib/db/customer-persona'
import { Button } from '@/components/ui/button'
import DashboardItemWrapper from '@/app/(app)/(dashboard-pages)/dashboard/[id]/_components/dashboard-item-wrapper'
import CompanySizeChart from '@/app/(app)/(dashboard-pages)/explore-2/_components/company-size-chart'
import { createVennSets } from '@/app/(startup)/company/_components/venn-sets'
import VennDiagram from '@/app/(startup)/company/_components/VienDiagram'

type CreatePersonaProp = {
  currentOrganization: OrganizationType
  organization: OrganizationType
}

const CreatePersona = async ({
  currentOrganization,
  organization
}: CreatePersonaProp) => {
  if (!currentOrganization || !organization) {
    console.error('Invalid organization IDs')
    return null
  }

  const currentPersona = await getPersonaDetails(currentOrganization.id)
  const persona = await getPersonaDetails(organization.id)

  if (!currentPersona || !persona) {
    console.error('Failed to fetch persona details')
    return null
  }

  // Validate and create Venn diagram data for different attributes
  const createValidVennData = (attr1: any[], attr2: any[]) => {
    if (!Array.isArray(attr1) || !Array.isArray(attr2)) {
      console.error('Invalid attribute data')
      return []
    }
    return createVennSets(attr1, attr2)
  }

  if (!currentPersona || !persona) {
    return (
      <DashboardItemWrapper className='flex h-64 items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-400 border-t-transparent'></div>
      </DashboardItemWrapper>
    )
  }

  return (
    <DashboardItemWrapper className='bg-background-ghost-white p-4'>
      <div className='flex items-center justify-between'>
        <h2 className='fds-text-semibold text-text-100'>Customer Persona</h2>

        {currentPersona?.personaStatus !== 'COMPLETED' ||
          (persona?.personaStatus !== 'COMPLETED' && (
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <span className='size-2.5 shrink-0 rounded-full bg-[#83C41380]' />
                <span className='fds-text-sm text-text-100'>
                  {currentOrganization.name}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='size-2.5 shrink-0 rounded-full bg-[#0062F180]' />
                <span className='fds-text-sm text-text-100'>
                  {organization.name}
                </span>
              </div>
            </div>
          ))}
      </div>
      {currentPersona?.personaStatus !== 'COMPLETED' ||
      persona?.personaStatus !== 'COMPLETED' ? (
        <div className='flex flex-col items-center justify-between gap-4 py-4 lg:flex-row'>
          <Image
            src='/persona-chart-dots.svg'
            alt='Persona'
            width={249}
            height={180}
          />

          <div className='flex max-w-xs flex-col items-center gap-4 lg:items-end'>
            <p className='fds-text-lead-semibold text-text-100 lg:text-right'>
              {currentPersona?.personaStatus !== 'COMPLETED'
                ? ` Unlock high-value partnerships by creating your
              organization's Ideal Customer Persona.`
                : `Seems like Your ideal partner has not created their Customer Persona.`}
            </p>

            {currentPersona?.personaStatus !== 'COMPLETED' ? (
              <Link href='/partner-match'>
                <Button className='fds-text-sm h-[37px]  w-[190px] gap-1 rounded-lg border border-primary-light-blue bg-transparent text-primary-light-blue hover:bg-background-ghost-white hover:text-primary-light-blue '>
                  Create
                </Button>
              </Link>
            ) : (
              <Button className='fds-text-sm h-[37px]  w-[190px] gap-1 rounded-lg border border-primary-light-blue bg-transparent text-primary-light-blue hover:bg-background-ghost-white hover:text-primary-light-blue '>
                Remind Them
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          {(() => {
            const hasValidData =
              currentPersona.category &&
              persona.category &&
              currentPersona.category.marketSegment &&
              persona.category.marketSegment &&
              currentPersona.category.companySector &&
              persona.category.companySector &&
              currentPersona.category.companySize &&
              persona.category.companySize &&
              currentPersona.category.isPartnershipProgram &&
              persona.category.isPartnershipProgram

            if (!hasValidData) {
              return (
                <div className='p-8'>
                  <p className='fds-text-sm text-center text-text-100'>
                    Persona data is missing or incomplete. Please ensure both
                    parties have provided their customer personas.
                  </p>
                </div>
              )
            }

            const vennData = createValidVennData(
              currentPersona.category.marketSegment,
              persona.category.marketSegment
            )
            const vennData2 = createValidVennData(
              currentPersona.category.companySector,
              persona.category.companySector
            )
            const vennData3 = createValidVennData(
              currentPersona.category.companySize,
              persona.category.companySize
            )

            return (
              <div>
                <div className='mt-4 grid grid-cols-2'>
                  <div className='relative flex items-center justify-center border-b border-r border-text-20'>
                    <VennDiagramSection
                      title='Market Segment'
                      vennData={vennData}
                      currentOrganization={currentOrganization}
                      organization={organization}
                    />
                  </div>

                  <div className='relative flex items-center justify-center border-b border-l border-text-20'>
                    <VennDiagramSection
                      title='Industries'
                      vennData={vennData2}
                      currentOrganization={currentOrganization}
                      organization={organization}
                    />
                  </div>

                  <div className='relative flex items-center justify-center border-r border-t border-text-20'>
                    <CompanySizeChart
                      persona={persona.category.companySize}
                      currentPersona={currentPersona.category.companySize}
                      label={vennData3}
                    />
                  </div>

                  <div className='relative flex items-center justify-center border-l border-t border-text-20'>
                    <PartnershipMatch
                      persona={persona.category.isPartnershipProgram}
                      currentPersona={
                        currentPersona.category.isPartnershipProgram
                      }
                    />
                  </div>
                </div>
              </div>
            )
          })()}
        </>
      )}
    </DashboardItemWrapper>
  )
}

// A reusable VennDiagram section component for optimization
const VennDiagramSection = ({
  title,
  vennData,
  currentOrganization,
  organization
}: {
  title: string
  vennData: any[]
  currentOrganization: OrganizationType
  organization: OrganizationType
}) => (
  <div className='relative  max-w-[236px]  py-4'>
    {/* Title Section */}
    <div className='mb-4'>
      <h3 className='fds-text-sm text-text-100'>{title}</h3>
      <div className='flex items-baseline'>
        <span className='fds-heading text-primary-light-blue'>
          {vennData.length > 2 ? vennData[2]?.label : '0'}%
        </span>
        <span className='ml-1 text-shark-xs text-text-100 '>match</span>
      </div>
    </div>
    {vennData.length > 0 && <VennDiagram sets={vennData} />}
  </div>
)

const PartnershipMatch = ({ persona, currentPersona }: any) => {
  // Variables to hold the active and inactive percentages
  let personaActivePercentage = 0
  let personaInactivePercentage = 0

  let currentActivePercentage = 0
  let currentInactivePercentage = 0

  // Calculate persona percentages based on the key
  if (persona[0]?.key === 'True') {
    personaActivePercentage = persona[0]?.percentage
    personaInactivePercentage = 100 - personaActivePercentage
  } else if (persona[0]?.key === 'False') {
    personaInactivePercentage = persona[0]?.percentage
    personaActivePercentage = 100 - personaInactivePercentage
  }

  // Calculate current persona percentages based on the key
  if (currentPersona[0]?.key === 'True') {
    currentActivePercentage = currentPersona[0]?.percentage
    currentInactivePercentage = 100 - currentActivePercentage
  } else if (currentPersona[0]?.key === 'False') {
    currentInactivePercentage = currentPersona[0]?.percentage
    currentActivePercentage = 100 - currentInactivePercentage
  }

  // Calculate the match percentage
  let matchPercentage = 0
  if (personaActivePercentage === 100 && currentActivePercentage === 100) {
    matchPercentage = 100 // Both are fully active
  } else if (
    personaInactivePercentage === 100 &&
    currentInactivePercentage === 100
  ) {
    matchPercentage = 0 // Both are fully inactive
  } else {
    matchPercentage =
      (personaActivePercentage /
        (personaActivePercentage + currentActivePercentage)) *
      100
  }

  return (
    <div className='relative max-w-[236px] py-4'>
      {/* Title Section */}
      <div className='mb-4'>
        <h3 className='fds-text-sm text-text-100'>Activated partnership</h3>
        <div className='flex items-baseline'>
          <span className='fds-heading text-primary-light-blue'>
            {matchPercentage.toFixed(0)}%
          </span>
          <span className='ml-1 text-shark-xs text-text-100'>match</span>
        </div>
      </div>

      {/* Bars Section */}
      <div className='space-y-4'>
        {/* Active Bar */}
        <div className='flex items-center gap-4'>
          <span className='w-10 text-xs font-semibold text-text-80'>
            Active
          </span>
          <div className='relative h-[45px] w-[181px] flex-1 overflow-hidden rounded-lg bg-[#C1E289]'>
            <div
              className='h-full bg-[#80B1F8]'
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
        </div>

        {/* Inactive Bar */}
        <div className='flex items-center gap-4'>
          <span className='w-10 text-xs font-semibold text-text-80'>
            Inactive
          </span>
          <div className='relative h-[45px] w-[181px] flex-1 overflow-hidden rounded-lg bg-[#C1E289]'>
            <div
              className='h-full bg-[#80B1F8]'
              style={{ width: `${100 - matchPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePersona
