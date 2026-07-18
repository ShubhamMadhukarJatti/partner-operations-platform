'use client'

import React from 'react'
import Image from 'next/image'
import dealImage from '@/../public/assets/business-deal.png'
import { ArrowLeftIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const Content = () => {
  return (
    <section className='flex h-full justify-between gap-6'>
      <div className='flex h-full w-[490px] flex-col justify-between'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-shark-3xl font-bold '>Welcome to sharkdom</h3>
          <p className='text-shark-base font-semibold'>
            Your 14 day free trial starts from today. After which you will be
            charged on your card.
          </p>
        </div>

        <div className='flex gap-4'>
          <Button>
            <ArrowLeftIcon />
          </Button>
          <Button className='w-[123px]'>Next</Button>
        </div>
      </div>
      <div className='flex h-full items-center justify-center'>
        <Image src={dealImage} alt='' width={279} height={279} />
      </div>
    </section>
  )
}

const TutorialPopup: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className='min-h-[553px] max-w-screen-lg px-10 py-6'>
        <div>
          <Carousel className='h-full w-full max-w-[954px]'>
            <CarouselContent className='h-full w-full'>
              <CarouselItem className='h-full  w-full'>
                <Content />
              </CarouselItem>
              <CarouselItem>
                <Content />
              </CarouselItem>
              <CarouselItem>
                <Content />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TutorialPopup
