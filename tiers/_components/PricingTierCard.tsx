import React from 'react'
import { MoreHorizontal, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export interface Tier {
  id: string
  name: string
  price: string
  features: string[]
  color: string
}

interface PricingTierCardProps {
  tier: Tier
  onEdit?: (tier: Tier) => void
  onDelete?: (tier: Tier) => void
}

const PricingTierCard = ({ tier, onEdit, onDelete }: PricingTierCardProps) => {
  return (
    <Card
      className='relative h-full overflow-hidden border-t-4 transition-shadow hover:shadow-md'
      style={{ borderTopColor: tier.color }}
    >
      <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-2'>
        <div>
          <h3 className='font-medium text-muted-foreground'>{tier.name}</h3>
          <div className='mt-1 flex items-center text-2xl font-bold'>
            {tier.price}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-0'
            >
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal
                color='black'
                className='h-4 w-4 text-muted-foreground'
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onEdit?.(tier)}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(tier)}
              className='text-destructive focus:text-destructive'
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className='my-4 h-px bg-border/50' />
        <ul className='space-y-3'>
          {tier.features.map((feature, index) => (
            <li key={index} className='flex items-center gap-2 text-sm'>
              <Sparkles className='h-4 w-4 shrink-0 fill-muted-foreground/10 text-muted-foreground/30' />
              <span className='font-medium'>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default PricingTierCard
