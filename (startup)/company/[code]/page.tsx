import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { OrganizationType } from '@/types'
import { Location, Medal, Star1 } from 'iconsax-react'

import { getCollaborationByTwoOrgs } from '@/lib/db/collaboration'
import { getConfigByType } from '@/lib/db/configuration'
import {
  getCurrentOrganization,
  // getOrganizationById,
  getOrgByCode
} from '@/lib/db/organization'
import { getCredits } from '@/lib/db/subscription'
import { getServerUser } from '@/lib/server'
import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import DashboardItemWrapper from '@/app/(app)/(dashboard-pages)/dashboard/[id]/_components/dashboard-item-wrapper'

import CompanyPageSidebar from '../_components/company-page-sidebar'
import CreatePersona from '../_components/CreatePersona'
import PublicProfileWrapper from '../_components/PublicProfileWrapper'
import StartupInfoHeader from '../_components/StartupInfoHeader'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    template: '',
    default: 'Sharkdom '
  },
  keywords: [
    'startup company',
    'tech startups',
    'mou',
    'start ups',
    'start up company',
    'ai startup',
    'partnership management platform',
    'sales enablement',
    'partner ecosystem',
    'sales enablement platform',
    'partner management',
    'channel sales',
    'startup company',
    'startup india',
    'startup business',
    'starting a company',
    'business to start',
    'business entrepreneurship',
    'business making',
    'partnership intelligence',
    'smart partnerships',
    'partnership marketplace',
    'ideal partners',
    'startup marketplace',
    'startup intelligence platform',
    'find right partnership for your platform',
    'automating partnership process',
    'virtual partnership ally',
    'assumptionless partnerships',
    'platform generated mou',
    'ai generated proposals',
    'ai generated partnerships',
    'smart partnership bot',
    'spam proposals',
    'partnerships based on facts',
    'lifelong partnerships'
  ],

  description:
    "Sharkdom is world's First Platform so using Startup Ecosystem to establish longtime Smart Partnerships with no prior knowledge related to partnerships needed, curated for founders and founding teams.",

  openGraph: {
    url: `https://sharkdom.com`,
    locale: 'en_US',
    username: '@sharkdomIndia',

    images: [
      {
        url: 'https://www.sharkdom.com/og-img-small.png',
        width: 1200,
        height: 630,
        alt: 'Sharkdom - Empowering startup partnerships'
      },

      {
        url: 'https://www.sharkdom.com/og-img-small.png',
        width: 1080,
        height: 1080,
        alt: 'Sharkdom - Empowering startup partnerships'
      },
      {
        url: 'https://www.sharkdom.com/og-img-small.png',
        width: 1080,
        height: 1920,
        alt: 'Sharkdom - Empowering startup partnerships'
      },
      {
        url: 'https://www.sharkdom.com/og-img-small.png',
        width: 1024,
        height: 512,
        alt: 'Sharkdom - Empowering startup partnerships'
      }
    ]
  },
  metadataBase: new URL('https://sharkdom.com'),
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s | Sharkdom',
      default: 'Sharkdom'
    },
    description: 'Empowering startup partnerships',
    site: '@sharkdomIndia',
    creator: '@SharkdomIndia'
  }
}

