import React from 'react'
import { Plus } from 'lucide-react'

import { Card } from '@/components/ui/card'

interface AddTierCardProps {
  onClick?: () => void
}

const AddTierCard = ({ onClick }: AddTierCardProps) => {
  return (
    <Card
      className='flex h-full cursor-pointer flex-col items-center justify-center border-dashed p-8 transition-colors hover:bg-accent/50'
      onClick={onClick}
    >
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg border bg-background shadow-sm'>
        <Plus className='h-6 w-6 text-muted-foreground' />
      </div>
      <h3 className='mb-1 text-lg font-semibold text-foreground'>
        Add a New Tier
      </h3>
      <p className='text-center text-sm text-muted-foreground'>
        You can add any number of
        <br />
        tiers
      </p>
    </Card>
  )
}

export default AddTierCard
