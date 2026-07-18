import React, { useState } from 'react'
import { HelpCircle, Plus } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import ColorPicker from './ColorPicker'

export interface PartnerTierData {
  id: string
  name: string
  price: string
  seatsLower: string
  seatsUpper: string
  discount: string
  region: string
  color: string
}

interface PartnerTierInputCardProps {
  data: PartnerTierData
  onChange: (updatedData: PartnerTierData) => void
}

const PartnerTierInputCard = ({
  data,
  onChange
}: PartnerTierInputCardProps) => {
  const handleChange = (field: keyof PartnerTierData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  // Basic validation helper for numbers
  const handleNumberChange = (field: keyof PartnerTierData, value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      handleChange(field, value)
    }
  }

  return (
    <Card className='mb-6 w-full max-w-[650px] border border-[#E5E7EB] bg-white p-6 !shadow-none'>
      {/* Tier Name */}
      <div className='mb-4'>
        <div className='mb-2 flex items-center gap-1.5'>
          <Label className='text-sm font-medium text-gray-700'>Tier Name</Label>
          <HelpCircle className='h-3.5 w-3.5 text-gray-400' />
        </div>
        <Input
          placeholder='e.g Gold'
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className='h-10 border-[#E5E7EB] bg-[#F9FAFB]'
        />
      </div>

      {/* Price */}
      <div className='mb-4'>
        <div className='mb-2 flex items-center gap-1.5'>
          <Label className='text-sm font-medium text-gray-700'>Price</Label>
          <HelpCircle className='h-3.5 w-3.5 text-gray-400' />
        </div>
        <div className='flex h-10 w-full items-center rounded-md border border-[#E5E7EB] bg-[#F9FAFB] focus-within:ring-1 focus-within:ring-ring'>
          <div className='flex h-full items-center justify-center border-r border-[#E5E7EB] px-3'>
            <span className='text-gray-500'>$</span>
          </div>
          <Input
            className='h-full flex-1 bg-transparent px-3 text-sm placeholder:text-muted-foreground focus:outline-none'
            placeholder='e.g 12,999'
            value={data.price}
            onChange={(e) => handleNumberChange('price', e.target.value)}
          />
        </div>
      </div>

      {/* Seats Range Row */}
      <div className='mb-1 flex flex-col gap-4 md:flex-row'>
        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-1.5'>
            <Label className='text-sm font-medium text-gray-700'>
              No of Seats lower value <span className='text-red-500'>*</span>
            </Label>
            <HelpCircle className='h-3.5 w-3.5 text-gray-400' />
          </div>
          <Input
            placeholder='e.g 100'
            value={data.seatsLower}
            onChange={(e) => handleNumberChange('seatsLower', e.target.value)}
            className='h-10 border-[#E5E7EB] bg-[#F9FAFB]'
          />
        </div>
        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-1.5'>
            <Label className='text-sm font-medium text-gray-700'>
              No of Seats Upper value <span className='text-red-500'>*</span>
            </Label>
            <HelpCircle className='h-3.5 w-3.5 text-gray-400' />
          </div>
          <Input
            placeholder='e.g 200'
            value={data.seatsUpper}
            onChange={(e) => handleNumberChange('seatsUpper', e.target.value)}
            className='h-10 border-[#E5E7EB] bg-[#F9FAFB]'
          />
        </div>
      </div>

      {/* Helper text for seats */}
      <div className='mb-4 text-xs text-gray-500'>
        It will reflect like &quot;{data.seatsLower || '200'} -{' '}
        {data.seatsUpper || '300'} Seats&quot;
      </div>

      {/* Bottom Row: Discount, Region, Color */}
      <div className='flex flex-col gap-4 md:flex-row'>
        {/* Discount */}
        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-1.5'>
            <Label className='text-sm font-medium text-gray-700'>
              Discount (%)
            </Label>
          </div>
          <Input
            placeholder='20'
            value={data.discount}
            onChange={(e) => handleNumberChange('discount', e.target.value)}
            className='h-10 border-[#E5E7EB] bg-[#F9FAFB]'
          />
        </div>

        {/* Region */}
        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-1.5'>
            <Label className='text-sm font-medium text-gray-700'>Region</Label>
          </div>
          <Select
            value={data.region}
            onValueChange={(val) => handleChange('region', val)}
          >
            <SelectTrigger className='h-10 border-[#E5E7EB] bg-[#F9FAFB]'>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Regions</SelectItem>
              <SelectItem value='north-america'>North America</SelectItem>
              <SelectItem value='europe'>Europe</SelectItem>
              <SelectItem value='asia'>Asia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-1.5'>
            <Label className='text-sm font-medium text-gray-700'>Colour</Label>
          </div>
          {/* Reusing ColorPicker but might need adaptation if "Yellow" text is required shown in select value. 
              The provided image shows "Color" label with "Yellow" text inside the select. 
              Implementing a specific Color Select for this card to match image exactly.
          */}
          {/* Just use the same ColorPicker logic */}
          <ColorPicker
            value={data.color}
            onChange={(val) => handleChange('color', val)}
          />
        </div>
      </div>
    </Card>
  )
}

export default PartnerTierInputCard