const StartupPage = async ({ params }: { params: { code: number } }) => {
  const code = params.code

  const { user, token } = await getServerUser()

  if (!user || !token) {
    return (
      <main>
        <StartupInfoHeader />
        <PublicProfileWrapper code={code} />
      </main>
    )
  }

  const [
    org,
    currentOrganization,

    playgroundOptions,
    playgroundOptionHints,
    sectorsData
    // partnershipTypes,
    // credits
  ] = await Promise.all([
    getOrgByCode(code),
    getCurrentOrganization(),

    getConfigByType('PLAYGROUND'),
    getConfigByType('PLAYGROUND_HINT'),
    getConfigByType('PREFERRED_SECTORS'),
    getConfigByType('PREFERRED_PARTNERSHIPS'),
    getCredits()
  ])

  const collaboration = await getCollaborationByTwoOrgs(
    org,
    currentOrganization
  )

  const sectors = sectorsData.map((sector) => ({
    value: sector.value,
    label: sector.key
  }))

  const orgSector =
    Array.isArray(org?.sector) && org?.sector?.length > 1
      ? sectors.find((sector) => sector?.label === org?.sector) || null
      : sectors.find((sector) => sector?.value === org?.sector) || null

  const currentOrgSector =
    Array.isArray(currentOrganization?.sector) &&
    currentOrganization?.sector?.length > 1
      ? sectors.find(
          (sector) => sector?.label === currentOrganization?.sector
        ) || null
      : sectors.find(
          (sector) => sector?.value === currentOrganization?.sector
        ) || null

  const getPreferences = (sectors: { area: string }[]) =>
    sectors.map((sector) => sector.area).join(', ')

  const compabilityPrompt = `Startup A:
ABOUT: ${org?.about}
MARKET SEGMENT: ${org?.companyType}
PREFERENCES: Looking for partnerships with companies in ${getPreferences(org.preferredSectors)}.
SECTOR: ${orgSector?.label}
Startup B:
ABOUT: ${currentOrganization?.about}
MARKET SEGMENT: ${currentOrganization?.companyType}
PREFERENCES: Interested in collaborations with companies in ${getPreferences(currentOrganization?.preferredSectors)}
SECTOR: ${currentOrgSector?.label}`

  // const startup = startups.find((startup) => startup.code === code)

  return (
    <main>
      <StartupInfoHeader />

      <MaxWidthWrapper className='flex max-w-5xl flex-col justify-between gap-4 px-4 py-8 lg:flex-row lg:py-12 xl:max-w-5xl'>
        <div className='flex w-full flex-col gap-2.5'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-end gap-4'>
              <div>
                <Image
                  src={
                    org?.logoUrl ||
                    'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
                  }
                  width={58}
                  height={58}
                  alt='org-logo'
                />
              </div>

              <div className='flex flex-col gap-1'>
                {(org?.sector || org?.companyType) && (
                  <div className='flex items-center gap-1'>
                    {org?.sector && (
                      <span className='fds-text-sm rounded-full bg-shark-blue-50 px-2 py-0.5 text-text-100'>
                        {sectorsData?.find((x) => x?.value === org.sector)
                          ?.key || '-'}
                      </span>
                    )}
                    {org?.companyType && (
                      <span className='fds-text-sm rounded-full bg-shark-blue-50 px-2 py-0.5 text-text-100'>
                        {org.companyType}
                      </span>
                    )}
                  </div>
                )}

                <span className='fds-text-lead text-text-100'>
                  {org?.name || '-'}
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {org?.rating && (
                <span className='inline-flex items-center'>
                  <div className='flex items-center'>
                    {Array.from({ length: 5 })
                      .fill(0)
                      .map((_, idx) => (
                        <Star1
                          variant='Bold'
                          size={16}
                          key={idx}
                          color='#f4aa4d'
                        />
                      ))}

                    <p className='fds-text-sm ml-2 text-text-100'>
                      {org.rating} Rating
                    </p>
                  </div>
                </span>
              )}

              {org?.city && (
                <span className='inline-flex items-center gap-1 text-sm  font-medium text-text-100'>
                  <Location color='#7688A8' size={16} /> {org.city}
                </span>
              )}

              {/* {match && (
              <span className='rounded-full border border-semantic-success px-4 py-1 text-shark-xs font-bold text-semantic-success'>
                {match}% Match
              </span>
            )} */}
            </div>

            {org?.about && (
              <div>
                <p className='text-shark-sm text-text-100 '>
                  {org.briefDescription}
                </p>
              </div>
            )}

            <div className='inline-flex items-center text-shark-sm  text-text-80'>
              Open to :{' '}
              <span className='ml-2 inline-flex items-center gap-2 font-medium'>
                {org.preferredPartnershipTypes &&
                org.preferredPartnershipTypes.length > 0 ? (
                  org.preferredPartnershipTypes.map(
                    (item: any, index: number) => {
                      return (
                        <span
                          className='rounded-full bg-shark-blue-50 px-2 py-1 text-shark-xs font-bold capitalize'
                          key={index}
                        >
                          {item.area.toLowerCase()}
                        </span>
                      )
                    }
                  )
                ) : (
                  <span className='rounded-full bg-shark-blue-50 px-2 py-1 text-shark-xs font-bold capitalize'>
                    {' '}
                    All supported partnerships
                  </span>
                )}
              </span>
            </div>
          </div>

          <SecondaryDetails org={org} />

          <CreatePersona
            currentOrganization={currentOrganization}
            organization={org}
          />

          {org?.organizationCollaborations &&
            org.organizationCollaborations.length > 0 && (
              <CompanyPartners
                heading={`Company's Partners (Active on sharkdom)`}
                partners={org.organizationCollaborations}
              />
            )}

          {org?.about && <DetailCard heading='About' text={org.about} />}
          {currentOrganization.planCode === 'FREE' && <InsightsSection />}
        </div>

        <CompanyPageSidebar
          currentOrganization={currentOrganization}
          organization={org}
          prompt={compabilityPrompt}
          collabStatus={collaboration?.status!}
        />
      </MaxWidthWrapper>
    </main>
  )
}

export default StartupPage

const DetailCard = ({ heading, text }: { heading: string; text: string }) => {
  return (
    <DashboardItemWrapper className='flex flex-col gap-2 p-4'>
      <h4 className='fds-text-semibold text-text-100'>{heading}</h4>
      <p className='text-shark-base font-medium text-text-60'>{text}</p>
    </DashboardItemWrapper>
  )
}

