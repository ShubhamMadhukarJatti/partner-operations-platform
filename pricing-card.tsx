'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import {
  CheckCircle2,
  DollarSign,
  IndianRupee,
  Sparkles,
  XCircle
} from 'lucide-react'

import { PricingPlanType } from '@/config/data'
import { getOrganizationMappingsByUserId } from '@/lib/db/organization'
import useFormStore from '@/lib/stores/useFormStore'
import { cn, getBaseUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const PricingCard = ({
  plan,
  email,
  isHomePage = false
}: {
  plan: PricingPlanType
  email?: string
  isHomePage?: boolean
  isDisabled?: boolean
}) => {
  const {
    title,
    price,
    features,
    featured,
    cta,
    description,
    notIncluded,
    status
  } = plan

  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUSLocale, setIsUSLocale] = useState(false)
  let [orgId, setOrgId] = useState<number>(0)
  const router = useRouter()
  const { nextStep } = useFormStore()
  const pathname = usePathname()

  useEffect(() => {
    setIsUSLocale(pathname.startsWith('/en-us'))
  }, [pathname])

  console.log(isUSLocale, 'isUSLocale')

  const CurrencyIcon = isUSLocale ? DollarSign : IndianRupee
  const currencySymbol = isUSLocale ? '$' : ''

  useEffect(() => {
    getOrgData()
  }, [])

  const getOrgData = async () => {
    const organizationMappingsData = await getOrganizationMappingsByUserId()

    const currentOrganization = organizationMappingsData.find(
      (org) => org.organizationUserMapping.status === 'ACTIVE'
    )?.organization!
    setOrgId(currentOrganization?.id)
  }

  const fetchData2 = async () => {
    if (orgId === 0) {
      return
    }

    let baseurl = getBaseUrl()
    let resp
    const options = {
      method: 'post',
      url: baseurl + '/api/phonepe',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        title: title,
        orgId: orgId,
        price: price
      }
    }
    axios
      .request(options)
      .then(function (response) {
        resp = response.data.data.data.instrumentResponse.redirectInfo.url
        console.log(resp)
        router.push(resp)
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  return (
    <>
      <div
        className={cn(
          'relative mx-2 h-auto min-w-[300px] max-w-xs transform flex-col gap-10 rounded-2xl border border-[#D4D4D4] bg-[#FFFFFF] p-6 pb-14 text-card-foreground transition duration-500 hover:scale-105',
          {
            'mt-2 h-auto rounded-t-xl': featured
          }
        )}
      >
        {featured && (
          <div
            className={cn(
              'absolute left-0 top-0 w-full rounded-t-xl bg-[#3A72EC] p-1 text-sm font-medium text-white'
            )}
          >
            <span className='inline-flex pl-4 pt-1'>
              <Sparkles className='pr-1' />
              Recommended for you
            </span>
          </div>
        )}
        <div className='flex flex-col items-start gap-1'>
          <span
            className={cn('text-lg font-semibold text-[#3A72EC]', {
              'mt-5': featured
            })}
          >
            {title}
          </span>
          <span className='flex'>
            <CurrencyIcon className='w-4' />
            <span className='text-3xl font-semibold'>
              {currencySymbol}
              {price !== 0 ? price : '0'}
              <span
                className={cn(
                  'text-base font-medium text-muted-foreground',
                  {}
                )}
              >
                /month
              </span>
            </span>
          </span>
          <p className='text-start text-sm font-medium text-muted-foreground'>
            {description}
          </p>
          <Separator />
          <ul className='mb-6 mt-1 flex flex-col gap-2 text-[#475467]'>
            {features.map((feature) => (
              <li key={feature} className='flex gap-2 capitalize'>
                <CheckCircle2 className='h-5 w-5 text-[#039855]' />
                <span className='flex-1'>{feature}</span>
              </li>
            ))}

            {notIncluded?.map((feature) => (
              <li
                key={feature}
                className='flex items-center gap-2 capitalize text-muted-foreground line-through'
              >
                <XCircle className='' size={20} /> {feature}
              </li>
            ))}
          </ul>
        </div>

        {status === 'Contact' ? (
          <Button
            className={cn({ 'text-white': featured })}
            variant={featured ? 'default' : 'outline'}
          >
            <Link
              href='https://calendly.com/sharkdom/customer-support'
              target='_blank'
            >
              {cta}
            </Link>
          </Button>
        ) : (
          <Button
            className={cn(
              { 'text-white': featured },
              'absolute bottom-6 left-5 right-5 px-16 py-4 text-lg'
            )}
            loading={isLoading}
            onClick={() => {
              setIsLoading(true)
              fetchData2()
            }}
          >
            {cta}
          </Button>
        )}
      </div>
    </>
  )
}

export default PricingCard
