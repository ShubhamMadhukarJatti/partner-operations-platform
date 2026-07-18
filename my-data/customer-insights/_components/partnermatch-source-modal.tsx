import { Dispatch, SetStateAction, useState } from 'react'
import Image from 'next/image'
import { MessageSquareMore, PlusIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { recordType } from '../../_components/Segment'
import { DataSource } from '../page'

type Props = {
  openModalWithSource: (datasource: DataSource, recordType: recordType) => void

  isHeader?: boolean
  data: any
  recordType: recordType
}

type DataSourceD = {
  id: DataSource
  label: string
  description: string
  icon: string
  badge?: string
}

const dataSources: DataSourceD[] = [
  {
    id: 'HUBSPOT',
    label: 'HubSpot',
    description: 'One time setup and we will do the rest!',
    icon: '/hubspot.svg',
    badge: 'Recommended'
  },
  {
    id: 'ZOHO',
    label: 'Zoho',
    description: 'One time setup and we will do the rest!',
    icon: '/icons/zoho-rounded-logo.svg',
    badge: 'Recommended'
  },
  {
    id: 'GOOGLE_SHEET',
    label: 'Google Sheets',
    description: 'Good for a company when there is no HubSpot',
    icon: '/sheets.svg'
  },
  {
    id: 'CSV',
    label: 'CSV',
    description: 'Best option to just try partner match journey!',
    icon: '/csv.svg'
  }
]

const PartnermatchSourceModal = ({
  recordType,
  openModalWithSource,
  isHeader,
  data
}: Props) => {
  const handleConnect = () => {
    // Always proceed to open the modal - authentication will be handled inside the connect components
    openModalWithSource(selectedValue, recordType)
  }

  const [selectedValue, setSelectedValue] = useState<DataSource>('HUBSPOT')
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='primary'
          className='fds-text-sm bg-primary-blue text-white hover:bg-primary-blue'
        >
          {isHeader ? (
            <span className='flex items-center gap-1.5 font-bold'>
              <PlusIcon strokeWidth={4} size={16} /> Add Data
            </span>
          ) : (
            'Find my best partners'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='p-6 sm:max-w-[480px]'>
        <DialogHeader className='space-y-1'>
          <div className='mb-4 flex items-center gap-2'>
            <div className='w-fit rounded-lg bg-gray-100 p-2'>
              <MessageSquareMore className='h-6 w-6 text-gray-600' />
            </div>
          </div>
          <DialogTitle className='fds-text-lead-semibold text-text-100'>
            Choose your data source
          </DialogTitle>
          <DialogDescription className='text-shark-sm text-text-80'>
            Select where you want to take your data from
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selectedValue || ''}
          onValueChange={(value) => setSelectedValue(value as DataSource)}
          className='mt-5 space-y-3'
        >
          {dataSources.map((source) => (
            <DataSourceOption
              key={source.id}
              {...source}
              selectedValue={selectedValue}
              onSelect={setSelectedValue}
            />
          ))}
        </RadioGroup>

        <div className='mt-4 grid grid-cols-2 gap-3'>
          <Button
            variant='primary'
            className='fds-text-semibold flex-1 bg-primary-blue text-white hover:bg-primary-blue'
            size='lg'
            onClick={handleConnect}
          >
            Connect
          </Button>
          <DialogClose className=''>
            <Button
              variant='outline'
              className='fds-text-semibold w-full flex-1 text-text-80 '
              size='lg'
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PartnermatchSourceModal

const DataSourceOption = ({
  id,
  label,
  description,
  icon,
  badge,

  selectedValue,
  onSelect
}: DataSourceD & {
  selectedValue: DataSource
  onSelect: Dispatch<SetStateAction<DataSource>>
}) => {
  return (
    <div
      className={`flex cursor-pointer items-center space-x-4 rounded-xl border p-4 hover:border-primary ${
        selectedValue === id ? 'border-2 border-primary' : ''
      }`}
      onClick={() => onSelect(id)}
    >
      <div className='flex flex-1 items-center space-x-4'>
        <div className={`rounded p-1`}>
          <Image src={icon} height={40} width={40} alt={id!} />
        </div>
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <Label htmlFor={id as string} className='fds-text text-text-100'>
              {label}
            </Label>
            {badge && (
              <Badge
                className='rounded border border-border bg-white text-shark-xs text-text-80'
                variant='secondary'
              >
                {badge}
              </Badge>
            )}
          </div>
          <p className='mt-1 text-shark-sm text-text-80'>{description}</p>
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value={id!} id={id!} className='sr-only' />
        <div className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary-blue'>
          {selectedValue === id && (
            <span className='h-3 w-3 rounded-full bg-primary-blue' />
          )}
        </div>
      </div>
    </div>
  )
}
