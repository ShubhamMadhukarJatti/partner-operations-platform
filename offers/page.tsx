'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ColouredBg from '@/../public/assets/coloured-waves-bg.png'
import CoverImg from '@/../public/assets/offers-cover-image.svg'
import { Drawer } from '@mui/material'
import { ArrowRight, Info, Plus, X } from 'lucide-react'

import { getPerks } from '@/lib/db/perk'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default function OffersPage() {
  const route = useRouter()

  const [offers, setOffers] = useState([])

  useEffect(() => {
    getPerksData()
  }, [])

  async function getPerksData() {
    try {
      const response = await getPerks()
      setOffers(response?.content)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <main className='p-4'>
      <div className='relative flex w-full items-center rounded-lg bg-[#030A1B] px-12 py-6'>
        <Image
          className='w-full rounded-lg'
          src={ColouredBg}
          alt={'coloured-bg'}
          fill
        />
        <div className='relative my-auto flex w-full flex-col items-center justify-between gap-8 text-white lg:flex-row'>
          <div className='w-100 flex flex-col'>
            <p className='mb-1 text-3xl font-bold tracking-wide'>
              Introducing Perk Marketplace
            </p>
            <p className='text-lg font-light leading-6 text-gray-200'>
              List your perks and discount offer that other
              <br />
              businesses would love to serve their
              <br />
              customers.
            </p>
            <button
              className='mt-6 flex w-fit flex-row items-center gap-2 rounded-full bg-blue-600 px-6 py-2 font-semibold'
              onClick={() => route.push('/offers/create-perk')}
            >
              Create perk <Plus size={20} />
            </button>
          </div>
          <div>
            <Image
              className='w-72 rounded-lg'
              src={CoverImg}
              alt={'cover-img'}
            />
          </div>
        </div>
      </div>
      <p className='mt-6 text-lg font-semibold'>Discover perks for you</p>
      <section
        aria-label='offers'
        className='mt-3 grid w-full grid-cols-1 items-center gap-5 lg:grid-cols-3'
      >
        {offers.map((offer: any, index: number) => {
          const colors = ['#3C3A96', '#8A376E', '#8A6937', '#17533E']
          return (
            <OfferCard
              key={index}
              offer={offer}
              bgColor={colors[index % colors.length]}
            />
          )
        })}
      </section>
    </main>
  )
}

const OfferCard = ({ offer, bgColor }: any) => {
  const [openOfferDetails, setOpenOfferDetails] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)

  return (
    <>
      <Drawer
        anchor={'right'}
        open={openOfferDetails}
        onClose={() => setOpenOfferDetails(false)}
      >
        <div className='relative flex h-full max-w-lg flex-col items-start gap-2 overflow-y-scroll px-8 py-6 lg:min-w-[500px]'>
          <div
            className='absolute right-2 top-3 cursor-pointer'
            onClick={() => setOpenOfferDetails(false)}
          >
            <X />
          </div>
          <div className='mt-6 flex flex-row items-center justify-start gap-3'>
            <Image
              width={200}
              height={200}
              src={`${offer?.perkIcon}`}
              alt={offer?.perkName}
              className='size-10 rounded-lg bg-white object-contain'
            />
            <h3 className='text-2xl font-semibold'>{offer?.perkName}</h3>
          </div>
          <div className='mt-3 flex flex-row items-center gap-2 rounded-md bg-[#FFF7D9] px-3 py-2'>
            <Info size={20} color={'#957400'} />
            <p className='text-sm'>Expires on 25 July, 2024</p>
          </div>
          <div className='mt-6'>
            <p className='mb-2 font-semibold'>About offer:</p>
            <p>{offer?.perkDetails}</p>
          </div>
          <div className='my-7 flex w-full flex-row items-center justify-between gap-10'>
            <div className='flex basis-2/4 flex-col items-center gap-1 rounded-md border border-gray-300 p-2'>
              <p>Offer value</p>
              <p>{offer?.perkValue}</p>
            </div>
            <div className='flex basis-2/4 flex-col items-center gap-1 rounded-md border border-gray-300 p-2'>
              <p>Offer duration</p>
              <p>{offer?.perkDuration}</p>
            </div>
          </div>
          <div>
            <p className='mb-3 font-semibold'>Steps to redeem:</p>
            {offer?.steps.map((step: string, index: number) => {
              return (
                <p className='mb-2' key={index}>
                  {step}
                </p>
              )
            })}
          </div>
          <Link
            className='ml-auto mt-auto flex flex-row items-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white'
            href={offer?.perkUrl || '#'}
            scroll={true}
            target={'_blank'}
          >
            Redeem now <Plus />
          </Link>
        </div>
      </Drawer>
      <Card
        className='group flex h-full max-w-[450px] cursor-pointer flex-col gap-0 p-0 shadow'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader>
          <div
            className={`w-full rounded-t-lg p-1`}
            style={{ backgroundColor: bgColor }}
          />
        </CardHeader>
        <CardContent
          className={`mb-2 flex flex-1 flex-col gap-2 p-4 transition duration-500 ease-in-out`}
          style={{ backgroundColor: isHovered ? bgColor : '#ffffff' }}
        >
          <div className='flex items-center gap-2'>
            <Image
              width={200}
              height={200}
              src={offer?.perkIcon}
              alt={offer?.perkName}
              className='size-10 rounded-lg bg-white object-contain'
            />
            <h3 className='text-lg font-medium transition duration-300 ease-in-out group-hover:text-white'>
              {offer?.perkName}
            </h3>
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-pretty text-base text-muted-foreground transition duration-300 ease-in-out group-hover:text-gray-300'>
              {offer?.perkDetails}
            </p>
          </div>
        </CardContent>
        <CardFooter className='mt-2 flex justify-between px-5 pb-5'>
          <div className='basis-2/4 rounded-md px-3 py-1 outline-dashed outline-gray-300'>
            <p className='text-center'>{offer?.perkValue}</p>
          </div>
          <Button
            variant='link'
            className='p-0 font-medium text-primary'
            size='sm'
            asChild
          >
            <div onClick={() => setOpenOfferDetails(true)}>
              View perk <ArrowRight className='ml-1 h-4 w-4 ' />
            </div>
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
