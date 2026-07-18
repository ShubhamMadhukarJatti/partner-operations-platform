'use client'

import React, { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Credits, OrganizationType } from '@/types'
import {
  EyeOff,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  SquareArrowOutUpRight,
  Twitter,
  Youtube
} from 'lucide-react'
import { DecodedIdToken } from 'next-firebase-auth-edge/lib/auth/token-verifier'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { showCustomToast } from '@/components/custom-toast'
import { ImageFallback } from '@/components/shared/image-with-fallback'
import SendProposal from '@/app/(app)/(dashboard-pages)/dashboard/send-proposal'

import { CheckCompability } from '../compability-drawer'
import { SelectPartnershipType } from '../select-partnership-type'
import { canSendProposals } from '../utils/ProposalChecks'

const FollowButton = dynamic(
  () => import('@/app/(app)/(dashboard-pages)/_components/follow-button'),
  { ssr: false }
)

type Props = {
  organization: OrganizationType
  currentOrganization: OrganizationType
  user: DecodedIdToken
  token: string
  playgroundOptions: { option: string; hint: string; category: string }[]
  sectors: { value: string; label: string }[]
  status: string | null
  routeToSettings?: () => void
  partnershipTypes: any
}

export const StartupProfile = ({
  organization,
  currentOrganization,
  user,
  token,
  sectors,
  playgroundOptions,
  status,
  routeToSettings,
  partnershipTypes
}: Props) => {
  const [showBanner, setShowBanner] = useState(false)

  const iconMap: { [key: string]: React.ReactNode } = {
    WEBSITE: <Globe size={20} />,
    FACEBOOK: <Facebook size={20} />,
    LINKEDIN: <Linkedin size={20} />,
    TWITTER: <Twitter size={20} />,
    INSTAGRAM: <Instagram size={20} />,
    YOUTUBE: <Youtube size={20} />
  }
  const orgSector =
    Array.isArray(organization?.sector) && organization?.sector?.length > 1
      ? sectors.find((sector) => sector?.label === organization?.sector) || null
      : sectors.find((sector) => sector?.value === organization?.sector) || null

  const [credits, setCredits] = useState<Credits | null>(null)

  const getCredits = async () => {
    try {
      const creditsData = await fetch(
        `/api/credits?organizationId=${currentOrganization.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!creditsData.ok) {
        throw new Error(creditsData?.statusText || 'Failed to fetch credits')
      }

      const credits: Credits = await creditsData.json()
      return credits
    } catch (error: any) {
      console.log(`ERROR GETTING CREDITS DATA:::`, error)
    }
  }

  useEffect(() => {
    async function fetchData() {
      const credits = await getCredits()
      setCredits(credits ? credits : null)
    }
    fetchData()
  }, [])

  const compabilityPrompt = `Startup A:
ABOUT: ${organization.about}
MARKET SEGMENT: ${organization.companyType}
PREFERENCES: Looking for partnerships with companies in the advertising and marketing industry.
SECTOR: ${orgSector?.label}
Startup B:
ABOUT: ${currentOrganization?.about}
MARKET SEGMENT: ${organization.companyType}
PREFERENCES: Interested in collaborations with companies in the AI technology sector. SECTOR: Fashion Technology`

  return (
    <main className=' flex w-full max-w-screen-lg flex-col   '>
      <div className='flex flex-col border-b border-border bg-accent  p-6 pb-4 '>
        <div className='  flex flex-col  border-b border-border pb-4  '>
          <div className='flex flex-col justify-between gap-y-2 sm:flex-row sm:items-center'>
            <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center'>
              <ImageFallback
                src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${organization.id}`}
                alt={organization.name}
                width={200}
                height={200}
                className='size-10 flex-shrink-0 rounded-full'
              />
              <h1 className='text-xl font-medium'>{organization.name} </h1>

              <div className='w-max rounded-md bg-[#EEFFE5] px-3 py-1.5 text-sm font-semibold sm:ml-1.5'>
                <span className='text-[#428025]'>56% Match</span>
              </div>
              <CheckCompability prompt={compabilityPrompt} />
            </div>

            <div className=' flex items-center gap-3 pr-[2rem]'>
              {currentOrganization.id !== organization.id && (
                <>
                  <SelectPartnershipType
                    credits={credits as Credits}
                    recieverOrg={organization}
                    userId={user.uid}
                    token={token}
                    senderOrg={currentOrganization}
                    options={playgroundOptions}
                    status={status}
                  />

                  <Suspense
                    fallback={
                      <Button disabled loading size={'sm'} className=''>
                        Loading
                      </Button>
                    }
                  >
                    {currentOrganization.briefDescription === null ||
                    currentOrganization.about === null ||
                    currentOrganization.services.length === 0 ? (
                      <>
                        {showBanner && (
                          <div className='fixed left-1/2 top-4 z-50 -translate-x-1/2 transform'>
                            <div className='z-[99] flex w-[506px] items-center justify-between rounded-lg border bg-card p-4'>
                              <div className=''>
                                <h2 className='text-base'>
                                  Your profile is offline...
                                </h2>
                                <p className='text-sm text-muted-foreground'>
                                  Update your profile to make it online & send
                                  proposals.
                                </p>
                              </div>
                              <button
                                onClick={routeToSettings}
                                className='button-style cursor-pointer rounded-[81px] border-2 border-solid border-[#0062F1] px-4 py-2 text-sm text-primary'
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        )}
                        <Button
                          className='border border-primary bg-white px-7 text-primary hover:bg-primary hover:text-white'
                          onClick={() => {
                            if (
                              canSendProposals(
                                currentOrganization?.planCode || 'FREE',
                                credits?.collaborationSent || 0
                              )
                            ) {
                              setShowBanner(true)
                            } else {
                              showCustomToast(
                                'Warning',
                                'Insufficient AI credits.',
                                'error',
                                5000
                              )
                            }
                          }}
                        >
                          Send Proposal
                        </Button>
                      </>
                    ) : (
                      <>
                        <SendProposal
                          recieverOrg={organization}
                          senderOrg={currentOrganization}
                          userId={user.uid}
                          token={token}
                          options={playgroundOptions}
                          status={status}
                          credits={credits as Credits}
                        />
                      </>
                    )}
                  </Suspense>
                </>
              )}
            </div>
          </div>
          <div className='pt-3 text-sm text-muted-foreground'>
            <p>{organization.briefDescription}</p>
          </div>
        </div>
        <div className='flex flex-col gap-2  pt-4'>
          <p className='inline-flex text-sm  text-muted-foreground'>
            Open to :{' '}
            <span className='ml-2 font-medium'>
              {organization.preferredPartnershipTypes &&
              organization.preferredPartnershipTypes.length > 0 ? (
                organization.preferredPartnershipTypes.map((item, index) => {
                  const preferredArea = partnershipTypes.find(
                    (partnership: any) => partnership.key === item.area
                  )

                  return (
                    <span className='capitalize' key={index}>
                      {index > 0 && ', '}
                      {preferredArea && preferredArea.value.toLowerCase()}
                    </span>
                  )
                })
              ) : (
                <span> All supported partnerships</span>
              )}
            </span>
          </p>

          <p className='inline-flex text-sm  text-muted-foreground'>
            Proposal acknowledgement time :
            <span className='ml-2 font-medium'>
              {organization.acknowledgmentTime
                ? organization.acknowledgmentTime
                : 72}{' '}
              hours
            </span>
          </p>
        </div>
      </div>

      <div
        className=' grid 
      grid-cols-1  lg:grid-cols-3'
      >
        <div className='hide-scrollbar col-span-2  flex  max-h-[30rem]   flex-col gap-6 overflow-y-scroll p-6 sm:border-r sm:border-border'>
          <div className='flex flex-col  gap-4 '>
            <p className='text-base  font-medium leading-5'>Partners</p>

            {Array.isArray(organization?.organizationCollaborations) &&
            organization?.organizationCollaborations?.length > 0 ? (
              <div className='flex flex-wrap items-center gap-3'>
                {organization?.organizationCollaborations?.map((item) => (
                  <div
                    className='flex w-fit items-center gap-1 rounded-md bg-[#F3F4F6] px-4 py-3'
                    key={item?.organizationId}
                  >
                    <ImageFallback
                      src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${item?.organizationId}`}
                      alt={item?.organizationName}
                      width={200}
                      height={200}
                      className='size-8 flex-shrink-0 rounded-full'
                    />
                    <p className='text-base font-medium  leading-4'>
                      {item?.organizationName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className=' flex w-full flex-col items-center gap-2 rounded-lg  bg-[#F3F4F6] px-6 py-4'>
                <Image
                  src='/assets/send-proposal.svg'
                  alt=''
                  width={200}
                  height={142}
                />
                <p className='text-center text-sm '>
                  Join us in welcoming {organization?.name}! Be the first to
                  collaborate with {organization?.name} by{' '}
                  <span className='text-primary'>sending proposal</span> and
                  kickstart your journey to mutually beneficial partnership.
                </p>
                {/* <Button>Send Proposal</Button> */}
                <SendProposal
                  credits={credits as Credits}
                  recieverOrg={organization}
                  senderOrg={currentOrganization}
                  userId={user.uid}
                  token={token}
                  options={playgroundOptions}
                  status={status}
                />
              </div>
            )}
          </div>

          <div className='flex flex-col  gap-4 '>
            <p className='text-base  font-medium leading-5'>About Startup</p>
            <p className='text-base text-muted-foreground'>
              {organization?.about}
            </p>
          </div>
          <div className='flex flex-col  gap-4 '>
            <p className='text-base  font-medium leading-5'>Services</p>
            <p className='text-base text-muted-foreground'>
              {Array.isArray(organization?.services) &&
                organization?.services?.length > 0 &&
                organization?.services.map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && ', '}
                    {item?.service}
                  </React.Fragment>
                ))}
            </p>
          </div>

          {/* <div className='flex flex-col  gap-4 '>
            <p className='text-base  font-medium leading-5'>
              What partners say
            </p>

            <div>
              <div className='flex max-w-[18.8rem] flex-col gap-1 rounded-lg bg-[#F3F4F6] p-4 '>
                <div className='flex w-fit items-center gap-1  '>
                  <ImageFallback
                    src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${organization.id}`}
                    alt={organization.name}
                    width={200}
                    height={200}
                    className='size-8 flex-shrink-0 rounded-full'
                  />
                  <p className='text-base font-medium  leading-4'>Zomato</p>
                </div>
                <span className='text-muted-foreground'>Strategic partner</span>
                <p className='text-sm '>
                  Streamlining hospital procurement via AI-driven platform for
                  efficient supply. thterifpf kfjndf{' '}
                </p>
              </div>
            </div>
          </div> */}
        </div>

        <div className='p-4'>
          <p className='text-base  font-medium leading-5'>Quick info </p>
          <div className='mt-4 flex flex-col gap-2'>
            <div className='flex items-center justify-between text-base leading-5  '>
              <span className='inline-flex items-center'>
                Brand Resouces
                <Link
                  href={'https://doc.sharkdom.com/branding-resources'}
                  target='_blank'
                >
                  <span className='ml-2 flex size-5  items-center  justify-center rounded-full bg-border font-mono text-xs font-bold leading-3'>
                    i
                  </span>
                </Link>
              </span>
              <span className='text-muted-foreground'>
                {organization?.brandResources ? 'Available' : 'False'}
              </span>
            </div>
            <div className='flex items-center justify-between text-base leading-5  '>
              {' '}
              <span className='inline-flex items-center'>
                Referral Program{' '}
                <Link
                  href={'https://doc.sharkdom.com/use-cases/referral-program'}
                  target='_blank'
                >
                  <span className='ml-2 flex size-5  items-center  justify-center rounded-full bg-border font-mono text-xs font-bold leading-3'>
                    i
                  </span>
                </Link>{' '}
              </span>
              <span className='text-muted-foreground'>
                {' '}
                {organization?.referralProgram ? 'Available' : 'False'}
              </span>
            </div>
            <div className='flex items-center justify-between text-base leading-5  '>
              <span>Point of Contact</span>
              <span className='text-muted-foreground'> Founder</span>
            </div>
          </div>{' '}
          <div className='mt-6 flex flex-col gap-2'>
            <div className='flex items-center justify-between text-base leading-5  '>
              <span>Legal Name</span>
              <span className='text-muted-foreground'>
                {organization.legalName === 'string' ? (
                  <EyeOff className='size-4 font-bold text-muted-foreground' />
                ) : (
                  <span className='text-muted-foreground'>
                    {organization?.legalName}
                  </span>
                )}
              </span>
            </div>
            <div className='flex items-center justify-between text-base leading-5  '>
              {' '}
              <span>Founded in </span>
              <span className='text-muted-foreground'>
                {' '}
                {organization?.inceptionYear}
              </span>
            </div>
            <div className='flex items-center justify-between text-base leading-5  '>
              <span>Location</span>

              {organization.city === 'string' ? (
                <EyeOff className='size-4 font-bold text-muted-foreground' />
              ) : (
                <span className='text-muted-foreground'>
                  {organization?.city}
                </span>
              )}
            </div>
            <div className='flex items-center justify-between text-base leading-5  '>
              <span>Sector</span>
              <span className='text-muted-foreground'> {orgSector?.label}</span>
            </div>
            <div className='flex items-center justify-between text-base leading-5  '>
              <span>Website</span>

              {organization?.website === 'string' ? (
                <EyeOff className='size-4 font-bold text-muted-foreground' />
              ) : organization.website ? (
                <Link href={organization?.website} target='_blank'>
                  <Button variant={'link'} className='px-0'>
                    {organization?.website}{' '}
                    <SquareArrowOutUpRight className='ml-1 size-4' />
                  </Button>{' '}
                </Link>
              ) : (
                <span className='text-red-500'>Not Available</span>
              )}
            </div>
          </div>
          <div className='mt-[3.5rem]  flex w-full flex-col items-center gap-3 rounded-lg  bg-[#F3F4F6] p-4'>
            <p className='text-base'>
              Subscribe to get updates about {organization?.name} partnership
              deals
            </p>

            {/* <FollowButton
              currentOrganizationId={currentOrganization.id}
              organizationId={organization.id}
              size='sm'
              className='border border-gray-500'
            /> */}
            {/* <Button className='h-8 w-full'>Subscribe</Button> */}
            <FollowButton
              className='h-8 w-full bg-primary text-white hover:bg-primary'
              organizationId={organization?.id}
              currentOrganizationId={currentOrganization?.id}
            />
          </div>
        </div>
      </div>

      {/* <div className='flex flex-col gap-3 lg:flex-row'>
        <div className='flex w-full flex-col gap-3'>
          <Card className='p-4'>
            <CardContent className='flex flex-col gap-3'>
              <h2 className='text-lg font-semibold text-muted-foreground'>
                About
              </h2>
              {organization.about ? (
                <p className=''>{organization.about}</p>
              ) : (
                <p>Data unavailable</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className='flex flex-col gap-3'>
              <h2 className='text-lg font-semibold text-muted-foreground'>
                Services
              </h2>
              {organization.services && organization.services.length > 0 ? (
                <ul className='list-inside list-disc'>
                  {organization.services.map((service) => (
                    <li key={service.id}>{service.service}</li>
                  ))}
                </ul>
              ) : (
                <p>Data unavailable</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className='flex w-full flex-col gap-3 lg:max-w-xs'>
          <Track classname='w-full' />
          <Card className=' h-fit p-4'>
            <CardContent className='flex flex-col gap-3'>
              <h2 className='text-lg font-semibold text-muted-foreground'>
                Quick Info
              </h2>
              {organization.legalName && (
                <QuickInfo title='Legal Name' value={organization.legalName} />
              )}
              {organization.dateOfIncorporation && (
                <QuickInfo
                  title='Founded'
                  value={organization.dateOfIncorporation}
                />
              )}
              {orgSector && (
                <QuickInfo title='Sector' value={orgSector.label} />
              )}
              {organization.funding && (
                <QuickInfo title='Funding' value={organization.funding} />
              )}
              {organization.companyType && (
                <QuickInfo
                  title='Company Type'
                  value={organization.companyType}
                />
              )}
              {organization.state && organization.city && (
                <QuickInfo
                  title='Location'
                  value={`${organization.city},${organization.state}`}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div> */}
    </main>
  )
}

type SocialMediaLinkProps = {
  name: string
  url: string
  icon: React.ReactNode
}
const SocialMediaLink = ({ name, url, icon }: SocialMediaLinkProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full' asChild>
          <a href={url} target='_blank'>
            {icon}
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const QuickInfo = ({ title, value }: { title: string; value: string }) => (
  <div className='flex items-center justify-between capitalize'>
    <p className='font-medium text-muted-foreground'>{title}</p>
    <p className='text-right lowercase first-letter:uppercase'>{value}</p>
  </div>
)
