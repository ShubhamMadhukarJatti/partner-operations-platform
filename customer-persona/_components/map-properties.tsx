import React from 'react'

import MapItem from './map-item'

type Props = {
  headers: string[]
  selectedMapping: Record<string, string>
  setSelectedMapping: (mapping: Record<string, string>) => void
  allHeaders?: string[]
  isSearchEnabledDropdown?: boolean
}

const MapProperties = ({
  headers,
  allHeaders,
  selectedMapping,
  setSelectedMapping,
  isSearchEnabledDropdown
}: Props) => {
  return (
    <div>
      <div className='grid grid-cols-2 '>
        <span className='text-sm font-bold leading-4  text-text-80'>
          Properties in Sharkdom
        </span>

        <span className='text-sm font-bold leading-4 text-text-80'>
          Columns in your file
        </span>
      </div>

      <div className='mt-4 flex flex-col gap-4'>
        {Object.entries(selectedMapping).map(([property, value]) => {
          return (
            <MapItem
              key={property}
              property={property}
              headers={headers}
              allHeaders={allHeaders || []}
              selectedMapping={selectedMapping}
              setSelectedMapping={setSelectedMapping}
              isSearchEnabledDropdown={false}
            />
          )
        })}
      </div>
    </div>
  )
}

export default MapProperties
