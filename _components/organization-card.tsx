import Link from 'next/link'
import type { OrganizationType } from '@/types'

import { backgroundColorMappingPartnership } from '@/config/data'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ImageFallback } from '@/components/shared/image-with-fallback'

type Props = {
  organization: any
  currentOrganization?: OrganizationType
}

export const PREFERRED_SECTORS = [
  {
    id: 45,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'EDUCATION',
    value: 'A',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 46,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'MEDICAL',
    value: 'B',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 47,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'TECH',
    value: 'C',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 48,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'AGRICULTURE',
    value: 'D',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 49,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'RESTAURANTS',
    value: 'E',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 50,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'SOFTWARE',
    value: 'F',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 51,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'MARKETING',
    value: 'G',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 52,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'BUSINESS',
    value: 'H',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 53,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'FINANCE',
    value: 'I',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 54,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'HOSPITALITY',
    value: 'J',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 55,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'MANUFACTURING',
    value: 'K',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 56,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'PROPERTY',
    value: 'L',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 57,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'MEDIA',
    value: 'M',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 58,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'FASHION ',
    value: 'N',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 59,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'TRANSPORTATION',
    value: 'O',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 60,
    creationTimestamp: '2023-09-11T23:30:26.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:26.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'FOOD',
    value: 'P',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 61,
    creationTimestamp: '2023-09-11T23:30:27.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:27.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'ENTERTAINMENT',
    value: 'Q',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 62,
    creationTimestamp: '2023-09-11T23:30:27.000+00:00',
    lastUpdatedTimestamp: '2023-09-11T23:30:27.000+00:00',
    type: 'PREFERRED_SECTORS',
    key: 'OTHERS',
    value: 'R',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  }
]

export const PREFERRED_PARTNERSHIPS = [
  {
    id: 121,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'A',
    value: 'STRATEGIC',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 122,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'B',
    value: 'TECHNOLOGY',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 123,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'C',
    value: 'CO-MARKETING',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 124,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'D',
    value: 'COMMUNITY',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 125,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'E',
    value: 'BRAND_LICENSING',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 126,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'F',
    value: 'SALES',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  },
  {
    id: 127,
    creationTimestamp: '2024-02-21T00:17:28.000+00:00',
    lastUpdatedTimestamp: '2024-02-21T00:17:28.000+00:00',
    type: 'PREFERRED_PARTNERSHIPS',
    key: 'G',
    value: 'SOCIAL',
    webApplicable: true,
    appApplicable: true,
    backendApplicable: true,
    active: true
  }
]

export const OrganizationCard = ({
  organization,
  currentOrganization
}: Props) => {
  return (
    <Card className='flex h-full w-full max-w-sm   flex-col gap-2 rounded-xl border-none p-0 shadow-lg'>
      <Link
        href={`/company/${organization.code}`}
        scroll={false}
        target='_blank'
      >
        <CardContent className='flex flex-1 flex-col gap-2 border-0 p-4'>
          <div className='flex items-center justify-between border-b-2 border-[#F4F4F4] pb-3'>
            <div className='flex items-center gap-2'>
              <ImageFallback
                src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${organization.id}`}
                width={200}
                height={200}
                alt={organization.name}
                className='size-14 rounded-full'
              />

              <h3 className='flex items-center text-sm font-semibold leading-6'>
                {organization.name}
                {/* {organization.verified && (
                <BadgeCheck size={18} className='ml-2 shrink-0 text-primary' />
              )} */}
              </h3>
            </div>
            <Badge className='max-w-fit bg-[#CDDDFF]' variant='secondary'>
              <span className='lowercase first-letter:uppercase'>
                {
                  PREFERRED_SECTORS?.find(
                    (x) => x?.value === organization?.sector
                  )?.key
                }
              </span>
            </Badge>
            {/* <div className='flex items-center justify-center rounded-full bg-secondary p-2'>
            <WandSparkles className='size-4   text-primary' />
          </div> */}
          </div>

          <div className='flex items-center'></div>

          <p className='line-clamp-3 min-w-0 text-sm leading-[150%] text-black'>
            {organization.briefDescription}
          </p>
          {organization.preferredPartnershipTypes.length > 0 ? (
            <div>
              <p className='text-sm font-medium leading-[150%]'>
                Open for partnerships:
              </p>
              <div className='mt-3 flex flex-wrap gap-3'>
                {organization.preferredPartnershipTypes.map(
                  (item: any, index: number) => {
                    const value = PREFERRED_PARTNERSHIPS?.find(
                      (x) => x?.key === item.area
                    )?.value
                    const areaValue = PREFERRED_PARTNERSHIPS?.find(
                      (x) =>
                        x?.value?.toLowerCase() === item?.area?.toLowerCase()
                    )?.value

                    const bgColorClass =
                      backgroundColorMappingPartnership[item.area] ||
                      'bg-[#B5E4CA]'
                    return (
                      <div
                        className={cn(
                          'max-w-fit rounded px-2 py-1',
                          bgColorClass
                        )}
                        key={index}
                      >
                        <span
                          className='text-sm font-medium capitalize leading-4 text-[#3A3A3A]'
                          key={item.id}
                        >
                          {' '}
                          {`${value?.toLowerCase() || areaValue?.toLowerCase() || ''}${(value?.toLowerCase() || areaValue?.toLowerCase()) && organization.preferredPartnershipTypes?.length !== index + 1 ? '' : ''}`}
                        </span>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Link>
    </Card>
  )
}
