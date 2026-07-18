import Link from 'next/link'
import { TemplateResponse } from '@/types'
import { ArrowRight, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

type Props = {
  template: TemplateResponse
}

export const TemplatesCard = ({ template }: Props) => {
  return (
    <Card className='flex h-[200px] w-full flex-col gap-2 bg-[#3662E3] px-0 pb-0'>
      <CardContent className='flex flex-1 flex-col gap-2 overflow-hidden pb-4'>
        <div className='flex items-center justify-between'>
          <strong className='ml-7 rounded-lg border border-green-500 bg-green-500 px-3 py-1.5 text-xs font-medium text-white'>
            {`${template.succcessRate}%`} acknowledgement rate
          </strong>
          <div className='flex items-end'>
            {' '}
            {/* Align items to end */}
            <Tooltip>
              <TooltipTrigger>
                <Star className='mr-8 text-[#FFFFFF] hover:fill-yellow-400 hover:text-amber-400' />
              </TooltipTrigger>
              <TooltipContent side='bottom'>Save this template</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div>
          <h3 className='ml-5 text-lg font-semibold leading-tight text-[#FFFFFF]'>
            {template.title}
          </h3>
          {/*<p className='line-clamp-3 min-w-0 text-base font-normal text-muted-foreground'>
      {`${template.templateOfferings.length} `} offerings,
      {`${template.templateExpectations.length} `}
      expectations
  </p>*/}
          <h4 className='ml-5 mt-2 text-sm font-normal text-[#FFFFFF]'>
            {template.saved} startups bookmarked this
          </h4>
        </div>
      </CardContent>
      <CardFooter className='h-10 justify-between bg-white'>
        <div className='flex w-full flex-row items-end justify-between pr-4'>
          <div className='flex-grow'></div>
          <Button asChild variant='link'>
            <Link
              className='text-[#3662E3]'
              href={`/explore/${template.id}`}
              scroll={false}
            >
              View Proposal
              <ArrowRight className='ml-1' />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
