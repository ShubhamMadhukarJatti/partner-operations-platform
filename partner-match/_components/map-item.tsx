import React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type Props = {
  property: string
  headers: string[]
  allHeaders?: string[]
  selectedMapping: Record<string, string>
  setSelectedMapping: (mapping: Record<string, string>) => void
  isSearchEnabledDropdown: boolean
}

const MapItem = ({
  property,
  headers,
  allHeaders,
  isSearchEnabledDropdown,
  selectedMapping,
  setSelectedMapping
}: Props) => {
  return (
    <div className='flex items-center space-x-2'>
      <div className='flex-1'>
        <Input
          id={property}
          placeholder={`${property}${property === 'domain' ? '/website*' : ''}`}
          className='h-12 w-full border border-[#ADB7CB] bg-[#F8FBFF] text-[#4D5C78]'
          disabled
        />
      </div>
      <div className=''>
        <Image
          src='/arrow-right.svg'
          width={24}
          height={24}
          alt='Right arrow'
          className='text-gray-400'
        />
      </div>
      <div className='flex-1'>
        {isSearchEnabledDropdown ? (
          <Combobox
            onSelect={(value) =>
              setSelectedMapping({ ...selectedMapping, [property]: value })
            }
            allOptions={allHeaders || []}
            defaultOptions={headers}
          />
        ) : (
          <Select
            value={selectedMapping[property]}
            onValueChange={(value) =>
              setSelectedMapping({ ...selectedMapping, [property]: value })
            }
          >
            <SelectTrigger className='h-12 w-full rounded-md'>
              <SelectValue
                placeholder={'Select'}
                className={cn(
                  property === 'other' ? 'text-semantic-danger' : ''
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {headers?.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
              {property !== 'domain' && (
                <SelectItem value='other' className='text-semantic-danger'>
                  Don&apos;t import
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className=''>
        {selectedMapping[property] !== '' ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 28 28'
            fill='none'
          >
            <circle cx='14' cy='14' r='14' fill='#83C413' />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M18.7464 9.45412L11.5864 16.3641L9.68641 14.3341C9.33641 14.0041 8.78641 13.9841 8.38641 14.2641C7.99641 14.5541 7.88641 15.0641 8.12641 15.4741L10.3764 19.1341C10.5964 19.4741 10.9764 19.6841 11.4064 19.6841C11.8164 19.6841 12.2064 19.4741 12.4264 19.1341C12.7864 18.6641 19.6564 10.4741 19.6564 10.4741C20.5564 9.55412 19.4664 8.74412 18.7464 9.44412V9.45412Z'
              fill='white'
            />
          </svg>
        ) : (
          <Image
            src='/info-circle.svg'
            width={28}
            height={28}
            alt='Info'
            className='text-gray-400'
          />
        )}
      </div>
    </div>
  )
}

export default MapItem
