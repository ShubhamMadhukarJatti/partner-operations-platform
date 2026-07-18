import React from 'react'
import { ArrowLeft } from 'iconsax-react'

import { Button } from '@/components/ui/button'

import MapItem from './map-item'

type Props = {
  headers: string[]
  selectedMapping: Record<string, string>
  setSelectedMapping: (mapping: Record<string, string>) => void
  allHeaders?: string[]
  isSearchEnabledDropdown?: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setStep: () => void
}

const FieldMapping = ({
  headers,
  selectedMapping,
  setSelectedMapping,
  allHeaders,
  isSearchEnabledDropdown,
  setIsOpen,
  setStep
}: Props) => {
  // Check if all mapping properties have non-empty values
  const isAllFieldsMapped = Object.values(selectedMapping).every(
    (value) => value !== ''
  )

  return (
    <div className='mt-8 w-full'>
      <Button
        variant={'link'}
        onClick={() => setIsOpen(false)}
        className='mb-6 flex items-center px-0 text-shark-sm font-semibold text-primary-blue '
      >
        <ArrowLeft size={16} className='mr-1' />
        Back to Home
      </Button>

      <div>
        <h3 className='text-shark-lg font-semibold text-text-100'>
          Field mapping
        </h3>
        <p className='mt-1 text-shark-sm text-text-80'>
          AI auto-suggests best field mapping
        </p>
      </div>
      <hr className='my-5 bg-text-20' />

      <div className=' mb-6 mt-1 bg-[#FDF3E3] p-4'>
        <h3 className='text-shark-base  font-bold text-text-100'>
          Review column properties
        </h3>
        <p className=' pt-1 text-shark-sm text-text-90'>
          Ensure columns from your file are mapped correctly to contact
          properties.
        </p>
      </div>

      <div>
        <div className='grid grid-cols-2 '>
          <span className='text-sm font-bold leading-4  text-text-80'>
            Properties in Sharkdom
          </span>

          <span className='text-sm font-bold leading-4 text-text-80'>
            Columns in your file
          </span>
        </div>

        <div className='mb-12 mt-4 flex flex-col gap-4'>
          {Object.entries(selectedMapping).map(([property, value]) => {
            return (
              <MapItem
                key={property}
                property={property}
                headers={headers}
                allHeaders={allHeaders || []}
                selectedMapping={selectedMapping}
                setSelectedMapping={setSelectedMapping}
                isSearchEnabledDropdown={isSearchEnabledDropdown || false}
              />
            )
          })}
        </div>
      </div>

      <Button
        className='w-[218px] rounded-md bg-primary-blue py-2 text-shark-base font-bold text-white transition-colors hover:bg-primary-blue disabled:cursor-not-allowed disabled:opacity-50'
        disabled={!isAllFieldsMapped}
        onClick={() => {
          setStep()
        }}
      >
        Validate & Continue
      </Button>
    </div>
  )
}

export default FieldMapping
