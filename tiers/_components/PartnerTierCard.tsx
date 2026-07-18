import React from 'react'
import { MapPin, MoreHorizontal, Percent, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'

export interface PartnerTier {
  id: string
  name: string
  price: string
  seats: string
  discount: string
  region: string
  color: string
  active: boolean
}

interface PartnerTierCardProps {
  tier: PartnerTier
  onEdit?: (tier: PartnerTier) => void
  onDelete?: (tier: PartnerTier) => void
  onToggleActive?: (tier: PartnerTier, active: boolean) => void
}

// Simple honeycomb-like overlay pattern
const HexPattern = () => (
  <div
    className='absolute inset-0 opacity-30'
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 0L11.196 3V9L6 12L0.804 9V3L6 0Z' fill='none' stroke='white' strokeWidth='0.5'/%3E%3C/svg%3E")`,
      backgroundSize: '12px 12px'
    }}
  />
)

const PartnerTierCard = ({
  tier,
  onEdit,
  onDelete,
  onToggleActive
}: PartnerTierCardProps) => {
  return (
    <Card className='border-border/60 p-5 transition-all duration-200 hover:shadow-md'>
      {/* Header */}
      <div className='mb-6 flex items-start justify-between'>
        <div className='flex items-center gap-4'>
          {/* Icon Box with Color & Honeycomb pattern */}
          <div
            className='relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl shadow-sm'
            style={{ backgroundColor: tier.color }}
          >
            <HexPattern />
          </div>

          {/* Tier Name & Price */}
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>
              {tier.name}
            </h3>
            <div className='mt-0.5 text-xl font-bold'>{tier.price}</div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          <Switch
            checked={tier.active}
            onCheckedChange={(checked) => onToggleActive?.(tier, checked)}
            className='data-[state=checked]:bg-[#10B981]' // Green color from image
          />
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
        </div>
      </div>

      {/* Divider */}
      <div className='mb-6 h-px w-full bg-border/50' />

      {/* Details Grid */}
      <div className='grid grid-cols-3 gap-4'>
        {/* Seats */}
        <div className='space-y-1'>
          <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
            <Users className='h-3.5 w-3.5' />
            <span>Seats</span>
          </div>
          <div className='truncate text-sm font-semibold' title={tier.seats}>
            {tier.seats}
          </div>
        </div>

        {/* Discount */}
        <div className='space-y-1'>
          <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
            <div className='relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-current'>
              <span className='text-[8px] font-bold'>%</span>
            </div>
            <span>Discount</span>
          </div>
          <div className='text-sm font-semibold'>{tier.discount}</div>
        </div>

        {/* Region */}
        <div className='space-y-1'>
          <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
            <MapPin className='h-3.5 w-3.5' />
            <span>Region</span>
          </div>
          <div className='truncate text-sm font-semibold' title={tier.region}>
            {tier.region}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PartnerTierCard
