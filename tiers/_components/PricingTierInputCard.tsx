import React, { useState } from 'react'
import { HelpCircle, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import ColorPicker from './ColorPicker'

export interface PricingTierData {
  id: string
  name: string
  price: string
  color: string
  features: string[]
}

interface TierInputCardProps {
  data: PricingTierData
  onChange: (updatedData: PricingTierData) => void
  onDelete?: () => void
}

const PricingTierInputCard = ({
  data,
  onChange,
  onDelete
}: TierInputCardProps) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, name: e.target.value })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic validation to allow numbers
    const val = e.target.value
    // Allow empty or numbers (basic regex)
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange({ ...data, price: val })
    }
  }

  const handleColorChange = (color: string) => {
    onChange({ ...data, color })
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...data.features]
    newFeatures[index] = value
    onChange({ ...data, features: newFeatures })
  }

  const addFeature = () => {
    onChange({ ...data, features: [...data.features, ''] })
  }

  const removeFeature = (index: number) => {
    const newFeatures = data.features.filter((_, i) => i !== index)
    onChange({ ...data, features: newFeatures })
  }

  return (
    <Card className='mb-6 w-full max-w-[650px] border border-[#E5E7EB] bg-white p-6 !shadow-none'>
      {/* Top Row: Name, Price, Color */}
      <div className='mb-6 flex flex-col gap-6 md:flex-row'>
        {/* Tier Name */}
        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-1.5'>
            <Label
              htmlFor={`tier-name-${data.id}`}
              className='text-sm font-medium text-gray-700'
            >
              Tier Name
            </Label>
          </div>
          <Input
            id={`tier-name-${data.id}`}
            placeholder='Standard'
            value={data.name}
            onChange={handleNameChange}
            className='h-10 border-[#E5E7EB] bg-[#F9FAFB]'
          />
        </div>

        {/* Price */}
        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-1.5'>
            <Label
              htmlFor={`tier-price-${data.id}`}
              className='text-sm font-medium text-gray-700'
            >
              Price
            </Label>
          </div>
          <div className='flex h-10 w-full items-center rounded-md border border-[#E5E7EB] bg-[#F9FAFB] focus-within:ring-1 focus-within:ring-ring'>
            <div className='flex h-full items-center justify-center border-r border-[#E5E7EB] px-3'>
              <span className='text-gray-500'>$</span>
            </div>
            <Input
              id={`tier-price-${data.id}`}
              className='h-full flex-1 bg-transparent px-3 text-sm placeholder:text-muted-foreground focus:outline-none'
              placeholder='2,999'
              value={data.price}
              onChange={handlePriceChange}
            />
          </div>
        </div>

        {/* Color */}
        <div className='w-full md:w-auto'>
          <div className='mb-2 flex items-center gap-1.5'>
            <Label className='text-sm font-medium text-gray-700'>Colour</Label>
          </div>
          <ColorPicker value={data.color} onChange={handleColorChange} />
        </div>
      </div>

      {/* Features Section */}
      <div>
        <div className='mb-3 flex items-center gap-1.5'>
          <Label className='text-sm font-medium text-gray-700'>Features</Label>
        </div>

        <div className='space-y-3'>
          {data.features.map((feature, index) => (
            <div key={`${data.id}-feature-${index}`} className='relative'>
              <Input
                placeholder='Add feature details'
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className='h-10 border-[#E5E7EB] bg-[#F9FAFB] pr-10'
              />
              <button
                onClick={() => removeFeature(index)}
                className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600'
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addFeature}
          className='mt-3 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700'
        >
          <Plus size={16} />
          Add Features
        </button>
      </div>
    </Card>
  )
}

export default PricingTierInputCard
