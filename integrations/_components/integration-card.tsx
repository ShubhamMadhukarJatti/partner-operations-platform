'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

type ICProps = {
  isNew: boolean
  name: string
  handleCardClick: () => void
}

const IntegrationCard = ({ isNew, name, handleCardClick }: ICProps) => {
  const subtitle = `Sync leads data with ${name}`
  return (
    <Card
      className='flex h-full w-full cursor-pointer flex-col gap-2 p-0'
      onClick={() => handleCardClick()}
    >
      <CardContent className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-center gap-2'>
          <Image
            width={200}
            height={200}
            src={`/assets/hub-spot.svg`}
            alt={'HubSpot'}
            className='size-10 object-contain'
          />
          <h3 className='text-lg font-medium'>{name}</h3>
        </div>
        <div>
          <Badge className='max-w-fit text-[#475467]' variant='secondary'>
            Marketing
          </Badge>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-pretty text-base text-muted-foreground'>
            {subtitle}
          </p>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end bg-secondary'>
        <Button
          variant='primary'
          className='font-medium'
          size='sm'
          onClick={() => handleCardClick()}
        >
          {isNew ? 'Set up app' : 'View Leads'}{' '}
          <ArrowRight className='ml-1 h-4 w-4 ' />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default IntegrationCard
