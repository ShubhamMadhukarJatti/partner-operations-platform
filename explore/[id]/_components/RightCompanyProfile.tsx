import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Globe, Users2 } from 'lucide-react'

import { useSpecificConfigData } from '@/lib/useConfig'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

import { PREFERRED_SECTORS } from '../../../_components/organization-card'
import CompanyDetailsPlaceholder from './placeholders/CompanyDetailsPlaceholder'

const RightCompanyProfile: React.FC<{
  org: any
  match: any
  isLoading?: boolean
}> = ({ org, match, isLoading = false }) => {
  const { isLoading: configLoading, preferredSectors } = useSpecificConfigData([
    'PREFERRED_SECTORS'
  ])

  return (
    <aside className=' h-full w-full shrink-0 lg:w-[300px]'>
      <div className='flex h-full w-full flex-col gap-6 lg:max-w-[360px]'>
        {!org || isLoading ? (
          <CompanyDetailsPlaceholder />
        ) : (
          <div
            className={cn(
              'min-h-full rounded-xl border bg-white py-4 lg:pb-14'
            )}
          >
            <div className='flex flex-col gap-4 px-4  pb-4'>
              <div className='space-y-2'>
                <div className='grid grid-cols-2'>
                  <p className='flex items-center gap-2  text-xs font-normal text-[#7688A8]'>
                    <Globe size={16} stroke='#2563EB' /> Website{' '}
                  </p>
                  {org?.website ? (
                    <Link href={org.website} target='_blank'>
                      <span className='inline-flex items-center text-shark-sm font-normal text-primary-light-blue'>
                        Visit Website
                      </span>
                    </Link>
                  ) : (
                    <span className='text-shark-sm font-bold text-text-100'>
                      -
                    </span>
                  )}
                </div>
                <div className='grid grid-cols-2'>
                  <p className='flex items-center gap-2 text-xs font-normal text-[#7688A8]'>
                    <Calendar size={16} stroke='#2563EB' /> Member since{' '}
                  </p>
                  <p className='flex items-center gap-2 text-sm font-medium text-[#2A3241]'>
                    {new Date(org?.creationTimestamp).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }
                    )}
                  </p>
                </div>
                <div className='grid grid-cols-2'>
                  <p className='flex items-center gap-2 text-xs font-normal text-[#7688A8]'>
                    <Users2 size={16} stroke='#2563EB' /> Active Partnerships
                  </p>

                  <p className='text-sm font-medium text-[#2A3241]'>
                    {org?.activePartnerships > 0 ? org.activePartnerships : '-'}
                  </p>
                </div>
                <div className='grid grid-cols-2'>
                  <p className='flex items-center gap-2 text-xs font-normal text-[#7688A8]'>
                    <Users2 size={16} stroke='#2563EB' /> In-line Partnerships
                  </p>

                  <p className='text-sm font-medium text-[#2A3241]'>
                    {org?.pipelinePartnerships > 0
                      ? org.pipelinePartnerships
                      : '-'}
                  </p>
                </div>
              </div>
              <Separator className='' />
              <div className='flex flex-col gap-2'>
                <div className={cn('grid grid-cols-1 gap-2 ')}>
                  <div className='grid grid-cols-2 gap-1'>
                    <p className='text-xs font-medium text-[#7688A8] '>
                      Legal Name
                    </p>
                    <p className='text-xs font-bold text-[#2A3241]'>
                      {org?.legalName || '-'}
                    </p>
                  </div>
                  <div className='grid grid-cols-2 '>
                    <p className='text-xs font-medium text-[#7688A8] '>
                      Founded On
                    </p>
                    <p className='text-xs font-bold text-[#2A3241]'>
                      {org?.inceptionYear || '-'}
                    </p>
                  </div>
                  <div className='grid grid-cols-2 '>
                    <p className='text-xs font-medium text-[#7688A8] '>
                      Accessible APIs
                    </p>
                    <p className='text-xs font-bold text-[#2A3241]'>
                      {org?.accessibleApisVisible || '-'}
                    </p>
                  </div>
                  <div className='grid grid-cols-2'>
                    <p className='text-xs font-medium text-[#7688A8] '>
                      Meeting success rate
                    </p>
                    <p className='text-xs font-bold text-[#2A3241]'>
                      {org?.meetingSuccessRate
                        ? `${org.meetingSuccessRate}%`
                        : '-'}
                    </p>
                  </div>
                  <div className='grid grid-cols-2 '>
                    <p className='text-xs font-medium text-[#7688A8] '>
                      Acknowledgement time
                    </p>
                    <p className='text-xs font-bold text-[#2A3241]'>
                      {org?.acknowledgmentTime || '-'} hr
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <div className='flex w-full flex-col gap-2.5 lg:flex-row'>
                    <div className='flex grow flex-col gap-6'>
                        {loading && personaLoading ? (
                            <CustomerPersona />
                        ) : (
                            <CreatePersonaModal
                                currentOrganization={currentOrg}
                                organization={org}
                                setPersonaLoading={setPersonaLoading}
                            />
                        )}

                        {org?.organizationCollaborations ? (
                            <CompanyPartners
                                about={org?.about}
                                name={org?.name}
                                heading={`Partners active on sharkdom`}
                                partners={org.organizationCollaborations}
                            />
                        ) : (
                            <About title={'About'} />
                        )}

                        {org?.services ? (
                            <About title={'Services'} />
                        ) : org?.services.length !== 0 ? (
                            <ServicesCard services={org?.services} />
                        ) : (
                            <></>
                        )}
                    </div>
                    {!(currentOrg && org) ? (
                        <CustomerSidebar />
                    ) : (
                        <CompanyDetailsSidebar
                            currentOrganization={currentOrg}
                            organization={org}
                            prompt={compabilityPrompt}
                            collabStatus={collabStatus}
                        />
                    )}
                </div> */}

        {/* {org?.about && <DetailCard heading='About' text={org.about} />} */}
        {/* {currentOrg.planCode === 'FREE' && <InsightsSection />} */}
        {/* <ProposalUpgrade currentOrg={currentOrg} /> */}
      </div>
    </aside>
  )
}

export default RightCompanyProfile