const CompanyPartners = ({
  heading,
  partners
}: {
  heading: string
  partners: any
}) => {
  return (
    <DashboardItemWrapper className='flex flex-col gap-2 p-4'>
      <h4 className='fds-text-semibold text-text-100'>{heading}</h4>
      <div className='flex flex-wrap items-center gap-4  '>
        {partners
          .filter((partner: any) => partner.status === 'ACTIVE')
          .map((partner: any) => (
            <div
              className='flex flex-col items-center '
              key={partner.organizationId}
            >
              <Image
                src={
                  partner?.logoUrl ||
                  'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
                }
                width={32}
                height={32}
                alt={partner.organizationName}
              />
              <p className='fds-text mt-1 text-center text-text-60'>
                {partner.organizationName || '-'}
              </p>
            </div>
          ))}
      </div>
    </DashboardItemWrapper>
  )
}

const SecondaryDetails = ({ org }: { org: OrganizationType }) => {
  const activePartnerships =
    org.organizationCollaborations?.filter(
      (item: any) => item.status === 'ACTIVE'
    ).length || 0

  const inPipelinePartnerships =
    org.organizationCollaborations?.filter(
      (item: any) => item.status !== 'ACTIVE'
    ).length || 0

  return (
    <DashboardItemWrapper className='grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3'>
      <div className='flex flex-col gap-1 p-4'>
        <span className='fds-text-sm text-text-60'>Legal Name</span>
        <span className='text-shark-sm font-bold text-text-100'>
          {org.legalName || '-'}
        </span>
      </div>

      <div className='flex flex-col gap-1 p-4'>
        <span className='fds-text-sm text-text-60'>Founded On</span>
        <span className='text-shark-sm font-bold text-text-100'>
          {org.inceptionYear || '-'}
        </span>
      </div>

      <div className='flex flex-col gap-1 p-4'>
        <span className='fds-text-sm text-text-60'>Website</span>
        {org.website ? (
          <Link href={org.website} target='_blank'>
            <span className='inline-flex items-center text-shark-sm font-bold text-primary-light-blue'>
              {org.website.length > 20
                ? `${org.website.slice(0, 20)}...`
                : org.website}
            </span>
          </Link>
        ) : (
          <span className='text-shark-sm font-bold text-text-100'>-</span>
        )}
      </div>

      <div className='flex flex-col gap-1 p-4'>
        <span className='fds-text-sm text-text-60'>Active Partnerships</span>
        <span className='text-shark-sm font-bold text-text-100'>
          {activePartnerships > 0 ? activePartnerships : '-'}
        </span>
      </div>

      <div className='flex flex-col gap-1 p-4'>
        <span className='fds-text-sm text-text-60'>
          In pipeline Partnership
        </span>
        <span className='text-shark-sm font-bold text-text-100'>
          {inPipelinePartnerships > 0 ? inPipelinePartnerships : '-'}
        </span>
      </div>

      <div className='flex flex-col gap-1 p-4'>
        <span className='fds-text-sm text-text-60'>Meeting success rate</span>
        <span className='text-shark-sm font-bold text-text-100'>-</span>
      </div>
    </DashboardItemWrapper>
  )
}

const InsightsSection = () => {
  return (
    <DashboardItemWrapper className='flex justify-between bg-[url("/insights-vector.png")] bg-cover px-6 py-8'>
      {/* Left Side - Text */}
      <div className='shrink-0'>
        <h2 className='fds-heading mb-3 text-text-100'>
          Want to get more insights?
        </h2>
        <ul className='space-y-2 '>
          <li className='flex items-center text-shark-xs text-text-100'>
            <span className='mr-2'>
              <Medal size={16} color='#2A3241' />
            </span>{' '}
            Get compatibility data
          </li>
          <li className='flex items-center text-shark-xs text-text-100'>
            <span className='mr-2'>
              <Medal size={16} color='#2A3241' />
            </span>{' '}
            Share referral programs with ease
          </li>
          <li className='flex items-center text-shark-xs text-text-100'>
            <span className='mr-2'>
              <Medal size={16} color='#2A3241' />
            </span>{' '}
            Generate idea customer persona
          </li>
        </ul>
      </div>

      <div className='text-right'>
        <h3 className='fds-text-lead-semibold mb-4 text-white'>
          Unlock even more features with paid plans
        </h3>
        <Button
          // onClick={toggleUpgradePopUp}
          className=' bg:text-white fds-text-sm h-[37px] rounded-lg border border-white  bg-transparent text-white hover:bg-transparent '
        >
          View Plans
        </Button>
      </div>
    </DashboardItemWrapper>
  )
}
